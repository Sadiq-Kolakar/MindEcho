import { User } from '../../models/User.js'
import { env } from '../../config/env.js'
import { ApiError } from '../../shared/utils/api-error.js'
import { decryptToken, encryptToken } from '../../shared/utils/crypto.js'
import { fromPublicUserId } from '../../shared/utils/user-id.js'

export interface GmailStatusResponse {
  connected: boolean
  email?: string
  connectedAt?: string
}

export function getGoogleAuthUrl(userId: string): string {
  const isMock = env.GOOGLE_CLIENT_ID === 'mock-google-client-id' || !env.GOOGLE_CLIENT_ID

  if (isMock) {
    // Generate a mock OAuth consent URL that redirects back to callback with mock code
    const callbackUrl = new URL(env.GOOGLE_REDIRECT_URI)
    callbackUrl.searchParams.set('code', 'mock_google_auth_code_xyz123')
    callbackUrl.searchParams.set('state', userId)
    return callbackUrl.toString()
  }

  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
  const options = {
    redirect_uri: env.GOOGLE_REDIRECT_URI,
    client_id: env.GOOGLE_CLIENT_ID,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
    state: userId,
  }

  const qs = new URLSearchParams(options)
  return `${rootUrl}?${qs.toString()}`
}

export async function handleGoogleCallback(code: string, publicUserId: string): Promise<GmailStatusResponse> {
  const userId = fromPublicUserId(publicUserId)
  const isMock = code.startsWith('mock_') || env.GOOGLE_CLIENT_ID === 'mock-google-client-id'

  let accessToken: string
  let refreshToken: string
  let userEmail: string

  if (isMock) {
    const user = await User.findById(userId)
    accessToken = 'mock_google_access_token_' + Date.now()
    refreshToken = 'mock_google_refresh_token_' + Date.now()
    userEmail = user?.email || 'user.mindecho@gmail.com'
  } else {
    // Exchange code for tokens via Google OAuth API
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenRes.ok) {
      const errText = await tokenRes.text()
      throw new ApiError(400, 'GMAIL_OAUTH_FAILED', `Failed to exchange authorization code: ${errText}`)
    }

    const tokenData = (await tokenRes.json()) as {
      access_token: string
      refresh_token?: string
      expires_in: number
    }

    accessToken = tokenData.access_token
    refreshToken = tokenData.refresh_token || ''

    // Fetch Google User Email
    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (userInfoRes.ok) {
      const userInfo = (await userInfoRes.json()) as { email?: string }
      userEmail = userInfo.email || 'user.gmail@gmail.com'
    } else {
      const user = await User.findById(userId)
      userEmail = user?.email || 'user.gmail@gmail.com'
    }
  }

  const existingUser = await User.findById(userId)
  const finalRefreshToken = refreshToken || (existingUser?.gmailAuth?.googleRefreshToken ? decryptToken(existingUser.gmailAuth.googleRefreshToken) : accessToken)

  const encryptedAccess = encryptToken(accessToken)
  const encryptedRefresh = encryptToken(finalRefreshToken)
  const connectedAt = new Date()

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        gmailAuth: {
          googleAccessToken: encryptedAccess,
          googleRefreshToken: encryptedRefresh,
          googleEmail: userEmail,
          connectedAt,
        },
      },
    },
    { new: true },
  )

  if (!updatedUser) {
    throw new ApiError(404, 'USER_NOT_FOUND', 'User not found')
  }

  return {
    connected: true,
    email: userEmail,
    connectedAt: connectedAt.toISOString(),
  }
}

export async function getGmailStatus(publicUserId: string): Promise<GmailStatusResponse> {
  const user = await User.findById(fromPublicUserId(publicUserId))
  if (!user) {
    throw new ApiError(404, 'USER_NOT_FOUND', 'User not found')
  }

  const connected = !!(user.gmailAuth?.googleRefreshToken || user.gmailAuth?.googleAccessToken)
  return {
    connected,
    email: user.gmailAuth?.googleEmail || undefined,
    connectedAt: user.gmailAuth?.connectedAt ? user.gmailAuth.connectedAt.toISOString() : undefined,
  }
}

export async function disconnectGmail(publicUserId: string): Promise<GmailStatusResponse> {
  const userId = fromPublicUserId(publicUserId)
  const user = await User.findByIdAndUpdate(
    userId,
    { $unset: { gmailAuth: 1 } },
    { new: true },
  )

  if (!user) {
    throw new ApiError(404, 'USER_NOT_FOUND', 'User not found')
  }

  return { connected: false }
}

export async function getValidAccessToken(userId: string): Promise<string | null> {
  const user = await User.findById(userId)
  if (!user || !user.gmailAuth || !user.gmailAuth.googleRefreshToken) {
    return null
  }

  const decryptedRefreshToken = decryptToken(user.gmailAuth.googleRefreshToken)
  const isMock = decryptedRefreshToken.startsWith('mock_') || env.GOOGLE_CLIENT_ID === 'mock-google-client-id'

  if (isMock) {
    return 'mock_valid_access_token'
  }

  // Attempt to refresh access token using Google OAuth API
  try {
    const refreshRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        refresh_token: decryptedRefreshToken,
        grant_type: 'refresh_token',
      }),
    })

    if (!refreshRes.ok) {
      console.error('Failed to refresh Google access token:', await refreshRes.text())
      return user.gmailAuth.googleAccessToken ? decryptToken(user.gmailAuth.googleAccessToken) : null
    }

    const data = (await refreshRes.json()) as { access_token: string }
    const newAccessToken = data.access_token
    const encryptedNewAccess = encryptToken(newAccessToken)

    await User.findByIdAndUpdate(userId, {
      $set: { 'gmailAuth.googleAccessToken': encryptedNewAccess },
    })

    return newAccessToken
  } catch (error) {
    console.error('Error refreshing Google access token:', error)
    return user.gmailAuth.googleAccessToken ? decryptToken(user.gmailAuth.googleAccessToken) : null
  }
}

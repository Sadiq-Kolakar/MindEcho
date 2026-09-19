import type { FastifyInstance } from 'fastify'
import { authGuard } from '../../shared/middleware/auth-guard.js'
import {
  disconnectGmail,
  getGmailStatus,
  getGoogleAuthUrl,
  handleGoogleCallback,
} from './gmail.service.js'

export async function gmailRoutes(app: FastifyInstance): Promise<void> {
  const guard = { preHandler: authGuard }

  app.get('/status', guard, async (request, reply) => {
    const status = await getGmailStatus(request.user!.id)
    return reply.send(status)
  })

  app.get('/connect', guard, async (request, reply) => {
    const authUrl = getGoogleAuthUrl(request.user!.id)
    return reply.send({ authUrl })
  })

  app.get('/callback', async (request, reply) => {
    const { code, state, error } = request.query as {
      code?: string
      state?: string
      error?: string
    }

    if (error || !code) {
      return reply.type('text/html').send(`
        <!DOCTYPE html>
        <html>
          <head><title>Gmail Connection Failed</title></head>
          <body style="font-family: sans-serif; background: #1e1917; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh;">
            <div style="text-align: center; background: rgba(255,255,255,0.05); padding: 32px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
              <h2 style="color: #f87171;">Connection Failed</h2>
              <p>Google OAuth authorization was denied or failed.</p>
              <button onclick="window.close()" style="background: #e8c89b; color: #1e1917; border: none; padding: 8px 16px; border-radius: 8px; font-weight: bold; cursor: pointer;">Close Window</button>
            </div>
          </body>
        </html>
      `)
    }

    const userId = state || ''
    try {
      await handleGoogleCallback(code, userId)
      return reply.type('text/html').send(`
        <!DOCTYPE html>
        <html>
          <head><title>Gmail Connected</title></head>
          <body style="font-family: sans-serif; background: #1e1917; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh;">
            <div style="text-align: center; background: rgba(255,255,255,0.05); padding: 32px; border-radius: 16px; border: 1px solid rgba(232,200,155,0.3);">
              <h2 style="color: #4ade80;">Gmail Account Connected!</h2>
              <p>Your Gmail account has been linked to MindEcho for email reminders.</p>
              <script>
                if (window.opener) {
                  window.opener.postMessage({ type: 'GMAIL_CONNECTED' }, '*');
                  setTimeout(() => window.close(), 1500);
                } else {
                  setTimeout(() => { window.location.href = '/calendar'; }, 2000);
                }
              </script>
            </div>
          </body>
        </html>
      `)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save Google account'
      return reply.type('text/html').send(`
        <!DOCTYPE html>
        <html>
          <head><title>Gmail Connection Error</title></head>
          <body style="font-family: sans-serif; background: #1e1917; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh;">
            <div style="text-align: center; background: rgba(255,255,255,0.05); padding: 32px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
              <h2 style="color: #f87171;">Error</h2>
              <p>${msg}</p>
              <button onclick="window.close()" style="background: #e8c89b; color: #1e1917; border: none; padding: 8px 16px; border-radius: 8px; font-weight: bold; cursor: pointer;">Close Window</button>
            </div>
          </body>
        </html>
      `)
    }
  })

  app.post('/disconnect', guard, async (request, reply) => {
    const result = await disconnectGmail(request.user!.id)
    return reply.send(result)
  })
}

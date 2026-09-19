import { env } from '../../config/env.js'

export interface SendReminderEmailInput {
  accessToken: string
  toEmail: string
  title: string
  dateStr: string
  timeStr?: string
  reminderMinutesBefore: number
  subjectName?: string
}

function formatReminderMinutes(minutes: number): string {
  if (minutes === 1440) return '1 day before'
  if (minutes === 60) return '1 hour before'
  return `${minutes} minutes before`
}

function buildMimeMessage(input: SendReminderEmailInput): string {
  const reminderLabel = formatReminderMinutes(input.reminderMinutesBefore)
  const timeDisplay = input.timeStr || 'All Day'

  const subject = `Reminder: ${input.title}`
  const bodyText = `Hello,

This is a reminder for your upcoming event.

Title:
${input.title}

Date:
${input.dateStr}

Time:
${timeDisplay}

Reminder:
${reminderLabel}

Good luck with your preparation.

MindEcho`

  const bodyHtml = `
    <div style="font-family: Arial, sans-serif; background-color: #1e1917; color: #f5efe8; padding: 24px; borderRadius: 16px;">
      <h2 style="color: #e8c89b; margin-top: 0;">MindEcho Event Reminder</h2>
      <p>Hello,</p>
      <p>This is a reminder for your upcoming event.</p>
      <div style="background-color: rgba(255,255,255,0.05); border: 1px solid rgba(232,200,155,0.3); border-radius: 12px; padding: 16px; margin: 16px 0;">
        <p style="margin: 4px 0;"><strong>Title:</strong> <span style="color: #e8c89b;">${input.title}</span></p>
        <p style="margin: 4px 0;"><strong>Date:</strong> ${input.dateStr}</p>
        <p style="margin: 4px 0;"><strong>Time:</strong> ${timeDisplay}</p>
        <p style="margin: 4px 0;"><strong>Reminder:</strong> ${reminderLabel}</p>
        ${input.subjectName ? `<p style="margin: 4px 0;"><strong>Subject:</strong> ${input.subjectName}</p>` : ''}
      </div>
      <p>Good luck with your preparation.</p>
      <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 20px 0;" />
      <p style="font-size: 12px; color: #a1a1aa;">Sent automatically by MindEcho Spaced Repetition Platform.</p>
    </div>
  `

  const mimeLines = [
    `To: ${input.toEmail}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    '',
    bodyHtml,
  ]

  return mimeLines.join('\r\n')
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export async function sendEventReminderEmail(input: SendReminderEmailInput): Promise<{ success: boolean; messageId?: string }> {
  const isMock = input.accessToken.startsWith('mock_') || env.NOTIFICATION_PROVIDER === 'mock'

  if (isMock) {
    console.log(`[MOCK EMAIL SERVICE] Sending reminder email to ${input.toEmail} for "${input.title}"`)
    return { success: true, messageId: `mock_msg_${Date.now()}` }
  }

  const rawMime = buildMimeMessage(input)
  const rawBase64 = base64UrlEncode(rawMime)

  let retries = 3
  let lastError: Error | null = null

  while (retries > 0) {
    try {
      const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${input.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ raw: rawBase64 }),
      })

      if (response.ok) {
        const data = (await response.json()) as { id?: string }
        return { success: true, messageId: data.id }
      }

      const errorText = await response.text()
      lastError = new Error(`Gmail API error (${response.status}): ${errorText}`)
      retries -= 1
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (4 - retries)))
      }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      retries -= 1
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (4 - retries)))
      }
    }
  }

  console.error(`Failed to send email to ${input.toEmail}:`, lastError)
  throw lastError || new Error('Failed to send email via Gmail API')
}

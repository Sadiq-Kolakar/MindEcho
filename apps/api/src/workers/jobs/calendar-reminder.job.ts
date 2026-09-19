import { ImportantDate } from '../../models/ImportantDate.js'
import { User } from '../../models/User.js'
import { getValidAccessToken } from '../../modules/gmail/gmail.service.js'
import { sendEventReminderEmail } from '../../shared/services/email.service.js'

export interface CalendarReminderJobResult {
  processedCount: number
  emailsSent: number
}

function parseEventDateTime(date: Date, timeStr?: string): Date {
  const eventDate = new Date(date)
  if (!timeStr) {
    // Default event time to 09:00 AM UTC if no specific time given
    eventDate.setUTCHours(9, 0, 0, 0)
    return eventDate
  }

  // Parse time format: "10:00", "10:00 AM", "14:30", "2:30 PM"
  const cleanTime = timeStr.trim().toUpperCase()
  const isPm = cleanTime.endsWith('PM')
  const isAm = cleanTime.endsWith('AM')
  const timeOnly = cleanTime.replace(/AM|PM/, '').trim()
  const parts = timeOnly.split(':')

  let hours = parseInt(parts[0] || '9', 10)
  const minutes = parseInt(parts[1] || '0', 10)

  if (isPm && hours < 12) hours += 12
  if (isAm && hours === 12) hours = 0

  eventDate.setUTCHours(hours, minutes, 0, 0)
  return eventDate
}

function formatDateFormatted(date: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
  const day = date.getUTCDate()
  const month = months[date.getUTCMonth()]
  const year = date.getUTCFullYear()
  return `${day} ${month} ${year}`
}

export async function runCalendarReminderJob(referenceDate = new Date()): Promise<CalendarReminderJobResult> {
  const pendingEvents = await ImportantDate.find({
    reminderEnabled: true,
    emailReminderSent: false,
  })

  let processedCount = 0
  let emailsSent = 0
  const nowMs = referenceDate.getTime()

  for (const item of pendingEvents) {
    processedCount += 1
    const eventDateTime = parseEventDateTime(item.date, item.time || undefined)
    const reminderMinutes = item.reminderMinutesBefore ?? 30
    const reminderTriggerMs = eventDateTime.getTime() - reminderMinutes * 60 * 1000

    // Check if current time has reached or passed the reminder trigger time
    if (nowMs < reminderTriggerMs) {
      continue
    }

    // Grace period check (don't send if event is more than 24h past)
    if (nowMs > eventDateTime.getTime() + 24 * 60 * 60 * 1000) {
      // Mark sent so it's skipped in future runs
      await ImportantDate.updateOne(
        { _id: item._id, emailReminderSent: false },
        { $set: { emailReminderSent: true } },
      )
      continue
    }

    const user = await User.findById(item.userId)
    if (!user) continue

    // Verify email notifications are enabled in user settings
    if (!user.notificationSettings?.emailEnabled) {
      continue
    }

    // Verify Gmail connection exists
    if (!user.gmailAuth || (!user.gmailAuth.googleRefreshToken && !user.gmailAuth.googleAccessToken)) {
      continue
    }

    // Get or refresh access token
    const accessToken = await getValidAccessToken(user._id.toString())
    if (!accessToken) {
      console.warn(`[REMINDER JOB] Could not retrieve valid access token for user ${user._id}`)
      continue
    }

    const targetEmail = user.gmailAuth.googleEmail || user.email

    try {
      await sendEventReminderEmail({
        accessToken,
        toEmail: targetEmail,
        title: item.title,
        dateStr: formatDateFormatted(item.date),
        timeStr: item.time || undefined,
        reminderMinutesBefore: reminderMinutes,
        subjectName: item.subject,
      })

      // Mark as sent atomically to prevent duplicate emails
      const updateRes = await ImportantDate.updateOne(
        { _id: item._id, emailReminderSent: false },
        { $set: { emailReminderSent: true } },
      )

      if (updateRes.modifiedCount > 0) {
        emailsSent += 1
      }
    } catch (error) {
      console.error(`[REMINDER JOB] Error sending email reminder for event ${item._id}:`, error)
    }
  }

  return { processedCount, emailsSent }
}

import crypto from 'node:crypto'
import { env } from '../../config/env.js'

function getEncryptionKey(): Buffer {
  return crypto.createHash('sha256').update(env.OAUTH_ENCRYPTION_KEY).digest()
}

export function encryptToken(text: string): string {
  if (!text) return text
  const key = getEncryptionKey()
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)

  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  const authTag = cipher.getAuthTag().toString('hex')

  return `${iv.toString('hex')}:${authTag}:${encrypted}`
}

export function decryptToken(cipherText: string): string {
  if (!cipherText) return cipherText
  if (!cipherText.includes(':')) {
    return cipherText
  }

  const [ivHex, authTagHex, encryptedHex] = cipherText.split(':')
  if (!ivHex || !authTagHex || !encryptedHex) {
    return cipherText
  }

  const key = getEncryptionKey()
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(ivHex, 'hex'))
  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'))

  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

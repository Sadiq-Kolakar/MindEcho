import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const AUDIO_DIR = join(process.cwd(), 'storage', 'audio')

export async function saveAudioFile(
  userId: string,
  evaluationId: string,
  buffer: Buffer,
  extension = 'webm',
): Promise<string> {
  const userDir = join(AUDIO_DIR, userId.replace(/[^a-zA-Z0-9_-]/g, '_'))
  await mkdir(userDir, { recursive: true })

  const filename = `${evaluationId}.${extension}`
  const fullPath = join(userDir, filename)
  await writeFile(fullPath, buffer)

  return `audio/${userId}/${filename}`
}

export async function readAudioFile(relativePath: string): Promise<{ buffer: Buffer; mimeType: string }> {
  const fullPath = join(process.cwd(), 'storage', relativePath)
  const buffer = await readFile(fullPath)
  const mimeType = relativePath.endsWith('.wav') ? 'audio/wav' : 'audio/webm'
  return { buffer, mimeType }
}

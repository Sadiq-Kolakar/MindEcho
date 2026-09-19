import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { env } from '../../config/env.js'

const AUDIO_DIR = join(process.cwd(), 'storage', 'audio')

export interface AudioStorage {
  save(userId: string, evaluationId: string, buffer: Buffer, extension?: string): Promise<string>
  read(relativePath: string): Promise<{ buffer: Buffer; mimeType: string }>
}

function mimeForPath(relativePath: string): string {
  return relativePath.endsWith('.wav') ? 'audio/wav' : 'audio/webm'
}

class LocalAudioStorage implements AudioStorage {
  async save(
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

  async read(relativePath: string): Promise<{ buffer: Buffer; mimeType: string }> {
    const fullPath = join(process.cwd(), 'storage', relativePath)
    const buffer = await readFile(fullPath)
    return { buffer, mimeType: mimeForPath(relativePath) }
  }
}

class S3AudioStorage implements AudioStorage {
  private client: S3Client
  private bucket: string

  constructor() {
    if (!env.S3_ENDPOINT || !env.S3_ACCESS_KEY || !env.S3_SECRET_KEY) {
      throw new Error('S3_ENDPOINT, S3_ACCESS_KEY, and S3_SECRET_KEY are required for AUDIO_STORAGE=s3')
    }

    this.bucket = env.S3_BUCKET
    this.client = new S3Client({
      region: env.S3_REGION,
      endpoint: env.S3_ENDPOINT,
      forcePathStyle: true,
      credentials: {
        accessKeyId: env.S3_ACCESS_KEY,
        secretAccessKey: env.S3_SECRET_KEY,
      },
    })
  }

  private objectKey(userId: string, evaluationId: string, extension: string): string {
    return `audio/${userId.replace(/[^a-zA-Z0-9_-]/g, '_')}/${evaluationId}.${extension}`
  }

  async save(
    userId: string,
    evaluationId: string,
    buffer: Buffer,
    extension = 'webm',
  ): Promise<string> {
    const key = this.objectKey(userId, evaluationId, extension)
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: extension === 'wav' ? 'audio/wav' : 'audio/webm',
      }),
    )
    return key
  }

  async read(relativePath: string): Promise<{ buffer: Buffer; mimeType: string }> {
    const response = await this.client.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: relativePath,
      }),
    )

    const body = response.Body
    if (!body) {
      throw new Error('S3 object body is empty')
    }

    const bytes = await body.transformToByteArray()
    return {
      buffer: Buffer.from(bytes),
      mimeType: mimeForPath(relativePath),
    }
  }
}

let storageInstance: AudioStorage | null = null

export function getAudioStorage(): AudioStorage {
  if (!storageInstance) {
    storageInstance = env.AUDIO_STORAGE === 's3' ? new S3AudioStorage() : new LocalAudioStorage()
  }
  return storageInstance
}

export async function saveAudioFile(
  userId: string,
  evaluationId: string,
  buffer: Buffer,
  extension = 'webm',
): Promise<string> {
  return getAudioStorage().save(userId, evaluationId, buffer, extension)
}

export async function readAudioFile(relativePath: string): Promise<{ buffer: Buffer; mimeType: string }> {
  return getAudioStorage().read(relativePath)
}

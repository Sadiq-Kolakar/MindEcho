import { env } from '../../config/env.js'

import type { STTProvider } from './stt-provider.js'

export class WhisperSTTProvider implements STTProvider {
  private apiKey: string
  private baseUrl: string

  constructor(apiKey: string, baseUrl?: string) {
    this.apiKey = apiKey
    this.baseUrl = baseUrl || 'https://api.openai.com/v1'
  }

  async transcribe(buffer: Buffer, mimeType: string): Promise<string> {
    const extension = mimeType.includes('wav') ? 'wav' : 'webm'
    const formData = new FormData()
    formData.append('file', new Blob([buffer], { type: mimeType }), `explanation.${extension}`)
    formData.append('model', 'whisper-1')
    formData.append('response_format', 'json')

    const response = await fetch(`${this.baseUrl}/audio/transcriptions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`Whisper STT error (${response.status}): ${errText}`)
    }

    const data = (await response.json()) as { text?: string }
    const text = data.text?.trim()

    if (!text) {
      throw new Error('Whisper STT returned an empty transcript')
    }

    return text
  }
}

export function createWhisperProvider(): WhisperSTTProvider {
  const apiKey = env.OPENAI_API_KEY || process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is required for Whisper STT')
  }
  return new WhisperSTTProvider(apiKey, env.OPENAI_BASE_URL)
}

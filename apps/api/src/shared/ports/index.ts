import { env } from '../../config/env.js'
import { MockLLMProvider } from './mock-llm-provider.js'
import { OpenAILLMProvider } from './openai-llm-provider.js'
import { GeminiLLMProvider } from './gemini-llm-provider.js'
import { MockNotificationProvider } from './mock-notification-provider.js'
import { MockPaymentProvider } from './mock-payment-provider.js'
import { StripePaymentProvider } from './stripe-payment-provider.js'
import { MockSTTProvider } from './mock-stt-provider.js'
import { createWhisperProvider } from './whisper-stt-provider.js'
import type { LLMProvider } from './llm-provider.js'
import type { NotificationProvider } from './notification-provider.js'
import type { PaymentProvider } from './payment-provider.js'
import type { STTProvider } from './stt-provider.js'

export function createLLMProvider(): LLMProvider {
  const provider = env.LLM_PROVIDER

  if (provider === 'openai') {
    const apiKey = env.OPENAI_API_KEY || process.env.OPENAI_API_KEY
    if (apiKey) {
      return new OpenAILLMProvider(apiKey, env.OPENAI_BASE_URL, env.OPENAI_MODEL)
    }
    console.warn('[LLMProvider] OPENAI_API_KEY is not set. Falling back to MockLLMProvider.')
    return new MockLLMProvider()
  }

  if (provider === 'gemini') {
    const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY
    if (apiKey) {
      return new GeminiLLMProvider(apiKey)
    }
    console.warn('[LLMProvider] GEMINI_API_KEY is not set. Falling back to MockLLMProvider.')
    return new MockLLMProvider()
  }

  return new MockLLMProvider()
}

export function createSTTProvider(): STTProvider {
  switch (env.STT_PROVIDER) {
    case 'mock':
      return new MockSTTProvider()
    case 'whisper':
      return createWhisperProvider()
    default:
      throw new Error(`STT provider "${env.STT_PROVIDER}" not configured yet (Phase 4)`)
  }
}

export function createNotificationProvider(): NotificationProvider {
  switch (env.NOTIFICATION_PROVIDER) {
    case 'mock':
      return new MockNotificationProvider()
    default:
      throw new Error(`Notification provider "${env.NOTIFICATION_PROVIDER}" not configured yet (Phase 8)`)
  }
}

export function createPaymentProvider(): PaymentProvider {
  switch (env.PAYMENT_PROVIDER) {
    case 'mock':
      return new MockPaymentProvider()
    case 'stripe':
      return new StripePaymentProvider()
    default:
      throw new Error(`Payment provider "${env.PAYMENT_PROVIDER}" not configured yet (Phase 6)`)
  }
}

export type { LLMProvider, FeynmanEvaluationResult } from './llm-provider.js'
export type { STTProvider } from './stt-provider.js'
export type { NotificationProvider, NotificationPayload } from './notification-provider.js'
export type { PaymentProvider, CheckoutResult } from './payment-provider.js'

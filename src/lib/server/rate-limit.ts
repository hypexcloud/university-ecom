import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'

let redis: Redis | null = null
function getRedis(): Redis | null {
  if (redis) return redis
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  redis = new Redis({ url, token })
  return redis
}

type RateLimitConfig = {
  /** Max requests in the window */
  limit: number
  /** Window duration string (e.g. '1 m', '10 s', '1 h') */
  window: `${number} ${'s' | 'm' | 'h' | 'd'}`
  /** Prefix for the rate limit key */
  prefix: string
}

/**
 * Rate limit a request. Returns a NextResponse with 429 if exceeded, or null if allowed.
 * Falls back to allowing all requests if Upstash is not configured.
 */
export async function checkRateLimit(
  request: NextRequest,
  config: RateLimitConfig,
): Promise<NextResponse | null> {
  const r = getRedis()
  if (!r) return null // Upstash not configured — allow all

  const limiter = new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(config.limit, config.window),
    prefix: `rl:${config.prefix}`,
  })

  // Use IP as identifier for public routes, or forwarded header
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || '127.0.0.1'

  const { success, remaining, reset } = await limiter.limit(ip)

  if (!success) {
    return NextResponse.json(
      { error: 'Zu viele Anfragen. Bitte versuche es später erneut.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Remaining': String(remaining),
          'X-RateLimit-Reset': String(reset),
          'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)),
        },
      },
    )
  }

  return null // Allowed
}

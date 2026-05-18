import { createHmac } from 'crypto'

const LIBRARY_ID = process.env.BUNNY_STREAM_LIBRARY_ID || ''
const PULL_ZONE = process.env.BUNNY_STREAM_PULL_ZONE || ''
const SIGNING_KEY = process.env.BUNNY_STREAM_SIGNING_KEY || ''

/**
 * Generate a Bunny Stream signed URL for video playback.
 * TTL: 5 minutes. Returns null if env vars not configured.
 */
export function getSignedVideoUrl(videoId: string): string | null {
  if (!LIBRARY_ID || !PULL_ZONE || !SIGNING_KEY) {
    return null
  }

  const expiresUnix = Math.floor(Date.now() / 1000) + 300 // 5 min TTL
  const path = `/${LIBRARY_ID}/${videoId}/playlist.m3u8`
  const url = `https://${PULL_ZONE}.b-cdn.net${path}`

  // Bunny Stream token auth: SHA256(signing_key + path + expires)
  const hashableBase = SIGNING_KEY + path + String(expiresUnix)
  const token = createHmac('sha256', SIGNING_KEY)
    .update(hashableBase)
    .digest('hex')

  return `${url}?token=${token}&expires=${expiresUnix}`
}

const API_KEY = process.env.BUNNY_STREAM_API_KEY || ''
const LIBRARY_ID = process.env.BUNNY_STREAM_LIBRARY_ID || ''
const BASE_URL = `https://video.bunnycdn.com/library/${LIBRARY_ID}`

interface BunnyVideo {
  guid: string
  title: string
  length: number // seconds
  status: number // 4 = ready
  storageSize: number
  dateUploaded: string
  thumbnailFileName: string
}

/**
 * List all videos in the Bunny Stream library.
 */
export async function listVideos(page = 1, perPage = 50): Promise<{ items: BunnyVideo[]; totalItems: number }> {
  if (!API_KEY || !LIBRARY_ID) {
    return { items: [], totalItems: 0 }
  }

  const res = await fetch(`${BASE_URL}/videos?page=${page}&itemsPerPage=${perPage}`, {
    headers: { AccessKey: API_KEY },
  })

  if (!res.ok) throw new Error(`Bunny API error: ${res.status}`)
  return res.json()
}

/**
 * Create a video placeholder in Bunny Stream (for upload).
 */
export async function createVideo(title: string): Promise<{ guid: string }> {
  if (!API_KEY || !LIBRARY_ID) {
    throw new Error('Bunny Stream not configured')
  }

  const res = await fetch(`${BASE_URL}/videos`, {
    method: 'POST',
    headers: { AccessKey: API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  })

  if (!res.ok) throw new Error(`Bunny API error: ${res.status}`)
  return res.json()
}

/**
 * Get the TUS upload URL for a video.
 * Client uploads directly to Bunny via TUS protocol.
 */
export function getUploadUrl(videoId: string): string {
  return `https://video.bunnycdn.com/tusupload?libraryId=${LIBRARY_ID}&videoId=${videoId}`
}

/**
 * Delete a video from Bunny Stream.
 */
export async function deleteVideo(videoId: string): Promise<void> {
  if (!API_KEY || !LIBRARY_ID) return

  await fetch(`${BASE_URL}/videos/${videoId}`, {
    method: 'DELETE',
    headers: { AccessKey: API_KEY },
  })
}

'use client'

import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, Loader2, PlayCircle } from 'lucide-react'

interface VideoPlayerProps {
  resourceId: string
  title: string
  url: string
  provider: 'youtube' | 'vimeo' | 'custom'
  duration?: string
  onComplete?: () => void
  onProgress?: (watched: number, total: number) => void
}

export default function VideoPlayer({
  resourceId,
  title,
  url,
  provider,
  duration,
  onComplete,
  onProgress,
}: VideoPlayerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [watchProgress, setWatchProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const playerRef = useRef<any>(null)
  const progressIntervalRef = useRef<any>(null)

  useEffect(() => {
    // Load YouTube API
    if (provider === 'youtube' && !window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    }

    // Load Vimeo Player API
    if (provider === 'vimeo' && !window.Vimeo) {
      const script = document.createElement('script')
      script.src = 'https://player.vimeo.com/api/player.js'
      document.head.appendChild(script)
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [provider])

  useEffect(() => {
    if (isOpen && provider === 'youtube') {
      initYouTubePlayer()
    } else if (isOpen && provider === 'vimeo') {
      initVimeoPlayer()
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [isOpen])

  const getYouTubeVideoId = (url: string): string => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[7].length === 11 ? match[7] : ''
  }

  const getVimeoVideoId = (url: string): string => {
    const regExp = /vimeo\.com\/(\d+)/
    const match = url.match(regExp)
    return match ? match[1] : ''
  }

  const initYouTubePlayer = () => {
    const videoId = getYouTubeVideoId(url)
    if (!videoId) return

    const onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId,
        playerVars: {
          autoplay: 1,
          controls: 1,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      })
    }

    if (window.YT && window.YT.Player) {
      onYouTubeIframeAPIReady()
    } else {
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady
    }
  }

  const initVimeoPlayer = () => {
    const videoId = getVimeoVideoId(url)
    if (!videoId || !window.Vimeo) return

    const iframe = document.getElementById('vimeo-player') as HTMLIFrameElement
    playerRef.current = new window.Vimeo.Player(iframe)

    playerRef.current.on('play', () => setIsPlaying(true))
    playerRef.current.on('pause', () => setIsPlaying(false))
    playerRef.current.on('ended', handleVideoComplete)

    // Track progress
    playerRef.current.on('timeupdate', async (data: any) => {
      const progress = (data.seconds / data.duration) * 100
      setWatchProgress(progress)

      if (onProgress) {
        onProgress(data.seconds, data.duration)
      }

      // Mark as complete at 90%
      if (progress >= 90 && !isCompleted) {
        handleVideoComplete()
      }
    })
  }

  const onPlayerReady = (event: any) => {
    // Start tracking progress
    progressIntervalRef.current = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        const currentTime = playerRef.current.getCurrentTime()
        const duration = playerRef.current.getDuration()

        if (duration > 0) {
          const progress = (currentTime / duration) * 100
          setWatchProgress(progress)

          if (onProgress) {
            onProgress(currentTime, duration)
          }

          // Mark as complete at 90%
          if (progress >= 90 && !isCompleted) {
            handleVideoComplete()
          }
        }
      }
    }, 1000)
  }

  const onPlayerStateChange = (event: any) => {
    // YT.PlayerState.PLAYING = 1
    // YT.PlayerState.PAUSED = 2
    // YT.PlayerState.ENDED = 0
    if (event.data === 1) {
      setIsPlaying(true)
    } else if (event.data === 2) {
      setIsPlaying(false)
    } else if (event.data === 0) {
      handleVideoComplete()
    }
  }

  const handleVideoComplete = () => {
    if (!isCompleted) {
      setIsCompleted(true)
      if (onComplete) {
        onComplete()
      }
    }
  }

  const handleClose = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }

    // Stop the video
    if (playerRef.current) {
      if (provider === 'youtube' && playerRef.current.stopVideo) {
        playerRef.current.stopVideo()
      } else if (provider === 'vimeo' && playerRef.current.pause) {
        playerRef.current.pause()
      }
    }

    setIsOpen(false)
    setIsPlaying(false)
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <PlayCircle className="h-4 w-4" />
        Ansehen
      </Button>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{title}</span>
              {isCompleted && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm">Abgeschlossen</span>
                </div>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Video Player */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              {provider === 'youtube' && (
                <div id="youtube-player" className="w-full h-full" />
              )}

              {provider === 'vimeo' && (
                <iframe
                  id="vimeo-player"
                  src={`https://player.vimeo.com/video/${getVimeoVideoId(url)}?autoplay=1`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              )}

              {provider === 'custom' && (
                <video
                  className="w-full h-full"
                  controls
                  autoPlay
                  onTimeUpdate={(e) => {
                    const video = e.currentTarget
                    const progress = (video.currentTime / video.duration) * 100
                    setWatchProgress(progress)

                    if (onProgress) {
                      onProgress(video.currentTime, video.duration)
                    }

                    if (progress >= 90 && !isCompleted) {
                      handleVideoComplete()
                    }
                  }}
                  onEnded={handleVideoComplete}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  <source src={url} />
                  Ihr Browser unterstützt das Video-Tag nicht.
                </video>
              )}
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Fortschritt</span>
                <span className="font-medium">{Math.round(watchProgress)}%</span>
              </div>
              <Progress value={watchProgress} className="h-2" />
              {duration && (
                <p className="text-xs text-gray-500">Dauer: {duration}</p>
              )}
            </div>

            {/* Info */}
            {watchProgress >= 90 && !isCompleted && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  Sie haben 90% des Videos gesehen. Es wird automatisch als abgeschlossen markiert.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Type definitions for external APIs
declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
    Vimeo: any
  }
}

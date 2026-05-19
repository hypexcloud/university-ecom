'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Video } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Erfolg {
  id: string
  title: string
  description: string | null
  mediaUrl: string
  mediaType: string
}

export function KundenerfolgeCarousel({ items }: { items: Erfolg[] }) {
  const [index, setIndex] = useState(0)
  const visibleCount = 3
  const maxIndex = Math.max(0, items.length - visibleCount)

  const prev = () => setIndex((i) => Math.max(0, i - 1))
  const next = () => setIndex((i) => Math.min(maxIndex, i + 1))

  const visible = items.slice(index, index + visibleCount)

  return (
    <div className="relative">
      <div className="flex gap-4 justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={prev}
          disabled={index === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 text-prestige-gold-500 hover:text-prestige-gold-400"
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>

        <div className="grid md:grid-cols-3 gap-6 w-full px-12">
          <AnimatePresence mode="popLayout">
            {visible.map((e) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-prestige-gray-900/50 border-prestige-gray-800 overflow-hidden h-full">
                  <div className="aspect-video bg-prestige-gray-800">
                    {e.mediaType === 'image' ? (
                      <img src={e.mediaUrl} alt={e.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Video className="h-10 w-10 text-prestige-gray-600" />
                      </div>
                    )}
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-bold text-prestige-white mb-1">{e.title}</h3>
                    {e.description && <p className="text-sm text-prestige-gray-400 mt-1">{e.description}</p>}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={next}
          disabled={index >= maxIndex}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 text-prestige-gold-500 hover:text-prestige-gold-400"
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>

      {/* Dots */}
      {items.length > visibleCount && (
        <div className="flex justify-center gap-1.5 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full transition-colors ${i === index ? 'bg-prestige-gold-500' : 'bg-prestige-gray-700'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

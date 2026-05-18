'use client'

import { useState, useEffect, useRef } from 'react'
import { Badge } from '@/components/ui/badge'

interface Message {
  id: string
  body: string
  authorUid: string
  createdAt: string
  authorFirstName: string
}

export function RealtimeMessages({ ticketId, userId, initialMessages }: {
  ticketId: string
  userId: string
  initialMessages: Message[]
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Poll for new messages every 10 seconds
  useEffect(() => {
    const poll = async () => {
      const res = await fetch(`/api/tickets/${ticketId}`)
      if (res.ok) {
        const data = await res.json()
        if (data.messages?.length !== messages.length) {
          setMessages(data.messages)
        }
      }
    }

    const interval = setInterval(poll, 10_000)
    return () => clearInterval(interval)
  }, [ticketId, messages.length])

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  return (
    <div className="space-y-4">
      {messages.map((msg) => {
        const isOwn = msg.authorUid === userId
        return (
          <div key={msg.id} className={`rounded-lg p-4 ${isOwn ? 'bg-primary/5 ml-8' : 'bg-muted mr-8'}`}>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{isOwn ? 'Du' : msg.authorFirstName}</span>
              <span>{new Date(msg.createdAt).toLocaleString('de-DE')}</span>
            </div>
            <p className="text-sm whitespace-pre-wrap">{msg.body}</p>
          </div>
        )
      })}
      <div ref={bottomRef} />
    </div>
  )
}

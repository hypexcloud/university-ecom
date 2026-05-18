import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Crown, Video, Play } from 'lucide-react'
import Link from 'next/link'
import { db } from '@/lib/server/db'
import { interviews, kundenerfolge } from '@/lib/server/db/schema'
import { asc } from 'drizzle-orm'

export const metadata = {
  title: 'Interviews & Erfolge — University Ecom',
  description: 'Interviews, Erfolgsgeschichten und Einblicke unserer Teilnehmer und Coaches.',
}

export default async function InterviewsPage() {
  const videoList = await db.select().from(interviews).orderBy(asc(interviews.orderIndex))
  const erfolge = await db.select().from(kundenerfolge).orderBy(asc(kundenerfolge.orderIndex))

  return (
    <div className="min-h-screen bg-prestige-black">
      {/* Hero */}
      <section className="px-6 py-20 md:py-28">
        <div className="container mx-auto max-w-5xl text-center">
          <Crown className="w-12 h-12 text-prestige-gold-500 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-display font-bold text-prestige-white mb-6">
            Interviews & <span className="text-gradient-gold">Erfolge</span>
          </h1>
          <div className="accent-line-gold mx-auto mb-6"></div>
          <p className="text-xl text-prestige-gray-300 max-w-2xl mx-auto">
            Echte Gespräche, echte Ergebnisse. Erfahre, wie unsere Teilnehmer ihr Business transformiert haben.
          </p>
        </div>
      </section>

      {/* Interviews / Videos */}
      <section className="px-6 py-16 border-t border-prestige-gray-800">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-display font-bold text-prestige-white mb-10">Interviews</h2>

          {videoList.length === 0 ? (
            <div className="text-center py-16">
              <Video className="h-16 w-16 text-prestige-gray-700 mx-auto mb-4" />
              <p className="text-prestige-gray-500 text-lg">Videos werden in Kürze hinzugefügt.</p>
              <p className="text-prestige-gray-600 text-sm mt-2">Unsere Coaches arbeiten an spannenden Inhalten für dich.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videoList.map((v) => (
                <Card key={v.id} className="bg-prestige-gray-900/50 border-prestige-gray-800 overflow-hidden group hover:border-prestige-gold-500/50 transition-colors">
                  <div className="aspect-video bg-prestige-gray-800 relative">
                    {v.thumbnailUrl ? (
                      <img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Video className="h-10 w-10 text-prestige-gray-600" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 rounded-full bg-prestige-gold-500 flex items-center justify-center">
                        <Play className="h-6 w-6 text-black ml-1" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-bold text-prestige-white mb-1">{v.title}</h3>
                    {v.category && <Badge variant="outline" className="border-prestige-gray-700 text-prestige-gray-400">{v.category}</Badge>}
                    {v.description && <p className="text-sm text-prestige-gray-400 mt-2 line-clamp-2">{v.description}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Kundenerfolge */}
      <section className="px-6 py-16 border-t border-prestige-gray-800">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-display font-bold text-prestige-white mb-10">Kundenerfolge</h2>

          {erfolge.length === 0 ? (
            <div className="text-center py-16">
              <Crown className="h-16 w-16 text-prestige-gray-700 mx-auto mb-4" />
              <p className="text-prestige-gray-500 text-lg">Erfolgsgeschichten werden in Kürze veröffentlicht.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {erfolge.map((e) => (
                <Card key={e.id} className="bg-prestige-gray-900/50 border-prestige-gray-800 overflow-hidden">
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
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 border-t border-prestige-gray-800">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-display font-bold text-prestige-white mb-4">Bereit, deine eigene Erfolgsgeschichte zu schreiben?</h2>
          <p className="text-prestige-gray-400 mb-8">Starte jetzt mit dem passenden Kurs und werde Teil unserer Community.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses" className="inline-flex items-center justify-center px-8 py-4 bg-prestige-gold-500 text-black font-bold rounded-lg hover:bg-prestige-gold-400 transition-colors">
              Kurse ansehen
            </Link>
            <Link href="/intake" className="inline-flex items-center justify-center px-8 py-4 border border-prestige-gray-600 text-prestige-gray-300 rounded-lg hover:border-prestige-gold-500 hover:text-prestige-white transition-colors">
              Erstgespräch buchen
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, BookOpen, Star, Clock, Users, CheckCircle, Video, FileText, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Kurs - Künstliche Intelligenz für Ihr Business',
  description: 'Lernen Sie, wie Sie ChatGPT und andere AI-Tools professionell für Ihr Business einsetzen. 12 Wochen intensive Ausbildung mit praktischen Übungen.',
}

export default function AICourse() {
  return (
    <div className="container mx-auto px-6 py-12 space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <BookOpen className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold">
          AI Kurs
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Meistern Sie Künstliche Intelligenz für Ihr Business. Von ChatGPT bis zur 
          vollständigen Automatisierung - lernen Sie praktische AI-Anwendungen, die 
          Ihren Geschäftserfolg steigern.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/pricing/ai">
              Jetzt einschreiben
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
            <Link href="#curriculum">
              Lehrplan ansehen
            </Link>
          </Button>
        </div>
      </div>

      {/* Course Overview */}
      <div className="grid lg:grid-cols-3 gap-8">
        <Card>
          <CardHeader className="text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
            <CardTitle>12 Wochen</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">Intensive Ausbildung mit wöchentlichen Modulen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
            <CardTitle>250+ Studenten</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">Aktive Community von AI-Enthusiasten</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Star className="h-8 w-8 mx-auto mb-2 text-primary" />
            <CardTitle>4.9/5 Bewertung</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">Durchschnittliche Studentenbewertung</p>
          </CardContent>
        </Card>
      </div>

      {/* What You'll Learn */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Was Sie lernen werden</h2>
          <p className="text-xl text-muted-foreground">
            Praktische AI-Fähigkeiten für moderne Unternehmer
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              title: 'ChatGPT Mastery',
              description: 'Professioneller Umgang mit ChatGPT für Business-Anwendungen, Prompt Engineering und beste Praktiken.',
              icon: MessageSquare
            },
            {
              title: 'Business Automatisierung',
              description: 'Automatisieren Sie wiederkehrende Aufgaben mit AI-Tools und steigern Sie Ihre Produktivität.',
              icon: CheckCircle
            },
            {
              title: 'Content Creation',
              description: 'Erstellen Sie hochwertige Inhalte für Marketing, Social Media und Kundenkommunikation.',
              icon: FileText
            },
            {
              title: 'Kundenservice AI',
              description: 'Implementieren Sie AI-gestützte Chatbots und automatisierte Kundenbetreuung.',
              icon: Users
            },
            {
              title: 'Datenanalyse mit AI',
              description: 'Nutzen Sie AI für Business Intelligence und datengestützte Entscheidungen.',
              icon: BookOpen
            },
            {
              title: 'AI Tool Integration',
              description: 'Integrieren Sie verschiedene AI-Tools in Ihre bestehenden Geschäftsprozesse.',
              icon: Video
            }
          ].map((item, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Curriculum */}
      <div id="curriculum" className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Lehrplan</h2>
          <p className="text-xl text-muted-foreground">
            12 Wochen strukturiertes Lernen
          </p>
        </div>

        <div className="grid gap-4">
          {[
            {
              week: 1,
              title: 'AI Grundlagen & ChatGPT Einführung',
              topics: ['AI Landschaft verstehen', 'ChatGPT Setup', 'Erste Prompts', 'Sicherheit & Ethik']
            },
            {
              week: 2,
              title: 'Advanced Prompting Techniken',
              topics: ['Prompt Engineering', 'Context Management', 'Multi-Step Prompts', 'Output Optimierung']
            },
            {
              week: 3,
              title: 'Business Process Automation',
              topics: ['Workflow Analyse', 'Automatisierungsstrategien', 'Tool Integration', 'ROI Messung']
            },
            {
              week: 4,
              title: 'Content Creation Mastery',
              topics: ['Marketing Content', 'Social Media Posts', 'Blog Artikel', 'E-Mail Kampagnen']
            },
            {
              week: 5,
              title: 'Kundenservice Revolution',
              topics: ['Chatbot Entwicklung', 'Ticket Automatisierung', 'FAQ Generation', 'Sentiment Analyse']
            },
            {
              week: 6,
              title: 'Datenanalyse & Insights',
              topics: ['Data Processing', 'Report Generation', 'Trend Analyse', 'Predictive Analytics']
            }
          ].map((module, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Woche {module.week}: {module.title}</CardTitle>
                  </div>
                  <div className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                    Woche {module.week}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {module.topics.map((topic, topicIndex) => (
                    <div key={topicIndex} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{topic}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            + 6 weitere Wochen mit fortgeschrittenen Themen und praktischen Projekten
          </p>
          <Button asChild variant="outline">
            <Link href="/pricing/ai">
              Vollständigen Lehrplan anzeigen
            </Link>
          </Button>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/5 rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Bereit, AI zu meistern?</h2>
        <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
          Schließen Sie sich hunderten erfolgreicher Unternehmer an und transformieren 
          Sie Ihr Business mit Künstlicher Intelligenz.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/pricing/ai">
              Jetzt einschreiben
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
            <Link href="/courses/dropshipping">
              Dropshipping Kurs ansehen
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

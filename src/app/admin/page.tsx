'use client'

import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  CalendarIcon,
  Users,
  TrendingUpIcon,
  ClockIcon,
  PlusIcon,
  BarChart3,
  CheckCircleIcon
} from 'lucide-react'

export default function AdminPage() {
  // Mock stats data
  const stats = {
    totalSessions: 24,
    completedSessions: 18,
    upcomingSessions: 6,
    activeUsers: 12,
    totalMentors: 3,
    totalTeilnehmer: 8
  }

  const recentActivity = [
    {
      id: 1,
      type: 'session',
      message: 'Termin mit Max Mustermann abgeschlossen',
      time: 'vor 2 Stunden'
    },
    {
      id: 2,
      type: 'user',
      message: 'Neuer Teilnehmer Anna Schmidt hinzugefügt',
      time: 'vor 4 Stunden'
    },
    {
      id: 3,
      type: 'session',
      message: 'Termin für morgen 10:00 geplant',
      time: 'vor 6 Stunden'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Willkommen zurück! Hier ist eine Übersicht Ihres Mentoring-Systems
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/admin/benutzer">
              <Users className="h-4 w-4 mr-2" />
              Benutzer verwalten
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/termine">
              <PlusIcon className="h-4 w-4 mr-2" />
              Termin planen
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSessions}</p>
                <p className="text-sm text-gray-600">Termine Gesamt</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.completedSessions}</p>
                <p className="text-sm text-gray-600">Abgeschlossen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.upcomingSessions}</p>
                <p className="text-sm text-gray-600">Anstehend</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
                <p className="text-sm text-gray-600">Aktive Benutzer</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Schnellaktionen</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Button variant="outline" className="h-auto p-4" asChild>
                  <Link href="/admin/termine">
                    <div className="text-center">
                      <CalendarIcon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <div className="font-medium">Termin planen</div>
                      <div className="text-xs text-gray-500">Neuen Mentoring-Termin erstellen</div>
                    </div>
                  </Link>
                </Button>

                <Button variant="outline" className="h-auto p-4" asChild>
                  <Link href="/admin/benutzer">
                    <div className="text-center">
                      <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <div className="font-medium">Benutzer hinzufügen</div>
                      <div className="text-xs text-gray-500">Mentor oder Teilnehmer erstellen</div>
                    </div>
                  </Link>
                </Button>

                <Button variant="outline" className="h-auto p-4" asChild>
                  <Link href="/admin/intake">
                    <div className="text-center">
                      <BarChart3 className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                      <div className="font-medium">Intake prüfen</div>
                      <div className="text-xs text-gray-500">Bewerbungen verwalten</div>
                    </div>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Aktuelle Aktivitäten</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Stats */}
        <div className="space-y-6">
          {/* System Status */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>System-Status</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Mentoren</span>
                <span className="font-medium">{stats.totalMentors} aktiv</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Teilnehmer</span>
                <span className="font-medium">{stats.totalTeilnehmer} aktiv</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Erfolgsrate</span>
                <span className="font-medium text-green-600">94%</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Alle Systeme funktional</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Schedule */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Heutige Termine</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                  <div className="text-xs font-medium text-blue-600">10:00</div>
                  <div className="flex-1 text-sm">
                    <div className="font-medium">Max Mustermann</div>
                    <div className="text-gray-500">Erstberatung AI-Kurs</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                  <div className="text-xs font-medium text-green-600">14:00</div>
                  <div className="flex-1 text-sm">
                    <div className="font-medium">Anna Schmidt</div>
                    <div className="text-gray-500">Wöchentlicher Check-in</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
                  <div className="text-xs font-medium text-yellow-600">16:00</div>
                  <div className="flex-1 text-sm">
                    <div className="font-medium">Tom Weber</div>
                    <div className="text-gray-500">Projektbesprechung</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

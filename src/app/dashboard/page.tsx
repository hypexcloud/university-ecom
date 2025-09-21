'use client'

import { ProtectedRoute } from '@/lib/auth/protected-route'
import { useAuth } from '@/lib/auth/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  BookOpen, 
  Clock, 
  Trophy, 
  Settings, 
  LogOut,
  Bell,
  MessageCircle,
  TrendingUp,
  ArrowRight,
  Play
} from 'lucide-react'
import Link from 'next/link'

function DashboardContent() {
  const { appUser, user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
  }

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Willkommen zurück, {appUser?.profile?.firstName || appUser?.displayName || 'Student'}!
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Benachrichtigungen
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Abmelden
          </Button>
        </div>
      </div>

      {/* User Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={appUser?.photoURL || ''} />
              <AvatarFallback>
                {getInitials(appUser?.displayName || 'Student')}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div>
                <h2 className="text-xl font-semibold">
                  {appUser?.displayName || `${appUser?.profile?.firstName} ${appUser?.profile?.lastName}`}
                </h2>
                <p className="text-muted-foreground">{appUser?.email}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">
                  {appUser?.role === 'admin' ? 'Administrator' : 
                   appUser?.role === 'instructor' ? 'Dozent' : 'Student'}
                </Badge>
                {user?.emailVerified ? (
                  <Badge variant="default">E-Mail verifiziert</Badge>
                ) : (
                  <Badge variant="destructive">E-Mail nicht verifiziert</Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktive Kurse</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Noch keine Kurse gebucht
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lernzeit</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0h</div>
            <p className="text-xs text-muted-foreground">
              Diese Woche
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abgeschlossen</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Module abgeschlossen
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fortschritt</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">
              Durchschnittlicher Fortschritt
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Get Started Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Kurse entdecken</CardTitle>
            <CardDescription>
              Starten Sie Ihre Reise mit unseren professionellen Kursen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Verfügbare Kurse:</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">AI Kurs</p>
                    <p className="text-sm text-muted-foreground">Künstliche Intelligenz für Ihr Business</p>
                  </div>
                  <Button size="sm" asChild>
                    <Link href="/courses/ai">
                      <Play className="h-4 w-4 mr-2" />
                      Ansehen
                    </Link>
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Dropshipping Kurs</p>
                    <p className="text-sm text-muted-foreground">E-Commerce ohne Lagerkosten</p>
                  </div>
                  <Button size="sm" asChild>
                    <Link href="/courses/dropshipping">
                      <Play className="h-4 w-4 mr-2" />
                      Ansehen
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            <Button asChild className="w-full">
              <Link href="/courses">
                Alle Kurse ansehen
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Community & Support</CardTitle>
            <CardDescription>
              Vernetzen Sie sich mit anderen Studenten und erhalten Sie Hilfe
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp Community
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="mr-2 h-4 w-4" />
                Discord Server
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                1-zu-1 Mentoring
              </Button>
            </div>
            <Button asChild className="w-full">
              <Link href="/community">
                Community beitreten
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Letzte Aktivitäten</CardTitle>
          <CardDescription>
            Hier sehen Sie Ihre neuesten Aktivitäten und Fortschritte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Noch keine Aktivitäten vorhanden</p>
            <p className="text-sm">Starten Sie einen Kurs, um hier Fortschritte zu sehen</p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Button asChild>
          <Link href="/profile">
            <Settings className="mr-2 h-4 w-4" />
            Profil bearbeiten
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/support">
            <MessageCircle className="mr-2 h-4 w-4" />
            Support kontaktieren
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}

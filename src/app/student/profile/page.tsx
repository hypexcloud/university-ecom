'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  User, 
  Mail,
  Phone,
  MapPin,
  Lock,
  Bell,
  Globe,
  Shield,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Camera
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  company?: string
  address?: {
    street: string
    city: string
    zipCode: string
    country: string
  }
  bio?: string
  avatar?: string
}

interface NotificationPreferences {
  emailNotifications: boolean
  sessionReminders: boolean
  courseUpdates: boolean
  marketingEmails: boolean
}

export default function StudentProfilePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  
  // Profile data
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    address: {
      street: '',
      city: '',
      zipCode: '',
      country: 'Deutschland'
    },
    bio: ''
  })

  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Notifications
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    emailNotifications: true,
    sessionReminders: true,
    courseUpdates: true,
    marketingEmails: false
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    setLoading(true)
    try {
      // Mock data - in production, fetch from Firebase
      const mockProfile: UserProfile = {
        firstName: 'Max',
        lastName: 'Mustermann',
        email: user?.email || 'max@example.com',
        phone: '+49 123 456789',
        company: 'E-Commerce GmbH',
        address: {
          street: 'Musterstraße 123',
          city: 'Berlin',
          zipCode: '10115',
          country: 'Deutschland'
        },
        bio: 'E-Commerce Unternehmer, der AI Automatisierung lernt'
      }

      setProfile(mockProfile)
    } catch (error) {
      console.error('Error loading profile:', error)
      setError('Fehler beim Laden des Profils')
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      // Validate
      if (!profile.firstName || !profile.lastName || !profile.email) {
        throw new Error('Bitte füllen Sie alle Pflichtfelder aus')
      }

      // Save to Firebase
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate

      setSuccess('Profil erfolgreich aktualisiert!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message || 'Fehler beim Speichern')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      // Validate
      if (!passwordData.currentPassword || !passwordData.newPassword) {
        throw new Error('Bitte füllen Sie alle Felder aus')
      }

      if (passwordData.newPassword.length < 8) {
        throw new Error('Passwort muss mindestens 8 Zeichen lang sein')
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('Passwörter stimmen nicht überein')
      }

      // Update password
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate

      setSuccess('Passwort erfolgreich geändert!')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message || 'Fehler beim Ändern des Passworts')
    } finally {
      setSaving(false)
    }
  }

  const handleNotificationUpdate = async () => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      // Save to Firebase
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate

      setSuccess('Einstellungen gespeichert!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message || 'Fehler beim Speichern')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push('/student')} className="mb-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück zum Dashboard
        </Button>
        <h1 className="text-3xl font-bold">Profil & Einstellungen</h1>
        <p className="text-gray-600 mt-1">
          Verwalten Sie Ihre persönlichen Daten und Präferenzen
        </p>
      </div>

      {/* Alerts */}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-900">{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Persönliche Informationen
              </CardTitle>
              <CardDescription>
                Ihre grundlegenden Kontaktdaten
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Vorname *</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nachname *</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">E-Mail Adresse *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Telefonnummer</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+49 ..."
                  />
                </div>

                <div>
                  <Label htmlFor="company">Unternehmen (Optional)</Label>
                  <Input
                    id="company"
                    value={profile.company || ''}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Über mich (Optional)</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio || ''}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={3}
                    placeholder="Erzählen Sie etwas über sich..."
                  />
                </div>

                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Wird gespeichert...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Profil speichern
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Adresse
              </CardTitle>
              <CardDescription>
                Ihre Rechnungsadresse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <Label htmlFor="street">Straße & Hausnummer</Label>
                  <Input
                    id="street"
                    value={profile.address?.street || ''}
                    onChange={(e) => setProfile({
                      ...profile,
                      address: { ...profile.address!, street: e.target.value }
                    })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zipCode">PLZ</Label>
                    <Input
                      id="zipCode"
                      value={profile.address?.zipCode || ''}
                      onChange={(e) => setProfile({
                        ...profile,
                        address: { ...profile.address!, zipCode: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Stadt</Label>
                    <Input
                      id="city"
                      value={profile.address?.city || ''}
                      onChange={(e) => setProfile({
                        ...profile,
                        address: { ...profile.address!, city: e.target.value }
                      })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="country">Land</Label>
                  <Input
                    id="country"
                    value={profile.address?.country || ''}
                    onChange={(e) => setProfile({
                      ...profile,
                      address: { ...profile.address!, country: e.target.value }
                    })}
                  />
                </div>

                <Button type="submit" disabled={saving} variant="outline">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Adresse speichern
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Passwort ändern
              </CardTitle>
              <CardDescription>
                Ändern Sie Ihr Passwort für mehr Sicherheit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Aktuelles Passwort</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="newPassword">Neues Passwort</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Mindestens 8 Zeichen
                  </p>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  />
                </div>

                <Button type="submit" disabled={saving} variant="outline">
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Wird geändert...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Passwort ändern
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Settings */}
        <div className="space-y-6">
          {/* Profile Picture */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profilbild</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                    {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                  </div>
                  <Button
                    size="sm"
                    className="absolute bottom-0 right-0 rounded-full"
                    variant="outline"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Klicken Sie, um ein Foto hochzuladen
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="h-5 w-5" />
                Benachrichtigungen
              </CardTitle>
              <CardDescription>
                E-Mail Benachrichtigungseinstellungen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-sm">E-Mail Benachrichtigungen</p>
                  <p className="text-xs text-gray-500">Allgemeine Updates</p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => {
                    setNotifications({ ...notifications, emailNotifications: checked })
                    handleNotificationUpdate()
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-sm">Session Erinnerungen</p>
                  <p className="text-xs text-gray-500">24h vor Sessions</p>
                </div>
                <Switch
                  checked={notifications.sessionReminders}
                  onCheckedChange={(checked) => {
                    setNotifications({ ...notifications, sessionReminders: checked })
                    handleNotificationUpdate()
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-sm">Kurs Updates</p>
                  <p className="text-xs text-gray-500">Neue Module & Inhalte</p>
                </div>
                <Switch
                  checked={notifications.courseUpdates}
                  onCheckedChange={(checked) => {
                    setNotifications({ ...notifications, courseUpdates: checked })
                    handleNotificationUpdate()
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-sm">Marketing E-Mails</p>
                  <p className="text-xs text-gray-500">Angebote & News</p>
                </div>
                <Switch
                  checked={notifications.marketingEmails}
                  onCheckedChange={(checked) => {
                    setNotifications({ ...notifications, marketingEmails: checked })
                    handleNotificationUpdate()
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Language & Region */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="h-5 w-5" />
                Sprache & Region
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="language" className="text-sm">Sprache</Label>
                <select
                  id="language"
                  className="w-full mt-1 rounded-md border border-gray-300 p-2 text-sm"
                  defaultValue="de"
                >
                  <option value="de">Deutsch</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div>
                <Label htmlFor="timezone" className="text-sm">Zeitzone</Label>
                <select
                  id="timezone"
                  className="w-full mt-1 rounded-md border border-gray-300 p-2 text-sm"
                  defaultValue="Europe/Berlin"
                >
                  <option value="Europe/Berlin">Berlin (GMT+1)</option>
                  <option value="Europe/Vienna">Wien (GMT+1)</option>
                  <option value="Europe/Zurich">Zürich (GMT+1)</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-lg text-red-600">Gefahrenzone</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" className="w-full" size="sm">
                Account löschen
              </Button>
              <p className="text-xs text-gray-500 text-center mt-2">
                Diese Aktion kann nicht rückgängig gemacht werden
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

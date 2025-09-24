'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit,
  Trash2,
  UserCheck,
  UserX
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'mentor' | 'teilnehmer'
  isActive: boolean
  createdAt: string
}

export default function BenutzerPage() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@uniec.com',
      role: 'admin',
      isActive: true,
      createdAt: '2024-01-15'
    },
    {
      id: 'mentor-1',
      name: 'Dr. Sarah Müller',
      email: 'mentor@uniec.com',
      role: 'mentor',
      isActive: true,
      createdAt: '2024-01-20'
    },
    {
      id: 'student-1',
      name: 'Max Mustermann',
      email: 'student@uniec.com',
      role: 'teilnehmer',
      isActive: true,
      createdAt: '2024-01-25'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [showAddUser, setShowAddUser] = useState(false)

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="destructive">Admin</Badge>
      case 'mentor':
        return <Badge variant="default">Mentor</Badge>
      case 'teilnehmer':
        return <Badge variant="secondary">Teilnehmer</Badge>
      default:
        return <Badge variant="outline">Unbekannt</Badge>
    }
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="outline" className="text-green-600 border-green-600">
        <UserCheck className="h-3 w-3 mr-1" />
        Aktiv
      </Badge>
    ) : (
      <Badge variant="outline" className="text-red-600 border-red-600">
        <UserX className="h-3 w-3 mr-1" />
        Inaktiv
      </Badge>
    )
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const getRoleCount = (role: string) => {
    return users.filter(user => user.role === role).length
  }

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Benutzerverwaltung</h1>
          <p className="text-muted-foreground">
            Verwalten Sie Admins, Mentoren und Teilnehmer
          </p>
        </div>
        <Button onClick={() => setShowAddUser(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Benutzer hinzufügen
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamt</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Alle Benutzer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Users className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getRoleCount('admin')}</div>
            <p className="text-xs text-muted-foreground">Administratoren</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mentoren</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getRoleCount('mentor')}</div>
            <p className="text-xs text-muted-foreground">Mentoring-Experten</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teilnehmer</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getRoleCount('teilnehmer')}</div>
            <p className="text-xs text-muted-foreground">Kurs-Teilnehmer</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter & Suche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Suchen</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Name oder E-Mail eingeben..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Label htmlFor="role-filter">Rolle</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Rollen</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="mentor">Mentor</SelectItem>
                  <SelectItem value="teilnehmer">Teilnehmer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User List */}
      <Card>
        <CardHeader>
          <CardTitle>Benutzer ({filteredUsers.length})</CardTitle>
          <CardDescription>
            Übersicht aller Benutzer im System
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Keine Benutzer gefunden</p>
              <p className="text-sm">Versuchen Sie andere Suchkriterien</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Erstellt: {new Date(user.createdAt).toLocaleDateString('de-DE')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {getRoleBadge(user.role)}
                    {getStatusBadge(user.isActive)}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Bearbeiten
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleUserStatus(user.id)}>
                          {user.isActive ? (
                            <>
                              <UserX className="h-4 w-4 mr-2" />
                              Deaktivieren
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Aktivieren
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Löschen
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add User Dialog Placeholder */}
      {showAddUser && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle>Neuen Benutzer hinzufügen</CardTitle>
            <CardDescription>
              Erstellen Sie einen neuen Admin, Mentor oder Teilnehmer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4 text-muted-foreground">
              <p>Add User Dialog würde hier implementiert werden</p>
              <Button 
                variant="outline" 
                onClick={() => setShowAddUser(false)}
                className="mt-4"
              >
                Schließen
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

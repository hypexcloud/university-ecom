'use client'

import { useState } from 'react'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import {
  Users,
  UserPlus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Calendar,
  Filter
} from 'lucide-react'

// Mock data - will be replaced with Firebase
const mockUsers = [
  {
    id: '1',
    name: 'Dr. Maria Schmidt',
    email: 'maria.schmidt@uniec.com',
    role: 'mentor' as const,
    courseType: 'ai' as const,
    timeZone: 'Europe/Berlin',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    phone: '+49 30 12345678',
    sessionsCount: 24,
    rating: 4.8
  },
  {
    id: '2',
    name: 'Prof. Andreas Weber',
    email: 'andreas.weber@uniec.com', 
    role: 'mentor' as const,
    courseType: 'dropshipping' as const,
    timeZone: 'Europe/Berlin',
    isActive: true,
    createdAt: new Date('2024-01-10'),
    phone: '+49 30 87654321',
    sessionsCount: 31,
    rating: 4.9
  },
  {
    id: '3',
    name: 'Max Mustermann',
    email: 'max.mustermann@gmail.com',
    role: 'teilnehmer' as const,
    courseType: 'ai' as const,
    timeZone: 'Europe/Berlin',
    isActive: true,
    createdAt: new Date('2024-02-01'),
    phone: '+49 30 11111111',
    sessionsCompleted: 3,
    progress: 75
  },
  {
    id: '4',
    name: 'Anna Schmidt',
    email: 'anna.schmidt@gmail.com',
    role: 'teilnehmer' as const,
    courseType: 'dropshipping' as const,
    timeZone: 'Europe/Berlin',
    isActive: true,
    createdAt: new Date('2024-01-25'),
    phone: '+49 30 22222222',
    sessionsCompleted: 5,
    progress: 90
  },
  {
    id: '5',
    name: 'Tom Weber',
    email: 'tom.weber@gmail.com',
    role: 'teilnehmer' as const,
    courseType: 'ai' as const,
    timeZone: 'Europe/Berlin',
    isActive: false,
    createdAt: new Date('2024-01-20'),
    phone: '+49 30 33333333',
    sessionsCompleted: 1,
    progress: 20
  }
]

type UserRole = 'admin' | 'mentor' | 'teilnehmer'
type CourseType = 'ai' | 'dropshipping'

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  courseType?: CourseType
  timeZone: string
  isActive: boolean
  createdAt: Date
  phone?: string
  // Mentor specific
  sessionsCount?: number
  rating?: number
  // Teilnehmer specific  
  sessionsCompleted?: number
  progress?: number
}

export default function BenutzerVerwaltung() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'teilnehmer' as UserRole,
    courseType: 'ai' as CourseType,
    timeZone: 'Europe/Berlin',
    phone: ''
  })

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' ? user.isActive : !user.isActive)
    
    return matchesSearch && matchesRole && matchesStatus
  })

  // Get role stats
  const roleStats = {
    total: users.length,
    admin: users.filter(u => u.role === 'admin').length,
    mentor: users.filter(u => u.role === 'mentor').length,
    teilnehmer: users.filter(u => u.role === 'teilnehmer').length,
    active: users.filter(u => u.isActive).length,
    inactive: users.filter(u => !u.isActive).length
  }

  const handleAddUser = () => {
    const user: User = {
      id: Date.now().toString(),
      ...newUser,
      isActive: true,
      createdAt: new Date()
    }
    
    setUsers([...users, user])
    setIsAddDialogOpen(false)
    setNewUser({
      name: '',
      email: '',
      role: 'teilnehmer',
      courseType: 'ai',
      timeZone: 'Europe/Berlin',
      phone: ''
    })
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
  }

  const handleSaveEdit = () => {
    if (!editingUser) return
    
    setUsers(users.map(u => u.id === editingUser.id ? editingUser : u))
    setEditingUser(null)
  }

  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, isActive: !user.isActive }
        : user
    ))
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm('Sind Sie sicher, dass Sie diesen Benutzer löschen möchten?')) {
      setUsers(users.filter(user => user.id !== userId))
    }
  }

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'mentor': return 'bg-blue-100 text-blue-800'
      case 'teilnehmer': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCourseTypeColor = (courseType?: CourseType) => {
    switch (courseType) {
      case 'ai': return 'bg-purple-100 text-purple-800'
      case 'dropshipping': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{roleStats.total}</p>
                <p className="text-xs text-gray-600">Gesamt</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{roleStats.mentor}</p>
                <p className="text-xs text-gray-600">Mentoren</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{roleStats.teilnehmer}</p>
                <p className="text-xs text-gray-600">Teilnehmer</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Eye className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{roleStats.active}</p>
                <p className="text-xs text-gray-600">Aktiv</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <EyeOff className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{roleStats.inactive}</p>
                <p className="text-xs text-gray-600">Inaktiv</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <UserPlus className="h-4 w-4 mr-2" />
                Benutzer hinzufügen
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Neuen Benutzer hinzufügen</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="Max Mustermann"
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-Mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="max@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Rolle</Label>
                  <Select 
                    value={newUser.role} 
                    onValueChange={(value: UserRole) => setNewUser({ ...newUser, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="mentor">Mentor</SelectItem>
                      <SelectItem value="teilnehmer">Teilnehmer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="courseType">Kurs-Typ</Label>
                  <Select 
                    value={newUser.courseType} 
                    onValueChange={(value: CourseType) => setNewUser({ ...newUser, courseType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ai">AI-Kurs</SelectItem>
                      <SelectItem value="dropshipping">Dropshipping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="phone">Telefon (optional)</Label>
                  <Input
                    id="phone"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    placeholder="+49 30 12345678"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddUser} className="flex-1">
                    Hinzufügen
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">
                    Abbrechen
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Nach Name oder E-Mail suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Alle Rollen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Rollen</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="mentor">Mentor</SelectItem>
                  <SelectItem value="teilnehmer">Teilnehmer</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle</SelectItem>
                  <SelectItem value="active">Aktiv</SelectItem>
                  <SelectItem value="inactive">Inaktiv</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>
            Benutzer ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name & E-Mail</TableHead>
                <TableHead>Rolle</TableHead>
                <TableHead>Kurs</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Statistiken</TableHead>
                <TableHead>Erstellt</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {user.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(user.role)}>
                      {user.role === 'admin' && 'Administrator'}
                      {user.role === 'mentor' && 'Mentor'}
                      {user.role === 'teilnehmer' && 'Teilnehmer'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.courseType && (
                      <Badge className={getCourseTypeColor(user.courseType)}>
                        {user.courseType === 'ai' ? 'AI-Kurs' : 'Dropshipping'}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? 'default' : 'secondary'}>
                      {user.isActive ? 'Aktiv' : 'Inaktiv'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {user.role === 'mentor' && (
                        <div>
                          <div>⭐ {user.rating}/5</div>
                          <div className="text-gray-500">{user.sessionsCount} Sessions</div>
                        </div>
                      )}
                      {user.role === 'teilnehmer' && (
                        <div>
                          <div>📈 {user.progress}%</div>
                          <div className="text-gray-500">{user.sessionsCompleted} Sessions</div>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {user.createdAt.toLocaleDateString('de-DE')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Bearbeiten
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(user.id)}>
                          {user.isActive ? (
                            <>
                              <EyeOff className="h-4 w-4 mr-2" />
                              Deaktivieren
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              Aktivieren
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Löschen
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      {editingUser && (
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Benutzer bearbeiten</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-email">E-Mail</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-role">Rolle</Label>
                <Select 
                  value={editingUser.role} 
                  onValueChange={(value: UserRole) => setEditingUser({ ...editingUser, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="mentor">Mentor</SelectItem>
                    <SelectItem value="teilnehmer">Teilnehmer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-courseType">Kurs-Typ</Label>
                <Select 
                  value={editingUser.courseType || 'ai'} 
                  onValueChange={(value: CourseType) => setEditingUser({ ...editingUser, courseType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ai">AI-Kurs</SelectItem>
                    <SelectItem value="dropshipping">Dropshipping</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-phone">Telefon</Label>
                <Input
                  id="edit-phone"
                  value={editingUser.phone || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveEdit} className="flex-1">
                  Speichern
                </Button>
                <Button variant="outline" onClick={() => setEditingUser(null)} className="flex-1">
                  Abbrechen
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

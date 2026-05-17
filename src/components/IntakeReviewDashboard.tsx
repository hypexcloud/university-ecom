'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Mail,
  Phone,
  Loader2,
  Award,
} from 'lucide-react'
import { format } from 'date-fns'
import type { IntakeSubmission } from '@/lib/intake-types'

export default function IntakeReviewDashboard() {
  const [submissions, setSubmissions] = useState<IntakeSubmission[]>([])
  const [filteredSubmissions, setFilteredSubmissions] = useState<IntakeSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<IntakeSubmission | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [reviewNotes, setReviewNotes] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterQualification, setFilterQualification] = useState<string>('all')

  useEffect(() => {
    loadSubmissions()
  }, [])

  useEffect(() => {
    filterSubmissionsList()
  }, [filterStatus, filterQualification, submissions])

  const loadSubmissions = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/intake-submissions')
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data.submissions || [])
      }
    } catch (error) {
      console.error('Error loading submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterSubmissionsList = () => {
    let filtered = [...submissions]

    if (filterStatus !== 'all') {
      filtered = filtered.filter((s) => s.status === filterStatus)
    }

    if (filterQualification !== 'all') {
      filtered = filtered.filter((s) => s.qualification === filterQualification)
    }

    setFilteredSubmissions(filtered)
  }

  const handleViewDetails = (submission: IntakeSubmission) => {
    setSelectedSubmission(submission)
    setReviewNotes(submission.reviewNotes || '')
    setIsDetailsOpen(true)
  }

  const handleUpdateStatus = async (status: 'approved' | 'rejected') => {
    if (!selectedSubmission) return

    try {
      const response = await fetch(`/api/admin/intake-submissions/${selectedSubmission.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          reviewNotes,
        }),
      })

      if (response.ok) {
        await loadSubmissions()
        setIsDetailsOpen(false)
      }
    } catch (error) {
      console.error('Error updating submission:', error)
    }
  }

  const getQualificationBadge = (qualification: string) => {
    switch (qualification) {
      case 'high':
        return <Badge className="bg-green-100 text-green-800">Hoch</Badge>
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Mittel</Badge>
      case 'low':
        return <Badge className="bg-blue-100 text-blue-800">Niedrig</Badge>
      default:
        return <Badge variant="outline">{qualification}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Ausstehend</Badge>
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Genehmigt</Badge>
      case 'rejected':
        return <Badge variant="destructive">Abgelehnt</Badge>
      case 'reviewing':
        return <Badge className="bg-blue-100 text-blue-800">In Prüfung</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const stats = {
    total: submissions.length,
    pending: submissions.filter((s) => s.status === 'pending').length,
    approved: submissions.filter((s) => s.status === 'approved').length,
    rejected: submissions.filter((s) => s.status === 'rejected').length,
    highQual: submissions.filter((s) => s.qualification === 'high').length,
    mediumQual: submissions.filter((s) => s.qualification === 'medium').length,
    lowQual: submissions.filter((s) => s.qualification === 'low').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Intake-Bewerbungen</h1>
        <p className="text-gray-600 mt-1">Verwalten Sie Kursinteressenten und Bewerbungen</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{stats.total}</p>
              <p className="text-sm text-gray-600">Gesamt</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-sm text-gray-600">Ausstehend</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{stats.highQual}</p>
              <p className="text-sm text-gray-600">Hoch qualifiziert</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.approved}</p>
              <p className="text-sm text-gray-600">Genehmigt</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="pending">Ausstehend</SelectItem>
                <SelectItem value="reviewing">In Prüfung</SelectItem>
                <SelectItem value="approved">Genehmigt</SelectItem>
                <SelectItem value="rejected">Abgelehnt</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterQualification} onValueChange={setFilterQualification}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Qualifikationen</SelectItem>
                <SelectItem value="high">Hoch</SelectItem>
                <SelectItem value="medium">Mittel</SelectItem>
                <SelectItem value="low">Niedrig</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Bewerbungen ({filteredSubmissions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Keine Bewerbungen gefunden</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>E-Mail</TableHead>
                  <TableHead>Kurs</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Qualifikation</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead>Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">
                      {submission.firstName} {submission.lastName}
                    </TableCell>
                    <TableCell>{submission.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{submission.courseType.toUpperCase()}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{submission.leadScore}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getQualificationBadge(submission.qualification)}</TableCell>
                    <TableCell>{getStatusBadge(submission.status)}</TableCell>
                    <TableCell>
                      {submission.submittedAt &&
                        format(
                          new Date(
                            (submission.submittedAt as any).seconds
                              ? (submission.submittedAt as any).seconds * 1000
                              : (submission.submittedAt as unknown as number)
                          ),
                          'dd.MM.yyyy'
                        )}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(submission)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Bewerbungsdetails: {selectedSubmission?.firstName} {selectedSubmission?.lastName}
            </DialogTitle>
            <DialogDescription>
              Eingereicht am{' '}
              {selectedSubmission?.submittedAt &&
                format(
                  new Date(
                    (selectedSubmission.submittedAt as any).seconds
                      ? (selectedSubmission.submittedAt as any).seconds * 1000
                      : (selectedSubmission.submittedAt as unknown as number)
                  ),
                  'dd.MM.yyyy HH:mm'
                )}
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-6">
              {/* Score & Qualification */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Lead Score</p>
                      <p className="text-3xl font-bold">{selectedSubmission.leadScore} / 100</p>
                    </div>
                    <div>{getQualificationBadge(selectedSubmission.qualification)}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <div>
                <h3 className="font-bold mb-3">Kontaktinformationen</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">E-Mail</p>
                    <p className="font-medium">{selectedSubmission.email}</p>
                  </div>
                  {selectedSubmission.phone && (
                    <div>
                      <p className="text-sm text-gray-600">Telefon</p>
                      <p className="font-medium">{selectedSubmission.phone}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Land</p>
                    <p className="font-medium">{selectedSubmission.country}</p>
                  </div>
                </div>
              </div>

              {/* Business Background */}
              <div>
                <h3 className="font-bold mb-3">Geschäftlicher Hintergrund</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-600">Aktuelle Situation:</span>{' '}
                    {selectedSubmission.currentSituation}
                  </p>
                  <p>
                    <span className="text-gray-600">Online Business:</span>{' '}
                    {selectedSubmission.hasOnlineBusiness ? 'Ja' : 'Nein'}
                  </p>
                  <p>
                    <span className="text-gray-600">Geschäftserfahrung:</span>{' '}
                    {selectedSubmission.businessExperience}
                  </p>
                  {selectedSubmission.monthlyRevenue && (
                    <p>
                      <span className="text-gray-600">Monatlicher Umsatz:</span>{' '}
                      {selectedSubmission.monthlyRevenue}
                    </p>
                  )}
                </div>
              </div>

              {/* Goals & Motivation */}
              <div>
                <h3 className="font-bold mb-3">Ziele & Motivation</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Hauptziel</p>
                    <p className="text-sm bg-gray-50 p-3 rounded">{selectedSubmission.primaryGoal}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Warum jetzt?</p>
                    <p className="text-sm bg-gray-50 p-3 rounded">{selectedSubmission.whyNow}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Größte Herausforderung</p>
                    <p className="text-sm bg-gray-50 p-3 rounded">
                      {selectedSubmission.biggestChallenge}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Erwartungen</p>
                    <p className="text-sm bg-gray-50 p-3 rounded">
                      {selectedSubmission.expectations}
                    </p>
                  </div>
                </div>
              </div>

              {/* Review Notes */}
              <div>
                <h3 className="font-bold mb-3">Prüfungsnotizen</h3>
                <Textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Ihre Notizen zur Bewerbung..."
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Schließen
            </Button>
            {selectedSubmission?.status === 'pending' && (
              <>
                <Button variant="destructive" onClick={() => handleUpdateStatus('rejected')}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Ablehnen
                </Button>
                <Button onClick={() => handleUpdateStatus('approved')}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Genehmigen
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

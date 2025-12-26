'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  Users, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Eye,
  Check,
  X,
  TrendingUp,
  Search
} from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

export default function AdminAffiliateManagement() {
  const [loading, setLoading] = useState(true)
  const [affiliates, setAffiliates] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [commissions, setCommissions] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/affiliates')
      if (response.ok) {
        const data = await response.json()
        setAffiliates(data.affiliates || [])
        setApplications(data.applications || [])
        setCommissions(data.commissions || [])
      }
    } catch (err) {
      console.error('Error loading affiliate data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleReviewApplication = (application: any) => {
    setSelectedApplication(application)
    setReviewDialogOpen(true)
  }

  const handleApproveApplication = async () => {
    if (!selectedApplication) return
    
    setProcessing(true)
    try {
      const response = await fetch('/api/admin/approve-affiliate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: selectedApplication.id,
          userId: selectedApplication.userId,
          approved: true
        })
      })

      if (response.ok) {
        await loadData()
        setReviewDialogOpen(false)
      }
    } catch (err) {
      console.error('Error approving application:', err)
    } finally {
      setProcessing(false)
    }
  }

  const handleRejectApplication = async () => {
    if (!selectedApplication) return
    
    setProcessing(true)
    try {
      const response = await fetch('/api/admin/approve-affiliate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: selectedApplication.id,
          userId: selectedApplication.userId,
          approved: false
        })
      })

      if (response.ok) {
        await loadData()
        setReviewDialogOpen(false)
      }
    } catch (err) {
      console.error('Error rejecting application:', err)
    } finally {
      setProcessing(false)
    }
  }

  const handleUpdateCommissionStatus = async (commissionId: string, affiliateId: string, amount: number, status: string) => {
    try {
      const response = await fetch('/api/admin/update-commission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commissionId,
          affiliateId,
          amount,
          status
        })
      })

      if (response.ok) {
        await loadData()
      }
    } catch (err) {
      console.error('Error updating commission:', err)
    }
  }

  const stats = {
    totalAffiliates: affiliates.length,
    pendingApplications: applications.filter(a => a.status === 'pending').length,
    totalCommissions: commissions.reduce((sum, c) => sum + c.amount, 0),
    pendingCommissions: commissions.filter(c => c.status === 'pending').length
  }

  const filteredAffiliates = affiliates.filter(a => 
    a.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.affiliateData?.code?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Affiliates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAffiliates}</div>
            <p className="text-xs text-muted-foreground">Aktive Partner</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bewerbungen</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApplications}</div>
            <p className="text-xs text-muted-foreground">Ausstehend</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Provisionen</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{stats.totalCommissions.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Gesamt</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ausstehend</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingCommissions}</div>
            <p className="text-xs text-muted-foreground">Zu prüfen</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="affiliates">
        <TabsList>
          <TabsTrigger value="affiliates">
            Affiliates ({affiliates.length})
          </TabsTrigger>
          <TabsTrigger value="applications">
            Bewerbungen ({applications.length})
          </TabsTrigger>
          <TabsTrigger value="commissions">
            Provisionen ({commissions.length})
          </TabsTrigger>
        </TabsList>

        {/* Affiliates Tab */}
        <TabsContent value="affiliates" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Affiliate Partner</CardTitle>
                  <CardDescription>Alle aktiven Affiliates</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Suchen..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Empfehlungen</TableHead>
                    <TableHead>Verdienst</TableHead>
                    <TableHead>Ausstehend</TableHead>
                    <TableHead>Conversion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAffiliates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                        Keine Affiliates gefunden
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAffiliates.map((affiliate) => (
                      <TableRow key={affiliate.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{affiliate.firstName} {affiliate.lastName}</p>
                            <p className="text-sm text-gray-500">{affiliate.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                            {affiliate.affiliateData?.code}
                          </code>
                        </TableCell>
                        <TableCell>{affiliate.affiliateData?.totalReferrals || 0}</TableCell>
                        <TableCell>€{(affiliate.affiliateData?.totalEarnings || 0).toFixed(2)}</TableCell>
                        <TableCell>€{(affiliate.affiliateData?.pendingEarnings || 0).toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {affiliate.affiliateData?.conversionRate || 0}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Affiliate Bewerbungen</CardTitle>
              <CardDescription>Prüfen und genehmigen Sie neue Bewerbungen</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Datum</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                        Keine Bewerbungen
                      </TableCell>
                    </TableRow>
                  ) : (
                    applications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{app.name}</p>
                            <p className="text-sm text-gray-500">{app.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {app.appliedAt && format(app.appliedAt.toDate(), 'd. MMM yyyy', { locale: de })}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              app.status === 'approved' ? 'default' :
                              app.status === 'rejected' ? 'destructive' :
                              'secondary'
                            }
                          >
                            {app.status === 'pending' && 'Ausstehend'}
                            {app.status === 'approved' && 'Genehmigt'}
                            {app.status === 'rejected' && 'Abgelehnt'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {app.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReviewApplication(app)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Prüfen
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Commissions Tab */}
        <TabsContent value="commissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Provisionen</CardTitle>
              <CardDescription>Verwalten Sie Affiliate-Provisionen</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Affiliate</TableHead>
                    <TableHead>Betrag</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Datum</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commissions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                        Keine Provisionen
                      </TableCell>
                    </TableRow>
                  ) : (
                    commissions.map((commission) => (
                      <TableRow key={commission.id}>
                        <TableCell>
                          <code className="text-sm">{commission.affiliateId.substring(0, 8)}...</code>
                        </TableCell>
                        <TableCell className="font-medium">€{commission.amount.toFixed(2)}</TableCell>
                        <TableCell>{(commission.rate * 100).toFixed(0)}%</TableCell>
                        <TableCell>
                          {commission.createdAt && format(commission.createdAt.toDate(), 'd. MMM', { locale: de })}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              commission.status === 'paid' ? 'default' :
                              commission.status === 'approved' ? 'secondary' :
                              'outline'
                            }
                          >
                            {commission.status === 'pending' && 'Ausstehend'}
                            {commission.status === 'approved' && 'Genehmigt'}
                            {commission.status === 'paid' && 'Ausgezahlt'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {commission.status === 'pending' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdateCommissionStatus(
                                  commission.id,
                                  commission.affiliateId,
                                  commission.amount,
                                  'approved'
                                )}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            {commission.status === 'approved' && (
                              <Button
                                size="sm"
                                onClick={() => handleUpdateCommissionStatus(
                                  commission.id,
                                  commission.affiliateId,
                                  commission.amount,
                                  'paid'
                                )}
                              >
                                Als bezahlt markieren
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Affiliate Bewerbung prüfen</DialogTitle>
            <DialogDescription>Überprüfen Sie die Bewerbungsdetails</DialogDescription>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Name</p>
                <p className="text-sm text-gray-600">{selectedApplication.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium">E-Mail</p>
                <p className="text-sm text-gray-600">{selectedApplication.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Grund</p>
                <p className="text-sm text-gray-600">{selectedApplication.reason}</p>
              </div>
              {selectedApplication.website && (
                <div>
                  <p className="text-sm font-medium">Website</p>
                  <p className="text-sm text-gray-600">{selectedApplication.website}</p>
                </div>
              )}
              {selectedApplication.experience && (
                <div>
                  <p className="text-sm font-medium">Erfahrung</p>
                  <p className="text-sm text-gray-600">{selectedApplication.experience}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleRejectApplication}
              disabled={processing}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Ablehnen
            </Button>
            <Button
              onClick={handleApproveApplication}
              disabled={processing}
            >
              {processing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Genehmigen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

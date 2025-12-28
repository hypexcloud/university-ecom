'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Award,
  ArrowRight,
  Calendar,
  ShoppingCart,
} from 'lucide-react'
import { getRecommendation } from '@/lib/lead-scoring'
import type { IntakeSubmission } from '@/lib/intake-types'
import Link from 'next/link'

interface IntakeResultsProps {
  submission: IntakeSubmission
}

export default function IntakeResults({ submission }: IntakeResultsProps) {
  const recommendation = getRecommendation(submission.qualification)
  const { leadScore, qualification } = submission

  const getQualificationColor = () => {
    switch (qualification) {
      case 'high':
        return 'bg-green-50 border-green-500'
      case 'medium':
        return 'bg-yellow-50 border-yellow-500'
      case 'low':
        return 'bg-blue-50 border-blue-500'
    }
  }

  const getQualificationIcon = () => {
    switch (qualification) {
      case 'high':
        return <CheckCircle className="h-16 w-16 text-green-600" />
      case 'medium':
        return <AlertCircle className="h-16 w-16 text-yellow-600" />
      case 'low':
        return <Calendar className="h-16 w-16 text-blue-600" />
    }
  }

  const getQualificationLabel = () => {
    switch (qualification) {
      case 'high':
        return 'Hohe Qualifikation'
      case 'medium':
        return 'Mittlere Qualifikation'
      case 'low':
        return 'Beratung empfohlen'
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Score Card */}
      <Card className={`${getQualificationColor()} border-2`}>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">{getQualificationIcon()}</div>

            <div>
              <h2 className="text-3xl font-bold mb-2">
                {getQualificationLabel()}
              </h2>
              <Badge
                variant="secondary"
                className={`text-lg px-4 py-1 ${
                  qualification === 'high'
                    ? 'bg-green-100 text-green-800'
                    : qualification === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                <Award className="h-4 w-4 mr-2 inline" />
                {leadScore} / 100 Punkte
              </Badge>
            </div>

            <div className="max-w-md mx-auto">
              <div className="flex justify-between text-sm mb-2">
                <span>Ihr Qualifikations-Score</span>
                <span>{leadScore}%</span>
              </div>
              <Progress value={leadScore} className="h-3" />
            </div>

            <p className="text-lg mt-4">{recommendation.message}</p>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Ihre nächsten Schritte</CardTitle>
          <CardDescription>So geht es weiter</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendation.nextSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <p className="flex-1 pt-1">{step}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Score Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Score-Aufschlüsselung</CardTitle>
          <CardDescription>So wurde Ihr Score berechnet</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Geschäftlicher Hintergrund</span>
              <span className="font-medium">0-30 Punkte</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• Online Business vorhanden: {submission.hasOnlineBusiness ? '✓' : '✗'}</li>
              <li>• Geschäftserfahrung: {submission.businessExperience}</li>
            </ul>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Finanzielle Bereitschaft</span>
              <span className="font-medium">0-25 Punkte</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• Investitionsbudget: {submission.investmentBudget}</li>
              {submission.monthlyRevenue && <li>• Monatlicher Umsatz: {submission.monthlyRevenue}</li>}
            </ul>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Engagement-Level</span>
              <span className="font-medium">0-25 Punkte</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• Zeitliches Engagement: {submission.timeCommitment}</li>
              <li>• Startbereitschaft: {submission.readyToStart}</li>
            </ul>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Passung & Motivation</span>
              <span className="font-medium">0-20 Punkte</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• Klare Ziele: {submission.primaryGoal.length > 50 ? '✓' : '✗'}</li>
              <li>• Kurs-Interesse: {submission.courseType}</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {recommendation.canPurchase && (
          <Button asChild size="lg" className="flex-1">
            <Link href="/pricing">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Zur Kursauswahl
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        )}

        <Button asChild variant="outline" size="lg" className="flex-1">
          <Link href="/contact">
            <Calendar className="h-5 w-5 mr-2" />
            Beratungsgespräch buchen
          </Link>
        </Button>
      </div>

      {/* Additional Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0" />
            <div className="space-y-2">
              <p className="font-medium text-blue-900">
                Vielen Dank für Ihre Bewerbung!
              </p>
              <p className="text-sm text-blue-800">
                Wir haben Ihre Informationen erhalten und werden uns innerhalb von 24 Stunden bei
                Ihnen melden. Sie erhalten eine Bestätigungs-E-Mail an{' '}
                <strong>{submission.email}</strong>.
              </p>
              {qualification === 'low' && (
                <p className="text-sm text-blue-800 mt-2">
                  Ein Mitglied unseres Teams wird sich mit Ihnen in Verbindung setzen, um die
                  beste Vorgehensweise für Ihre individuelle Situation zu besprechen.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

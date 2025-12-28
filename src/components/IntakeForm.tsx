'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Award,
  AlertCircle,
} from 'lucide-react'
import type { IntakeSubmission } from '@/lib/intake-types'

interface IntakeFormProps {
  onComplete: (submission: IntakeSubmission) => void
  prefilledEmail?: string
}

const TOTAL_STEPS = 5

export default function IntakeForm({ onComplete, prefilledEmail }: IntakeFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<IntakeSubmission>>({
    email: prefilledEmail || '',
    courseType: 'ai',
  })

  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const response = await fetch('/api/intake/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        onComplete(data.submission)
      }
    } catch (error) {
      console.error('Error submitting intake:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && formData.country
      case 2:
        return (
          formData.currentSituation &&
          formData.hasOnlineBusiness !== undefined &&
          formData.businessExperience
        )
      case 3:
        return formData.courseType && formData.primaryGoal && formData.timeCommitment
      case 4:
        return formData.investmentBudget && formData.readyToStart
      case 5:
        return formData.whyNow && formData.biggestChallenge && formData.expectations
      default:
        return false
    }
  }

  const progress = (currentStep / TOTAL_STEPS) * 100

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">
            Schritt {currentStep} von {TOTAL_STEPS}
          </span>
          <span className="text-sm text-gray-600">{Math.round(progress)}% abgeschlossen</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step 1: Personal Information */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Persönliche Informationen</CardTitle>
            <CardDescription>Beginnen wir mit Ihren grundlegenden Informationen</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Vorname *</Label>
                <Input
                  value={formData.firstName || ''}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  placeholder="Max"
                />
              </div>
              <div>
                <Label>Nachname *</Label>
                <Input
                  value={formData.lastName || ''}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  placeholder="Mustermann"
                />
              </div>
            </div>

            <div>
              <Label>E-Mail *</Label>
              <Input
                type="email"
                value={formData.email || ''}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="max@beispiel.de"
              />
            </div>

            <div>
              <Label>Telefon (optional)</Label>
              <Input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+49 123 456789"
              />
            </div>

            <div>
              <Label>Land *</Label>
              <Select value={formData.country} onValueChange={(value) => updateField('country', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Wählen Sie Ihr Land" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DE">Deutschland</SelectItem>
                  <SelectItem value="AT">Österreich</SelectItem>
                  <SelectItem value="CH">Schweiz</SelectItem>
                  <SelectItem value="other">Anderes Land</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Business Background */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Geschäftlicher Hintergrund</CardTitle>
            <CardDescription>Erzählen Sie uns von Ihrer aktuellen Situation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Aktuelle Situation *</Label>
              <Select
                value={formData.currentSituation}
                onValueChange={(value: any) => updateField('currentSituation', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wählen Sie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employed">Angestellt</SelectItem>
                  <SelectItem value="self_employed">Selbstständig</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="unemployed">Arbeitsuchend</SelectItem>
                  <SelectItem value="other">Andere</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Haben Sie bereits ein Online-Business? *</Label>
              <RadioGroup
                value={formData.hasOnlineBusiness?.toString()}
                onValueChange={(value) => updateField('hasOnlineBusiness', value === 'true')}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="has-yes" />
                  <Label htmlFor="has-yes">Ja</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="has-no" />
                  <Label htmlFor="has-no">Nein</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Geschäftserfahrung *</Label>
              <Select
                value={formData.businessExperience}
                onValueChange={(value: any) => updateField('businessExperience', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wählen Sie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Keine Erfahrung</SelectItem>
                  <SelectItem value="less_than_1_year">Weniger als 1 Jahr</SelectItem>
                  <SelectItem value="1_3_years">1-3 Jahre</SelectItem>
                  <SelectItem value="more_than_3_years">Mehr als 3 Jahre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.hasOnlineBusiness && (
              <div>
                <Label>Monatlicher Umsatz (optional)</Label>
                <Input
                  value={formData.monthlyRevenue || ''}
                  onChange={(e) => updateField('monthlyRevenue', e.target.value)}
                  placeholder="z.B. €5000"
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 3: Course Interest */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Kursinteresse & Ziele</CardTitle>
            <CardDescription>Was möchten Sie erreichen?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Welcher Kurs interessiert Sie? *</Label>
              <RadioGroup
                value={formData.courseType}
                onValueChange={(value: any) => updateField('courseType', value)}
              >
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="ai" id="ai" />
                  <Label htmlFor="ai" className="flex-1 cursor-pointer">
                    <div>
                      <p className="font-medium">KI Automation Kurs</p>
                      <p className="text-sm text-gray-600">
                        Automatisieren Sie Ihr Business mit KI
                      </p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="dropshipping" id="dropshipping" />
                  <Label htmlFor="dropshipping" className="flex-1 cursor-pointer">
                    <div>
                      <p className="font-medium">EU Dropshipping Kurs</p>
                      <p className="text-sm text-gray-600">
                        Starten Sie Ihr EU-konformes Dropshipping Business
                      </p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="both" id="both" />
                  <Label htmlFor="both" className="flex-1 cursor-pointer">
                    <div>
                      <p className="font-medium">Beide Kurse</p>
                      <p className="text-sm text-gray-600">
                        Kombinieren Sie KI & Dropshipping
                      </p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Ihr Hauptziel *</Label>
              <Textarea
                value={formData.primaryGoal || ''}
                onChange={(e) => updateField('primaryGoal', e.target.value)}
                placeholder="Was möchten Sie mit dem Kurs erreichen? Je detaillierter, desto besser..."
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-1">
                {(formData.primaryGoal?.length || 0)}/500 Zeichen
              </p>
            </div>

            <div>
              <Label>Zeitliches Engagement (pro Woche) *</Label>
              <Select
                value={formData.timeCommitment}
                onValueChange={(value: any) => updateField('timeCommitment', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wählen Sie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="less_than_5h">Weniger als 5 Stunden</SelectItem>
                  <SelectItem value="5_10h">5-10 Stunden</SelectItem>
                  <SelectItem value="10_20h">10-20 Stunden</SelectItem>
                  <SelectItem value="more_than_20h">Mehr als 20 Stunden</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Course-specific questions */}
            {formData.courseType === 'ai' && (
              <>
                <div>
                  <Label>KI-Erfahrung</Label>
                  <Select
                    value={formData.aiExperience}
                    onValueChange={(value: any) => updateField('aiExperience', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wählen Sie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Keine Erfahrung</SelectItem>
                      <SelectItem value="beginner">Anfänger</SelectItem>
                      <SelectItem value="intermediate">Fortgeschritten</SelectItem>
                      <SelectItem value="advanced">Experte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Was möchten Sie automatisieren?</Label>
                  <Textarea
                    value={formData.aiUseCase || ''}
                    onChange={(e) => updateField('aiUseCase', e.target.value)}
                    placeholder="z.B. Kundensupport, Content-Erstellung, Datenanalyse..."
                    rows={3}
                  />
                </div>
              </>
            )}

            {formData.courseType === 'dropshipping' && (
              <>
                <div>
                  <Label>Dropshipping-Erfahrung</Label>
                  <Select
                    value={formData.dropshippingExperience}
                    onValueChange={(value: any) => updateField('dropshippingExperience', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wählen Sie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Keine Erfahrung</SelectItem>
                      <SelectItem value="tried_failed">Versucht, nicht erfolgreich</SelectItem>
                      <SelectItem value="currently_running">Aktuell am Laufen</SelectItem>
                      <SelectItem value="experienced">Erfahren</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Zielmarkt</Label>
                  <Input
                    value={formData.targetMarket || ''}
                    onChange={(e) => updateField('targetMarket', e.target.value)}
                    placeholder="z.B. Deutschland, DACH-Region, EU..."
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 4: Investment & Readiness */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Investitionsbereitschaft</CardTitle>
            <CardDescription>Wie bereit sind Sie zu starten?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Investitionsbudget *</Label>
              <RadioGroup
                value={formData.investmentBudget}
                onValueChange={(value: any) => updateField('investmentBudget', value)}
              >
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="under_500" id="under500" />
                  <Label htmlFor="under500" className="flex-1 cursor-pointer">
                    Unter €500
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="500_2000" id="500to2000" />
                  <Label htmlFor="500to2000" className="flex-1 cursor-pointer">
                    €500 - €2.000
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="2000_5000" id="2000to5000" />
                  <Label htmlFor="2000to5000" className="flex-1 cursor-pointer">
                    €2.000 - €5.000
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="over_5000" id="over5000" />
                  <Label htmlFor="over5000" className="flex-1 cursor-pointer">
                    Über €5.000
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Wann möchten Sie starten? *</Label>
              <Select
                value={formData.readyToStart}
                onValueChange={(value: any) => updateField('readyToStart', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wählen Sie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediately">Sofort</SelectItem>
                  <SelectItem value="within_1_month">Innerhalb 1 Monat</SelectItem>
                  <SelectItem value="within_3_months">Innerhalb 3 Monaten</SelectItem>
                  <SelectItem value="just_exploring">Nur am Erkunden</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Motivation */}
      {currentStep === 5 && (
        <Card>
          <CardHeader>
            <CardTitle>Motivation & Erwartungen</CardTitle>
            <CardDescription>Helfen Sie uns, Sie besser zu verstehen</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Warum jetzt? *</Label>
              <Textarea
                value={formData.whyNow || ''}
                onChange={(e) => updateField('whyNow', e.target.value)}
                placeholder="Was hat Sie dazu bewogen, genau jetzt nach dieser Lösung zu suchen?"
                rows={4}
              />
            </div>

            <div>
              <Label>Ihre größte Herausforderung *</Label>
              <Textarea
                value={formData.biggestChallenge || ''}
                onChange={(e) => updateField('biggestChallenge', e.target.value)}
                placeholder="Was ist Ihre größte Herausforderung, die Sie mit diesem Kurs lösen möchten?"
                rows={4}
              />
            </div>

            <div>
              <Label>Ihre Erwartungen *</Label>
              <Textarea
                value={formData.expectations || ''}
                onChange={(e) => updateField('expectations', e.target.value)}
                placeholder="Was erwarten Sie vom Kurs? Was würde für Sie einen Erfolg darstellen?"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück
        </Button>

        {currentStep < TOTAL_STEPS ? (
          <Button onClick={handleNext} disabled={!isStepValid()}>
            Weiter
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!isStepValid() || submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Wird eingereicht...
              </>
            ) : (
              <>
                Absenden
                <CheckCircle className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

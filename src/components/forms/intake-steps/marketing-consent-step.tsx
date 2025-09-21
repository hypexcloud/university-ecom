'use client'

import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Shield, Globe, Mail, MessageSquare, CheckCircle, Loader2 } from 'lucide-react'
import { formOptions } from '../intake-validation'
import type { IntakeFormData } from '../intake-validation'
import Link from 'next/link'

interface MarketingConsentStepProps {
  onSubmit: () => void
  onBack: () => void
  isSubmitting: boolean
}

export function MarketingConsentStep({ onSubmit, onBack, isSubmitting }: MarketingConsentStepProps) {
  const { 
    setValue, 
    watch, 
    formState: { errors },
    trigger 
  } = useFormContext<IntakeFormData>()

  const marketingConsent = watch('marketingConsent')

  const handleSubmit = async () => {
    const isValid = await trigger('marketingConsent')
    if (isValid) {
      onSubmit()
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          Einverständnis & Datenschutz
        </h2>
        <p className="text-muted-foreground">
          Letzte Schritte: Marketing-Präferenzen und rechtliche Einverständnisse.
        </p>
      </div>

      {/* How did you hear about us */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Wie haben Sie von uns erfahren?
          </CardTitle>
          <CardDescription>
            Diese Information hilft uns, unsere Marketingbemühungen zu verbessern.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Informationsquelle *</Label>
            <Select
              value={marketingConsent?.howDidYouHear || ''}
              onValueChange={(value) => setValue('marketingConsent.howDidYouHear', value)}
            >
              <SelectTrigger className={errors.marketingConsent?.howDidYouHear ? 'border-red-500' : ''}>
                <SelectValue placeholder="Wählen Sie eine Option" />
              </SelectTrigger>
              <SelectContent>
                {formOptions.howDidYouHear.map((source) => (
                  <SelectItem key={source.value} value={source.value}>
                    {source.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.marketingConsent?.howDidYouHear && (
              <p className="text-sm text-red-500">{errors.marketingConsent.howDidYouHear.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Language Preference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Sprachpräferenz
          </CardTitle>
          <CardDescription>
            In welcher Sprache möchten Sie kommunizieren?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={marketingConsent?.preferredLanguage || ''}
            onValueChange={(value) => setValue('marketingConsent.preferredLanguage', value)}
            className="flex space-x-6"
          >
            {formOptions.languages.map((language) => (
              <div key={language.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={language.value}
                  id={language.value}
                  className={errors.marketingConsent?.preferredLanguage ? 'border-red-500' : ''}
                />
                <Label htmlFor={language.value} className="cursor-pointer">
                  {language.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {errors.marketingConsent?.preferredLanguage && (
            <p className="text-sm text-red-500">{errors.marketingConsent.preferredLanguage.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Marketing Consent */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Marketing-Einverständnis
          </CardTitle>
          <CardDescription>
            Möchten Sie über neue Kurse, Updates und exklusive Angebote informiert werden?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="marketingConsent"
              checked={marketingConsent?.marketingConsent || false}
              onCheckedChange={(checked) => setValue('marketingConsent.marketingConsent', checked as boolean)}
            />
            <div className="space-y-1">
              <Label htmlFor="marketingConsent" className="cursor-pointer font-medium">
                Ja, ich möchte Marketing-E-Mails erhalten
              </Label>
              <p className="text-sm text-muted-foreground">
                Sie erhalten etwa 1-2 E-Mails pro Woche mit wertvollen Tipps, Kurs-Updates und exklusiven Angeboten. 
                Sie können sich jederzeit abmelden.
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border-blue-200 border">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-800">
                  Was Sie erwarten können:
                </p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Exklusive Tipps und Strategien</li>
                  <li>• Früher Zugang zu neuen Kursen</li>
                  <li>• Spezielle Rabatte für Stammkunden</li>
                  <li>• Live-Webinare und Q&A-Sessions</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legal Consent */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Rechtliche Einverständnisse
          </CardTitle>
          <CardDescription>
            Erforderlich für die Nutzung unserer Dienste
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Data Processing Consent */}
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="dataProcessingConsent"
                checked={marketingConsent?.dataProcessingConsent || false}
                onCheckedChange={(checked) => setValue('marketingConsent.dataProcessingConsent', checked as boolean)}
                className={errors.marketingConsent?.dataProcessingConsent ? 'border-red-500' : ''}
              />
              <div className="space-y-1">
                <Label htmlFor="dataProcessingConsent" className="cursor-pointer font-medium">
                  Datenverarbeitung zustimmen *
                </Label>
                <p className="text-sm text-muted-foreground">
                  Ich stimme der Verarbeitung meiner personenbezogenen Daten gemäß der{' '}
                  <Link href="/privacy" className="text-primary underline">
                    Datenschutzerklärung
                  </Link>{' '}
                  zu. Diese Zustimmung ist erforderlich, um Ihnen unsere Dienste anbieten zu können.
                </p>
              </div>
            </div>
            {errors.marketingConsent?.dataProcessingConsent && (
              <p className="text-sm text-red-500">{errors.marketingConsent.dataProcessingConsent.message}</p>
            )}
          </div>

          {/* Terms Acceptance */}
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="termsAccepted"
                checked={marketingConsent?.termsAccepted || false}
                onCheckedChange={(checked) => setValue('marketingConsent.termsAccepted', checked as boolean)}
                className={errors.marketingConsent?.termsAccepted ? 'border-red-500' : ''}
              />
              <div className="space-y-1">
                <Label htmlFor="termsAccepted" className="cursor-pointer font-medium">
                  AGB akzeptieren *
                </Label>
                <p className="text-sm text-muted-foreground">
                  Ich habe die{' '}
                  <Link href="/terms" className="text-primary underline">
                    Allgemeinen Geschäftsbedingungen
                  </Link>{' '}
                  gelesen und akzeptiere sie. Diese regeln die Nutzung unserer Plattform und Dienste.
                </p>
              </div>
            </div>
            {errors.marketingConsent?.termsAccepted && (
              <p className="text-sm text-red-500">{errors.marketingConsent.termsAccepted.message}</p>
            )}
          </div>

          {/* GDPR Information */}
          <div className="bg-green-50 p-4 rounded-lg border-green-200 border">
            <div className="flex items-start space-x-2">
              <Shield className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-green-800">
                  Ihre Rechte nach DSGVO:
                </p>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Auskunft über gespeicherte Daten</li>
                  <li>• Berichtigung unrichtiger Daten</li>
                  <li>• Löschung Ihrer Daten</li>
                  <li>• Widerruf der Einverständnisse</li>
                  <li>• Datenübertragbarkeit</li>
                </ul>
                <p className="text-xs text-green-600 mt-2">
                  Kontakt für Datenschutzanfragen:{' '}
                  <a href="mailto:privacy@university-ecom.com" className="underline">
                    privacy@university-ecom.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final Summary */}
      <Card className="bg-gradient-to-r from-primary/5 to-blue-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="text-lg font-semibold">
              🎉 Fast geschafft!
            </div>
            <p className="text-muted-foreground">
              Vielen Dank für die ausführlichen Informationen. Wir werden Ihre Antworten prüfen 
              und uns innerhalb von 24 Stunden bei Ihnen melden.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-sm font-medium">Schritt 1</div>
                <div className="text-xs text-muted-foreground">Prüfung Ihrer Antworten</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Schritt 2</div>
                <div className="text-xs text-muted-foreground">Persönliche Beratung</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Schritt 3</div>
                <div className="text-xs text-muted-foreground">Kurszugang erhalten</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} size="lg" className="min-w-32" disabled={isSubmitting}>
          Zurück
        </Button>
        <Button onClick={handleSubmit} size="lg" className="min-w-32" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Wird gesendet...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Fragebogen absenden
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

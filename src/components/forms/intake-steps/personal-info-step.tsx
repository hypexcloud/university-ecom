'use client'

import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { User, Building, MapPin, Clock } from 'lucide-react'
import { formOptions } from '../intake-validation'
import type { IntakeFormData } from '../intake-validation'

interface PersonalInfoStepProps {
  onNext: () => void
}

export function PersonalInfoStep({ onNext }: PersonalInfoStepProps) {
  const { 
    register, 
    setValue, 
    watch, 
    formState: { errors },
    trigger 
  } = useFormContext<IntakeFormData>()

  const personalInfo = watch('personalInfo')

  const handleNext = async () => {
    const isValid = await trigger('personalInfo')
    if (isValid) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <User className="h-6 w-6 text-primary" />
          Persönliche Informationen
        </h2>
        <p className="text-muted-foreground">
          Erzählen Sie uns etwas über sich, damit wir Ihnen die beste Beratung bieten können.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ihre Kontaktdaten</CardTitle>
          <CardDescription>
            Diese Informationen verwenden wir für Ihre Anmeldung und Kommunikation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Vorname *</Label>
              <Input
                id="firstName"
                placeholder="Max"
                {...register('personalInfo.firstName')}
                className={errors.personalInfo?.firstName ? 'border-red-500' : ''}
              />
              {errors.personalInfo?.firstName && (
                <p className="text-sm text-red-500">{errors.personalInfo.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Nachname *</Label>
              <Input
                id="lastName"
                placeholder="Mustermann"
                {...register('personalInfo.lastName')}
                className={errors.personalInfo?.lastName ? 'border-red-500' : ''}
              />
              {errors.personalInfo?.lastName && (
                <p className="text-sm text-red-500">{errors.personalInfo.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-Mail-Adresse *</Label>
            <Input
              id="email"
              type="email"
              placeholder="max@beispiel.de"
              {...register('personalInfo.email')}
              className={errors.personalInfo?.email ? 'border-red-500' : ''}
            />
            {errors.personalInfo?.email && (
              <p className="text-sm text-red-500">{errors.personalInfo.email.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building className="h-5 w-5" />
            Berufliche Informationen
          </CardTitle>
          <CardDescription>
            Optional - hilft uns, maßgeschneiderte Empfehlungen zu geben.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company">Unternehmen (optional)</Label>
            <Input
              id="company"
              placeholder="Muster GmbH"
              {...register('personalInfo.company')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Branche (optional)</Label>
            <Input
              id="industry"
              placeholder="z.B. E-Commerce, Beratung, Software"
              {...register('personalInfo.industry')}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Standort & Zeitzone
          </CardTitle>
          <CardDescription>
            Wichtig für die Terminplanung und lokale Compliance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="country">Land *</Label>
            <Select
              value={personalInfo?.country || ''}
              onValueChange={(value) => setValue('personalInfo.country', value)}
            >
              <SelectTrigger className={errors.personalInfo?.country ? 'border-red-500' : ''}>
                <SelectValue placeholder="Wählen Sie Ihr Land" />
              </SelectTrigger>
              <SelectContent>
                {formOptions.countries.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.personalInfo?.country && (
              <p className="text-sm text-red-500">{errors.personalInfo.country.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeZone">Zeitzone *</Label>
            <Select
              value={personalInfo?.timeZone || ''}
              onValueChange={(value) => setValue('personalInfo.timeZone', value)}
            >
              <SelectTrigger className={errors.personalInfo?.timeZone ? 'border-red-500' : ''}>
                <SelectValue placeholder="Wählen Sie Ihre Zeitzone" />
              </SelectTrigger>
              <SelectContent>
                {formOptions.timeZones.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {tz.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.personalInfo?.timeZone && (
              <p className="text-sm text-red-500">{errors.personalInfo.timeZone.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleNext} size="lg" className="min-w-32">
          Weiter
        </Button>
      </div>
    </div>
  )
}

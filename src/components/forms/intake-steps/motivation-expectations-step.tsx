'use client'

import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Heart, Target, AlertTriangle, ArrowRight } from 'lucide-react'
import { formOptions } from '../intake-validation'
import type { IntakeFormData } from '../intake-validation'

interface MotivationExpectationsStepProps {
  onNext: () => void
  onBack: () => void
}

export function MotivationExpectationsStep({ onNext, onBack }: MotivationExpectationsStepProps) {
  const { 
    register,
    setValue, 
    watch, 
    formState: { errors },
    trigger 
  } = useFormContext<IntakeFormData>()

  const motivationExpectations = watch('motivationExpectations')

  const handleNext = async () => {
    const isValid = await trigger('motivationExpectations')
    if (isValid) {
      onNext()
    }
  }

  const handleChallengeSelection = (challenge: string, checked: boolean) => {
    const currentChallenges = motivationExpectations?.challenges || []
    if (checked) {
      const newChallenges = [...currentChallenges, challenge]
      setValue('motivationExpectations.challenges', newChallenges)
    } else {
      const newChallenges = currentChallenges.filter(c => c !== challenge)
      setValue('motivationExpectations.challenges', newChallenges)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Heart className="h-6 w-6 text-primary" />
          Motivation & Erwartungen
        </h2>
        <p className="text-muted-foreground">
          Helfen Sie uns zu verstehen, was Sie antreibt und was Sie erreichen möchten.
        </p>
      </div>

      {/* Motivation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Ihre Motivation
          </CardTitle>
          <CardDescription>
            Was motiviert Sie dazu, diesen Schritt zu gehen? Was ist Ihr "Warum"?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="motivation">Beschreiben Sie Ihre Motivation *</Label>
            <Textarea
              id="motivation"
              placeholder="z.B. Ich möchte finanziell unabhängig werden, mehr Zeit mit meiner Familie verbringen, oder ein erfolgreiches Online-Business aufbauen..."
              className={`min-h-[120px] ${errors.motivationExpectations?.motivation ? 'border-red-500' : ''}`}
              {...register('motivationExpectations.motivation')}
            />
            <div className="text-xs text-muted-foreground">
              Mindestens 20 Zeichen erforderlich
            </div>
            {errors.motivationExpectations?.motivation && (
              <p className="text-sm text-red-500">{errors.motivationExpectations.motivation.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Expected Outcomes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            Erwartete Ergebnisse
          </CardTitle>
          <CardDescription>
            Was erwarten Sie konkret von dem Kurs? Welche Ergebnisse möchten Sie erzielen?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="expectedOutcome">Beschreiben Sie Ihre Erwartungen *</Label>
            <Textarea
              id="expectedOutcome"
              placeholder="z.B. Ich erwarte, nach dem Kurs €5.000 monatlich zu verdienen, meine Arbeitszeit um 50% zu reduzieren, oder 10 neue Kunden pro Monat zu gewinnen..."
              className={`min-h-[120px] ${errors.motivationExpectations?.expectedOutcome ? 'border-red-500' : ''}`}
              {...register('motivationExpectations.expectedOutcome')}
            />
            <div className="text-xs text-muted-foreground">
              Mindestens 20 Zeichen erforderlich
            </div>
            {errors.motivationExpectations?.expectedOutcome && (
              <p className="text-sm text-red-500">{errors.motivationExpectations.expectedOutcome.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Challenges */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Ihre größten Herausforderungen
          </CardTitle>
          <CardDescription>
            Welche Hindernisse oder Schwierigkeiten erwarten Sie? Wählen Sie alle zutreffenden aus.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {formOptions.challenges.map((challenge, index) => (
              <div key={index} className="flex items-start space-x-2">
                <Checkbox
                  id={`challenge-${index}`}
                  checked={motivationExpectations?.challenges?.includes(challenge) || false}
                  onCheckedChange={(checked) => handleChallengeSelection(challenge, checked as boolean)}
                />
                <Label
                  htmlFor={`challenge-${index}`}
                  className="text-sm leading-relaxed cursor-pointer"
                >
                  {challenge}
                </Label>
              </div>
            ))}
          </div>
          
          {errors.motivationExpectations?.challenges && (
            <p className="text-sm text-red-500">{errors.motivationExpectations.challenges.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Success Mindset */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="font-semibold text-blue-800 mb-2">💡 Erfolgs-Tipp</h3>
              <p className="text-sm text-blue-700">
                Die erfolgreichsten Studenten sind diejenigen, die klare Ziele haben und bereit sind, 
                konsequent daran zu arbeiten. Ihre Motivation wird der Schlüssel zu Ihrem Erfolg sein!
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-lg font-bold text-blue-800">95%</div>
                <div className="text-xs text-blue-600">Erfolgsrate bei klaren Zielen</div>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-bold text-blue-800">3-6</div>
                <div className="text-xs text-blue-600">Monate bis erste Ergebnisse</div>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-bold text-blue-800">24/7</div>
                <div className="text-xs text-blue-600">Community Support</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} size="lg" className="min-w-32">
          Zurück
        </Button>
        <Button onClick={handleNext} size="lg" className="min-w-32">
          Weiter
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

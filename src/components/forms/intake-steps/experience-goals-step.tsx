'use client'

import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Target, Clock, Euro, TrendingUp } from 'lucide-react'
import { formOptions } from '../intake-validation'
import type { IntakeFormData } from '../intake-validation'

interface ExperienceGoalsStepProps {
  onNext: () => void
  onBack: () => void
}

export function ExperienceGoalsStep({ onNext, onBack }: ExperienceGoalsStepProps) {
  const { 
    register, 
    setValue, 
    watch, 
    formState: { errors },
    trigger 
  } = useFormContext<IntakeFormData>()

  const experienceGoals = watch('experienceGoals')

  const handleNext = async () => {
    const isValid = await trigger('experienceGoals')
    if (isValid) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Target className="h-6 w-6 text-primary" />
          Erfahrung & Ziele
        </h2>
        <p className="text-muted-foreground">
          Erzählen Sie uns von Ihrer bisherigen Erfahrung und Ihren Zielen.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ihre aktuelle Erfahrung</CardTitle>
          <CardDescription>
            Wo stehen Sie aktuell in Bezug auf AI oder E-Commerce/Dropshipping?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>Erfahrungslevel *</Label>
            <RadioGroup
              value={experienceGoals?.currentExperience || ''}
              onValueChange={(value) => setValue('experienceGoals.currentExperience', value as any)}
              className="grid grid-cols-1 gap-4"
            >
              {formOptions.experienceLevels.map((level) => (
                <div key={level.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={level.value}
                    id={level.value}
                    className={errors.experienceGoals?.currentExperience ? 'border-red-500' : ''}
                  />
                  <Label htmlFor={level.value} className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{level.label}</div>
                        <div className="text-sm text-muted-foreground">{level.description}</div>
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {errors.experienceGoals?.currentExperience && (
              <p className="text-sm text-red-500">{errors.experienceGoals.currentExperience.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ihr Hauptziel</CardTitle>
          <CardDescription>
            Was möchten Sie mit unserem Kurs erreichen?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="primaryGoal">Beschreiben Sie Ihr Hauptziel *</Label>
            <Textarea
              id="primaryGoal"
              placeholder="z.B. Ich möchte ein passives Einkommen aufbauen, mein bestehendes Business automatisieren, oder eine neue Karriere starten..."
              className={`min-h-[100px] ${errors.experienceGoals?.primaryGoal ? 'border-red-500' : ''}`}
              {...register('experienceGoals.primaryGoal')}
            />
            {errors.experienceGoals?.primaryGoal && (
              <p className="text-sm text-red-500">{errors.experienceGoals.primaryGoal.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Zeitliche Verfügbarkeit
          </CardTitle>
          <CardDescription>
            Wie viel Zeit können Sie pro Woche investieren?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>Wöchentliche Verfügbarkeit *</Label>
            <RadioGroup
              value={experienceGoals?.timeCommitment || ''}
              onValueChange={(value) => setValue('experienceGoals.timeCommitment', value as any)}
              className="grid grid-cols-1 gap-4"
            >
              {formOptions.timeCommitments.map((time) => (
                <div key={time.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={time.value}
                    id={time.value}
                    className={errors.experienceGoals?.timeCommitment ? 'border-red-500' : ''}
                  />
                  <Label htmlFor={time.value} className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{time.label}</div>
                        <div className="text-sm text-muted-foreground">{time.description}</div>
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {errors.experienceGoals?.timeCommitment && (
              <p className="text-sm text-red-500">{errors.experienceGoals.timeCommitment.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Euro className="h-5 w-5" />
            Investitionsbereitschaft
          </CardTitle>
          <CardDescription>
            Welches Budget haben Sie für den Start eingeplant? (zusätzlich zum Kurs)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>Startbudget *</Label>
            <RadioGroup
              value={experienceGoals?.budget || ''}
              onValueChange={(value) => setValue('experienceGoals.budget', value as any)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {formOptions.budgetRanges.map((budget) => (
                <div key={budget.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={budget.value}
                    id={budget.value}
                    className={errors.experienceGoals?.budget ? 'border-red-500' : ''}
                  />
                  <Label htmlFor={budget.value} className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{budget.label}</div>
                        <div className="text-sm text-muted-foreground">{budget.description}</div>
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {errors.experienceGoals?.budget && (
              <p className="text-sm text-red-500">{errors.experienceGoals.budget.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} size="lg" className="min-w-32">
          Zurück
        </Button>
        <Button onClick={handleNext} size="lg" className="min-w-32">
          Weiter
        </Button>
      </div>
    </div>
  )
}

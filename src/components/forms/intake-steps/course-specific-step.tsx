'use client'

import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Zap, TrendingUp, Star, Check, ArrowRight } from 'lucide-react'
import { formOptions } from '../intake-validation'
import type { IntakeFormData } from '../intake-validation'

interface CourseSpecificStepProps {
  onNext: () => void
  onBack: () => void
}

export function CourseSpecificStep({ onNext, onBack }: CourseSpecificStepProps) {
  const { 
    setValue, 
    watch, 
    formState: { errors },
    trigger 
  } = useFormContext<IntakeFormData>()

  const courseSpecific = watch('courseSpecific')

  const handleNext = async () => {
    const isValid = await trigger('courseSpecific')
    if (isValid) {
      onNext()
    }
  }

  const handleCourseSelection = (courseType: string, checked: boolean) => {
    const currentCourses = courseSpecific?.interestedCourse || []
    if (checked) {
      const newCourses = [...currentCourses, courseType]
      setValue('courseSpecific.interestedCourse', newCourses)
    } else {
      const newCourses = currentCourses.filter(course => course !== courseType)
      setValue('courseSpecific.interestedCourse', newCourses)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          Kurs & Plan Auswahl
        </h2>
        <p className="text-muted-foreground">
          Wählen Sie die Kurse und den Plan, die am besten zu Ihren Zielen passen.
        </p>
      </div>

      {/* Course Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Welche Kurse interessieren Sie?</CardTitle>
          <CardDescription>
            Sie können einen oder beide Kurse auswählen. Jeder Kurs kann separat gebucht werden.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* AI Course */}
            <div className="relative">
              <Card className={`cursor-pointer transition-all hover:shadow-md ${
                courseSpecific?.interestedCourse?.includes('ai') ? 'ring-2 ring-primary' : ''
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="course-ai"
                        checked={courseSpecific?.interestedCourse?.includes('ai') || false}
                        onCheckedChange={(checked) => handleCourseSelection('ai', checked as boolean)}
                      />
                      <Label htmlFor="course-ai" className="cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Zap className="h-5 w-5 text-blue-600" />
                          <span className="font-semibold">AI Kurs</span>
                        </div>
                      </Label>
                    </div>
                    <Badge variant="secondary">3 Monate</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Künstliche Intelligenz für Ihr Business
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>ChatGPT & AI-Tools professionell nutzen</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Geschäftsprozesse automatisieren</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>AI-gestützte Kundenbetreuung</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Ab</span>
                      <span className="text-lg font-bold">€200</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Dropshipping Course */}
            <div className="relative">
              <Card className={`cursor-pointer transition-all hover:shadow-md ${
                courseSpecific?.interestedCourse?.includes('dropshipping') ? 'ring-2 ring-primary' : ''
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="course-dropshipping"
                        checked={courseSpecific?.interestedCourse?.includes('dropshipping') || false}
                        onCheckedChange={(checked) => handleCourseSelection('dropshipping', checked as boolean)}
                      />
                      <Label htmlFor="course-dropshipping" className="cursor-pointer">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                          <span className="font-semibold">Dropshipping Kurs</span>
                        </div>
                      </Label>
                    </div>
                    <Badge variant="secondary">2 Monate</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    E-Commerce ohne Lagerkosten
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Profitable Nischen identifizieren</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>EU-konforme Online-Shops</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Marketing & Kundenakquise</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Ab</span>
                      <span className="text-lg font-bold">€200</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {errors.courseSpecific?.interestedCourse && (
            <p className="text-sm text-red-500">{errors.courseSpecific.interestedCourse.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Plan Selection */}
      {courseSpecific?.interestedCourse && courseSpecific.interestedCourse.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Wählen Sie Ihren Plan</CardTitle>
            <CardDescription>
              Beide Pläne beinhalten lebenslangen Zugang zu allen Kursinhalten.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={courseSpecific?.preferredPlan || ''}
              onValueChange={(value) => setValue('courseSpecific.preferredPlan', value)}
              className="grid md:grid-cols-2 gap-6"
            >
              {formOptions.planTypes.map((plan) => (
                <div key={plan.value} className="relative">
                  <Card className={`cursor-pointer transition-all hover:shadow-md ${
                    courseSpecific?.preferredPlan === plan.value ? 'ring-2 ring-primary' : ''
                  }`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={plan.value}
                            id={plan.value}
                            className={errors.courseSpecific?.preferredPlan ? 'border-red-500' : ''}
                          />
                          <Label htmlFor={plan.value} className="cursor-pointer">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{plan.label}</span>
                              {plan.value === 'max' && (
                                <Badge variant="default">
                                  <Star className="h-3 w-3 mr-1" />
                                  Empfohlen
                                </Badge>
                              )}
                            </div>
                          </Label>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {plan.description}
                      </p>
                      <div className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-600" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      {plan.value === 'max' && (
                        <div className="pt-2 border-t">
                          <div className="text-sm text-primary font-medium">
                            Zusätzlich: Persönliche Betreuung & 1-zu-1 Coaching
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </RadioGroup>
            
            {errors.courseSpecific?.preferredPlan && (
              <p className="text-sm text-red-500">{errors.courseSpecific.preferredPlan.message}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Bundle Discount Info */}
      {courseSpecific?.interestedCourse && courseSpecific.interestedCourse.length > 1 && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="text-green-800 font-semibold flex items-center justify-center gap-2">
                <Star className="h-5 w-5" />
                Bundle-Rabatt verfügbar!
              </div>
              <p className="text-sm text-green-700">
                Bei der Buchung beider Kurse erhalten Sie 20% Rabatt auf den Gesamtpreis.
                Das entspricht einer Ersparnis von bis zu €398!
              </p>
            </div>
          </CardContent>
        </Card>
      )}

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

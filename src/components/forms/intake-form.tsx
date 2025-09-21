'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent } from '@/components/ui/card'
import { ProgressIndicator } from './progress-indicator'
import { PersonalInfoStep } from './intake-steps/personal-info-step'
import { ExperienceGoalsStep } from './intake-steps/experience-goals-step'
import { CourseSpecificStep } from './intake-steps/course-specific-step'
import { MotivationExpectationsStep } from './intake-steps/motivation-expectations-step'
import { MarketingConsentStep } from './intake-steps/marketing-consent-step'
import { intakeFormSchema, type IntakeFormData, type StepNumber, getStepTitle, getStepDescription } from './intake-validation'
import { IntakeService } from '@/lib/firebase/firestore'
import { Timestamp } from 'firebase/firestore'
import { useRouter } from 'next/navigation'

const TOTAL_STEPS = 5

export function IntakeForm() {
  const [currentStep, setCurrentStep] = useState<StepNumber>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const methods = useForm<IntakeFormData>({
    resolver: zodResolver(intakeFormSchema),
    mode: 'onChange',
    defaultValues: {
      personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        industry: '',
        country: '',
        timeZone: '',
      },
      experienceGoals: {
        currentExperience: '',
        primaryGoal: '',
        timeCommitment: '',
        budget: '',
      },
      courseSpecific: {
        interestedCourse: [],
        preferredPlan: '',
      },
      motivationExpectations: {
        motivation: '',
        expectedOutcome: '',
        challenges: [],
      },
      marketingConsent: {
        howDidYouHear: '',
        preferredLanguage: '',
        marketingConsent: false,
        dataProcessingConsent: false,
        termsAccepted: false,
      },
    },
  })

  const { handleSubmit, watch } = methods

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => (prev + 1) as StepNumber)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as StepNumber)
    }
  }

  const onSubmit = async (data: IntakeFormData) => {
    setIsSubmitting(true)
    try {
      // Flatten the data structure for Firestore
      const intakeData = {
        email: data.personalInfo.email,
        responses: {
          // Personal Information
          firstName: data.personalInfo.firstName,
          lastName: data.personalInfo.lastName,
          company: data.personalInfo.company || '',
          industry: data.personalInfo.industry || '',
          
          // Experience & Goals
          currentExperience: data.experienceGoals.currentExperience,
          primaryGoal: data.experienceGoals.primaryGoal,
          timeCommitment: data.experienceGoals.timeCommitment,
          budget: data.experienceGoals.budget,
          
          // Course Specific
          interestedCourse: data.courseSpecific.interestedCourse,
          preferredPlan: data.courseSpecific.preferredPlan,
          
          // Motivation & Expectations
          motivation: data.motivationExpectations.motivation,
          expectedOutcome: data.motivationExpectations.expectedOutcome,
          challenges: data.motivationExpectations.challenges,
          
          // Logistics
          timeZone: data.personalInfo.timeZone,
          country: data.personalInfo.country,
          preferredLanguage: data.marketingConsent.preferredLanguage,
          
          // Marketing
          howDidYouHear: data.marketingConsent.howDidYouHear,
          marketingConsent: data.marketingConsent.marketingConsent,
          dataProcessingConsent: data.marketingConsent.dataProcessingConsent,
          termsAccepted: data.marketingConsent.termsAccepted,
        },
        status: 'pending' as const,
      }

      // Save to Firestore
      const intakeId = await IntakeService.createIntakeResponse(intakeData)
      
      console.log('✅ Complete intake response saved:', intakeId)
      
      // Redirect to success page
      router.push('/intake/success')
      
    } catch (error) {
      console.error('❌ Error submitting intake:', error)
      // TODO: Show error message to user
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep onNext={handleNext} />
      case 2:
        return <ExperienceGoalsStep onNext={handleNext} onBack={handleBack} />
      case 3:
        return <CourseSpecificStep onNext={handleNext} onBack={handleBack} />
      case 4:
        return <MotivationExpectationsStep onNext={handleNext} onBack={handleBack} />
      case 5:
        return <MarketingConsentStep onSubmit={handleSubmit(onSubmit)} onBack={handleBack} isSubmitting={isSubmitting} />
      default:
        return <PersonalInfoStep onNext={handleNext} />
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Progress Indicator */}
      <Card>
        <CardContent className="pt-6">
          <ProgressIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        </CardContent>
      </Card>

      {/* Step Header */}
      <div className="text-center space-y-2">
        <div className="text-sm text-muted-foreground">
          {getStepDescription(currentStep)}
        </div>
        <div className="text-xs text-muted-foreground">
          Ihre Antworten helfen uns, Ihnen die beste Beratung zu bieten
        </div>
      </div>

      {/* Step Content */}
      <FormProvider {...methods}>
        {renderCurrentStep()}
      </FormProvider>

      {/* Debug Info (Remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <details>
              <summary className="cursor-pointer font-medium">Debug Info (Schritt {currentStep})</summary>
              <pre className="mt-2 text-xs overflow-auto max-h-60">
                {JSON.stringify(watch(), null, 2)}
              </pre>
            </details>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

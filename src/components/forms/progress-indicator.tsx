'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  className?: string
}

export function ProgressIndicator({ currentStep, totalSteps, className }: ProgressIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100

  const stepLabels = [
    'Persönlich',
    'Erfahrung',
    'Kurse',
    'Motivation',
    'Abschluss'
  ]

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Progress Bar */}
      <div className="relative">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Step Indicators */}
        <div className="absolute top-0 left-0 right-0 flex justify-between">
          {Array.from({ length: totalSteps }, (_, index) => {
            const stepNumber = index + 1
            const isCompleted = stepNumber < currentStep
            const isCurrent = stepNumber === currentStep
            
            return (
              <div
                key={stepNumber}
                className={cn(
                  'w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-semibold transition-all duration-300',
                  'transform -translate-y-2',
                  {
                    'bg-primary border-primary text-primary-foreground': isCompleted,
                    'bg-primary border-primary text-primary-foreground scale-110': isCurrent,
                    'bg-background border-muted-foreground text-muted-foreground': !isCompleted && !isCurrent,
                  }
                )}
              >
                {isCompleted ? (
                  <Check className="w-3 h-3" />
                ) : (
                  stepNumber
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Step Labels */}
      <div className="flex justify-between text-xs text-muted-foreground mt-8">
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          
          return (
            <span 
              key={index}
              className={cn(
                'text-center transition-colors duration-300',
                {
                  'text-primary font-medium': isCompleted || isCurrent,
                  'text-muted-foreground': !isCompleted && !isCurrent,
                }
              )}
            >
              {label}
            </span>
          )
        })}
      </div>

      {/* Progress Text */}
      <div className="text-center">
        <span className="text-sm font-medium">
          Schritt {currentStep} von {totalSteps}
        </span>
        <div className="text-xs text-muted-foreground mt-1">
          {Math.round(progress)}% abgeschlossen
        </div>
      </div>
    </div>
  )
}

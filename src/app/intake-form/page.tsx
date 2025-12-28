'use client'

import { useState } from 'react'
import IntakeForm from '@/components/IntakeForm'
import IntakeResults from '@/components/IntakeResults'
import type { IntakeSubmission } from '@/lib/intake-types'

export default function IntakeFormPage() {
  const [submission, setSubmission] = useState<IntakeSubmission | null>(null)

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Kurs-Qualifikation</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Beantworten Sie einige Fragen, um herauszufinden, welcher Kurs am besten zu Ihnen passt
            und ob Sie die Voraussetzungen erfüllen.
          </p>
        </div>

        {/* Form or Results */}
        {!submission ? (
          <IntakeForm onComplete={setSubmission} />
        ) : (
          <IntakeResults submission={submission} />
        )}
      </div>
    </div>
  )
}

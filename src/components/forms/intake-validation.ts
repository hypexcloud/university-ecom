import { z } from 'zod'

// Personal Information Schema
export const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'Vorname muss mindestens 2 Zeichen haben'),
  lastName: z.string().min(2, 'Nachname muss mindestens 2 Zeichen haben'),
  email: z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein'),
  company: z.string().optional(),
  industry: z.string().optional(),
  country: z.string().min(1, 'Bitte wählen Sie Ihr Land'),
  timeZone: z.string().min(1, 'Bitte wählen Sie Ihre Zeitzone'),
})

// Experience & Goals Schema  
export const experienceGoalsSchema = z.object({
  currentExperience: z.string().min(1, 'Bitte wählen Sie Ihre Erfahrung'),
  primaryGoal: z.string().min(10, 'Bitte beschreiben Sie Ihr Ziel (mindestens 10 Zeichen)'),
  timeCommitment: z.string().min(1, 'Bitte wählen Sie Ihre verfügbare Zeit'),
  budget: z.string().min(1, 'Bitte wählen Sie Ihr Budget'),
})

// Course Specific Schema
export const courseSpecificSchema = z.object({
  interestedCourse: z.array(z.string()).min(1, 'Bitte wählen Sie mindestens einen Kurs'),
  preferredPlan: z.string().min(1, 'Bitte wählen Sie einen Plan'),
})

// Motivation & Expectations Schema
export const motivationExpectationsSchema = z.object({
  motivation: z.string().min(20, 'Bitte beschreiben Sie Ihre Motivation (mindestens 20 Zeichen)'),
  expectedOutcome: z.string().min(20, 'Bitte beschreiben Sie Ihre Erwartungen (mindestens 20 Zeichen)'),
  challenges: z.array(z.string()).min(1, 'Bitte wählen Sie mindestens eine Herausforderung'),
})

// Marketing & Consent Schema
export const marketingConsentSchema = z.object({
  howDidYouHear: z.string().min(1, 'Bitte teilen Sie uns mit, wie Sie von uns erfahren haben'),
  preferredLanguage: z.string().min(1, 'Bitte wählen Sie Ihre bevorzugte Sprache'),
  marketingConsent: z.boolean(),
  dataProcessingConsent: z.boolean().refine(val => val === true, {
    message: 'Sie müssen der Datenverarbeitung zustimmen, um fortzufahren',
  }),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'Sie müssen die AGB akzeptieren, um fortzufahren',
  }),
})

// Complete Intake Schema
export const intakeFormSchema = z.object({
  personalInfo: personalInfoSchema,
  experienceGoals: experienceGoalsSchema,
  courseSpecific: courseSpecificSchema,
  motivationExpectations: motivationExpectationsSchema,
  marketingConsent: marketingConsentSchema,
})

export type IntakeFormData = z.infer<typeof intakeFormSchema>

// Individual step schemas for validation
export const stepSchemas = {
  1: personalInfoSchema,
  2: experienceGoalsSchema,
  3: courseSpecificSchema,
  4: motivationExpectationsSchema,
  5: marketingConsentSchema,
} as const

export type StepNumber = keyof typeof stepSchemas

// Options for form fields
export const formOptions = {
  countries: [
    { value: 'DE', label: 'Deutschland' },
    { value: 'AT', label: 'Österreich' },
    { value: 'CH', label: 'Schweiz' },
    { value: 'NL', label: 'Niederlande' },
    { value: 'BE', label: 'Belgien' },
    { value: 'FR', label: 'Frankreich' },
    { value: 'IT', label: 'Italien' },
    { value: 'ES', label: 'Spanien' },
    { value: 'OTHER', label: 'Anderes Land' },
  ],
  
  timeZones: [
    { value: 'Europe/Berlin', label: 'Berlin (GMT+1)' },
    { value: 'Europe/Vienna', label: 'Wien (GMT+1)' },
    { value: 'Europe/Zurich', label: 'Zürich (GMT+1)' },
    { value: 'Europe/Amsterdam', label: 'Amsterdam (GMT+1)' },
    { value: 'Europe/Brussels', label: 'Brüssel (GMT+1)' },
    { value: 'Europe/Paris', label: 'Paris (GMT+1)' },
    { value: 'Europe/Rome', label: 'Rom (GMT+1)' },
    { value: 'Europe/Madrid', label: 'Madrid (GMT+1)' },
  ],

  experienceLevels: [
    { value: 'none', label: 'Keine Erfahrung', description: 'Ich bin komplett neu in diesem Bereich' },
    { value: 'beginner', label: 'Anfänger', description: 'Ich habe grundlegende Kenntnisse' },
    { value: 'intermediate', label: 'Fortgeschritten', description: 'Ich habe bereits Erfahrungen gesammelt' },
    { value: 'advanced', label: 'Experte', description: 'Ich möchte mein Wissen vertiefen' },
  ],

  timeCommitments: [
    { value: 'part-time', label: 'Teilzeit (5-10h/Woche)', description: 'Nebenbei neben Job/Studium' },
    { value: 'full-time', label: 'Vollzeit (20+h/Woche)', description: 'Hauptfokus auf das Business' },
    { value: 'weekends', label: 'Wochenenden (5-8h/Woche)', description: 'Nur am Wochenende verfügbar' },
  ],

  budgetRanges: [
    { value: 'under-1k', label: 'Unter €1.000', description: 'Für den Anfang' },
    { value: '1k-5k', label: '€1.000 - €5.000', description: 'Solide Startinvestition' },
    { value: '5k-10k', label: '€5.000 - €10.000', description: 'Ernsthafte Investition' },
    { value: '10k-plus', label: 'Über €10.000', description: 'Maximale Investition' },
  ],

  planTypes: [
    { 
      value: 'pro', 
      label: 'Pro Plan (€497)', 
      description: 'Vollständiger Kurszugang + Community',
      features: ['Alle Lektionen', 'Community-Zugang', 'Email-Support', 'Lebenslanger Zugang']
    },
    { 
      value: 'max', 
      label: 'Max Plan (€997)', 
      description: 'Pro Plan + persönliche Betreuung',
      features: ['Alles aus Pro Plan', '1-zu-1 Mentoring', 'Persönlicher Coach', 'Priorisierter Support']
    },
  ],

  challenges: [
    'Zeitmangel für das Lernen neuer Fähigkeiten',
    'Unklarheit über die richtige Strategie',
    'Technische Umsetzung und Tools',
    'Marketing und Kundengewinnung',
    'Rechtliche Unsicherheiten (EU-Compliance)',
    'Kapitalbeschränkungen für Investitionen',
    'Mangel an praktischer Erfahrung',
    'Schwierigkeiten bei der Automatisierung',
    'Konkurrenzdruck im Markt',
    'Skalierung des Geschäfts',
  ],

  howDidYouHear: [
    { value: 'google', label: 'Google Suche' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'facebook', label: 'Facebook/Instagram' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'podcast', label: 'Podcast' },
    { value: 'blog', label: 'Blog/Artikel' },
    { value: 'referral', label: 'Empfehlung von Freunden' },
    { value: 'advertising', label: 'Online-Werbung' },
    { value: 'other', label: 'Anderes' },
  ],

  languages: [
    { value: 'de', label: 'Deutsch' },
    { value: 'en', label: 'English' },
  ],
} as const

// Helper functions
export function getStepTitle(step: StepNumber): string {
  const titles = {
    1: 'Persönliche Informationen',
    2: 'Erfahrung & Ziele',
    3: 'Kurs & Plan Auswahl',
    4: 'Motivation & Erwartungen',
    5: 'Einverständnis & Datenschutz',
  }
  return titles[step]
}

export function getStepDescription(step: StepNumber): string {
  const descriptions = {
    1: 'Erzählen Sie uns etwas über sich',
    2: 'Ihre Erfahrung und Ziele',
    3: 'Welcher Kurs passt zu Ihnen?',
    4: 'Was motiviert Sie?',
    5: 'Datenschutz und Einverständnis',
  }
  return descriptions[step]
}

export function calculateProgress(step: StepNumber): number {
  return (step / 5) * 100
}

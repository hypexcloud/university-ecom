import { Course, CoursePlan, CourseModule } from '@/lib/types'

/**
 * University Ecom Course Definitions
 * Based on the new concept document
 */

// AI Kurs (3 Monate / 90 Tage)
export const AI_COURSE_MODULES: Omit<CourseModule, 'isLocked'>[] = [
  {
    id: 'ai-module-1',
    order: 1,
    week: 1,
    title: 'AI Grundlagen',
    titleDE: 'AI Grundlagen',
    description: 'Introduction to AI fundamentals and core concepts',
    descriptionDE: 'Einführung in die Grundlagen der KI und Kernkonzepte',
    durationWeeks: 2,
    topics: [
      'Was ist Künstliche Intelligenz?',
      'Machine Learning Basics',
      'AI Tools Übersicht',
      'Use Cases in Business',
    ],
    resources: [],
  },
  {
    id: 'ai-module-2',
    order: 2,
    week: 3,
    title: 'Prompt Engineering',
    titleDE: 'Prompt Engineering',
    description: 'Master the art of crafting effective AI prompts',
    descriptionDE: 'Meistern Sie die Kunst des effektiven Prompt-Designs',
    durationWeeks: 2,
    topics: [
      'Prompt Strukturen',
      'Advanced Techniken',
      'Context Management',
      'Optimization Strategien',
    ],
    resources: [],
  },
  {
    id: 'ai-module-3',
    order: 3,
    week: 5,
    title: 'Automationen & Workflows',
    titleDE: 'Automationen & Workflows',
    description: 'Build automated workflows with AI',
    descriptionDE: 'Erstellen Sie automatisierte Workflows mit KI',
    durationWeeks: 2,
    topics: [
      'Workflow Design',
      'Tool Integration',
      'Automation Best Practices',
      'Zapier & Make.com',
    ],
    resources: [],
  },
  {
    id: 'ai-module-4',
    order: 4,
    week: 7,
    title: 'Marketing & Content',
    titleDE: 'Marketing & Content',
    description: 'AI-powered marketing and content creation',
    descriptionDE: 'KI-gestütztes Marketing und Content-Erstellung',
    durationWeeks: 2,
    topics: [
      'Content Generation',
      'SEO Optimization',
      'Social Media Content',
      'Email Marketing',
    ],
    resources: [],
  },
  {
    id: 'ai-module-5',
    order: 5,
    week: 9,
    title: 'Chatbots & Kundenservice',
    titleDE: 'Chatbots & Kundenservice',
    description: 'Build intelligent customer service solutions',
    descriptionDE: 'Intelligente Kundenservice-Lösungen entwickeln',
    durationWeeks: 2,
    topics: [
      'Chatbot Entwicklung',
      'Customer Support Automation',
      'Integration in Website',
      'Analytics & Optimization',
    ],
    resources: [],
  },
  {
    id: 'ai-module-6',
    order: 6,
    week: 11,
    title: 'Analyse & Optimierung',
    titleDE: 'Analyse & Optimierung',
    description: 'Data analysis and AI performance optimization',
    descriptionDE: 'Datenanalyse und KI-Performance-Optimierung',
    durationWeeks: 2,
    topics: [
      'Performance Metrics',
      'A/B Testing',
      'Data Analysis',
      'Continuous Improvement',
    ],
    resources: [],
  },
]

export const AI_COURSE_PLANS: CoursePlan[] = [
  {
    id: 'ai-fast',
    name: 'fast',
    nameDE: 'Fast',
    displayName: 'Fast Plan',
    displayNameDE: 'Fast Plan',
    price: 200,
    currency: 'EUR',
    features: [
      'All video content',
      'Course materials',
      'Community access',
      'Self-paced learning',
    ],
    featuresDE: [
      'Alle Video-Inhalte',
      'Kursmaterialien',
      'Community-Zugang',
      'Selbstgesteuertes Lernen',
    ],
    includes1to1: false,
    description: 'Perfect for self-learners who want access to all content',
    descriptionDE: 'Perfekt für Selbstlerner, die Zugang zu allen Inhalten wollen',
  },
  {
    id: 'ai-business',
    name: 'business',
    nameDE: 'Business',
    displayName: 'Business Plan',
    displayNameDE: 'Business Plan',
    price: 1000,
    currency: 'EUR',
    features: [
      'Everything in Fast',
      '1:1 mentoring sessions',
      'Direct support',
      'Weekly check-ins',
      'Personalized feedback',
    ],
    featuresDE: [
      'Alles aus Fast',
      '1:1 Mentoring-Sessions',
      'Direkte Unterstützung',
      'Wöchentliche Check-ins',
      'Personalisiertes Feedback',
    ],
    includes1to1: true,
    maxSlots: 28,
    mentorId: 'amin', // Will be replaced with actual mentor ID
    description: '1:1 support to accelerate your learning',
    descriptionDE: '1:1 Unterstützung für beschleunigtes Lernen',
  },
  {
    id: 'ai-infinity',
    name: 'infinity',
    nameDE: 'Infinity',
    displayName: 'Infinity Plan',
    displayNameDE: 'Infinity Plan',
    price: 1400,
    currency: 'EUR',
    features: [
      'Everything in Business',
      'Premium coaching',
      'Priority support',
      'Unlimited Q&A access',
      'Custom implementation help',
      'Advanced strategy sessions',
    ],
    featuresDE: [
      'Alles aus Business',
      'Premium Coaching',
      'Prioritäts-Support',
      'Unbegrenzter Q&A Zugang',
      'Individuelle Implementierungshilfe',
      'Erweiterte Strategie-Sessions',
    ],
    includes1to1: true,
    maxSlots: 28,
    mentorId: 'amin',
    description: 'The complete premium experience with maximum support',
    descriptionDE: 'Das komplette Premium-Erlebnis mit maximaler Unterstützung',
  },
]

// Dropshipping Kurs (2 Monate / 60 Tage)
export const DROPSHIPPING_COURSE_MODULES: Omit<CourseModule, 'isLocked'>[] = [
  {
    id: 'ds-module-1',
    order: 1,
    week: 1,
    title: 'Markt & Produktanalyse',
    titleDE: 'Markt & Produktanalyse',
    description: 'Market research and product selection strategies',
    descriptionDE: 'Marktforschung und Produktauswahlstrategien',
    durationWeeks: 1,
    topics: [
      'Marktforschung',
      'Nischen-Analyse',
      'Produkt-Research',
      'Wettbewerbsanalyse',
    ],
    resources: [],
  },
  {
    id: 'ds-module-2',
    order: 2,
    week: 2,
    title: 'Lieferanten',
    titleDE: 'Lieferanten',
    description: 'Finding and working with reliable suppliers',
    descriptionDE: 'Zuverlässige Lieferanten finden und mit ihnen arbeiten',
    durationWeeks: 1,
    topics: [
      'Lieferanten finden',
      'Verhandlungen',
      'Qualitätskontrolle',
      'Lieferketten-Management',
    ],
    resources: [],
  },
  {
    id: 'ds-module-3',
    order: 3,
    week: 3,
    title: 'Shop-Aufbau',
    titleDE: 'Shop-Aufbau',
    description: 'Building your professional online store',
    descriptionDE: 'Aufbau Ihres professionellen Online-Shops',
    durationWeeks: 2,
    topics: [
      'Shopify Setup',
      'Theme Anpassung',
      'Produktseiten',
      'Checkout Optimierung',
    ],
    resources: [],
  },
  {
    id: 'ds-module-4',
    order: 4,
    week: 5,
    title: 'Conversion',
    titleDE: 'Conversion',
    description: 'Optimization strategies to maximize sales',
    descriptionDE: 'Optimierungsstrategien zur Umsatzmaximierung',
    durationWeeks: 1,
    topics: [
      'Conversion Rate Optimization',
      'A/B Testing',
      'Trust Badges',
      'Upselling & Cross-selling',
    ],
    resources: [],
  },
  {
    id: 'ds-module-5',
    order: 5,
    week: 6,
    title: 'Recht (DSGVO, AGB, VAT)',
    titleDE: 'Recht (DSGVO, AGB, VAT)',
    description: 'Legal compliance for EU markets',
    descriptionDE: 'Rechtliche Compliance für EU-Märkte',
    durationWeeks: 1,
    topics: [
      'DSGVO Compliance',
      'AGB & Impressum',
      'Widerrufsrecht',
      'VAT & Steuern',
    ],
    resources: [],
  },
  {
    id: 'ds-module-6',
    order: 6,
    week: 7,
    title: 'Marketing & Skalierung',
    titleDE: 'Marketing & Skalierung',
    description: 'Scale your dropshipping business',
    descriptionDE: 'Skalieren Sie Ihr Dropshipping-Business',
    durationWeeks: 2,
    topics: [
      'Facebook Ads',
      'TikTok Marketing',
      'Influencer Marketing',
      'Skalierungsstrategien',
    ],
    resources: [],
  },
]

export const DROPSHIPPING_COURSE_PLANS: CoursePlan[] = [
  {
    id: 'ds-fast',
    name: 'fast',
    nameDE: 'Fast',
    displayName: 'Fast Plan',
    displayNameDE: 'Fast Plan',
    price: 200,
    currency: 'EUR',
    features: [
      'All video content',
      'Course materials',
      'Templates & checklists',
      'Community access',
    ],
    featuresDE: [
      'Alle Video-Inhalte',
      'Kursmaterialien',
      'Templates & Checklisten',
      'Community-Zugang',
    ],
    includes1to1: false,
    description: 'Learn at your own pace with complete course access',
    descriptionDE: 'Lernen Sie in Ihrem eigenen Tempo mit vollständigem Kurszugang',
  },
  {
    id: 'ds-business',
    name: 'business',
    nameDE: 'Business',
    displayName: 'Business Plan',
    displayNameDE: 'Business Plan',
    price: 1000,
    currency: 'EUR',
    features: [
      'Everything in Fast',
      '1:1 mentoring',
      'Store review sessions',
      'Direct mentor access',
      'Weekly strategy calls',
    ],
    featuresDE: [
      'Alles aus Fast',
      '1:1 Mentoring',
      'Store Review Sessions',
      'Direkter Mentor-Zugang',
      'Wöchentliche Strategie-Calls',
    ],
    includes1to1: true,
    maxSlots: 5,
    mentorId: 'esat', // Will be replaced with actual mentor ID
    description: 'Get personalized guidance to build your store faster',
    descriptionDE: 'Erhalten Sie persönliche Anleitung für schnelleren Store-Aufbau',
  },
  {
    id: 'ds-infinity',
    name: 'infinity',
    nameDE: 'Infinity',
    displayName: 'Infinity Plan',
    displayNameDE: 'Infinity Plan',
    price: 3000,
    currency: 'EUR',
    features: [
      'Everything in Business',
      'Winning product research',
      'Custom website (fully coded)',
      'Premium 1:1 coaching',
      'Done-for-you setup assistance',
      'Unlimited support',
    ],
    featuresDE: [
      'Alles aus Business',
      'Winning Product Research',
      'Custom Website (vollständig gecoded)',
      'Premium 1:1 Coaching',
      'Done-for-you Setup-Unterstützung',
      'Unbegrenzter Support',
    ],
    includes1to1: true,
    maxSlots: 5,
    mentorId: 'esat',
    description: 'Premium package with done-for-you services',
    descriptionDE: 'Premium-Paket mit Done-for-you Services',
  },
]

// Course Data Objects
export const AI_COURSE_DATA: Omit<Course, 'createdAt' | 'updatedAt'> = {
  id: 'ai-kurs',
  type: 'ai',
  name: 'AI Automation Course',
  nameDE: 'AI Automations Kurs',
  description: 'Master AI automation for business growth in 3 months',
  descriptionDE: 'Meistern Sie KI-Automatisierung für Geschäftswachstum in 3 Monaten',
  duration: 90, // days
  isActive: true,
  modules: AI_COURSE_MODULES.map(m => ({ ...m, isLocked: false })),
  plans: AI_COURSE_PLANS,
  features: [
    'AI Fundamentals',
    'Prompt Engineering',
    'Automation & Workflows',
    'Marketing & Content',
    'Chatbots & Customer Service',
    'Analysis & Optimization',
  ],
  featuresDE: [
    'AI Grundlagen',
    'Prompt Engineering',
    'Automationen & Workflows',
    'Marketing & Content',
    'Chatbots & Kundenservice',
    'Analyse & Optimierung',
  ],
}

export const DROPSHIPPING_COURSE_DATA: Omit<Course, 'createdAt' | 'updatedAt'> = {
  id: 'dropshipping-kurs',
  type: 'dropshipping',
  name: 'EU Dropshipping Course',
  nameDE: 'EU Dropshipping Kurs',
  description: 'Build a profitable EU-compliant dropshipping business in 2 months',
  descriptionDE: 'Bauen Sie ein profitables EU-konformes Dropshipping-Business in 2 Monaten',
  duration: 60, // days
  isActive: true,
  modules: DROPSHIPPING_COURSE_MODULES.map(m => ({ ...m, isLocked: false })),
  plans: DROPSHIPPING_COURSE_PLANS,
  features: [
    'Market & Product Analysis',
    'Supplier Management',
    'Store Setup',
    'Conversion Optimization',
    'Legal Compliance (DSGVO, VAT)',
    'Marketing & Scaling',
  ],
  featuresDE: [
    'Markt & Produktanalyse',
    'Lieferanten-Management',
    'Shop-Aufbau',
    'Conversion-Optimierung',
    'Rechtliche Compliance (DSGVO, VAT)',
    'Marketing & Skalierung',
  ],
}

export const ALL_COURSES = [AI_COURSE_DATA, DROPSHIPPING_COURSE_DATA]

// Helper functions
export function getCourseById(courseId: string) {
  return ALL_COURSES.find(c => c.id === courseId)
}

export function getPlanById(courseId: string, planId: string) {
  const course = getCourseById(courseId)
  return course?.plans.find(p => p.id === planId)
}

export function getPlanPrice(courseId: string, planId: string): number {
  const plan = getPlanById(courseId, planId)
  return plan?.price || 0
}

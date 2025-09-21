import { Timestamp } from 'firebase/firestore'
import { FirestoreService, CourseService } from './firestore'
import { COLLECTIONS, Course, CourseModule, AdminSettings, EmailTemplate } from '../types'

// Seed initial course data
export async function seedCourses() {
  console.log('🌱 Seeding courses...')

  // AI Course
  const aiCourse: Omit<Course, 'id' | 'createdAt' | 'updatedAt'> = {
    type: 'ai',
    title: 'AI Kurs - Künstliche Intelligenz für Ihr Business',
    description: 'Lernen Sie, wie Sie ChatGPT und andere AI-Tools professionell für Ihr Business einsetzen. 12 Wochen intensive Ausbildung mit praktischen Übungen.',
    price: {
      pro: 497,
      max: 997
    },
    duration: 12,
    modules: [
      {
        id: 'ai-week-1',
        week: 1,
        title: 'AI Grundlagen & ChatGPT Einführung',
        description: 'Verstehen Sie die AI-Landschaft und lernen Sie ChatGPT professionell zu nutzen.',
        topics: ['AI Landschaft verstehen', 'ChatGPT Setup', 'Erste Prompts', 'Sicherheit & Ethik'],
        resources: [],
        isLocked: false
      },
      {
        id: 'ai-week-2',
        week: 2,
        title: 'Advanced Prompting Techniken',
        description: 'Meistern Sie fortgeschrittene Prompt-Engineering Techniken für bessere Ergebnisse.',
        topics: ['Prompt Engineering', 'Context Management', 'Multi-Step Prompts', 'Output Optimierung'],
        resources: [],
        isLocked: true
      }
    ],
    features: [
      'ChatGPT und AI-Tools professionell einsetzen',
      'Automatisierung von Geschäftsprozessen',
      'AI-gestützte Kundenbetreuung und Marketing'
    ],
    isActive: true
  }

  // Dropshipping Course
  const dropshippingCourse: Omit<Course, 'id' | 'createdAt' | 'updatedAt'> = {
    type: 'dropshipping',
    title: 'Dropshipping Kurs - Erfolgreiches E-Commerce ohne Lagerkosten',
    description: 'Lernen Sie profitable Dropshipping-Strategien für den EU-Markt. 16 Wochen intensive Ausbildung mit praktischen Fallstudien.',
    price: {
      pro: 497,
      max: 997
    },
    duration: 16,
    modules: [
      {
        id: 'ds-week-1-2',
        week: 1,
        title: 'Dropshipping Grundlagen & Marktanalyse',
        description: 'Verstehen Sie das Dropshipping Business Model und analysieren Sie den EU-Markt.',
        topics: ['Business Model verstehen', 'EU-Markt Analyse', 'Nischenfindung', 'Konkurrenzanalyse'],
        resources: [],
        isLocked: false
      }
    ],
    features: [
      'Profitable Nischen und Produkte identifizieren',
      'EU-konforme Online-Shops erstellen',
      'Effektives Marketing und Kundenakquise'
    ],
    isActive: true
  }

  try {
    const aiCourseId = await FirestoreService.create(COLLECTIONS.COURSES, aiCourse)
    const dropshippingCourseId = await FirestoreService.create(COLLECTIONS.COURSES, dropshippingCourse)
    
    console.log('✅ Courses created:', { aiCourseId, dropshippingCourseId })
    return { aiCourseId, dropshippingCourseId }
  } catch (error) {
    console.error('❌ Error seeding courses:', error)
    throw error
  }
}

// Seed admin settings
export async function seedAdminSettings() {
  console.log('🌱 Seeding admin settings...')

  const adminSettings: Omit<AdminSettings, 'id' | 'createdAt' | 'updatedAt' | 'updatedBy'> & { updatedBy: string } = {
    courses: {
      ai: {
        isActive: true,
        maxEnrollments: 100,
        nextCohortStart: Timestamp.fromDate(new Date('2025-02-01'))
      },
      dropshipping: {
        isActive: true,
        maxEnrollments: 150,
        nextCohortStart: Timestamp.fromDate(new Date('2025-02-01'))
      }
    },
    community: {
      whatsapp: {
        ai: {
          groupId: 'ai-group-placeholder',
          inviteLink: 'https://chat.whatsapp.com/placeholder-ai',
          isActive: true
        },
        dropshipping: {
          groupId: 'ds-group-placeholder',
          inviteLink: 'https://chat.whatsapp.com/placeholder-ds',
          isActive: true
        }
      },
      discord: {
        serverId: 'discord-server-placeholder',
        inviteLink: 'https://discord.gg/placeholder',
        isActive: true
      }
    },
    support: {
      businessHours: {
        start: '09:00',
        end: '17:00',
        timezone: 'Europe/Berlin',
        workingDays: [1, 2, 3, 4, 5]
      },
      autoResponder: {
        enabled: true,
        message: 'Vielen Dank für Ihre Nachricht! Wir werden Ihnen innerhalb von 24 Stunden antworten.'
      }
    },
    updatedBy: 'system'
  }

  try {
    await FirestoreService.create(COLLECTIONS.ADMIN_SETTINGS, adminSettings)
    console.log('✅ Admin settings created')
  } catch (error) {
    console.error('❌ Error seeding admin settings:', error)
    throw error
  }
}

// Seed email templates
export async function seedEmailTemplates() {
  console.log('🌱 Seeding email templates...')

  const templates: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      name: 'Welcome Email',
      subject: 'Willkommen bei University Ecom! 🎉',
      htmlContent: `
        <h1>Willkommen {{firstName}}!</h1>
        <p>Vielen Dank für Ihre Anmeldung zum {{courseName}}.</p>
        <p>Ihr Zugang ist jetzt aktiv und Sie können sofort beginnen.</p>
        <a href="{{dashboardUrl}}" style="background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
          Zum Dashboard
        </a>
        <p>Bei Fragen stehen wir Ihnen gerne zur Verfügung.</p>
        <p>Ihr University Ecom Team</p>
      `,
      textContent: `
        Willkommen {{firstName}}!
        
        Vielen Dank für Ihre Anmeldung zum {{courseName}}.
        Ihr Zugang ist jetzt aktiv und Sie können sofort beginnen.
        
        Dashboard: {{dashboardUrl}}
        
        Bei Fragen stehen wir Ihnen gerne zur Verfügung.
        
        Ihr University Ecom Team
      `,
      variables: ['firstName', 'courseName', 'dashboardUrl'],
      category: 'welcome',
      isActive: true
    }
  ]

  try {
    const templateIds = []
    for (const template of templates) {
      const templateId = await FirestoreService.create(COLLECTIONS.EMAIL_TEMPLATES, template)
      templateIds.push(templateId)
    }
    console.log('✅ Email templates created:', templateIds)
    return templateIds
  } catch (error) {
    console.error('❌ Error seeding email templates:', error)
    throw error
  }
}

// Main seeding function
export async function seedDatabase() {
  console.log('🚀 Starting database seeding...')
  
  try {
    // Check if courses already exist
    const existingCourses = await CourseService.getAllCourses()
    if (existingCourses.length > 0) {
      console.log('📊 Database already seeded, skipping...')
      return
    }

    // Seed all initial data
    await seedCourses()
    await seedAdminSettings()
    await seedEmailTemplates()
    
    console.log('🎉 Database seeding completed successfully!')
  } catch (error) {
    console.error('💥 Database seeding failed:', error)
    throw error
  }
}

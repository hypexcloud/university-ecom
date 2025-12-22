import { Timestamp } from 'firebase/firestore'
import { FirestoreService, CourseService } from './firestore'
import { COLLECTIONS, Course, AdminSettings, EmailTemplate } from '../types'
import { AI_COURSE_DATA, DROPSHIPPING_COURSE_DATA } from '../courses-data'

// Seed initial course data using the centralized course data
export async function seedCourses() {
  console.log('🌱 Seeding courses...')

  // AI Course - using data from courses-data.ts
  const aiCourse: Omit<Course, 'id' | 'createdAt' | 'updatedAt'> = {
    type: 'ai',
    name: AI_COURSE_DATA.name,
    nameDE: AI_COURSE_DATA.nameDE,
    description: AI_COURSE_DATA.description,
    descriptionDE: AI_COURSE_DATA.descriptionDE,
    duration: AI_COURSE_DATA.duration,
    isActive: true,
    modules: AI_COURSE_DATA.modules,
    plans: AI_COURSE_DATA.plans,
    features: AI_COURSE_DATA.features,
    featuresDE: AI_COURSE_DATA.featuresDE,
  }

  // Dropshipping Course - using data from courses-data.ts
  const dropshippingCourse: Omit<Course, 'id' | 'createdAt' | 'updatedAt'> = {
    type: 'dropshipping',
    name: DROPSHIPPING_COURSE_DATA.name,
    nameDE: DROPSHIPPING_COURSE_DATA.nameDE,
    description: DROPSHIPPING_COURSE_DATA.description,
    descriptionDE: DROPSHIPPING_COURSE_DATA.descriptionDE,
    duration: DROPSHIPPING_COURSE_DATA.duration,
    isActive: true,
    modules: DROPSHIPPING_COURSE_DATA.modules,
    plans: DROPSHIPPING_COURSE_DATA.plans,
    features: DROPSHIPPING_COURSE_DATA.features,
    featuresDE: DROPSHIPPING_COURSE_DATA.featuresDE,
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

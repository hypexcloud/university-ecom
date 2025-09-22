// Email automation helper functions for client-side usage

export interface EmailAutomationOptions {
  apiKey?: string // For server-side usage
}

export class EmailAutomation {
  
  // Send intake confirmation email
  static async sendIntakeConfirmation(data: {
    email: string
    firstName: string
    lastName?: string
    userId?: string
  }) {
    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'intake_confirmation',
          data
        })
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send email')
      }

      return result
    } catch (error: any) {
      console.error('Failed to send intake confirmation:', error)
      throw error
    }
  }

  // Send intake decision email (approve/reject)
  static async sendIntakeDecision(data: {
    email: string
    firstName: string
    lastName?: string
    approved: boolean
    reviewNotes?: string
    userId?: string
  }) {
    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'intake_decision',
          data
        })
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send email')
      }

      return result
    } catch (error: any) {
      console.error('Failed to send intake decision:', error)
      throw error
    }
  }

  // Send welcome sequence email
  static async sendWelcomeSequence(data: {
    email: string
    firstName: string
    lastName?: string
    sequenceNumber: 1 | 2 | 3
    courseName?: string
    userId?: string
  }) {
    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'welcome_sequence',
          data
        })
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send email')
      }

      return result
    } catch (error: any) {
      console.error('Failed to send welcome sequence:', error)
      throw error
    }
  }

  // Send support ticket notification
  static async sendSupportTicketNotification(data: {
    email: string
    firstName: string
    ticketId: string
    ticketSubject: string
    ticketType: 'created' | 'resolved'
    response?: string
    userId?: string
  }) {
    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'support_ticket',
          data
        })
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send email')
      }

      return result
    } catch (error: any) {
      console.error('Failed to send support ticket notification:', error)
      throw error
    }
  }

  // Send test email
  static async sendTestEmail(email: string) {
    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'test',
          data: { email }
        })
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send email')
      }

      return result
    } catch (error: any) {
      console.error('Failed to send test email:', error)
      throw error
    }
  }

  // Send bulk emails
  static async sendBulkEmails(emails: Array<{
    type: string
    data: {
      email: string
      firstName: string
      [key: string]: any
    }
  }>) {
    try {
      const response = await fetch('/api/email/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emails })
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send bulk emails')
      }

      return result
    } catch (error: any) {
      console.error('Failed to send bulk emails:', error)
      throw error
    }
  }

  // Schedule welcome sequence (for future automation)
  static async scheduleWelcomeSequence(data: {
    email: string
    firstName: string
    lastName?: string
    courseName?: string
    userId?: string
    startDate?: Date
  }) {
    // This would integrate with a job scheduler in production
    // For now, we'll just send the first email immediately
    try {
      await this.sendWelcomeSequence({
        ...data,
        sequenceNumber: 1
      })

      // In a real implementation, you would schedule the subsequent emails:
      // - Email 2: 3 days after enrollment
      // - Email 3: 1 week after enrollment
      
      console.log('Welcome sequence started for:', data.email)
      
      return { success: true, message: 'Welcome sequence scheduled' }
    } catch (error: any) {
      console.error('Failed to schedule welcome sequence:', error)
      throw error
    }
  }
}

// Email automation hooks for React components
export function useEmailAutomation() {
  const sendIntakeConfirmation = async (data: Parameters<typeof EmailAutomation.sendIntakeConfirmation>[0]) => {
    return EmailAutomation.sendIntakeConfirmation(data)
  }

  const sendIntakeDecision = async (data: Parameters<typeof EmailAutomation.sendIntakeDecision>[0]) => {
    return EmailAutomation.sendIntakeDecision(data)
  }

  const sendWelcomeSequence = async (data: Parameters<typeof EmailAutomation.sendWelcomeSequence>[0]) => {
    return EmailAutomation.sendWelcomeSequence(data)
  }

  const sendTestEmail = async (email: string) => {
    return EmailAutomation.sendTestEmail(email)
  }

  return {
    sendIntakeConfirmation,
    sendIntakeDecision,
    sendWelcomeSequence,
    sendTestEmail
  }
}

// Utility functions for common email scenarios
export const EmailUtils = {
  // Extract user data from intake response for email automation
  extractUserDataFromIntake: (intakeResponse: any) => {
    return {
      email: intakeResponse.email,
      firstName: intakeResponse.responses?.personalInfo?.firstName || intakeResponse.responses?.firstName || 'Kunde',
      lastName: intakeResponse.responses?.personalInfo?.lastName || intakeResponse.responses?.lastName,
      userId: intakeResponse.userId
    }
  },

  // Generate personalized subject lines
  generatePersonalizedSubject: (template: string, firstName: string) => {
    return template.replace('{{firstName}}', firstName)
  },

  // Validate email address
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}

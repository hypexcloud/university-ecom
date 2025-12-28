/**
 * Certificate Generation Utilities
 * 
 * Generate PDF certificates for course completion
 */

import { jsPDF } from 'jspdf'
import type { Certificate, StudentProgress } from './course-types'

/**
 * Generate certificate PDF
 */
export async function generateCertificatePDF(
  certificate: Certificate,
  studentName: string,
  courseName: string
): Promise<Blob> {
  // Create PDF
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  // Background - Prestige Black & Gold
  doc.setFillColor(10, 10, 10) // #0a0a0a
  doc.rect(0, 0, pageWidth, pageHeight, 'F')

  // Gold border
  doc.setDrawColor(212, 175, 55) // #d4af37
  doc.setLineWidth(2)
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20)

  // Inner border
  doc.setLineWidth(0.5)
  doc.rect(15, 15, pageWidth - 30, pageHeight - 30)

  // Logo/Badge at top
  doc.setFillColor(212, 175, 55)
  doc.circle(pageWidth / 2, 35, 15, 'F')
  
  doc.setTextColor(10, 10, 10)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('UE', pageWidth / 2, 38, { align: 'center' })

  // Title
  doc.setTextColor(212, 175, 55)
  doc.setFontSize(48)
  doc.setFont('helvetica', 'bold')
  doc.text('ZERTIFIKAT', pageWidth / 2, 70, { align: 'center' })

  // Subtitle
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'normal')
  doc.text('ÜBER DEN ERFOLGREICHEN ABSCHLUSS', pageWidth / 2, 82, { align: 'center' })

  // Student Name
  doc.setTextColor(212, 175, 55)
  doc.setFontSize(32)
  doc.setFont('helvetica', 'bold')
  doc.text(studentName.toUpperCase(), pageWidth / 2, 105, { align: 'center' })

  // Course Name
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'normal')
  doc.text('hat erfolgreich den Kurs', pageWidth / 2, 120, { align: 'center' })
  
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text(courseName, pageWidth / 2, 132, { align: 'center' })
  
  doc.setFontSize(20)
  doc.setFont('helvetica', 'normal')
  doc.text('abgeschlossen', pageWidth / 2, 144, { align: 'center' })

  // Completion Details
  const completionDate = certificate.completionDate
    ? new Date((certificate.completionDate as any).seconds * 1000).toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('de-DE')

  doc.setTextColor(200, 200, 200)
  doc.setFontSize(12)
  doc.text(`Abschlussdatum: ${completionDate}`, pageWidth / 2, 160, { align: 'center' })
  doc.text(
    `Gesamtfortschritt: ${certificate.overallCompletion}% | Sessions: ${certificate.sessionsCompleted}`,
    pageWidth / 2,
    167,
    { align: 'center' }
  )

  // Certificate Number
  doc.setFontSize(10)
  doc.setTextColor(150, 150, 150)
  doc.text(`Zertifikat-Nr: ${certificate.certificateNumber}`, pageWidth / 2, 178, {
    align: 'center',
  })

  // Verification Code
  doc.text(`Verifizierungscode: ${certificate.verificationCode}`, pageWidth / 2, 184, {
    align: 'center',
  })

  // Signature Line
  doc.setDrawColor(212, 175, 55)
  doc.setLineWidth(0.3)
  doc.line(pageWidth / 2 - 30, pageHeight - 25, pageWidth / 2 + 30, pageHeight - 25)

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'italic')
  doc.text('University Ecom', pageWidth / 2, pageHeight - 20, { align: 'center' })

  // Return as blob
  return doc.output('blob')
}

/**
 * Upload certificate to Firebase Storage
 */
export async function uploadCertificate(
  certificateId: string,
  pdfBlob: Blob
): Promise<string> {
  // This would upload to Firebase Storage
  // For now, return a placeholder URL
  
  // In production:
  // const storage = getStorage()
  // const storageRef = ref(storage, `certificates/${certificateId}.pdf`)
  // await uploadBytes(storageRef, pdfBlob)
  // const downloadURL = await getDownloadURL(storageRef)
  // return downloadURL

  return `https://storage.googleapis.com/university-ecom/certificates/${certificateId}.pdf`
}

/**
 * Send certificate email
 */
export async function sendCertificateEmail(
  email: string,
  studentName: string,
  courseName: string,
  certificateUrl: string
) {
  // This would integrate with the email system
  console.log(`Certificate email sent to ${email}`)
  
  // In production:
  // await sendEmail({
  //   to: email,
  //   subject: 'Ihr Kurs-Zertifikat',
  //   html: certificateEmailTemplate(studentName, courseName, certificateUrl)
  // })
}

/**
 * Check if student is eligible for certificate
 */
export function isCertificateEligible(progress: StudentProgress): boolean {
  // Must complete at least 90% of course
  if (progress.overallCompletion < 90) return false

  // Must complete all required sessions
  if (progress.sessionsCompleted < progress.totalSessions) return false

  // Must pass all required quizzes
  const requiredQuizzesPassed = progress.quizScores?.every(
    (score) => (score.score / score.maxScore) * 100 >= 70 // 70% passing
  )

  if (progress.quizScores && progress.quizScores.length > 0 && !requiredQuizzesPassed) {
    return false
  }

  return true
}

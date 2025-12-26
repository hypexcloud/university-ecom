/**
 * Checkout Form Validation Schema
 * 
 * Zod schema for validating checkout form data
 */

import { z } from 'zod'

export const checkoutSchema = z.object({
  // Course Selection
  course: z.enum(['ai', 'dropshipping'], {
    required_error: 'Bitte wählen Sie einen Kurs aus'
  }),
  plan: z.enum(['fast', 'business', 'infinity'], {
    required_error: 'Bitte wählen Sie einen Plan aus'
  }),
  
  // Personal Information (Required)
  firstName: z.string()
    .min(2, 'Vorname muss mindestens 2 Zeichen haben')
    .max(50, 'Vorname darf maximal 50 Zeichen haben'),
  lastName: z.string()
    .min(2, 'Nachname muss mindestens 2 Zeichen haben')
    .max(50, 'Nachname darf maximal 50 Zeichen haben'),
  email: z.string()
    .email('Bitte geben Sie eine gültige E-Mail-Adresse ein')
    .toLowerCase(),
  phone: z.string()
    .min(10, 'Telefonnummer muss mindestens 10 Zeichen haben')
    .max(20, 'Telefonnummer darf maximal 20 Zeichen haben')
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 
      'Bitte geben Sie eine gültige Telefonnummer ein'),
  
  // Address (Required)
  address: z.object({
    street: z.string()
      .min(5, 'Straße und Hausnummer sind erforderlich')
      .max(100, 'Adresse darf maximal 100 Zeichen haben'),
    zipCode: z.string()
      .min(4, 'PLZ muss mindestens 4 Zeichen haben')
      .max(10, 'PLZ darf maximal 10 Zeichen haben'),
    city: z.string()
      .min(2, 'Stadt ist erforderlich')
      .max(50, 'Stadt darf maximal 50 Zeichen haben'),
    country: z.string()
      .min(2, 'Land ist erforderlich')
      .max(50, 'Land darf maximal 50 Zeichen haben')
      .default('Deutschland')
  }),
  
  // Optional Fields
  discord: z.string()
    .max(50, 'Discord-Name darf maximal 50 Zeichen haben')
    .optional()
    .or(z.literal('')),
  birthDate: z.string()
    .optional()
    .or(z.literal('')),
  
  // Lead Attribution
  leadSource: z.enum([
    'google',
    'youtube', 
    'tiktok',
    'instagram',
    'facebook',
    'linkedin',
    'friend',
    'other'
  ], {
    required_error: 'Bitte wählen Sie aus, wie Sie auf uns aufmerksam geworden sind'
  }),
  affiliateId: z.string().optional(),
  
  // Terms & Conditions
  acceptTerms: z.boolean()
    .refine((val) => val === true, {
      message: 'Sie müssen den AGB und der Datenschutzerklärung zustimmen'
    }),
  acceptNewsletter: z.boolean().default(false)
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>

/**
 * Lead source options for dropdown
 */
export const LEAD_SOURCE_OPTIONS = [
  { value: 'google', label: 'Google Suche' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'friend', label: 'Empfehlung von Freund/Bekannten' },
  { value: 'other', label: 'Sonstiges' }
] as const

/**
 * Country options for dropdown
 */
export const COUNTRY_OPTIONS = [
  { value: 'Deutschland', label: 'Deutschland' },
  { value: 'Österreich', label: 'Österreich' },
  { value: 'Schweiz', label: 'Schweiz' },
  { value: 'Niederlande', label: 'Niederlande' },
  { value: 'Belgien', label: 'Belgien' },
  { value: 'Luxemburg', label: 'Luxemburg' },
  { value: 'Frankreich', label: 'Frankreich' },
  { value: 'Italien', label: 'Italien' },
  { value: 'Spanien', label: 'Spanien' },
  { value: 'Polen', label: 'Polen' },
  { value: 'Andere', label: 'Andere' }
] as const

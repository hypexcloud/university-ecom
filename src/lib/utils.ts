import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { randomBytes } from "crypto"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function nanoid(size = 21): string {
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz'
  const bytes = randomBytes(size)
  let id = ''
  for (let i = 0; i < size; i++) {
    id += alphabet[bytes[i] % alphabet.length]
  }
  return id
}

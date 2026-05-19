'use client'

import { useState, useEffect, useCallback } from 'react'

export interface CartItem {
  course: string  // 'ai' | 'dropshipping' | 'tiktok-creator' | 'youtube-creator'
  plan: string    // 'fast' | 'business' | 'infinity' | 'tiktok' | 'youtube'
}

const STORAGE_KEY = 'ue_cart'

function readCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function writeCart(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event('cart-update'))
}

export function addToCart(item: CartItem) {
  const items = readCart()
  // Prevent duplicate (same course+plan)
  if (items.some((i) => i.course === item.course && i.plan === item.plan)) return
  writeCart([...items, item])
}

export function removeFromCart(index: number) {
  const items = readCart()
  items.splice(index, 1)
  writeCart(items)
}

export function clearCart() {
  writeCart([])
  // Also clear legacy single-item key
  localStorage.removeItem('checkout_url')
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])

  const sync = useCallback(() => setItems(readCart()), [])

  useEffect(() => {
    sync()
    window.addEventListener('cart-update', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('cart-update', sync)
      window.removeEventListener('storage', sync)
    }
  }, [sync])

  return {
    items,
    count: items.length,
    add: (item: CartItem) => { addToCart(item); sync() },
    remove: (index: number) => { removeFromCart(index); sync() },
    clear: () => { clearCart(); sync() },
  }
}

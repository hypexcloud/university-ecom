'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/cart'

export function CartIcon() {
  const { count } = useCart()

  return (
    <Link href="/checkout" className="relative inline-flex items-center text-prestige-gray-300 hover:text-prestige-white transition-colors">
      <ShoppingCart className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-prestige-gold-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  )
}

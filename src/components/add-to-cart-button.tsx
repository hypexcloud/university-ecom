'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Check } from 'lucide-react'
import { addToCart } from '@/lib/cart'

interface AddToCartButtonProps {
  course: string
  plan: string
  label?: string
  directCheckout?: boolean
}

export function AddToCartButton({ course, plan, label, directCheckout }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false)
  const router = useRouter()

  const handleClick = () => {
    addToCart({ course, plan })
    if (directCheckout) {
      router.push('/checkout')
    } else {
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    }
  }

  if (added) {
    return (
      <Button disabled className="w-full">
        <Check className="h-4 w-4 mr-2" /> Hinzugefügt
      </Button>
    )
  }

  return (
    <Button onClick={handleClick} className="w-full">
      <ShoppingCart className="h-4 w-4 mr-2" />
      {label || (directCheckout ? 'Jetzt kaufen' : 'In den Warenkorb')}
    </Button>
  )
}

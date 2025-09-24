'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { 
  Menu, 
  BookOpen, 
  TrendingUp, 
  Users, 
  LogIn,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const courses = [
  {
    title: 'AI Kurs',
    href: '/courses/ai',
    description: 'Künstliche Intelligenz für Ihr Business nutzen',
    icon: BookOpen,
  },
  {
    title: 'Dropshipping Kurs',
    href: '/courses/dropshipping',
    description: 'Erfolgreiches E-Commerce ohne Lagerkosten',
    icon: TrendingUp,
  },
]

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              UE
            </div>
            <span className="font-bold text-xl">University Ecom</span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Kurse</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {courses.map((course) => (
                      <ListItem
                        key={course.title}
                        title={course.title}
                        href={course.href}
                        icon={course.icon}
                      >
                        {course.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                  <Link href="/about">
                    <Users className="mr-2 h-4 w-4" />
                    Über uns
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Auth Section - Simple for Public Site */}
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost" className="hidden md:inline-flex">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Anmelden
              </Link>
            </Button>
            <Button asChild className="hidden md:inline-flex">
              <Link href="/courses">Kurse ansehen</Link>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu öffnen</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4">
                  <Link
                    href="/"
                    className="flex items-center space-x-2 pb-4"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                      UE
                    </div>
                    <span className="font-bold text-xl">University Ecom</span>
                  </Link>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                      Kurse
                    </h3>
                    {courses.map((course) => (
                      <Link
                        key={course.href}
                        href={course.href}
                        className={cn(
                          "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted",
                          pathname === course.href && "bg-muted"
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        <course.icon className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{course.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {course.description}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="space-y-3 pt-4 border-t">
                    <Link
                      href="/about"
                      className={cn(
                        "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted",
                        pathname === "/about" && "bg-muted"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <Users className="h-4 w-4" />
                      <span>Über uns</span>
                    </Link>

                    <Link
                      href="/login"
                      className={cn(
                        "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted",
                        pathname === "/login" && "bg-muted"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <LogIn className="h-4 w-4" />
                      <span>Anmelden</span>
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

const ListItem = ({
  className,
  title,
  href,
  icon: Icon,
  children,
  ...props
}: {
  className?: string
  title: string
  href: string
  icon: any
  children: React.ReactNode
}) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex items-center space-x-2">
            <Icon className="h-4 w-4" />
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}

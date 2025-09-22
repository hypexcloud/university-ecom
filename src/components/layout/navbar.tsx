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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { 
  Menu, 
  BookOpen, 
  TrendingUp, 
  Users, 
  LogIn, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Loader2,
  Crown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { useAuth } from '@/lib/auth/auth-context'

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
  const { user, appUser, loading, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const getUserInitials = () => {
    if (appUser?.displayName) {
      return appUser.displayName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase()
    }
    return 'U'
  }

  const getUserName = () => {
    if (appUser?.profile?.firstName && appUser?.profile?.lastName) {
      return `${appUser.profile.firstName} ${appUser.profile.lastName}`
    }
    if (appUser?.displayName) {
      return appUser.displayName
    }
    if (user?.displayName) {
      return user.displayName
    }
    return user?.email?.split('@')[0] || 'Benutzer'
  }

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

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  Laden...
                </span>
              </div>
            ) : user ? (
              // Logged in user dropdown
              <div className="flex items-center space-x-4">
                {appUser?.role === 'admin' && (
                  <Button asChild variant="ghost" size="sm" className="hidden lg:inline-flex">
                    <Link href="/admin/intake">
                      <Crown className="mr-2 h-4 w-4" />
                      Admin
                    </Link>
                  </Button>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={appUser?.photoURL || user.photoURL || undefined} alt={getUserName()} />
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{getUserName()}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                        {appUser?.role && appUser.role !== 'student' && (
                          <p className="text-xs leading-none text-primary capitalize">
                            {appUser.role === 'admin' ? 'Administrator' : appUser.role}
                          </p>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/profile" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Profil
                      </Link>
                    </DropdownMenuItem>
                    {appUser?.role === 'admin' && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin/intake" className="cursor-pointer">
                            <Crown className="mr-2 h-4 w-4" />
                            Intake Management
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Abmelden
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              // Not logged in
              <>
                <Button asChild variant="ghost" className="hidden md:inline-flex">
                  <Link href="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Anmelden
                  </Link>
                </Button>
                <Button asChild className="hidden md:inline-flex">
                  <Link href="/courses">Kurse ansehen</Link>
                </Button>
              </>
            )}

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
                  
                  {/* User info in mobile menu */}
                  {user && (
                    <div className="flex items-center space-x-3 pb-4 border-b">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={appUser?.photoURL || user.photoURL || undefined} alt={getUserName()} />
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{getUserName()}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                  )}

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

                    {user ? (
                      <>
                        <Link
                          href="/dashboard"
                          className={cn(
                            "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted",
                            pathname === "/dashboard" && "bg-muted"
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>

                        {appUser?.role === 'admin' && (
                          <Link
                            href="/admin/intake"
                            className={cn(
                              "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted",
                              pathname.startsWith("/admin") && "bg-muted"
                            )}
                            onClick={() => setIsOpen(false)}
                          >
                            <Crown className="h-4 w-4" />
                            <span>Admin</span>
                          </Link>
                        )}

                        <button
                          onClick={() => {
                            handleLogout()
                            setIsOpen(false)
                          }}
                          className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted text-red-600"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Abmelden</span>
                        </button>
                      </>
                    ) : (
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
                    )}
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

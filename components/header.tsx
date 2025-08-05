"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"
import { User, LogOut, FileText, Menu, Home, Zap, Eye } from "lucide-react"
import { useState } from "react"

export function Header() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">KHIP</h1>
            <p className="text-xs text-gray-500">Korea's Hottest Insight Point</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-gray-600 hover:text-emerald-600 transition-colors flex items-center gap-2">
            <Home className="h-4 w-4" />
            Home
          </Link>
          <a href="/#how-it-works" className="text-gray-600 hover:text-emerald-600 transition-colors">
            How It Works
          </a>
          <a href="/#pricing" className="text-gray-600 hover:text-emerald-600 transition-colors">
            Pricing
          </a>
          <div className="relative group">
            <button className="text-gray-600 hover:text-emerald-600 transition-colors flex items-center gap-1">
              <Eye className="h-4 w-4" />
              Sample Reports
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <Link
                href="/sample-report"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600"
              >
                Single Insight Report
              </Link>
              <Link
                href="/sample-snapshot"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600"
              >
                Snapshot Report
              </Link>
            </div>
          </div>
          {user && (
            <Link
              href="/dashboard/snapshot"
              className="text-gray-600 hover:text-emerald-600 transition-colors flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              Dashboard
            </Link>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-emerald-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">K</span>
                  </div>
                  KHIP
                </SheetTitle>
                <SheetDescription>Korea's Hottest Insight Point</SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Home className="h-4 w-4" />
                  Home
                </Link>
                <a
                  href="/#how-it-works"
                  className="text-gray-600 hover:text-emerald-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  How It Works
                </a>
                <a
                  href="/#pricing"
                  className="text-gray-600 hover:text-emerald-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Pricing
                </a>
                <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                  <Link
                    href="/sample-report"
                    className="block text-gray-600 hover:text-emerald-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Single Insight Report
                  </Link>
                  <Link
                    href="/sample-snapshot"
                    className="block text-gray-600 hover:text-emerald-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Snapshot Report
                  </Link>
                </div>
                {user && (
                  <Link
                    href="/dashboard/snapshot"
                    className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Zap className="h-4 w-4" />
                    Dashboard
                  </Link>
                )}
                {user && (
                  <Link
                    href="/my-reports"
                    className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <FileText className="h-4 w-4" />
                    My Reports
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/snapshot">
                    <Zap className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/my-reports">
                    <FileText className="mr-2 h-4 w-4" />
                    My Reports
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild className="hidden sm:inline-flex">
                <Link href="/login">Log In</Link>
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

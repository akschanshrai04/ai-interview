"use client"

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/context/Authcontext'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { ChevronDown, LogOut } from 'lucide-react'

export default function DashboardHeader() {
  const { user } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const router = useRouter()

  // Use actual user data if available
  const displayName = user?.displayName || "User"
  const displayEmail = user?.email || "user@example.com"

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <header className="w-full h-16 bg-white border-b border-border px-6 flex items-center justify-between relative z-50">
      {/* Logo/Brand */}
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-dark-charcoal font-[var(--font-inter)] tracking-tight m-0">
          InterviewAI
        </h1>
      </div>

      {/* User Info with Dropdown */}
      <div className="flex items-center space-x-4">
        <div className="text-right hidden sm:block">
          <div className="text-sm font-medium text-dark-charcoal font-[var(--font-inter)]">
            {displayName}
          </div>
          <div className="text-xs text-medium-gray font-[var(--font-inter)]">
            {displayEmail}
          </div>
        </div>
        
        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            {/* Avatar */}
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-primary-foreground">
                {displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
            
            {/* Dropdown Arrow */}
            <ChevronDown className={`h-4 w-4 text-medium-gray transition-transform duration-200 ${
              isDropdownOpen ? 'rotate-180' : ''
            }`} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-border py-2 z-50">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="text-sm font-medium text-dark-charcoal">
                  {displayName}
                </div>
                <div className="text-xs text-medium-gray">
                  {displayEmail}
                </div>
              </div>

              {/* Logout Button */}
              <div className="py-1">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false)
                    handleLogout()
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
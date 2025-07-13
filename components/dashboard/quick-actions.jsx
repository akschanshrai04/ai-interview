"use client"

import React from 'react'
import { Calendar, Mic } from 'lucide-react'
import { useRouter } from 'next/navigation'

const QuickActions = () => {
  const router = useRouter()
  
  const actions = [
    {
      icon: Calendar,
      title: "Start Interview",
      description: "Begin a new AI interview session",
      action: () => router.push('/make-interview')
    },
    {
      icon: Mic,
      title: "Practice Mode",
      description: "Practice with sample questions",
      action: () => router.push('/make-interview')
    }
  ]

  return (
    <div className="bg-white">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[var(--dark-charcoal)] font-[var(--font-inter)]">
          Quick Actions
        </h2>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <div
              key={index}
              onClick={action.action}
              className="bg-white border border-[var(--border)] rounded-lg p-6 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg shadow-sm"
            >
              <div className="space-y-3">
                <Icon 
                  className="h-6 w-6 text-[var(--teal)]" 
                  strokeWidth={1.5}
                />
                <div>
                  <h3 className="text-base font-medium text-[var(--dark-charcoal)] font-[var(--font-inter)] mb-1">
                    {action.title}
                  </h3>
                  <p className="text-sm text-[var(--medium-gray)] font-[var(--font-inter)]">
                    {action.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default QuickActions
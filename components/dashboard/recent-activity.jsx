"use client"

import { useState, useEffect } from 'react'
import { Calendar, CheckCircle, Users, FileText, Clock, Mic } from "lucide-react"
import { useAuth } from '@/context/Authcontext'
import { getInterviewsByUserId } from '@/lib/firestoreHelpers'

export default function RecentActivity() {
  const { user } = useAuth()
  const [activities, setActivities] = useState([])

  useEffect(() => {
    async function fetchActivities() {
      if (user?.uid) {
        try {
          const interviews = await getInterviewsByUserId(user.uid)
          const recentInterviews = interviews
            .sort((a, b) => {
              const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt)
              const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt)
              return dateB - dateA
            })
            .slice(0, 5)
            .map((interview, index) => {
              const date = interview.createdAt?.toDate ? interview.createdAt.toDate() : new Date(interview.createdAt)
              const timeAgo = getTimeAgo(date)
              
              return {
                id: interview.id,
                type: interview.status === 'completed' ? 'interview_completed' : 'interview_created',
                description: interview.status === 'completed' 
                  ? `${interview.interviewType || 'Interview'} completed`
                  : `${interview.interviewType || 'Interview'} created`,
                timestamp: timeAgo,
                icon: interview.status === 'completed' ? CheckCircle : Mic,
                iconColor: interview.status === 'completed' ? "text-[#22c55e]" : "text-[#00ADB5]",
                bgColor: interview.status === 'completed' ? "bg-green-50" : "bg-[#E0FAFF]"
              }
            })
          
          setActivities(recentInterviews)
        } catch (error) {
          console.error('Error fetching activities:', error)
          setActivities([])
        }
      }
    }
    fetchActivities()
  }, [user])

  const getTimeAgo = (date) => {
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)
    
    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    } else {
      return 'Just now'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#d4d4d4] p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[#222831] font-[var(--font-inter)]">
          Recent Activity
        </h2>
      </div>

      <div className="space-y-0">
        {activities.map((activity, index) => {
          const Icon = activity.icon
          const isLast = index === activities.length - 1

          return (
            <div key={activity.id} className="relative flex items-start py-3">
              {/* Timeline line */}
              {!isLast && (
                <div className="absolute left-5 top-12 w-0.5 h-full bg-[#d4d4d4]" />
              )}

              {/* Icon */}
              <div className={`relative z-10 flex-shrink-0 w-10 h-10 ${activity.bgColor} rounded-full flex items-center justify-center mr-4`}>
                <Icon className={`w-5 h-5 ${activity.iconColor}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 group cursor-pointer hover:bg-[#f7f7f7] -mx-2 px-2 py-1 rounded-md transition-colors duration-200">
                <p className="text-sm font-medium text-[#222831] font-[var(--font-inter)] leading-5">
                  {activity.description}
                </p>
                <p className="text-xs text-[#393E46] font-[var(--font-inter)] mt-1 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {activity.timestamp}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty state */}
      {activities.length === 0 && (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-[#f0f0f0] rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-[#393E46]" />
          </div>
          <p className="text-sm text-[#393E46] font-[var(--font-inter)]">
            No recent activity to display
          </p>
        </div>
      )}

      {/* View All Activity Link */}
      {activities.length > 0 && (
        <div className="mt-6 pt-4 border-t border-[#d4d4d4]">
          <button className="text-sm font-medium text-[#00ADB5] hover:text-[#008A91] transition-colors duration-200 font-[var(--font-inter)]">
            View All Activity
          </button>
        </div>
      )}
    </div>
  )
}
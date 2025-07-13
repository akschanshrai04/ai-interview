"use client"

import { useState, useEffect } from 'react'
import { Users, Calendar, CheckCircle, BarChart3 } from "lucide-react"
import { useAuth } from '@/context/Authcontext'
import { getInterviewsByUserId } from '@/lib/firestoreHelpers'

const StatCard = ({ data }) => {
  const Icon = data.icon
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-accent rounded-lg">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="text-3xl font-bold text-dark-charcoal leading-none">
          {data.value}
        </div>
        <div className="text-sm text-medium-gray">
          {data.title}
        </div>
        <div className="text-xs text-medium-gray opacity-75">
          {data.subtitle}
        </div>
      </div>
    </div>
  )
}

export default function StatsOverview() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalInterviews: 0,
    completedInterviews: 0,
    incompleteInterviews: 0,
    averageScore: 0
  })

  useEffect(() => {
    async function fetchStats() {
      if (user?.uid) {
        try {
          const interviews = await getInterviewsByUserId(user.uid)
          console.log('Fetched interviews:', interviews) // Debug log
          
          const completed = interviews.filter(i => i.status === 'completed').length
          const incomplete = interviews.filter(i => !i.status || i.status === 'incomplete').length
          
          console.log('Completed:', completed, 'Incomplete:', incomplete) // Debug log
          
          setStats({
            totalInterviews: interviews.length,
            completedInterviews: completed,
            incompleteInterviews: incomplete,
            averageScore: interviews.length > 0 ? Math.round((completed / interviews.length) * 100) : 0
          })
        } catch (error) {
          console.error('Error fetching stats:', error)
        }
      }
    }
    fetchStats()
  }, [user])

  const statsData = [
    {
      title: "Total Interviews",
      value: stats.totalInterviews.toString(),
      subtitle: "All time",
      icon: Users
    },
    {
      title: "Completed",
      value: stats.completedInterviews.toString(),
      subtitle: "Finished interviews",
      icon: CheckCircle
    },
    {
      title: "In Progress",
      value: stats.incompleteInterviews.toString(),
      subtitle: "Pending interviews",
      icon: Calendar
    },
    {
      title: "Completion Rate",
      value: `${stats.averageScore}%`,
      subtitle: "Success rate",
      icon: BarChart3
    }
  ]

  return (
    <div className="w-full bg-background">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <StatCard key={index} data={stat} />
        ))}
      </div>
    </div>
  )
}
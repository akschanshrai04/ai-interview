"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/Authcontext'
import { useRouter } from 'next/navigation'
import DashboardHeader from '@/components/dashboard/dashboard-header'
import StatsOverview from '@/components/dashboard/stats-overview'
import InterviewList from '@/components/dashboard/interview-list'
import QuickActions from '@/components/dashboard/quick-actions'
import RecentActivity from '@/components/dashboard/recent-activity'
import { motion } from 'framer-motion'
import { Brain, Mic, Target, ArrowRight, Users } from 'lucide-react'

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [activeView, setActiveView] = useState("dashboard")

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#EEEEEE" }}>
      <div className="flex items-center space-x-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "#00ADB5" }}></div>
        <span className="text-lg font-medium" style={{ color: "#222831" }}>Loading...</span>
      </div>
    </div>
  )
  if (!user) return null

  if (activeView !== "dashboard") {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#EEEEEE" }}>
        <DashboardHeader />
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-semibold mb-4" style={{ color: "#222831" }}>
                {activeView === "profile" ? "Profile Settings" : "Application Settings"}
              </h2>
              <p className="text-gray-600 mb-6">
                This section is under development.
              </p>
              <button
                onClick={() => setActiveView("dashboard")}
                className="px-6 py-2 rounded-lg transition-all duration-200 text-white font-medium hover:scale-105"
                style={{ backgroundColor: "#00ADB5" }}
              >
                Back to Dashboard
              </button>
            </motion.div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#EEEEEE" }}>
      <DashboardHeader />
      
      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full text-white text-sm font-medium mb-4" style={{ backgroundColor: "#00ADB5" }}>
              <Brain className="h-4 w-4" />
              <span>Welcome back, {user?.displayName || 'User'}!</span>
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: "#222831" }}>
              Ready for your next interview?
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Practice with our AI interviewer and get detailed feedback to ace your next technical or behavioral interview.
            </p>
          </motion.section>

          {/* Stats Overview */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <StatsOverview />
          </motion.section>

          {/* Quick Start Cards */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-6" style={{ color: "#222831" }}>
              Quick Start
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Brain,
                  title: "Technical Interview",
                  description: "Practice coding problems and system design",
                  color: "#00ADB5",
                  href: "/make-interview"
                },
                {
                  icon: Users,
                  title: "Behavioral Interview",
                  description: "Master STAR method responses",
                  color: "#393E46",
                  href: "/make-interview"
                },
                {
                  icon: Target,
                  title: "Mixed Interview",
                  description: "Combined technical and behavioral",
                  color: "#222831",
                  href: "/make-interview"
                }
              ].map((card, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(card.href)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                >
                  <div className="flex items-center space-x-4">
                    <div 
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: card.color + '20' }}
                    >
                      <card.icon 
                        className="h-6 w-6" 
                        style={{ color: card.color }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1" style={{ color: "#222831" }}>
                        {card.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {card.description}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Main Content Grid */}
          <motion.div
            className="grid grid-cols-1 xl:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Left Column - Interview List */}
            <div className="xl:col-span-2">
              <InterviewList />
            </div>

            {/* Right Column - Quick Actions and Recent Activity */}
            <div className="space-y-8">
              <QuickActions />
              <RecentActivity />
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
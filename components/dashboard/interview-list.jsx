"use client"

import { useState, useEffect } from 'react'
import { Calendar, Clock, MapPin, Users, Eye } from 'lucide-react'
import { useAuth } from '@/context/Authcontext'
import { getInterviewsByUserId } from '@/lib/firestoreHelpers'
import { useRouter } from 'next/navigation'

export default function InterviewList() {
  const { user } = useAuth()
  const router = useRouter()
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInterviews() {
      if (user?.uid) {
        setLoading(true)
        try {
          const data = await getInterviewsByUserId(user.uid)
          setInterviews(data)
        } catch (err) {
          console.error('Error fetching interviews:', err)
          setInterviews([])
        } finally {
          setLoading(false)
        }
      }
    }
    fetchInterviews()
  }, [user])

  const handleViewInterview = (interviewId) => {
    router.push(`/interview/${interviewId}`)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'incomplete':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-border p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-dark-charcoal">Your Interviews</h2>
        </div>
        <div className="text-center py-8">
          <div className="text-medium-gray">Loading interviews...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-border p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-dark-charcoal">Your Interviews</h2>
      </div>

      {interviews.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-medium-gray mb-4">No interviews found</div>
          <button
            onClick={() => router.push('/make-interview')}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Start Your First Interview
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {interviews.map((interview) => (
            <div
              key={interview.id}
              className="border border-border rounded-lg p-4 hover:shadow-sm transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-dark-charcoal">
                      {interview.interviewType || 'Interview'}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(interview.status)}`}>
                      {interview.status || 'incomplete'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-medium-gray">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(interview.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{interview.questionCount || 0} questions</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{Array.isArray(interview.techStack) ? interview.techStack.join(', ') : interview.techStack}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleViewInterview(interview.id)}
                  className="p-2 text-medium-gray hover:text-primary transition-colors duration-200"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 
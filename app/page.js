"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Mic,
  Brain,
  FileText,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Play,
  Download,
  Target,
  Menu,
  X,
  Github,
} from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#EEEEEE" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 w-full backdrop-blur-sm"
        style={{ backgroundColor: "rgba(34, 40, 49, 0.95)" }}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex h-16 items-center justify-between">
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ backgroundColor: "#00ADB5" }}
              >
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">InterviewAI</span>
            </motion.div>

            <nav className="hidden md:flex items-center space-x-8">
              {/* Navigation removed for student resume project */}
            </nav>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                className="hidden md:inline-flex text-gray-300 hover:text-white hover:bg-gray-700"
                onClick={() => window.location.href = '/login'}
              >
                Sign In
              </Button>
              <Button 
                className="text-white border-0" 
                style={{ backgroundColor: "#00ADB5" }}
                onClick={() => window.location.href = '/home'}
              >
                Start Interview
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          className="md:hidden fixed inset-0 z-40 pt-16"
          style={{ backgroundColor: "rgba(34, 40, 49, 0.95)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="container mx-auto px-4 py-8">
            <nav className="flex flex-col space-y-4">
              {/* Mobile navigation removed for student resume project */}
            </nav>
          </div>
        </motion.div>
      )}

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-6">
                <Badge variant="secondary" className="w-fit text-white border-0" style={{ backgroundColor: "#00ADB5" }}>
                  🚀 AI-Powered Interview Practice
                </Badge>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl" style={{ color: "#222831" }}>
                  Master Your Next
                  <span style={{ color: "#00ADB5" }}> Interview</span>
                </h1>
                <p className="text-xl max-w-[600px]" style={{ color: "#393E46" }}>
                  Practice with our advanced AI interviewer. Get real-time feedback, comprehensive analysis, and
                  detailed PDF reports to ace your next technical or behavioral interview.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="text-lg px-8 text-white border-0" 
                  style={{ backgroundColor: "#00ADB5" }}
                  onClick={() => window.location.href = '/home'}
                >
                  Start Free Interview
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center space-x-8 text-sm" style={{ color: "#393E46" }}>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" style={{ color: "#00ADB5" }} />
                  <span>No signup required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" style={{ color: "#00ADB5" }} />
                  <span>Instant feedback</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="rounded-2xl p-8 shadow-2xl" style={{ backgroundColor: "#222831" }}>
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "#00ADB5" }}></div>
                    <span className="text-white font-medium">AI Interview in Progress</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mic className="h-5 w-5" style={{ color: "#00ADB5" }} />
                      <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: "#393E46" }}>
                        <motion.div
                          className="h-2 rounded-full"
                          style={{ backgroundColor: "#00ADB5" }}
                          initial={{ width: 0 }}
                          animate={{ width: "70%" }}
                          transition={{ duration: 2, delay: 1 }}
                        ></motion.div>
                      </div>
                    </div>
                    <div className="text-gray-300 text-sm">&#34;Tell me about a challenging project you worked on...&#34;</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32" style={{ backgroundColor: "white" }}>
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div className="text-center space-y-4 mb-16" {...fadeInUp}>
            <Badge
              variant="secondary"
              className="w-fit mx-auto text-white border-0"
              style={{ backgroundColor: "#00ADB5" }}
            >
              Features
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl" style={{ color: "#222831" }}>
              Everything you need to succeed
            </h2>
            <p className="text-xl max-w-[800px] mx-auto" style={{ color: "#393E46" }}>
              Comprehensive interview preparation with AI-powered insights
            </p>
          </motion.div>

          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Brain,
                title: "Technical Interviews",
                description: "Practice coding problems, system design, and technical concepts with our AI interviewer.",
              },
              {
                icon: Users,
                title: "Behavioral Interviews",
                description: "Master STAR method responses and showcase your soft skills effectively.",
              },
              {
                icon: Target,
                title: "Mixed Interviews",
                description: "Combine technical and behavioral questions for comprehensive preparation.",
              },
              {
                icon: Mic,
                title: "Voice Recognition",
                description: "Natural voice conversations with advanced speech recognition technology.",
              },
              {
                icon: FileText,
                title: "PDF Reports",
                description: "Detailed analysis and feedback delivered in comprehensive PDF format.",
              },
              {
                icon: Clock,
                title: "Real-time Feedback",
                description: "Get instant insights on your performance and areas for improvement.",
              },
            ].map((feature, index) => (
              <motion.div key={feature.title} variants={fadeInUp}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="text-center">
                    <div
                      className="mx-auto h-12 w-12 rounded-lg flex items-center justify-center mb-4"
                      style={{ backgroundColor: "#00ADB5" }}
                    >
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle style={{ color: "#222831" }}>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p style={{ color: "#393E46" }}>{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 lg:py-32" style={{ backgroundColor: "#EEEEEE" }}>
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div className="text-center space-y-4 mb-16" {...fadeInUp}>
            <Badge
              variant="secondary"
              className="w-fit mx-auto text-white border-0"
              style={{ backgroundColor: "#00ADB5" }}
            >
              How it Works
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl" style={{ color: "#222831" }}>
              Simple 3-step process
            </h2>
          </motion.div>

          <motion.div
            className="grid gap-8 md:grid-cols-3"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                step: "01",
                title: "Choose Interview Type",
                description: "Select from technical, behavioral, or mixed interview formats based on your needs.",
              },
              {
                step: "02",
                title: "Start Voice Interview",
                description: "Engage in natural conversation with our AI interviewer using voice commands.",
              },
              {
                step: "03",
                title: "Get PDF Report",
                description: "Receive comprehensive feedback and analysis in a detailed PDF report.",
              },
            ].map((step, index) => (
              <motion.div key={step.step} className="text-center space-y-4" variants={fadeInUp}>
                <div
                  className="mx-auto h-16 w-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                  style={{ backgroundColor: "#00ADB5" }}
                >
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold" style={{ color: "#222831" }}>
                  {step.title}
                </h3>
                <p style={{ color: "#393E46" }}>{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Removed for student resume project */}

      {/* CTA Section */}
      <section className="py-20 lg:py-32" style={{ backgroundColor: "white" }}>
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div className="text-center space-y-8 max-w-3xl mx-auto" {...fadeInUp}>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl" style={{ color: "#222831" }}>
              Ready to practice your interview skills?
            </h2>
            <p className="text-xl" style={{ color: "#393E46" }}>
              Start your AI-powered interview practice session and improve your confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8 text-white border-0" 
                style={{ backgroundColor: "#00ADB5" }}
                onClick={() => window.location.href = '/home'}
              >
                Start Free Interview
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16" style={{ backgroundColor: "#222831" }}>
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ backgroundColor: "#00ADB5" }}
              >
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">InterviewAI</span>
            </div>
            <p className="text-gray-400 mb-4">
              AI-powered interview practice platform for students and professionals.
            </p>
            <a 
              href="https://github.com/akschanshrai04" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors flex items-center justify-center space-x-2"
            >
              <Github className="h-5 w-5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

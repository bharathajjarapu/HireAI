"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  ArrowLeft,
  Mail,
  Send,
  User,
  Star,
  Phone,
  Linkedin,
  Github,
  FileSymlink,
  X,
  Wand2,
  Copy,
  Eye,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Edit3,
  CheckCircle,
  Clock,
  Briefcase,
  GraduationCap,
  Code,
  MapPin,
  BarChart3,
} from "lucide-react"
import Link from "next/link"

interface ResumeAnalysis {
  id: number
  filename: string
  candidateName?: string
  skills: string[]
  experience: string
  education: string
  matchScore: number
  contact: Record<string, string>
  linkedinUrl?: string
  githubUrl?: string
  fileUrl?: string
  technical_proficiency?: {
    languages: string[]
    frameworks: string[]
    tools: string[]
  }
  achievements?: string[]
  pros?: string[]
  cons?: string[]
  summary?: string
}

interface EmailData {
  id: number
  candidateName: string
  subject: string
  body: string
  status: "draft" | "sent" | "sending"
  email?: string
}

export default function Pipeline() {
  const [selectedResumes, setSelectedResumes] = useState<ResumeAnalysis[]>([])
  const [emails, setEmails] = useState<EmailData[]>([])
  const [selectedEmailIndex, setSelectedEmailIndex] = useState(0)
  const [jobRole, setJobRole] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [expandedCandidates, setExpandedCandidates] = useState<number[]>([])

  useEffect(() => {
    // Load selected resumes from localStorage
    const savedResumes = localStorage.getItem('selectedResumes')
    if (savedResumes) {
      const resumes = JSON.parse(savedResumes)
      setSelectedResumes(resumes)
      
      // Initialize emails for each candidate
      const initialEmails: EmailData[] = resumes.map((resume: ResumeAnalysis, index: number) => ({
        id: resume.id,
        candidateName: resume.candidateName || resume.filename.replace('.pdf', '').replace(/[_-]/g, ' '),
        subject: '',
        body: '',
        status: 'draft' as const,
        email: resume.contact?.email
      }))
      setEmails(initialEmails)
    }

    // Auto-fill job role if cached
    const cachedRole = localStorage.getItem('autoAnalysisJobRole')
    if (cachedRole) {
      setJobRole(cachedRole)
    }
  }, [])

  const handleRemoveCandidate = (id: number) => {
    const newResumes = selectedResumes.filter(r => r.id !== id)
    setSelectedResumes(newResumes)
    setEmails(emails.filter(e => e.id !== id))
    localStorage.setItem('selectedResumes', JSON.stringify(newResumes))
    
    // Adjust selected index if needed
    if (selectedEmailIndex >= newResumes.length && newResumes.length > 0) {
      setSelectedEmailIndex(newResumes.length - 1)
    }
  }

  const generatePersonalizedEmail = async (index: number) => {
    if (!jobRole.trim()) {
      alert('Please enter a job role first!')
      return
    }

    setIsGenerating(true)

    try {
      const resume = selectedResumes[index]
      console.log('Generating email for:', {
        candidateName: resume.candidateName,
        jobRole: jobRole,
        matchScore: resume.matchScore,
        skills: resume.skills
      })

      const response = await fetch('/api/generate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidateName: resume.candidateName || resume.filename.replace('.pdf', '').replace(/[_-]/g, ' '),
          jobRole: jobRole,
          matchScore: resume.matchScore,
          skills: resume.skills
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to generate email: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log('Email generated successfully:', data)

      if (!data.subject && !data.body) {
        throw new Error('No email content received from server')
      }

      setEmails(prev => prev.map((email, i) => 
        i === index ? { 
          ...email, 
          subject: data.subject || `Exciting ${jobRole} Opportunity!`, 
          body: data.body || `Dear ${resume.candidateName || 'Candidate'},\n\nWe have an exciting ${jobRole} opportunity for you.\n\nBest regards,\nHiring Team`
        } : email
      ))

    } catch (error) {
      console.error('Error generating email:', error)
      
      // Create a basic email template as fallback
      const resume = selectedResumes[index]
      const candidateName = resume.candidateName || resume.filename.replace('.pdf', '').replace(/[_-]/g, ' ')
      
      setEmails(prev => prev.map((email, i) => 
        i === index ? { 
          ...email, 
          subject: `Exciting ${jobRole} Opportunity - ${resume.matchScore}% Match!`,
          body: `Dear ${candidateName},

I hope this email finds you well! I came across your profile and was impressed by your background and skills, particularly your expertise in ${resume.skills.slice(0, 3).join(", ")}.

We currently have an exciting ${jobRole} position that matches ${resume.matchScore}% with your profile. Based on your experience and skills, I believe you would be an excellent fit for our team.

Key highlights of this opportunity:
• Work with cutting-edge technologies including ${resume.skills.join(", ")}
• Competitive compensation package
• Flexible work arrangements
• Opportunity for career growth and development

I'd love to schedule a brief 15-20 minute call to discuss this opportunity further and learn more about your career goals.

Would you be available for a quick conversation this week?

Best regards,
[Your Name]
[Your Title]
[Company Name]

P.S. I noticed your expertise in ${resume.skills[0]} - we're doing some exciting work in that area that I think you'd find very interesting!`
        } : email
      ))
      
      // Don't show error alert, just use fallback template
      console.log('Used fallback email template due to API error')
    } finally {
      setIsGenerating(false)
    }
  }

  const sendEmail = async (index: number) => {
    setEmails(prev => prev.map((email, i) => 
      i === index ? { ...email, status: "sending" } : email
    ))

    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 1500))

    setEmails(prev => prev.map((email, i) => 
      i === index ? { ...email, status: "sent" } : email
    ))
  }

  const sendAllEmails = async () => {
    for (let i = 0; i < emails.length; i++) {
      if (emails[i].status === "draft") {
        await sendEmail(i)
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const toggleCandidateExpansion = (id: number) => {
    setExpandedCandidates(prev => 
      prev.includes(id) 
        ? prev.filter(candidateId => candidateId !== id)
        : [...prev, id]
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100"
    if (score >= 80) return "text-blue-600 bg-blue-100"
    if (score >= 70) return "text-yellow-600 bg-yellow-100"
    return "text-red-600 bg-red-100"
  }

  if (selectedResumes.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-100">
        <div className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/resume-parser">
                <Button variant="ghost" className="hover:bg-purple-50">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Parser
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <Mail className="w-6 h-6 text-purple-600" />
                <h1 className="text-xl font-bold text-gray-900">Hiring Pipeline</h1>
              </div>
              <div></div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Candidates Selected</h2>
            <p className="text-gray-600 mb-8">Select candidates from the resume parser to add them to your pipeline.</p>
            <Link href="/resume-parser">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go to Resume Parser
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-100">
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/resume-parser">
              <Button variant="ghost" className="hover:bg-purple-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Parser
              </Button>
            </Link>

            <div className="flex items-center space-x-3">
              <Mail className="w-6 h-6 text-purple-600" />
              <h1 className="text-xl font-bold text-gray-900">Email Campaign Builder</h1>
            </div>

            <Button
              onClick={sendAllEmails}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              disabled={emails.every(email => email.status !== "draft") || !jobRole.trim()}
            >
              <Send className="w-4 h-4 mr-2" />
              Send All Emails
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-4">
        {/* Compact Job Role Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <Card className="border-0 shadow-md bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Briefcase className="w-4 h-4 text-purple-600" />
                <Input
                  placeholder="Enter job role (e.g., Senior Backend Engineer)..."
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  className="flex-1 border-gray-200 focus:border-purple-500 focus:ring-purple-500 h-9"
                />
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
                  {selectedResumes.length} candidates
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-200px)]">
          {/* Candidate List - Smaller */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-3 overflow-y-auto"
          >
            <Card className="border-0 shadow-md bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-base">
                  <User className="w-4 h-4 text-purple-600" />
                  <span>Pipeline</span>
                </CardTitle>
                <CardDescription className="text-xs">{emails.length} candidates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[calc(100vh-320px)] overflow-y-auto">
                {selectedResumes.map((resume, index) => (
                  <motion.div
                    key={resume.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="space-y-2"
                  >
                    <div
                      onClick={() => setSelectedEmailIndex(index)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                        selectedEmailIndex === index
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-purple-300 hover:bg-purple-25"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm text-gray-900 truncate">
                          {resume.candidateName || resume.filename.replace('.pdf', '').replace(/[_-]/g, ' ')}
                        </h4>
                        <div className="flex items-center space-x-1">
                          <motion.div
                            animate={{ scale: emails[index]?.status === "sending" ? [1, 1.2, 1] : 1 }}
                            transition={{
                              duration: 0.5,
                              repeat: emails[index]?.status === "sending" ? Number.POSITIVE_INFINITY : 0,
                            }}
                          >
                            {emails[index]?.status === "draft" && (
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                                <Edit3 className="w-2 h-2 mr-1" />
                                Draft
                              </Badge>
                            )}
                            {emails[index]?.status === "sending" && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                                <Clock className="w-2 h-2 mr-1" />
                                Sending
                              </Badge>
                            )}
                            {emails[index]?.status === "sent" && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                                <CheckCircle className="w-2 h-2 mr-1" />
                                Sent
                              </Badge>
                            )}
                          </motion.div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveCandidate(resume.id)
                            }}
                            className="h-5 w-5 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-2 h-2" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-1">
                        <Badge className={`text-xs ${getScoreColor(resume.matchScore)}`}>
                          <Star className="w-2 h-2 mr-1" />
                          {resume.matchScore}%
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleCandidateExpansion(resume.id)
                          }}
                          className="h-4 w-4 p-0"
                        >
                          {expandedCandidates.includes(resume.id) ? (
                            <ChevronUp className="w-2 h-2" />
                          ) : (
                            <ChevronDown className="w-2 h-2" />
                          )}
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-1">
                        {resume.skills.slice(0, 2).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs px-1 py-0">
                            {skill}
                          </Badge>
                        ))}
                        {resume.skills.length > 2 && (
                          <Badge variant="outline" className="text-xs px-1 py-0 text-gray-500">
                            +{resume.skills.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Expanded Candidate Details - Compact */}
                    <Collapsible open={expandedCandidates.includes(resume.id)}>
                      <CollapsibleContent>
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="ml-2 p-2 bg-gray-50 rounded text-xs space-y-2"
                        >
                          {/* Contact Information */}
                          {resume.contact?.email && (
                            <div className="flex items-center">
                              <Mail className="w-2 h-2 mr-1 text-blue-600" />
                              <a href={`mailto:${resume.contact.email}`} className="text-blue-600 hover:underline truncate">
                                {resume.contact.email}
                              </a>
                            </div>
                          )}
                          {resume.contact?.phone && (
                            <div className="flex items-center">
                              <Phone className="w-2 h-2 mr-1 text-green-600" />
                              <a href={`tel:${resume.contact.phone}`} className="text-green-600 hover:underline">
                                {resume.contact.phone}
                              </a>
                            </div>
                          )}
                          
                          <div className="flex gap-1">
                            {resume.linkedinUrl && (
                              <Button variant="outline" size="sm" className="h-5 text-xs" asChild>
                                <a href={resume.linkedinUrl} target="_blank" rel="noopener noreferrer">
                                  <Linkedin className="w-2 h-2 mr-1" />
                                  LinkedIn
                                </a>
                              </Button>
                            )}
                            {resume.githubUrl && (
                              <Button variant="outline" size="sm" className="h-5 text-xs" asChild>
                                <a href={resume.githubUrl} target="_blank" rel="noopener noreferrer">
                                  <Github className="w-2 h-2 mr-1" />
                                  GitHub
                                </a>
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      </CollapsibleContent>
                    </Collapsible>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Email Composer - Main Area */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 h-full flex flex-col"
          >
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm flex-1 flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2 text-lg">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span>Email for {selectedResumes[selectedEmailIndex]?.candidateName || 'Candidate'}</span>
                    </CardTitle>
                    {emails[selectedEmailIndex]?.subject || emails[selectedEmailIndex]?.body ? (
                      <CardDescription className="text-sm">Personalized email ready to send</CardDescription>
                    ) : (
                      <CardDescription className="text-sm">Click "Generate" to create content</CardDescription>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(emails[selectedEmailIndex]?.body || "")}
                      className="border-gray-200 hover:bg-gray-50 h-7"
                      disabled={!emails[selectedEmailIndex]?.body}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generatePersonalizedEmail(selectedEmailIndex)}
                      disabled={isGenerating || !jobRole.trim()}
                      className="border-purple-200 hover:bg-purple-50 h-7"
                    >
                      {isGenerating ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        >
                          <Wand2 className="w-3 h-3" />
                        </motion.div>
                      ) : (
                        <Wand2 className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col space-y-3">
                {!jobRole.trim() && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
                    <p className="text-amber-700 text-sm">
                      Please enter a job role at the top to generate personalized emails
                    </p>
                  </div>
                )}

                {/* Subject Line */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Subject Line</label>
                  <Input
                    value={emails[selectedEmailIndex]?.subject || ""}
                    onChange={(e) => {
                      const newEmails = [...emails]
                      newEmails[selectedEmailIndex].subject = e.target.value
                      setEmails(newEmails)
                    }}
                    placeholder={emails[selectedEmailIndex]?.subject ? "" : "Subject will be generated..."}
                    className="border-gray-200 focus:border-purple-500 focus:ring-purple-500 h-9"
                  />
                </div>

                {/* Email Body - Compact */}
                <div className="flex-1 flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Message Content</label>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedEmailIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="flex-1"
                    >
                      <Textarea
                        value={emails[selectedEmailIndex]?.body || ""}
                        onChange={(e) => {
                          const newEmails = [...emails]
                          newEmails[selectedEmailIndex].body = e.target.value
                          setEmails(newEmails)
                        }}
                        className="border-gray-200 focus:border-purple-500 focus:ring-purple-500 font-mono text-sm h-full min-h-[200px] resize-none"
                        placeholder={emails[selectedEmailIndex]?.body ? "" : isGenerating ? "Generating personalized email..." : "Email content will be generated here"}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Email Actions - Compact */}
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
                      <Mail className="w-2 h-2 mr-1" />
                      To: {emails[selectedEmailIndex]?.email || 'No email found'}
                    </Badge>

                    <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50 h-7 text-xs">
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => generatePersonalizedEmail(selectedEmailIndex)}
                      disabled={isGenerating || emails[selectedEmailIndex]?.status !== "draft" || !jobRole.trim()}
                      className="border-purple-200 hover:bg-purple-50 h-8 text-sm"
                    >
                      {isGenerating ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="mr-1"
                          >
                            <Wand2 className="w-3 h-3" />
                          </motion.div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-3 h-3 mr-1" />
                          Generate
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={() => sendEmail(selectedEmailIndex)}
                      disabled={emails[selectedEmailIndex]?.status !== "draft" || !emails[selectedEmailIndex]?.subject || !emails[selectedEmailIndex]?.body}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-8 text-sm"
                    >
                      {emails[selectedEmailIndex]?.status === "sending" ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="mr-1"
                          >
                            <Clock className="w-3 h-3" />
                          </motion.div>
                          Sending...
                        </>
                      ) : emails[selectedEmailIndex]?.status === "sent" ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Sent
                        </>
                      ) : (
                        <>
                          <Send className="w-3 h-3 mr-1" />
                          Send
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Insights Sidebar - Compact */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            {/* AI Personalization Insights - Compact */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50">
              <CardContent className="p-4">
                <div className="flex items-start space-x-2">
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                      rotate: [0, 3, -3, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    <Sparkles className="w-4 h-4 text-purple-600 mt-0.5" />
                  </motion.div>
                  <div>
                    <h4 className="font-semibold text-purple-900 mb-2 text-sm">AI Insights</h4>
                    {selectedResumes[selectedEmailIndex] && (
                      <ul className="text-xs text-purple-700 space-y-1">
                        <li>• Highlighted {selectedResumes[selectedEmailIndex].skills[0]} expertise</li>
                        <li>• Referenced {selectedResumes[selectedEmailIndex].matchScore}% match score</li>
                        <li>• Used specific technologies from background</li>
                        <li>• Optimized subject line for open rates</li>
                        <li>• Added compelling call-to-action</li>
                      </ul>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardContent className="p-4">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm flex items-center">
                  <BarChart3 className="w-4 h-4 mr-1 text-blue-600" />
                  Quick Stats
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Total Candidates:</span>
                    <span className="font-medium">{selectedResumes.length}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Emails Sent:</span>
                    <span className="font-medium text-green-600">
                      {emails.filter(e => e.status === "sent").length}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Drafts:</span>
                    <span className="font-medium text-yellow-600">
                      {emails.filter(e => e.status === "draft").length}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Avg. Match Score:</span>
                    <span className="font-medium text-purple-600">
                      {Math.round(selectedResumes.reduce((acc, r) => acc + r.matchScore, 0) / selectedResumes.length || 0)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardContent className="p-4">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Quick Actions</h4>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs h-8 justify-start"
                    onClick={sendAllEmails}
                    disabled={emails.some(e => e.status === "sending") || emails.every(e => e.status === "sent")}
                  >
                    <Send className="w-3 h-3 mr-1" />
                    Send All Emails
                  </Button>
                  <Link href="/analytics" className="block">
                    <Button variant="outline" size="sm" className="w-full text-xs h-8 justify-start">
                      <BarChart3 className="w-3 h-3 mr-1" />
                      View Analytics
                    </Button>
                  </Link>
                  <Link href="/" className="block">
                    <Button variant="outline" size="sm" className="w-full text-xs h-8 justify-start">
                      <ArrowLeft className="w-3 h-3 mr-1" />
                      Back to Dashboard
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {emails.length > 0 && emails.every(email => email.status === "sent") && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              <Card className="border-0 shadow-2xl bg-white max-w-md mx-4">
                <CardContent className="p-8 text-center">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                    className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">All Emails Sent!</h3>
                  <p className="text-gray-600 mb-6">
                    Your personalized emails have been sent to all {emails.length} candidates.
                  </p>

                  <div className="flex space-x-3">
                    <Link href="/analytics" className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                        View Analytics
                      </Button>
                    </Link>
                    <Link href="/" className="flex-1">
                      <Button variant="outline" className="w-full border-gray-200 hover:bg-gray-50">
                        Dashboard
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 
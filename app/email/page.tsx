"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, Wand2, Send, Eye, CheckCircle, Clock, Sparkles, User, Edit3, Copy } from "lucide-react"
import Link from "next/link"

const mockSelectedCandidates = [
  {
    id: 1,
    name: "Sarah Chen",
    title: "Senior Backend Engineer",
    skills: ["Java", "Microservices", "AWS"],
    email: "sarah.chen@email.com",
  },
  {
    id: 4,
    name: "David Kim",
    title: "AI/ML Engineer",
    skills: ["Python", "TensorFlow", "LangChain"],
    email: "david.kim@email.com",
  },
]

const generatePersonalizedEmail = (candidate: (typeof mockSelectedCandidates)[0]) => {
  return `Subject: Exciting Backend Engineering Opportunity at TechCorp

Hi ${candidate.name},

I hope this email finds you well! I came across your profile and was impressed by your experience as a ${candidate.title}. Your expertise in ${candidate.skills.slice(0, 2).join(" and ")} particularly caught my attention.

We're currently looking for a talented engineer to join our growing team at TechCorp. Based on your background, I believe you'd be a fantastic fit for our Senior Backend Engineer position.

Here's what makes this opportunity special:
• Work with cutting-edge technologies including ${candidate.skills.join(", ")}
• Competitive salary and equity package
• Flexible remote work options
• Opportunity to lead technical initiatives

I'd love to schedule a brief 15-minute call to discuss this opportunity further and learn more about your career goals.

Would you be available for a quick chat this week?

Best regards,
Alex Johnson
Senior Technical Recruiter
TechCorp

P.S. I noticed your work with ${candidate.skills[0]} - we're doing some exciting projects in that space that I think you'd find interesting!`
}

export default function EmailGeneration() {
  const [emails, setEmails] = useState(
    mockSelectedCandidates.map((candidate) => ({
      ...candidate,
      emailContent: generatePersonalizedEmail(candidate),
      status: "draft" as "draft" | "sent" | "sending",
    })),
  )
  const [selectedEmailIndex, setSelectedEmailIndex] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)

  const regenerateEmail = async (index: number) => {
    setIsGenerating(true)

    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const candidate = emails[index]
    const newContent = generatePersonalizedEmail(candidate)

    setEmails((prev) => prev.map((email, i) => (i === index ? { ...email, emailContent: newContent } : email)))

    setIsGenerating(false)
  }

  const sendEmail = async (index: number) => {
    setEmails((prev) => prev.map((email, i) => (i === index ? { ...email, status: "sending" } : email)))

    // Simulate sending
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setEmails((prev) => prev.map((email, i) => (i === index ? { ...email, status: "sent" } : email)))
  }

  const sendAllEmails = async () => {
    for (let i = 0; i < emails.length; i++) {
      if (emails[i].status === "draft") {
        await sendEmail(i)
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    }
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
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
            <Link href="/search">
              <Button variant="ghost" className="hover:bg-purple-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Search
              </Button>
            </Link>

            <div className="flex items-center space-x-3">
              <Mail className="w-6 h-6 text-purple-600" />
              <h1 className="text-xl font-bold text-gray-900">Personalized Email Generation</h1>
            </div>

            <Button
              onClick={sendAllEmails}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              disabled={emails.every((email) => email.status !== "draft")}
            >
              <Send className="w-4 h-4 mr-2" />
              Send All Emails
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Candidate List */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-purple-600" />
                  <span>Selected Candidates</span>
                </CardTitle>
                <CardDescription>{emails.length} personalized emails ready</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {emails.map((email, index) => (
                  <motion.div
                    key={email.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedEmailIndex(index)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedEmailIndex === index
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300 hover:bg-purple-25"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{email.name}</h4>
                      <motion.div
                        animate={{ scale: email.status === "sending" ? [1, 1.2, 1] : 1 }}
                        transition={{
                          duration: 0.5,
                          repeat: email.status === "sending" ? Number.POSITIVE_INFINITY : 0,
                        }}
                      >
                        {email.status === "draft" && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            <Edit3 className="w-3 h-3 mr-1" />
                            Draft
                          </Badge>
                        )}
                        {email.status === "sending" && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            <Clock className="w-3 h-3 mr-1" />
                            Sending
                          </Badge>
                        )}
                        {email.status === "sent" && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Sent
                          </Badge>
                        )}
                      </motion.div>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">{email.title}</p>
                    <div className="flex flex-wrap gap-1">
                      {email.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Email Editor */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      <span>Email for {emails[selectedEmailIndex]?.name}</span>
                    </CardTitle>
                    <CardDescription>AI-generated personalized outreach email</CardDescription>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(emails[selectedEmailIndex]?.emailContent || "")}
                      className="border-gray-200 hover:bg-gray-50"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => regenerateEmail(selectedEmailIndex)}
                      disabled={isGenerating}
                      className="border-purple-200 hover:bg-purple-50"
                    >
                      {isGenerating ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        >
                          <Wand2 className="w-4 h-4" />
                        </motion.div>
                      ) : (
                        <Wand2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedEmailIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Textarea
                      value={emails[selectedEmailIndex]?.emailContent || ""}
                      onChange={(e) => {
                        const newEmails = [...emails]
                        newEmails[selectedEmailIndex].emailContent = e.target.value
                        setEmails(newEmails)
                      }}
                      rows={20}
                      className="border-gray-200 focus:border-purple-500 focus:ring-purple-500 font-mono text-sm"
                      placeholder="Email content will appear here..."
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Email Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      <Mail className="w-3 h-3 mr-1" />
                      To: {emails[selectedEmailIndex]?.email}
                    </Badge>

                    <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50">
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => regenerateEmail(selectedEmailIndex)}
                      disabled={isGenerating || emails[selectedEmailIndex]?.status !== "draft"}
                      className="border-purple-200 hover:bg-purple-50"
                    >
                      {isGenerating ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="mr-2"
                          >
                            <Wand2 className="w-4 h-4" />
                          </motion.div>
                          Regenerating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4 mr-2" />
                          Regenerate
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={() => sendEmail(selectedEmailIndex)}
                      disabled={emails[selectedEmailIndex]?.status !== "draft"}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      {emails[selectedEmailIndex]?.status === "sending" ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="mr-2"
                          >
                            <Clock className="w-4 h-4" />
                          </motion.div>
                          Sending...
                        </>
                      ) : emails[selectedEmailIndex]?.status === "sent" ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Sent
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Email
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6"
            >
              <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    >
                      <Sparkles className="w-6 h-6 text-purple-600 mt-1" />
                    </motion.div>
                    <div>
                      <h4 className="font-semibold text-purple-900 mb-2">AI Personalization Insights</h4>
                      <ul className="text-sm text-purple-700 space-y-1">
                        <li>• Highlighted candidate's {emails[selectedEmailIndex]?.skills[0]} expertise</li>
                        <li>• Mentioned specific technologies from their background</li>
                        <li>• Included personalized P.S. based on their skills</li>
                        <li>• Optimized subject line for higher open rates</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {emails.every((email) => email.status === "sent") && (
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

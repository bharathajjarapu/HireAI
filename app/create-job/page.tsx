"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Sparkles,
  Share2,
  Users,
  Copy,
  ExternalLink,
  Linkedin,
  Twitter,
  Globe,
  CheckCircle,
  Loader2,
  Lightbulb,
  Wand2,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface JobData {
  id: string
  title: string
  description: string
  formUrl: string
  applicantCount: number
  status: 'active' | 'draft'
  createdAt: string
}

interface GeneratedPost {
  platform: string
  content: string
  imageUrl: string
}

export default function CreateJob() {
  const router = useRouter()
  const { toast } = useToast()
  const [jobPrompt, setJobPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedJob, setGeneratedJob] = useState<JobData | null>(null)
  const [selectedPlatform, setSelectedPlatform] = useState<'linkedin' | 'twitter' | 'general'>('linkedin')
  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null)
  const [isGeneratingPost, setIsGeneratingPost] = useState(false)

  const generateJobAndForm = async () => {
    if (!jobPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a job description",
        variant: "destructive"
      })
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/jobs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: jobPrompt }),
      })

      if (!response.ok) {
        throw new Error('Failed to create job')
      }

      const jobData = await response.json()
      setGeneratedJob(jobData)

      toast({
        title: "Success",
        description: "Job and application form created successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create job. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const generateSocialPost = async () => {
    if (!generatedJob) return

    setIsGeneratingPost(true)
    try {
      const response = await fetch('/api/jobs/generate-social-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          jobId: generatedJob.id,
          jobTitle: generatedJob.title,
          jobDescription: generatedJob.description,
          formUrl: generatedJob.formUrl,
          platform: selectedPlatform
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate post')
      }

      const postData = await response.json()
      setGeneratedPost({
        platform: selectedPlatform,
        content: postData.content,
        imageUrl: postData.imageUrl
      })

      toast({
        title: "Post Generated!",
        description: `Human-like ${selectedPlatform} post created successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate post. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsGeneratingPost(false)
    }
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    })
  }

  const viewApplicants = () => {
    if (generatedJob) {
      router.push(`/jobs/${generatedJob.id}/applicants`)
    }
  }

  const platformOptions = [
    { value: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-600' },
    { value: 'twitter', label: 'Twitter', icon: Twitter, color: 'text-blue-400' },
    { value: 'general', label: 'General', icon: Globe, color: 'text-gray-600' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="hover:bg-blue-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>

            <Link href="/jobs">
              <Button variant="ghost" className="hover:bg-blue-50">
                View All Jobs
              </Button>
            </Link>

            <div className="flex items-center space-x-3">
              <Sparkles className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Create New Job</h1>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {!generatedJob ? (
          /* Initial Job Creation Form */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Describe Your Job</h2>
              <p className="text-gray-600 text-lg">
                Simply describe the position you're hiring for, and we'll create everything you need
              </p>

              {/* Sample Prompts */}
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                {[
                  {
                    label: "AI Developer",
                    prompt: "We're seeking an AI/ML Engineer skilled in Python, TensorFlow, and Large Language Models to build and optimize machine-learning pipelines for real-time inference. Remote, competitive salary."
                  },
                  {
                    label: "Full-Stack Dev",
                    prompt: "Hiring a Senior Full-Stack Developer (React, Next.js, Node.js, PostgreSQL) to lead development of a scalable SaaS platform. 5+ yrs experience, equity offered."
                  },
                  {
                    label: "DevOps Engineer",
                    prompt: "Looking for a DevOps Engineer experienced with AWS, Docker, Kubernetes, and CI/CD to automate infrastructure and improve deployment velocity. Hybrid-work."
                  }
                ].map((sample) => (
                  <Button
                    key={sample.label}
                    size="sm"
                    variant="outline"
                    type="button"
                    onClick={() => setJobPrompt(sample.prompt)}
                    className="border-yellow-200 hover:bg-yellow-50 text-yellow-700"
                  >
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                    <span>{sample.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Job Description Prompt</CardTitle>
                <CardDescription>
                  Tell us about the role, requirements, and what you're looking for in a candidate
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="jobPrompt" className="text-sm font-medium">
                    Job Description *
                  </Label>
                  <Textarea
                    id="jobPrompt"
                    placeholder="Example: We're looking for a Senior React Developer with 5+ years of experience. The role involves building scalable web applications using React, TypeScript, and Node.js. Remote work is available, salary range $120k-$180k. We value team collaboration and innovative thinking..."
                    rows={8}
                    value={jobPrompt}
                    onChange={(e) => setJobPrompt(e.target.value)}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
                  />
                </div>

                <Button
                  onClick={generateJobAndForm}
                  disabled={isGenerating || !jobPrompt.trim()}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating Job & Form...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Create Job & Generate Form Link
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          /* Generated Job Results */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Success Header */}
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Created Successfully!</h2>
              <p className="text-gray-600">Your job posting and application form are ready to go</p>
            </div>

            {/* Job Details Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {generatedJob.title}
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Active
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Created on {new Date(generatedJob.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{generatedJob.description}</p>
                
                {/* Form Link */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <Label className="text-sm font-medium text-blue-900 mb-2 block">
                    Application Form Link
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      value={generatedJob.formUrl}
                      readOnly
                      className="bg-white border-blue-200 text-sm"
                    />
                    <Button
                      onClick={() => copyToClipboard(generatedJob.formUrl, "Form link")}
                      variant="outline"
                      size="sm"
                      className="border-blue-200 hover:bg-blue-50"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => window.open(generatedJob.formUrl, '_blank')}
                      variant="outline"
                      size="sm"
                      className="border-blue-200 hover:bg-blue-50"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={viewApplicants}
                    className="flex-1 min-w-[200px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    View Applicants ({generatedJob.applicantCount})
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* LinkedIn Post Generator */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wand2 className="w-5 h-5 mr-2 text-purple-600" />
                  Generate Job Promotion Post
                </CardTitle>
                <CardDescription>
                  Create human-like posts to promote your job opening on social media platforms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Platform Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Select Platform</Label>
                  <div className="flex gap-2">
                    {platformOptions.map((platform) => {
                      const IconComponent = platform.icon
                      return (
                        <Button
                          key={platform.value}
                          variant={selectedPlatform === platform.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedPlatform(platform.value as any)}
                          className={`${
                            selectedPlatform === platform.value 
                              ? 'bg-blue-600 text-white' 
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <IconComponent className={`w-4 h-4 mr-2 ${platform.color}`} />
                          {platform.label}
                        </Button>
                      )
                    })}
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={generateSocialPost}
                  disabled={isGeneratingPost}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  {isGeneratingPost ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Human-like Post...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate {platformOptions.find(p => p.value === selectedPlatform)?.label} Post
                    </>
                  )}
                </Button>

                {/* Generated Post Display */}
                {generatedPost && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {generatedPost.platform === 'linkedin' && <Linkedin className="w-4 h-4 text-blue-600" />}
                        {generatedPost.platform === 'twitter' && <Twitter className="w-4 h-4 text-blue-400" />}
                        {generatedPost.platform === 'general' && <Globe className="w-4 h-4 text-gray-600" />}
                        <span className="font-medium capitalize">{generatedPost.platform} Post</span>
                      </div>
                      <Button
                        onClick={() => copyToClipboard(generatedPost.content, `${generatedPost.platform} post`)}
                        variant="outline"
                        size="sm"
                        className="border-blue-200 hover:bg-blue-50"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {generatedPost.imageUrl && (
                        <img src={generatedPost.imageUrl} alt="Job visual" className="w-full rounded-lg border border-blue-200" />
                      )}
                      <div className="bg-white rounded-lg p-4 border border-blue-200">
                        <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
                          {generatedPost.content}
                        </pre>
                      </div>

                      {/* Share Buttons */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const maxLen = 1300 // LinkedIn post limit
                            const summary = `${generatedPost.content}\n\n${generatedJob?.formUrl ?? ''}`.slice(0, maxLen)
                            const shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(generatedJob?.formUrl ?? '')}&title=${encodeURIComponent(generatedJob?.title ?? '')}&summary=${encodeURIComponent(summary)}&source=${encodeURIComponent(window.location.hostname)}`
                            window.open(shareUrl, '_blank')
                          }}
                          className="border-blue-200 hover:bg-blue-50"
                        >
                          <Linkedin className="w-4 h-4 mr-2" />
                          Share on LinkedIn
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const tweet = `${generatedPost.content} ${generatedJob?.formUrl ?? ''}`
                            const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`
                            window.open(shareUrl, '_blank')
                          }}
                          className="border-blue-200 hover:bg-blue-50"
                        >
                          <Twitter className="w-4 h-4 mr-2" />
                          Share on Twitter
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Create Another Job */}
            <div className="text-center">
              <Button
                onClick={() => {
                  setGeneratedJob(null)
                  setGeneratedPost(null)
                  setJobPrompt("")
                }}
                variant="outline"
                className="border-gray-300 hover:bg-gray-50"
              >
                Create Another Job
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

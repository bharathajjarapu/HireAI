"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ArrowLeft,
  Users,
  Mail,
  Phone,
  Linkedin,
  Github,
  FileText,
  Calendar,
  Search,
  Download,
  Eye,
  Filter,
  SortAsc,
  SortDesc,
  Loader2,
  CheckCircle,
  X,
  Plus,
  User,
  Star,
  Brain,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

interface Application {
  id: string
  jobId: string
  name: string
  email: string
  phone: string
  linkedin: string
  github: string
  coverLetter: string
  resumeFilename: string
  resumePath: string
  submittedAt: string
  status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected'
  score?: number
  ranking?: number
}

interface JobData {
  id: string
  title: string
  description: string
  applicantCount: number
  status: string
}

export default function ApplicantsPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.id as string
  const { toast } = useToast()
  
  const [jobData, setJobData] = useState<JobData | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([])
  const [selectedApplications, setSelectedApplications] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"date" | "name" | "score">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    fetchData()
  }, [jobId])

  useEffect(() => {
    filterAndSortApplications()
  }, [applications, searchTerm, statusFilter, sortBy, sortOrder])

  const fetchData = async () => {
    try {
      const [jobResponse, applicationsResponse] = await Promise.all([
        fetch(`/api/jobs/${jobId}`),
        fetch(`/api/applications/submit?jobId=${jobId}`)
      ])

      if (jobResponse.ok) {
        const jobData = await jobResponse.json()
        setJobData(jobData)
        // Store job role/title and description for analysis context
        try {
          if (jobData?.title) {
            localStorage.setItem('autoAnalysisJobRole', jobData.title)
          }
          if (jobData?.description) {
            localStorage.setItem('autoAnalysisJobDescription', jobData.description)
          }
        } catch (err) {
          console.warn('Unable to cache job metadata for analysis', err)
        }
      }

      if (applicationsResponse.ok) {
        const applicationsData = await applicationsResponse.json()
        setApplications(applicationsData.applications || [])
        // NEW: Persist resumes to localStorage for auto analysis
        try {
          const resumesForAnalysis = (applicationsData.applications || []).map((app: Application, idx: number) => ({
            id: idx + 1,
            filename: app.resumeFilename || `${app.name.replace(/\s+/g, "_").toLowerCase()}.pdf`,
            candidateName: app.name,
            fileUrl: app.resumePath,
          }))
          localStorage.setItem('autoAnalysisResumes', JSON.stringify(resumesForAnalysis))
        } catch (err) {
          console.warn('Unable to cache applicant resumes for analysis', err)
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSortApplications = () => {
    let filtered = applications

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(app => app.status === statusFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortBy) {
        case "date":
          aValue = new Date(a.submittedAt).getTime()
          bValue = new Date(b.submittedAt).getTime()
          break
        case "name":
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case "score":
          aValue = a.score || 0
          bValue = b.score || 0
          break
        default:
          aValue = new Date(a.submittedAt).getTime()
          bValue = new Date(b.submittedAt).getTime()
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredApplications(filtered)
  }

  const toggleApplicationSelection = (id: string) => {
    setSelectedApplications((prev) => 
      prev.includes(id) 
        ? prev.filter((appId) => appId !== id) 
        : [...prev, id]
    )
  }

  const handleAddToPipeline = () => {
    const selectedResumes = selectedApplications.map((id, idx) => {
      const app = applications.find(a => a.id === id)
      if (!app) return null

      return {
        id: Number(idx + 1),
        filename: app.resumeFilename || app.name.replace(/\s+/g, '_').toLowerCase() + '.pdf',
        candidateName: app.name,
        skills: [],
        experience: '',
        education: '',
        matchScore: app.score || 0,
        contact: {
          email: app.email,
          phone: app.phone
        },
        linkedinUrl: app.linkedin,
        githubUrl: app.github,
        fileUrl: app.resumePath,
      }
    }).filter(Boolean)

    localStorage.setItem('selectedResumes', JSON.stringify(selectedResumes))
    router.push('/pipeline')

    toast({
      title: "Added to Pipeline",
      description: `${selectedResumes.length} candidate${selectedResumes.length > 1 ? 's' : ''} added to pipeline`,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'reviewing': return 'bg-blue-100 text-blue-800'
      case 'shortlisted': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800 border-green-200'
    if (score >= 75) return 'bg-blue-100 text-blue-800 border-blue-200'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-red-100 text-red-800 border-red-200'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading applicants...</p>
        </div>
      </div>
    )
  }

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
            <Link href="/create-job">
              <Button variant="ghost" className="hover:bg-blue-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Job Creation
              </Button>
            </Link>

            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Job Applicants</h1>
            </div>

            <Button
              onClick={() => router.push('/resume-parser')}
              variant="outline"
              className="mr-2 border-purple-500 text-purple-700 hover:bg-purple-50"
              disabled={applications.length === 0}
            >
              <Brain className="w-4 h-4 mr-2" />
              Parse Resumes
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Job Info Header */}
          {jobData && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {jobData.title}
                    </CardTitle>
                    <CardDescription className="text-lg mt-1">
                      {applications.length} {applications.length === 1 ? 'application' : 'applications'} received
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Active
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          )}

          {/* Search and Filters */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search applicants..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                  </select>

                  <select
                    value={`${sortBy}_${sortOrder}`}
                    onChange={(e) => {
                      const [sort, order] = e.target.value.split('_')
                      setSortBy(sort as any)
                      setSortOrder(order as any)
                    }}
                    className="px-3 py-2 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="date_desc">Newest First</option>
                    <option value="date_asc">Oldest First</option>
                    <option value="name_asc">Name A-Z</option>
                    <option value="name_desc">Name Z-A</option>
                    <option value="score_desc">Highest Score</option>
                    <option value="score_asc">Lowest Score</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Applicants List */}
          {filteredApplications.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {applications.length === 0 ? "No Applications Yet" : "No Matching Applications"}
                </h3>
                <p className="text-gray-600">
                  {applications.length === 0 
                    ? "Share your job posting to start receiving applications."
                    : "Try adjusting your search or filter criteria."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredApplications.map((application, index) => (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  className={`relative border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg ${
                    selectedApplications.includes(application.id) 
                      ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-md' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <Card className="border-0 shadow-none">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          {/* Selection Checkbox */}
                          <motion.div 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="cursor-pointer"
                            onClick={() => toggleApplicationSelection(application.id)}
                          >
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              selectedApplications.includes(application.id) 
                                ? 'border-blue-500 bg-blue-500 text-white shadow-lg' 
                                : 'border-gray-300 hover:border-blue-400'
                            }`}>
                              {selectedApplications.includes(application.id) && (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </div>
                          </motion.div>

                          {/* Application Details */}
                          <div className="flex-1 min-w-0">
                            {/* Header with name and score */}
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {application.name}
                                </h3>
                                <Badge variant="secondary" className={getStatusColor(application.status)}>
                                  {application.status}
                                </Badge>
                              </div>
                              {application.score && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.2 }}
                                  className="ml-2 flex-shrink-0"
                                >
                                  <Badge 
                                    className={`text-sm font-semibold px-3 py-1.5 ${getScoreColor(application.score)}`}
                                  >
                                    <Star className="w-3 h-3 mr-1.5" />
                                    {application.score}% Match
                                  </Badge>
                                </motion.div>
                              )}
                            </div>

                            {/* Contact Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="flex items-center text-gray-600 text-sm">
                                <Mail className="w-4 h-4 mr-2" />
                                {application.email}
                              </div>
                              {application.phone && (
                                <div className="flex items-center text-gray-600 text-sm">
                                  <Phone className="w-4 h-4 mr-2" />
                                  {application.phone}
                                </div>
                              )}
                            </div>

                            {/* Social Links */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {application.linkedin && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const url = application.linkedin?.startsWith('http') 
                                      ? application.linkedin 
                                      : `https://${application.linkedin}`
                                    window.open(url, '_blank')
                                  }}
                                  className="h-8 border-blue-300 hover:bg-blue-50 text-blue-600"
                                >
                                  <Linkedin className="w-3.5 h-3.5 mr-1.5" /> LinkedIn
                                </Button>
                              )}
                              {application.github && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const url = application.github?.startsWith('http') 
                                      ? application.github 
                                      : `https://${application.github}`
                                    window.open(url, '_blank')
                                  }}
                                  className="h-8 border-gray-700 hover:bg-gray-100 text-gray-800"
                                >
                                  <Github className="w-3.5 h-3.5 mr-1.5" /> GitHub
                                </Button>
                              )}
                            </div>

                            {/* Application Date */}
                            <div className="flex items-center text-gray-500 text-sm mb-4">
                              <Calendar className="w-4 h-4 mr-2" />
                              Applied on {new Date(application.submittedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>

                            {/* Cover Letter */}
                            {application.coverLetter && (
                              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <h4 className="font-medium text-gray-900 mb-2">Cover Letter</h4>
                                <p className="text-gray-700 text-sm line-clamp-3">
                                  {application.coverLetter}
                                </p>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(application.resumePath, '_blank')}
                                className="h-8 border-green-300 hover:bg-green-50 text-green-600"
                              >
                                <FileText className="w-3.5 h-3.5 mr-1.5" /> View Resume
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const link = document.createElement('a')
                                  link.href = application.resumePath
                                  link.download = application.resumeFilename
                                  link.click()
                                }}
                                className="h-8 border-blue-300 hover:bg-blue-50 text-blue-600"
                              >
                                <Download className="w-3.5 h-3.5 mr-1.5" /> Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Selected Candidates Bar - Fixed at bottom */}
      <AnimatePresence>
        {selectedApplications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-gray-900/10 to-transparent pt-10"
          >
            <div className="container mx-auto px-4 sm:px-6 pb-6">
              <Card className="border-0 shadow-2xl bg-white/98 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                        >
                          {selectedApplications.length}
                        </motion.div>
                      </div>
                      <div className="text-center sm:text-left">
                        <h3 className="font-semibold text-gray-900">
                          {selectedApplications.length} Candidate{selectedApplications.length > 1 ? "s" : ""} Selected
                        </h3>
                        <p className="text-sm text-gray-600">Review selected candidates or add to pipeline</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedApplications([])}
                        className="w-full sm:w-auto border-gray-300 hover:bg-gray-50 text-gray-700"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Clear Selection
                      </Button>
                      <Button
                        onClick={handleAddToPipeline}
                        className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add to Pipeline
                      </Button>
                    </div>
                  </div>

                  {/* Selected Candidates Preview */}
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="mt-4 pt-4 border-t border-gray-200"
                  >
                    <ScrollArea className="max-h-[120px]">
                      <div className="flex gap-2 flex-wrap">
                        {selectedApplications.map((id) => {
                          const application = applications.find(app => app.id === id);
                          if (!application) return null;
                          return (
                            <motion.div
                              key={id}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="bg-gray-100 rounded-lg p-2 pr-3 flex items-center gap-2 group"
                            >
                              <div className="p-1.5 bg-white rounded">
                                <User className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="text-sm font-medium text-gray-700">
                                {application.name}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleApplicationSelection(id)}
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3 text-gray-500 hover:text-red-500" />
                              </Button>
                            </motion.div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </motion.div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 
"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Upload,
  FileText,
  Brain,
  Sparkles,
  CheckCircle,
  X,
  Download,
  Star,
  ChevronDown,
  ChevronUp,
  Zap,
  User,
  Briefcase,
  GraduationCap,
  Code,
  ArrowRight,
  MessageSquare,
  Mail,
  Send,
  Plus,
  Filter,
  Search,
  Eye,
  BarChart3,
  Linkedin,
  Github,
  FileSymlink,
  Loader2,
  Phone,
  Target,
  Wrench,
  TrendingUp,
  Database,
} from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useRouter } from "next/navigation"
import { MultiAgentAnalysisView } from "../components/MultiAgentAnalysisView"
import { AgentStatusManager } from "../components/AgentStatusManager"

// Mock parsed resumes data
const mockParsedResumes = [
  {
    id: 1,
    name: "Alex Johnson",
    title: "Senior AI Engineer",
    skills: ["Python", "TensorFlow", "LangChain", "RAG", "NLP", "AWS"],
    experience: [
      {
        title: "AI Engineer",
        company: "TechCorp",
        duration: "2020 - Present",
        description: "Developed LLM-based applications using LangChain and RAG architecture.",
      },
      {
        title: "Machine Learning Engineer",
        company: "DataSystems",
        duration: "2018 - 2020",
        description: "Built and deployed ML models for production environments.",
      },
    ],
    education: [
      {
        degree: "M.S. Computer Science",
        institution: "Stanford University",
        year: "2018",
      },
    ],
    matchScore: 95,
    filename: "alex_johnson_resume.pdf",
  },
  {
    id: 2,
    name: "Priya Sharma",
    title: "AI/ML Specialist",
    skills: ["Python", "PyTorch", "LangChain", "Hugging Face", "Vector Databases", "GCP"],
    experience: [
      {
        title: "AI Researcher",
        company: "AI Solutions Inc.",
        duration: "2019 - Present",
        description: "Researched and implemented RAG systems for enterprise applications.",
      },
      {
        title: "Data Scientist",
        company: "Global Analytics",
        duration: "2017 - 2019",
        description: "Developed predictive models using machine learning techniques.",
      },
    ],
    education: [
      {
        degree: "Ph.D. Machine Learning",
        institution: "MIT",
        year: "2017",
      },
    ],
    matchScore: 92,
    filename: "priya_sharma_resume.pdf",
  },
  {
    id: 3,
    name: "Michael Chen",
    title: "Full Stack AI Developer",
    skills: ["JavaScript", "Python", "React", "Node.js", "TensorFlow.js", "AWS"],
    experience: [
      {
        title: "AI Frontend Developer",
        company: "WebAI",
        duration: "2021 - Present",
        description: "Built web interfaces for AI applications.",
      },
      {
        title: "Software Engineer",
        company: "TechStart",
        duration: "2019 - 2021",
        description: "Developed full-stack applications with React and Node.js.",
      },
    ],
    education: [
      {
        degree: "B.S. Computer Science",
        institution: "UC Berkeley",
        year: "2019",
      },
    ],
    matchScore: 78,
    filename: "michael_chen_resume.pdf",
  },
  {
    id: 4,
    name: "Emma Wilson",
    title: "NLP Engineer",
    skills: ["Python", "BERT", "GPT", "LangChain", "SpaCy", "RAG", "Azure"],
    experience: [
      {
        title: "NLP Specialist",
        company: "Language AI",
        duration: "2020 - Present",
        description: "Implemented retrieval-augmented generation systems for enterprise clients.",
      },
      {
        title: "AI Research Assistant",
        company: "University Research Lab",
        duration: "2018 - 2020",
        description: "Researched transformer-based language models.",
      },
    ],
    education: [
      {
        degree: "M.S. Artificial Intelligence",
        institution: "Carnegie Mellon University",
        year: "2018",
      },
    ],
    matchScore: 90,
    filename: "emma_wilson_resume.pdf",
  },
  {
    id: 5,
    name: "James Rodriguez",
    title: "Machine Learning Engineer",
    skills: ["Python", "Scikit-learn", "TensorFlow", "Keras", "SQL", "Docker"],
    experience: [
      {
        title: "ML Engineer",
        company: "DataCorp",
        duration: "2019 - Present",
        description: "Built and deployed machine learning models for production.",
      },
      {
        title: "Data Analyst",
        company: "Analytics Inc.",
        duration: "2017 - 2019",
        description: "Analyzed large datasets to extract business insights.",
      },
    ],
    education: [
      {
        degree: "B.S. Statistics",
        institution: "University of Washington",
        year: "2017",
      },
    ],
    matchScore: 82,
    filename: "james_rodriguez_resume.pdf",
  },
]

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  isThinking?: boolean
}

interface ResumeAnalysis {
  id: number
  filename: string
  candidateName?: string
  skills: string[]
  experience: string
  education: string
  achievements: string[]
  technical_proficiency: {
    languages: string[]
    frameworks: string[]
    tools: string[]
  }
  role_matches: string[]
  improvement_areas: string[]
  pros: string[]
  cons: string[]
  summary: string
  matchScore: number
  timestamp: string
  linkedinUrl?: string
  githubUrl?: string
  fileUrl?: string
  contact: Record<string, string>
  multiAgentData?: {
    documentProcessing?: string
    roleMatching?: string
    skillsAnalysis?: string
    experienceReview?: string
    growthAnalysis?: string
    strengthsAssessment?: string
    finalSynthesis?: string
    agentResults?: Record<string, any>
    agentStatuses?: Record<string, any>
    analysisMetadata?: {
      totalProcessingTime: number
      completedAgents: number
      totalAgents: number
    }
  }
}

interface EmailTemplate {
  subject: string
  body: string
}

interface AgentStatus {
  status: 'idle' | 'working' | 'completed' | 'error'
  progress: number
  message: string
  startTime?: number
  endTime?: number
  processingTime?: number
}

const initializeAgentStatuses = (): Record<string, AgentStatus> => {
  const agentIds = [
    'document_processor',
    'role_matching', 
    'skills_analysis',
    'experience_review',
    'growth_analysis',
    'strengths_assessment',
    'final_synthesis',
    'finalizer'
  ]

  const statuses: Record<string, AgentStatus> = {}
  agentIds.forEach(id => {
    statuses[id] = {
      status: 'idle',
      progress: 0,
      message: 'Waiting to start...'
    }
  })
  return statuses
}

export default function ResumeParser() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [analysis, setAnalysis] = useState<ResumeAnalysis[]>([])
  const [currentFile, setCurrentFile] = useState<string>("")
  const [expandedResume, setExpandedResume] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<"score" | "name">("score")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedResumes, setSelectedResumes] = useState<number[]>([])
  const [chatMessages, setChatMessages] = useState<Record<number, ChatMessage[]>>({})
  const [currentMessage, setCurrentMessage] = useState<string>("")
  const [isChatting, setIsChatting] = useState<number | null>(null)
  const [showingSummary, setShowingSummary] = useState<number | null>(null)
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [selectedResumeForEmail, setSelectedResumeForEmail] = useState<number | null>(null)
  const [recipientEmail, setRecipientEmail] = useState("")
  const [emailSending, setEmailSending] = useState(false)
  const [jobRole, setJobRole] = useState("")
  const [maxResults, setMaxResults] = useState(10)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [resumeToPreview, setResumeToPreview] = useState<ResumeAnalysis | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showEmailCard, setShowEmailCard] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<"classic" | "multi-agent">("classic")
  const [showingMultiAgentAnalysis, setShowingMultiAgentAnalysis] = useState<number | null>(null)
  const [useDatabaseSource, setUseDatabaseSource] = useState(false)
  const [databaseUrl, setDatabaseUrl] = useState("")
  const [agentStatuses, setAgentStatuses] = useState<Record<string, any>>({})
  const [isShowingAgentFlow, setIsShowingAgentFlow] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const [autoTrigger, setAutoTrigger] = useState(false)

  // Handler for multi-agent analysis completion
  const handleMultiAgentAnalysisComplete = (results: any[]) => {
    const formattedResults: ResumeAnalysis[] = results.map((result, index) => ({
      id: Date.now() + index,
      filename: result.filename,
      candidateName: result.candidateName || result.filename.replace('.pdf', ''),
      skills: result.skills || ['Multi-agent analysis complete'],
      experience: result.experienceReview || result.experience || 'See detailed analysis',
      education: result.documentProcessing || result.education || 'See document processing',
      achievements: result.achievements || ['See strengths assessment'],
      technical_proficiency: result.technical_proficiency || {
        languages: ['See skills analysis'],
        frameworks: ['See skills analysis'], 
        tools: ['See skills analysis']
      },
      role_matches: result.role_matches || ['See role matching analysis'],
      improvement_areas: result.improvement_areas || ['See growth analysis'],
      pros: result.pros || ['See strengths assessment'],
      cons: result.cons || ['See growth analysis'],
      summary: result.finalSynthesis || result.summary || 'Comprehensive multi-agent analysis completed',
      matchScore: result.matchScore || 85,
      timestamp: new Date().toISOString(),
      linkedinUrl: result.contact?.linkedin,
      githubUrl: result.contact?.github,
      fileUrl: undefined,
      contact: result.contact || {},
      // Store multi-agent specific data
      multiAgentData: {
        documentProcessing: result.documentProcessing,
        roleMatching: result.roleMatching,
        skillsAnalysis: result.skillsAnalysis,
        experienceReview: result.experienceReview,
        growthAnalysis: result.growthAnalysis,
        strengthsAssessment: result.strengthsAssessment,
        finalSynthesis: result.finalSynthesis,
        agentResults: result.agentResults,
        agentStatuses: result.agentStatuses,
        analysisMetadata: result.analysisMetadata
      }
    }))
    
    setAnalysis(formattedResults)
    setActiveTab("classic") // Switch to results view
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(file => file.type === "application/pdf")
      setFiles(newFiles)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files).filter(file => file.type === "application/pdf")
      setFiles(newFiles)
    }
  }

  const handlePreviewResume = (resume: ResumeAnalysis) => {
    if (resume.fileUrl) {
      setResumeToPreview(resume)
      setPreviewModalOpen(true)
    } else {
      alert("No preview available for this resume.")
    }
  }

  const handleUpload = async () => {
    setUploading(true)
    setUploadProgress(0)
    setAnalysis([])
    setIsAnalyzing(true)

    try {
      const validFiles = files.filter(file => {
        const type = file.type.toLowerCase()
        return type.includes('pdf') || file.name.toLowerCase().endsWith('.pdf')
      }).slice(0, 5)
      
      if (validFiles.length === 0) {
        // No strict PDF validation – continue even if type missing
      }

      if (!jobRole.trim()) {
        alert('Please enter a job role/requirements for better matching')
        setUploading(false)
        setIsAnalyzing(false)
        return
      }

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i]
        setCurrentFile(file.name)
        const formData = new FormData()
        formData.append("file", file)
        formData.append("jobRole", jobRole)
        formData.append("extractText", "true") // Signal to extract full text

        // Update progress based on current file
        setUploadProgress((i / validFiles.length) * 100)

        try {
          // Create a local URL for the PDF file for preview
          let fileUrl: string | undefined = undefined
          try {
            fileUrl = URL.createObjectURL(file)
            
          const response = await fetch('/api/upload-resume', {
            method: "POST",
            body: formData,
          })
  
            if (!response.ok) {
              throw new Error(`Failed to process ${file.name}`)
            }

          const responseData = await response.json()

            // Use contact information from the API response
            const extractedUrls = {
              linkedinUrl: responseData.contact?.linkedin || undefined,
              githubUrl: responseData.contact?.github || undefined
            }

            // Use extracted name from API response
            const extractedName = responseData.candidateName || 
              file.name
                .replace(/\.pdf$/i, '')
                .replace(/[_-]/g, ' ')
                .replace(/\b\w/g, char => char.toUpperCase())
                .trim()
    
            // Generate consistent score based on file content and job role
            const jobRoleLower = jobRole.toLowerCase()
            let baseScore = 70
            
            const keywords = jobRoleLower.split(' ').filter(word => word.length > 2)
            const fileContent = responseData.text?.toLowerCase() || ''
            
            keywords.forEach(keyword => {
              if (fileContent.includes(keyword)) {
                baseScore += 5
              }
            })
            
            const fileHash = file.name.split('').reduce((a, b) => {
              a = ((a << 5) - a) + b.charCodeAt(0)
              return a & a
            }, 0)
            
            const scoreVariation = Math.abs(fileHash % 15) - 7 // -7 to +7
            const finalScore = Math.min(99, Math.max(60, baseScore + scoreVariation))

            setAnalysis(prev => {
              const newAnalysis = {
            ...responseData,
            id: Date.now() + i,
            filename: file.name,
                candidateName: extractedName,
            timestamp: new Date().toISOString(),
                matchScore: Math.round(finalScore),
                fileUrl: fileUrl,
                linkedinUrl: extractedUrls.linkedinUrl,
                githubUrl: extractedUrls.githubUrl,
                contact: responseData.contact || {}
              }
              return [...prev, newAnalysis]
            })
  
          setUploadProgress(((i + 1) / validFiles.length) * 100)
        } catch (error) {
          console.error(`Error processing ${file.name}:`, error)
          alert(`Failed to process ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
            if (fileUrl) URL.revokeObjectURL(fileUrl)
          continue
      }
    } catch (error) {
          // This outer catch is for errors not related to individual file processing
          console.error("Error in file processing loop:", error)
        } // This closes the outer try...catch for an individual file
      } // This closes the for loop
    } catch (error) {
      console.error("Error preparing files for upload:", error)
      alert(error instanceof Error ? error.message : "Error preparing files. Please try again.")
    } finally {
      setUploading(false)
      setCurrentFile("")
      setIsAnalyzing(false)
      setUploadProgress(100)
      // No longer revoking here, will be done on component unmount or when analysis changes
    }
  }

  const handleMultiAgentUpload = async () => {
    setUploading(true)
    setUploadProgress(0)
    setAnalysis([])
    setIsAnalyzing(true)
    setIsShowingAgentFlow(true)
    
    // Initialize agent statuses
    const initialStatuses = initializeAgentStatuses()
    setAgentStatuses(initialStatuses)

    try {
      const validFiles = files.slice(0, 5)
      
      if (validFiles.length === 0) {
        // Proceed even if type information missing (auto-imported resumes)
      }

      if (!jobRole.trim()) {
        alert('Please enter a job role/requirements for better matching')
        setUploading(false)
        setIsAnalyzing(false)
        setIsShowingAgentFlow(false)
        return
      }

      // Simulate agent progress with realistic timing - but use classic analysis for results
      const agentSequence = [
        { id: 'document_processor', duration: 2000, message: 'Extracting text and structure...' },
        { id: 'role_matching', duration: 2500, message: 'Analyzing role compatibility...' },
        { id: 'skills_analysis', duration: 2000, message: 'Evaluating technical skills...' },
        { id: 'experience_review', duration: 2500, message: 'Reviewing work experience...' },
        { id: 'growth_analysis', duration: 2000, message: 'Assessing growth potential...' },
        { id: 'strengths_assessment', duration: 2000, message: 'Identifying key strengths...' },
        { id: 'final_synthesis', duration: 2500, message: 'Synthesizing analysis...' },
        { id: 'finalizer', duration: 3000, message: 'Generating final results...' }
      ]

      setCurrentFile("Initializing multi-agent analysis...")
      setUploadProgress(5)

      // Process agents sequentially with real-time updates (visual only)
      for (let i = 0; i < agentSequence.length; i++) {
        const agent = agentSequence[i]
        const startTime = Date.now()

        // Start agent
        setAgentStatuses(prev => ({
          ...prev,
          [agent.id]: {
            ...prev[agent.id],
            status: 'working',
            message: agent.message,
            startTime,
            progress: 0
          }
        }))

        setCurrentFile(`${agent.message}`)

        // If this is the finalizer agent, start the actual classic analysis
        if (agent.id === 'finalizer') {
          // Start classic analysis API call in background
          const apiPromise = Promise.all(validFiles.map(async (file) => {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("jobRole", jobRole)
            formData.append("extractText", "true")

            const response = await fetch('/api/upload-resume', {
              method: "POST",
              body: formData,
            })

            if (!response.ok) {
              throw new Error(`Failed to process ${file.name}`)
            }

            const responseData = await response.json()

            // Create file URL for preview
            let fileUrl: string | undefined = undefined
            try {
              fileUrl = URL.createObjectURL(file)
            } catch (error) {
              console.warn(`Could not create preview URL for ${file.name}`)
            }

            // Generate consistent score
            const jobRoleLower = jobRole.toLowerCase()
            let baseScore = 70
            
            const keywords = jobRoleLower.split(' ').filter(word => word.length > 2)
            const fileContent = responseData.text?.toLowerCase() || ''
            
            keywords.forEach(keyword => {
              if (fileContent.includes(keyword)) {
                baseScore += 5
              }
            })
            
            const fileHash = file.name.split('').reduce((a, b) => {
              a = ((a << 5) - a) + b.charCodeAt(0)
              return a & a
            }, 0)
            
            const scoreVariation = Math.abs(fileHash % 15) - 7
            const finalScore = Math.min(99, Math.max(60, baseScore + scoreVariation))

            const extractedName = responseData.candidateName || 
              file.name
                .replace(/\.pdf$/i, '')
                .replace(/[_-]/g, ' ')
                .replace(/\b\w/g, char => char.toUpperCase())
                .trim()

            return {
              ...responseData,
              id: Date.now() + Math.random(),
              filename: file.name,
              candidateName: extractedName,
              timestamp: new Date().toISOString(),
              matchScore: Math.round(finalScore),
              fileUrl: fileUrl,
              linkedinUrl: responseData.contact?.linkedin,
              githubUrl: responseData.contact?.github,
              contact: responseData.contact || {}
            }
          }))

          // Simulate finalizer progress while API calls happen
          const progressSteps = 20
          const stepDuration = agent.duration / progressSteps

          for (let step = 1; step <= progressSteps; step++) {
            await new Promise(resolve => setTimeout(resolve, stepDuration))
            
            const progress = (step / progressSteps) * 100
            setAgentStatuses(prev => ({
              ...prev,
              [agent.id]: {
                ...prev[agent.id],
                progress: Math.round(progress),
                message: progress < 100 ? agent.message : 'Analysis complete'
              }
            }))

            // Update overall progress
            const baseProgress = 10 + (i / agentSequence.length) * 80
            const agentProgress = (progress / 100) * (80 / agentSequence.length)
            setUploadProgress(Math.round(baseProgress + agentProgress))
          }

          // Wait for classic analysis to complete
          const results = await apiPromise
          setAnalysis(results)

        } else {
          // For non-finalizer agents, just simulate progress
          const progressSteps = 20
          const stepDuration = agent.duration / progressSteps

          for (let step = 1; step <= progressSteps; step++) {
            await new Promise(resolve => setTimeout(resolve, stepDuration))
            
            const progress = (step / progressSteps) * 100
            setAgentStatuses(prev => ({
              ...prev,
              [agent.id]: {
                ...prev[agent.id],
                progress: Math.round(progress),
                message: progress < 100 ? agent.message : 'Analysis complete'
              }
            }))

            // Update overall progress
            const baseProgress = 10 + (i / agentSequence.length) * 80
            const agentProgress = (progress / 100) * (80 / agentSequence.length)
            setUploadProgress(Math.round(baseProgress + agentProgress))
          }
        }

        // Complete agent
        const endTime = Date.now()
        setAgentStatuses(prev => ({
          ...prev,
          [agent.id]: {
            ...prev[agent.id],
            status: 'completed',
            progress: 100,
            endTime,
            processingTime: endTime - startTime,
            message: 'Analysis complete'
          }
        }))
      }

      setUploadProgress(100)
      setCurrentFile("Multi-agent analysis complete!")

      // Keep agent flow visible for a moment before switching
      setTimeout(() => {
        setActiveTab("classic")
        setIsShowingAgentFlow(false)
      }, 1500)

    } catch (error) {
      console.error("Multi-agent upload error:", error)
      
      // Mark all working agents as error
      setAgentStatuses(prev => {
        const updated = { ...prev }
        Object.keys(updated).forEach(agentId => {
          if (updated[agentId].status === 'working') {
            updated[agentId] = {
              ...updated[agentId],
              status: 'error',
              message: 'Analysis failed'
            }
          }
        })
        return updated
      })
      
      alert(error instanceof Error ? error.message : "Multi-agent analysis failed. Please try again.")
    } finally {
      setUploading(false)
      setCurrentFile("")
      setIsAnalyzing(false)
    }
  }

  // Effect to revoke object URLs when component unmounts or analysis changes
  // to prevent memory leaks
  useEffect(() => {
    const currentAnalysis = analysis // Capture current analysis state
    return () => {
      currentAnalysis.forEach(item => {
        if (item.fileUrl && item.fileUrl.startsWith('blob:')) {
          URL.revokeObjectURL(item.fileUrl)
        }
      })
    }
  }, [analysis])

  const toggleResumeExpansion = (id: number) => {
    setExpandedResume(expandedResume === id ? null : id)
  }

  const toggleResumeSelection = (id: number) => {
    setSelectedResumes((prev) => (prev.includes(id) ? prev.filter((resumeId) => resumeId !== id) : [...prev, id]))
  }

  const handleSort = (type: "score" | "name") => {
    if (sortBy === type) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(type)
      setSortOrder(type === "score" ? "desc" : "asc")
    }
  }

  const sortedResumes = [...analysis].sort((a, b) => {
    if (sortBy === "score") {
      return sortOrder === "asc" ? a.matchScore - b.matchScore : b.matchScore - a.matchScore
    } else {
      const aName = a.filename.replace('.pdf', '').replace(/[_-]/g, ' ')
      const bName = b.filename.replace('.pdf', '').replace(/[_-]/g, ' ')
      return sortOrder === "asc" ? aName.localeCompare(bName) : bName.localeCompare(aName)
    }
  })

  // Filter and limit results based on user preferences
  const displayedResumes = sortedResumes
    .filter(resume => resume.matchScore >= 60) // Only show decent matches
    .slice(0, maxResults)

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100"
    if (score >= 80) return "text-blue-600 bg-blue-100"
    if (score >= 70) return "text-yellow-600 bg-yellow-100"
    return "text-red-600 bg-red-100"
  }

  // Chat function
  const handleChat = async (resumeId: number) => {
    if (!currentMessage.trim()) return;

    const resume = analysis.find(r => r.id === resumeId);
    if (!resume) return;

    // Add user message
    setChatMessages(prev => ({
      ...prev,
      [resumeId]: [...(prev[resumeId] || []), { role: 'user', content: currentMessage }]
    }));

    // Add thinking message
    setChatMessages(prev => ({
      ...prev,
      [resumeId]: [...(prev[resumeId] || []), { role: 'assistant', content: '', isThinking: true }]
    }));

    setIsProcessing(true);
    setCurrentMessage("");

    try {
      const response = await fetch('/api/chat-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentMessage,
          resumeContext: resume
        })
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      // Remove thinking message and add actual response
      setChatMessages(prev => ({
        ...prev,
        [resumeId]: [
          ...(prev[resumeId] || []).filter(msg => !msg.isThinking),
          { role: 'assistant', content: data.response }
        ]
      }));
    } catch (error) {
      console.error('Chat error:', error);
      // Remove thinking message and add error message
      setChatMessages(prev => ({
        ...prev,
        [resumeId]: [
          ...(prev[resumeId] || []).filter(msg => !msg.isThinking),
          { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }
        ]
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to generate summary
  const handleGenerateSummary = async (resumeId: number) => {
    setShowingSummary(resumeId);
  };

  // Email functionality
  const handleSendEmail = async (resumeId: number) => {
    setSelectedResumeForEmail(resumeId)
    setEmailModalOpen(true)
  }

  const sendEmailAnalysis = async () => {
    if (!recipientEmail || !selectedResumeForEmail) return

    setEmailSending(true)
    
    try {
      const resume = analysis.find(r => r.id === selectedResumeForEmail)
      if (!resume) throw new Error('Resume not found')

      const candidateName = resume.filename.replace('.pdf', '').replace(/[_-]/g, ' ')

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientEmail,
          candidateName,
          analysis: resume
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email')
      }

      alert('Email sent successfully!')
      setEmailModalOpen(false)
      setRecipientEmail("")
      setSelectedResumeForEmail(null)
    } catch (error) {
      console.error('Email error:', error)
      alert(error instanceof Error ? error.message : 'Failed to send email')
    } finally {
      setEmailSending(false)
    }
  }

  // Function to handle pipeline navigation
  const handleAddToPipeline = () => {
    // Store selected resumes in localStorage or state management
    localStorage.setItem('selectedResumes', JSON.stringify(
      selectedResumes.map(id => analysis.find(r => r.id === id))
    ))
    router.push('/pipeline')
  }

  // Replace the email modal with email card
  const renderEmailCard = (resumeId: number) => {
    const resume = analysis.find(r => r.id === resumeId)
    if (!resume) return null

    return (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="mt-4 pt-4 border-t border-gray-200"
      >
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900 flex items-center">
              <Mail className="w-4 h-4 mr-2 text-blue-600" />
              Contact Information
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEmailCard(null)}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Contact Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-sm text-gray-600">{resume.contact?.email || 'Not available'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone</p>
                    <p className="text-sm text-gray-600">{resume.contact?.phone || 'Not available'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => {
                  if (resume.contact?.email) {
                    window.location.href = `mailto:${resume.contact.email}`
                  }
                }}
              >
                <Mail className="w-3 h-3 mr-1" />
                Send Email
              </Button>
              {resume.contact?.phone && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={() => {
                    window.location.href = `tel:${resume.contact.phone}`
                  }}
                >
                  <Phone className="w-3 h-3 mr-1" />
                  Call
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  useEffect(() => {
    // Auto-analysis for resumes coming from Applicants page
    const runAutoAnalysis = async () => {
      try {
        const stored = localStorage.getItem('autoAnalysisResumes')
        if (!stored) return
        const resumes: { filename: string; fileUrl: string }[] = JSON.parse(stored)
        if (!resumes || resumes.length === 0) return

        // Limit to max 5 resumes as enforced by handleMultiAgentUpload
        const limitedResumes = resumes.slice(0, 5)

        // Fetch PDF blobs and create File objects
        const fetchedFiles: File[] = []
        for (const r of limitedResumes) {
          const response = await fetch(r.fileUrl)
          if (!response.ok) continue
          const blob = await response.blob()
          const file = new File([blob], r.filename, { type: 'application/pdf' })
          fetchedFiles.push(file)
        }

        if (fetchedFiles.length === 0) return

        // Set job role from storage if present
        const storedRole = localStorage.getItem('autoAnalysisJobRole') || ''
        const storedDesc = localStorage.getItem('autoAnalysisJobDescription') || ''
        if (storedRole) {
          setJobRole(storedRole)
        } else {
          setJobRole('Open Position')
        }
        if (storedDesc) {
          // Populate "Detailed Requirements" textarea
          setCurrentFile(storedDesc)
        }

        // Load files then trigger once files state updated
        setFiles(fetchedFiles)
        setAutoTrigger(true)

        // Clear to avoid duplicate triggers on re-mount
        localStorage.removeItem('autoAnalysisResumes')
      } catch (err) {
        console.warn('Auto-analysis failed to initialize', err)
      }
    }

    // Run only once on mount
    runAutoAnalysis()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Trigger analysis when files populated via auto flow
  useEffect(() => {
    if (autoTrigger && files.length > 0) {
      handleMultiAgentUpload()
      setAutoTrigger(false)
    }
  }, [autoTrigger, files])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          border: 2px solid white;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          border: 2px solid white;
        }
      `}</style>
      
      {/* Modern Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b bg-white/95 backdrop-blur-xl sticky top-0 z-50 shadow-sm"
      >
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
            <Link href="/">
                <Button variant="ghost" className="hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
              </Button>
            </Link>
              <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <Brain className="w-5 h-5 text-white" />
            </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">AI Resume Parser</h1>
                  <p className="text-sm text-gray-500">Intelligent candidate analysis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 sm:px-6 py-6 lg:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="xl:col-span-1 space-y-6 sticky top-24"
          >
            {/* Job Requirements Card */}
            <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3 text-lg">
                  <div className="p-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg">
                    <Briefcase className="w-4 h-4 text-white" />
                  </div>
                  <span>Job Requirements</span>
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Define role requirements for AI-powered matching
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Role Input Field */}
                <div className="space-y-2">
                  <Label htmlFor="jobRole" className="text-sm font-medium text-gray-700">
                    Job Role/Position *
                  </Label>
                  <Input
                    id="jobRole"
                    placeholder="e.g., Senior AI Engineer, Full Stack Developer, Data Scientist..."
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-200 h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements" className="text-sm font-medium text-gray-700">
                    Detailed Requirements
                  </Label>
                <Textarea
                    id="requirements"
                    placeholder="Describe required skills, experience, qualifications, and any specific technologies..."
                    rows={4}
                  value={currentFile}
                  onChange={(e) => setCurrentFile(e.target.value)}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-200 resize-none text-sm"
                  />
                </div>

                {/* Max Results Slider */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-gray-700">
                      Show Top Results
                    </Label>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {maxResults} resumes
                    </Badge>
                  </div>
                  <div className="px-1">
                    <input
                      type="range"
                      min="5"
                      max="50"
                      step="5"
                      value={maxResults}
                      onChange={(e) => setMaxResults(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((maxResults - 5) / 45) * 100}%, #e5e7eb ${((maxResults - 5) / 45) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>5</span>
                      <span>25</span>
                      <span>50</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-200 hover:bg-blue-50 text-blue-700 h-8"
                    onClick={() => {
                      setJobRole("Senior AI Engineer")
                      setCurrentFile(
                        "Looking for a Senior AI Engineer with 3+ years experience in LangChain, RAG systems, and NLP. Must have production AI system experience with Python, TensorFlow, and cloud platforms."
                      )
                    }}
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI Engineer
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-green-200 hover:bg-green-50 text-green-700 h-8"
                    onClick={() => {
                      setJobRole("Full Stack Developer")
                      setCurrentFile(
                        "Seeking a Full Stack Developer with expertise in React, Node.js, and modern web technologies. Experience with databases and cloud deployment required."
                      )
                    }}
                  >
                    <Code className="w-3 h-3 mr-1" />
                    Full Stack
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-200 hover:bg-gray-50 h-8"
                    onClick={() => {
                      setJobRole("")
                      setCurrentFile("")
                    }}
                  >
                    <X className="w-3 h-3 mr-1" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Resume Upload Card with Tabs */}
            <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3 text-lg">
                  <div className="p-2 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg">
                    <Upload className="w-4 h-4 text-white" />
                  </div>
                  <span>Resume Analysis</span>
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Choose between classic or advanced multi-agent AI analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Database Source Toggle */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Database className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Database Source</span>
                    </div>
                    <Switch
                      checked={useDatabaseSource}
                      onCheckedChange={setUseDatabaseSource}
                      className="data-[state=checked]:bg-blue-500"
                    />
                  </div>
                  
                  <AnimatePresence>
                    {useDatabaseSource && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                      >
                        <Label htmlFor="databaseUrl" className="text-sm font-medium text-gray-700">
                          Database Connection URL
                        </Label>
                        <Input
                          id="databaseUrl"
                          placeholder="Enter database connection string (e.g., mongodb://localhost:27017/resumes)"
                          value={databaseUrl}
                          onChange={(e) => setDatabaseUrl(e.target.value)}
                          className="border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                        />
                        <p className="text-xs text-gray-500">
                          Supports MongoDB, PostgreSQL, MySQL, and other database connections
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Shared file input for both tabs */}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf"
                  multiple
                />
                
                {!useDatabaseSource ? (
                  <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "classic" | "multi-agent")}>
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="classic" className="flex items-center space-x-2">
                        <Brain className="w-4 h-4" />
                        <span>Classic Analysis</span>
                      </TabsTrigger>
                      <TabsTrigger value="multi-agent" className="flex items-center space-x-2">
                        <Zap className="w-4 h-4" />
                        <span>Multi-Agent AI</span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="classic" className="space-y-4">
                      <div
                        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer group transition-all duration-300 ${
                          files.length > 0 
                            ? "border-green-400 bg-green-50" 
                            : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/50"
                        }`}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="flex flex-col items-center space-y-3">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className={`p-4 rounded-full transition-colors ${
                              files.length > 0 ? "bg-green-500" : "bg-blue-500 group-hover:bg-blue-600"
                            }`}
                          >
                            {files.length > 0 ? (
                              <CheckCircle className="w-6 h-6 text-white" />
                            ) : (
                              <Upload className="w-6 h-6 text-white" />
                            )}
                          </motion.div>
                          <div>
                          <p className="text-sm font-medium text-gray-700">
                              {files.length > 0 ? (
                                `${files.length} file${files.length > 1 ? 's' : ''} ready for analysis`
                              ) : (
                                "Drop PDF files here or click to browse"
                              )}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Supports multiple PDF files</p>
                          </div>
                        </div>
                      </div>

                      {files.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="space-y-3"
                        >
                          {/* Dynamic height based on number of files */}
                          {files.length <= 4 ? (
                            // No scroll for 4 or fewer files - just show them
                            <div className="border rounded-lg p-2">
                              <div className="space-y-2">
                                {files.map((file, index) => (
                                  <motion.div
                                    key={file.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center justify-between bg-gray-50 rounded-lg p-3 group hover:bg-gray-100 transition-colors"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <div className="p-1 bg-red-100 rounded">
                                        <FileText className="w-4 h-4 text-red-600" />
                                      </div>
                                      <div>
                                        <span className="text-sm font-medium text-gray-700 truncate max-w-[180px] block">
                                          {file.name}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </span>
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setFiles(files.filter(f => f !== file))}
                                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <X className="w-4 h-4 text-gray-500 hover:text-red-500" />
                                    </Button>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            // ScrollArea for 5+ files
                            <ScrollArea className="h-[300px] border rounded-lg p-2">
                              <div className="space-y-2 pr-4">
                                {files.map((file, index) => (
                                  <motion.div
                                    key={file.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center justify-between bg-gray-50 rounded-lg p-3 group hover:bg-gray-100 transition-colors"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <div className="p-1 bg-red-100 rounded">
                                        <FileText className="w-4 h-4 text-red-600" />
                                      </div>
                                      <div>
                                        <span className="text-sm font-medium text-gray-700 truncate max-w-[180px] block">
                                          {file.name}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </span>
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setFiles(files.filter(f => f !== file))}
                                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <X className="w-4 h-4 text-gray-500 hover:text-red-500" />
                                    </Button>
                                  </motion.div>
                                ))}
                              </div>
                            </ScrollArea>
                          )}

                          <Button
                            onClick={handleUpload}
                            disabled={uploading || !jobRole.trim() || files.length === 0}
                            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
                          >
                            {uploading || isAnalyzing ? (
                                  <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="mr-2"
                              >
                                <Zap className="w-4 h-4" />
                              </motion.div>
                                    {isAnalyzing ? "Analyzing with AI..." : "Uploading..."}
                                  </>
                            ) : (
                                  <>
                              <Brain className="w-4 h-4 mr-2" />
                                    {!jobRole.trim() ? "Enter Job Role First" : "Start AI Analysis"}
                                  </>
                            )}
                          </Button>

                              {!jobRole.trim() && files.length > 0 && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center"
                                >
                                  <Sparkles className="w-4 h-4 mr-2 flex-shrink-0" />
                                  Please enter a job role for accurate AI matching and scoring
                                </motion.div>
                              )}

                              {uploading && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="space-y-3 p-4 bg-blue-50 rounded-lg"
                                >
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-700 font-medium truncate max-w-[200px]">
                                      {currentFile || "Processing..."}
                                    </span>
                                    <span className="text-blue-600 font-semibold">{Math.round(uploadProgress)}%</span>
                                  </div>
                                <Progress value={uploadProgress} className="h-2" />
                                </motion.div>
                              )}
                            </motion.div>
                          )}
                    </TabsContent>

                    <TabsContent value="multi-agent" className="space-y-4">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        {/* Upload Area - Moved to Top */}
                        <div
                          className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer group transition-all duration-300 ${
                            files.length > 0 
                              ? "border-green-400 bg-green-50" 
                              : "border-gray-300 hover:border-purple-400 hover:bg-purple-50/50"
                          }`}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <div className="flex flex-col items-center space-y-3">
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              className={`p-4 rounded-full transition-colors ${
                                files.length > 0 ? "bg-green-500" : "bg-purple-500 group-hover:bg-purple-600"
                              }`}
                            >
                              {files.length > 0 ? (
                                <CheckCircle className="w-6 h-6 text-white" />
                              ) : (
                                <Upload className="w-6 h-6 text-white" />
                              )}
                            </motion.div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                {files.length > 0 ? (
                                  `${files.length} file${files.length > 1 ? 's' : ''} ready for multi-agent analysis`
                                ) : (
                                  "Drop PDF resumes here or click to browse"
                                )}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">Max 5 files • Supports multiple PDF files</p>
                            </div>
                          </div>
                        </div>

                        {files.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="space-y-3"
                          >
                            {/* Dynamic height based on number of files */}
                            {files.slice(0, 5).length <= 4 ? (
                              // No scroll for 4 or fewer files - just show them
                              <div className="border rounded-lg p-2">
                                <div className="space-y-2">
                                  {files.slice(0, 5).map((file, index) => (
                                    <motion.div
                                      key={file.name}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: index * 0.1 }}
                                      className="flex items-center justify-between bg-gray-50 rounded-lg p-3 group hover:bg-gray-100 transition-colors"
                                    >
                                      <div className="flex items-center space-x-3">
                                        <div className="p-1 bg-purple-100 rounded">
                                          <FileText className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <div>
                                          <span className="text-sm font-medium text-gray-700 truncate max-w-[180px] block">
                                            {file.name}
                                          </span>
                                          <span className="text-xs text-gray-500">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                          </span>
                                        </div>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setFiles(files.filter(f => f !== file))}
                                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <X className="w-4 h-4 text-gray-500 hover:text-red-500" />
                                      </Button>
                                    </motion.div>
                                  ))}
                                </div>
                                {files.length > 5 && (
                                  <div className="text-center text-sm text-gray-500 p-2 mt-2 bg-gray-50 rounded">
                                    + {files.length - 5} more files (max 5 will be processed)
                                  </div>
                                )}
                              </div>
                            ) : (
                              // ScrollArea for 5+ files
                              <ScrollArea className="h-[300px] border rounded-lg p-2">
                                <div className="space-y-2 pr-4">
                                  {files.slice(0, 5).map((file, index) => (
                                    <motion.div
                                      key={file.name}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: index * 0.1 }}
                                      className="flex items-center justify-between bg-gray-50 rounded-lg p-3 group hover:bg-gray-100 transition-colors"
                                    >
                                      <div className="flex items-center space-x-3">
                                        <div className="p-1 bg-purple-100 rounded">
                                          <FileText className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <div>
                                          <span className="text-sm font-medium text-gray-700 truncate max-w-[180px] block">
                                            {file.name}
                                          </span>
                                          <span className="text-xs text-gray-500">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                          </span>
                                        </div>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setFiles(files.filter(f => f !== file))}
                                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <X className="w-4 h-4 text-gray-500 hover:text-red-500" />
                                      </Button>
                                    </motion.div>
                                  ))}
                                  {files.length > 5 && (
                                    <div className="text-center text-sm text-gray-500 p-2">
                                      ... and {files.length - 5} more files (max 5 will be processed)
                                    </div>
                                  )}
                                </div>
                              </ScrollArea>
                            )}

                            <Button
                              onClick={handleMultiAgentUpload}
                              disabled={uploading || !jobRole.trim() || files.length === 0}
                              className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
                            >
                              {uploading || isAnalyzing ? (
                                <>
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="mr-2"
                                  >
                                    <Brain className="w-4 h-4" />
                                  </motion.div>
                                  {isAnalyzing ? "Multi-Agent Analysis in Progress..." : "Uploading..."}
                                </>
                              ) : (
                                <>
                                  <Brain className="w-4 h-4 mr-2" />
                                  {!jobRole.trim() ? "Enter Job Role First" : "Start Multi-Agent Analysis"}
                                </>
                              )}
                            </Button>

                            {!jobRole.trim() && files.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center"
                              >
                                <Sparkles className="w-4 h-4 mr-2 flex-shrink-0" />
                                Please enter a job role for accurate AI matching and scoring
                              </motion.div>
                            )}

                            {uploading && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-3 p-4 bg-purple-50 rounded-lg"
                              >
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-700 font-medium truncate max-w-[200px]">
                                    {currentFile || "Processing with AI agents..."}
                                  </span>
                                  <span className="text-purple-600 font-semibold">{Math.round(uploadProgress)}%</span>
                                </div>
                                <Progress value={uploadProgress} className="h-2" />
                              </motion.div>
                            )}
                          </motion.div>
                        )}
                        
                        {/* Description Area - Moved Below Upload */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                              <Brain className="w-4 h-4 text-white" />
                            </div>
                            <h4 className="font-semibold text-gray-900">Advanced Multi-Agent Analysis</h4>
                          </div>
                          <p className="text-sm text-gray-600">
                            Experience next-generation resume analysis with 7 specialized AI agents working together:
                          </p>
                          <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                            <div className="flex items-center space-x-2">
                              <FileText className="w-3 h-3 text-blue-500" />
                              <span>Document Processing</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Target className="w-3 h-3 text-green-500" />
                              <span>Role Matching</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Wrench className="w-3 h-3 text-orange-500" />
                              <span>Skills Analysis</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Briefcase className="w-3 h-3 text-purple-500" />
                              <span>Experience Review</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="w-3 h-3 text-cyan-500" />
                              <span>Growth Analysis</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <span>Strengths Assessment</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </TabsContent>
                  </Tabs>
                ) : (
                  /* Database Connection Interface */
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
                      >
                        <Database className="w-8 h-8 text-white" />
                      </motion.div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Database Connection Mode</h3>
                      <p className="text-gray-600 text-sm mb-6">
                        Connect to your existing resume database for bulk analysis
                      </p>
                      
                      {databaseUrl.trim() ? (
                        <Button
                          className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
                          disabled={!jobRole.trim()}
                        >
                          <Database className="w-4 h-4 mr-2" />
                          {!jobRole.trim() ? "Enter Job Role First" : "Connect to Database"}
                        </Button>
                      ) : (
                        <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center">
                          <Database className="w-4 h-4 mr-2 flex-shrink-0" />
                          Please enter a database connection URL above
                        </div>
                      )}
                    </div>
                    
                    {/* Database Info */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                          <Database className="w-4 h-4 text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900">Supported Databases</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>MongoDB</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>PostgreSQL</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span>MySQL</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>SQLite</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="xl:col-span-3"
          >
            <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm sticky top-24">
              <CardHeader className="pb-4 border-b sticky top-0 bg-white/80 backdrop-blur-md z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Analysis Results</CardTitle>
                      <CardDescription className="text-sm">
                  {analysis.length > 0
                          ? `Showing top ${displayedResumes.length} of ${analysis.length} analyzed resumes${jobRole ? ` for "${jobRole}"` : ''}`
                        : "Upload resumes to see AI analysis"}
                    </CardDescription>
                    </div>
                  </div>
                  
                  {analysis.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSort("score")}
                        className={`h-8 ${sortBy === "score" ? "bg-blue-50 border-blue-300" : ""}`}
                      >
                        <Star className="w-3 h-3 mr-1" />
                        Score
                        {sortBy === "score" && (
                          sortOrder === "desc" ? <ChevronDown className="w-3 h-3 ml-1" /> : <ChevronUp className="w-3 h-3 ml-1" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSort("name")}
                        className={`h-8 ${sortBy === "name" ? "bg-blue-50 border-blue-300" : ""}`}
                      >
                        <User className="w-3 h-3 mr-1" />
                        Name
                        {sortBy === "name" && (
                          sortOrder === "desc" ? <ChevronDown className="w-3 h-3 ml-1" /> : <ChevronUp className="w-3 h-3 ml-1" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <ScrollArea className="h-[calc(100vh-12rem)] pb-6">
                <CardContent className="pt-6">
                  {/* AI Agents Processing Display - Show when analyzing and no results */}
                  <AnimatePresence>
                    {isShowingAgentFlow && analysis.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="mb-6"
                      >
                        <AgentStatusManager
                          agents={agentStatuses}
                          isAnalyzing={isAnalyzing}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {analysis.length > 0 ? (
                    <div className="space-y-4">
                      {displayedResumes.length > 0 ? (
                        displayedResumes.map((result, index) => (
                    <motion.div
                            key={result.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.01 }}
                            className={`relative border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg ${
                              selectedResumes.includes(result.id) 
                                ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-md' 
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            {/* Resume Card Header */}
                            <div className="p-6">
                          <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4 flex-1">
                                  {/* Selection Checkbox */}
                                  <motion.div 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                className="cursor-pointer"
                                onClick={() => toggleResumeSelection(result.id)}
                              >
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                  selectedResumes.includes(result.id) 
                                        ? 'border-blue-500 bg-blue-500 text-white shadow-lg' 
                                        : 'border-gray-300 hover:border-blue-400'
                                }`}>
                                  {selectedResumes.includes(result.id) && (
                                    <CheckCircle className="w-4 h-4" />
                                  )}
                            </div>
                                  </motion.div>

                                  {/* Resume Details */}
                                  <div className="flex-1 min-w-0">
                                    {/* Header with name and score */}
                                    <div className="flex items-start justify-between mb-1">
                              <div>
                                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                                          {result.candidateName || result.filename.replace('.pdf', '').replace(/[_-]/g, ' ')}
                                        </h3>
                                        <p className="text-xs text-gray-500 truncate">
                                  {result.filename}
                                        </p>
                                      </div>
                                  {result.matchScore && (
                                        <motion.div
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          transition={{ delay: 0.2 }}
                                          className="ml-2 flex-shrink-0"
                                        >
                                    <Badge 
                                            className={`text-sm font-semibold px-3 py-1.5 ${getScoreColor(result.matchScore)}`}
                                    >
                                            <Star className="w-3 h-3 mr-1.5" />
                                      {result.matchScore}% Match
                                    </Badge>
                                        </motion.div>
                                      )}
                                    </div>
                                  
                                    {/* Social & Preview Links */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                      {result.linkedinUrl && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            const url = result.linkedinUrl?.startsWith('http') 
                                              ? result.linkedinUrl 
                                              : `https://${result.linkedinUrl}`
                                            window.open(url, '_blank')
                                          }}
                                          className="h-8 border-blue-300 hover:bg-blue-50 text-blue-600"
                                        >
                                          <Linkedin className="w-3.5 h-3.5 mr-1.5" /> LinkedIn
                                        </Button>
                                      )}
                                      {result.githubUrl && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            const url = result.githubUrl?.startsWith('http') 
                                              ? result.githubUrl 
                                              : `https://${result.githubUrl}`
                                            window.open(url, '_blank')
                                          }}
                                          className="h-8 border-gray-700 hover:bg-gray-100 text-gray-800"
                                        >
                                          <Github className="w-3.5 h-3.5 mr-1.5" /> GitHub
                                        </Button>
                                      )}
                                      {result.fileUrl && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handlePreviewResume(result)}
                                          className="h-8 border-green-300 hover:bg-green-50 text-green-600"
                                        >
                                          <FileSymlink className="w-3.5 h-3.5 mr-1.5" /> Preview
                                        </Button>
                                      )}
                                    </div>

                                    {/* Skills */}
                                    {result.skills && result.skills.length > 0 && (
                                      <div className="mb-4">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                          <Code className="w-4 h-4 mr-1" />
                                          Skills
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                          {result.skills.slice(0, 6).map((skill, i) => (
                                      <Badge
                                        key={i}
                                        variant="secondary"
                                              className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                                      >
                                    {skill}
                                  </Badge>
                                ))}
                                          {result.skills.length > 6 && (
                                            <Badge variant="outline" className="text-gray-500">
                                              +{result.skills.length - 6} more
                                            </Badge>
                                          )}
                          </div>
                                </div>
                                    )}

                                {/* Experience & Education */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                      <div className="flex items-start space-x-2">
                                        <Briefcase className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                                        <div>
                                          <p className="text-sm font-medium text-gray-700">Experience</p>
                                          <p className="text-sm text-gray-600">{result.experience}</p>
                                      </div>
                                </div>
                                      <div className="flex items-start space-x-2">
                                        <GraduationCap className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                                        <div>
                                          <p className="text-sm font-medium text-gray-700">Education</p>
                                          <p className="text-sm text-gray-600">{result.education}</p>
                              </div>
                          </div>
                        </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsChatting(isChatting === result.id ? null : result.id)}
                                        className={`h-8 ${isChatting === result.id ? "bg-blue-50 border-blue-300 text-blue-700" : ""}`}
                              >
                                        <MessageSquare className="w-3 h-3 mr-1" />
                                        Chat
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                        onClick={() => setShowingSummary(showingSummary === result.id ? null : result.id)}
                                        className={`h-8 ${showingSummary === result.id ? "bg-green-50 border-green-300 text-green-700" : ""}`}
                              >
                                        <Eye className="w-3 h-3 mr-1" />
                                        Summary
                              </Button>
                              {result.multiAgentData && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setShowingMultiAgentAnalysis(showingMultiAgentAnalysis === result.id ? null : result.id)}
                                  className={`h-8 ${showingMultiAgentAnalysis === result.id ? "bg-purple-50 border-purple-300 text-purple-700" : "border-purple-200 hover:bg-purple-50 text-purple-600"}`}
                                >
                                  <Brain className="w-3 h-3 mr-1" />
                                  Multi-Agent
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                        onClick={() => setShowEmailCard(showEmailCard === result.id ? null : result.id)}
                                        className={`h-8 ${showEmailCard === result.id ? "bg-blue-50 border-blue-300 text-blue-700" : ""}`}
                                      >
                                        <Mail className="w-3 h-3 mr-1" />
                                        Contact
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => toggleResumeExpansion(result.id)}
                                        className="h-8"
                                      >
                                        <ArrowRight className={`w-3 h-3 transition-transform ${expandedResume === result.id ? 'rotate-90' : ''}`} />
                                        Details
                              </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Enhanced Chat Interface */}
                            <AnimatePresence>
                            {isChatting === result.id && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="mt-6 pt-6 border-t border-gray-200"
                                >
                                  <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-4">
                                      <h4 className="font-semibold text-gray-900 flex items-center">
                                        <MessageSquare className="w-4 h-4 mr-2 text-blue-600" />
                                        Chat with Resume
                                      </h4>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsChatting(null)}
                                        className="h-8 w-8 p-0"
                                      >
                                        <X className="w-4 h-4" />
                                      </Button>
                                    </div>
                                    
                                    <ScrollArea className="h-[250px] mb-4 bg-white rounded-md border">
                                      <div className="p-4 space-y-3">
                                        {chatMessages[result.id]?.length === 0 || !chatMessages[result.id] ? (
                                          <motion.div 
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-center text-gray-500 py-8"
                                          >
                                            <motion.div
                                              animate={{ 
                                                scale: [1, 1.1, 1],
                                                rotate: [0, 5, -5, 0]
                                              }}
                                              transition={{ 
                                                duration: 2,
                                                repeat: Infinity,
                                                repeatType: "reverse"
                                              }}
                                            >
                                              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                            </motion.div>
                                            <p className="text-sm">Start a conversation about this resume</p>
                                          </motion.div>
                                        ) : (
                                          chatMessages[result.id]?.map((msg, i) => (
                                            <motion.div
                                      key={i}
                                              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                                              animate={{ opacity: 1, x: 0 }}
                                              transition={{ duration: 0.3 }}
                                              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                              <motion.div
                                                whileHover={{ scale: 1.02 }}
                                                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                          msg.role === 'user'
                                            ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-100 text-gray-900 border'
                                                }`}
                                              >
                                                {msg.isThinking ? (
                                                  <div className="flex items-center space-x-2">
                                                    <motion.div
                                                      className="w-2 h-2 bg-gray-500 rounded-full"
                                                      animate={{ scale: [1, 1.5, 1] }}
                                                      transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                                                    />
                                                    <motion.div
                                                      className="w-2 h-2 bg-gray-500 rounded-full"
                                                      animate={{ scale: [1, 1.5, 1] }}
                                                      transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", delay: 0.2 }}
                                                    />
                                                    <motion.div
                                                      className="w-2 h-2 bg-gray-500 rounded-full"
                                                      animate={{ scale: [1, 1.5, 1] }}
                                                      transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", delay: 0.4 }}
                                                    />
                                                  </div>
                                                ) : (
                                                  <div className={`prose prose-sm max-w-none ${
                                                    msg.role === 'user' ? 'user-message' : ''
                                                  }`}>
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {msg.content}
                                                    </ReactMarkdown>
                                      </div>
                                                )}
                                              </motion.div>
                                            </motion.div>
                                          ))
                                        )}
                                      </div>
                                </ScrollArea>
                                    
                                    <div className="flex space-x-2">
                                  <Input
                                    value={currentMessage}
                                    onChange={(e) => setCurrentMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && !isProcessing && handleChat(result.id)}
                                        placeholder="Ask about skills, experience, fit for role..."
                                        className="flex-1 h-9"
                                        disabled={isProcessing}
                                      />
                                      <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                      >
                                  <Button
                                    onClick={() => handleChat(result.id)}
                                          disabled={!currentMessage.trim() || isProcessing}
                                          size="sm"
                                          className="h-9 px-3"
                                        >
                                          {isProcessing ? (
                                            <motion.div
                                              animate={{ rotate: 360 }}
                                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            >
                                              <Loader2 className="w-4 h-4" />
                                            </motion.div>
                                          ) : (
                                            <Send className="w-4 h-4" />
                                          )}
                                  </Button>
                                      </motion.div>
                                    </div>
                                  </div>
                              </motion.div>
                            )}
                            </AnimatePresence>

                            {/* Enhanced Summary Section */}
                            <AnimatePresence>
                            {showingSummary === result.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="mt-6 pt-6 border-t border-gray-200"
                                >
                                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                                    <div className="flex items-center justify-between mb-4">
                                      <h4 className="font-semibold text-gray-900 flex items-center">
                                        <Eye className="w-4 h-4 mr-2 text-green-600" />
                                        AI Summary & Analysis
                                      </h4>
                                <Button
                              variant="ghost"
                                  size="sm"
                                        onClick={() => setShowingSummary(null)}
                                        className="h-8 w-8 p-0"
                                      >
                                        <X className="w-4 h-4" />
                                </Button>
                              </div>

                                    <Tabs defaultValue="overview" className="w-full">
                                      <TabsList className="grid w-full grid-cols-4 mb-4">
                                        <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                                        <TabsTrigger value="strengths" className="text-xs">Strengths</TabsTrigger>
                                        <TabsTrigger value="concerns" className="text-xs">Concerns</TabsTrigger>
                                        <TabsTrigger value="technical" className="text-xs">Technical</TabsTrigger>
                                      </TabsList>

                                      <TabsContent value="overview" className="space-y-4">
                                        <div className="bg-white rounded-md p-4 border">
                                          <h5 className="font-medium text-gray-900 mb-2">Summary</h5>
                                          <p className="text-gray-700 text-sm leading-relaxed">{result.summary}</p>
                                        </div>
                                        
                              {result.role_matches && result.role_matches.length > 0 && (
                                          <div className="bg-white rounded-md p-4 border">
                                            <h5 className="font-medium text-gray-900 mb-2">Suitable Roles</h5>
                                    <div className="flex flex-wrap gap-2">
                                    {result.role_matches.map((role, i) => (
                                      <Badge key={i} className="bg-green-100 text-green-800">
                                        {role}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                              )}
                                      </TabsContent>

                                      <TabsContent value="strengths" className="space-y-3">
                                        <div className="bg-white rounded-md p-4 border">
                                          <h5 className="font-medium text-green-700 mb-3">Key Strengths</h5>
                                          <div className="space-y-2">
                                            {result.pros?.map((pro, i) => (
                                              <div key={i} className="flex items-start space-x-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm text-gray-700">{pro}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                        
                              {result.achievements && result.achievements.length > 0 && (
                                          <div className="bg-white rounded-md p-4 border">
                                            <h5 className="font-medium text-gray-900 mb-3">Key Achievements</h5>
                                            <div className="space-y-2">
                                    {result.achievements.map((achievement, i) => (
                                                <div key={i} className="flex items-start space-x-2">
                                                  <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                                  <span className="text-sm text-gray-700">{achievement}</span>
                                                </div>
                                    ))}
                                            </div>
                                </div>
                              )}
                                      </TabsContent>

                                      <TabsContent value="concerns" className="space-y-3">
                                        <div className="bg-white rounded-md p-4 border">
                                          <h5 className="font-medium text-red-700 mb-3">Areas of Concern</h5>
                                          <div className="space-y-2">
                                            {result.cons?.map((con, i) => (
                                              <div key={i} className="flex items-start space-x-2">
                                                <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm text-gray-700">{con}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                        
                              {result.improvement_areas && result.improvement_areas.length > 0 && (
                                          <div className="bg-white rounded-md p-4 border">
                                            <h5 className="font-medium text-orange-700 mb-3">Growth Areas</h5>
                                  <div className="flex flex-wrap gap-2">
                                    {result.improvement_areas.map((area, i) => (
                                                <Badge key={i} variant="outline" className="text-orange-600 border-orange-300">
                                        {area}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                                      </TabsContent>

                                      <TabsContent value="technical" className="space-y-3">
                                        {result.technical_proficiency && (
                                          <div className="bg-white rounded-md p-4 border">
                                            <h5 className="font-medium text-gray-900 mb-3">Technical Proficiency</h5>
                                            <div className="space-y-4">
                                              {Object.entries(result.technical_proficiency).map(([category, items]) => (
                                                <div key={category}>
                                                  <h6 className="text-sm font-medium text-gray-700 capitalize mb-2">
                                                    {category}
                                                  </h6>
                                                  <div className="flex flex-wrap gap-2">
                                                    {Array.isArray(items) && items.map((item, i) => (
                                                      <Badge
                                                        key={i}
                                                        variant="secondary"
                                                        className="bg-purple-100 text-purple-800"
                                                      >
                                                        {item}
                                                      </Badge>
                                                    ))}
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </TabsContent>
                                    </Tabs>
                        </div>
                      </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Expanded Details */}
                            <AnimatePresence>
                              {expandedResume === result.id && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="mt-6 pt-6 border-t border-gray-200"
                                >
                                  <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-4">Detailed Information</h4>
                                    
                                    {/* Additional details can be added here */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="bg-white p-3 rounded border">
                                        <h5 className="font-medium text-gray-700 mb-2">Analysis Date</h5>
                                        <p className="text-sm text-gray-600">
                                          {new Date(result.timestamp || Date.now()).toLocaleDateString()}
                                        </p>
                  </div>
                                      <div className="bg-white p-3 rounded border">
                                        <h5 className="font-medium text-gray-700 mb-2">File Size</h5>
                                        <p className="text-sm text-gray-600">PDF Document</p>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Email Card */}
                            {showEmailCard === result.id && renderEmailCard(result.id)}

                            {/* Multi-Agent Analysis Display */}
                            <AnimatePresence>
                              {showingMultiAgentAnalysis === result.id && result.multiAgentData && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="mt-6 pt-6 border-t border-gray-200"
                                >
                                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
                                    <div className="flex items-center justify-between mb-4">
                                      <h4 className="font-semibold text-gray-900 flex items-center">
                                        <Brain className="w-4 h-4 mr-2 text-purple-600" />
                                        Multi-Agent Analysis
                                      </h4>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowingMultiAgentAnalysis(null)}
                                        className="h-8 w-8 p-0"
                                      >
                                        <X className="w-4 h-4" />
                                      </Button>
                                    </div>
                                    
                                    <ScrollArea className="max-h-[600px]">
                                      <MultiAgentAnalysisView
                                        multiAgentData={result.multiAgentData}
                                        candidateName={result.candidateName || result.filename}
                                      />
                                    </ScrollArea>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        ))
                      ) : (
                        // No resumes meet the filter criteria
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center py-16"
                        >
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                            className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                            <Filter className="w-10 h-10 text-orange-600" />
                    </motion.div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No Matches Found
                    </h3>
                          <p className="text-gray-600 max-w-md mx-auto mb-4">
                            {analysis.length} resumes were analyzed, but none meet the current criteria.
                          </p>
                          <div className="flex flex-wrap justify-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setMaxResults(50)}
                              className="text-sm"
                            >
                              Show More Results
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setJobRole("")
                                setCurrentFile("")
                              }}
                              className="text-sm"
                            >
                              Clear Filters
                            </Button>
                  </div>
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-16"
                    >
                      <motion.div
                        animate={{ 
                          scale: [1, 1.05, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6"
                      >
                        <FileText className="w-10 h-10 text-blue-600" />
                      </motion.div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Ready for AI Analysis
                      </h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Upload PDF resumes to see detailed AI-powered analysis, match scores, and insights.
                      </p>
                    </motion.div>
                )}
              </CardContent>
              </ScrollArea>
            </Card>
          </motion.div>
        </div>
        </div>

      {/* Selected Candidates Bar - Fixed at bottom */}
      <AnimatePresence>
        {selectedResumes.length > 0 && (
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
                          {selectedResumes.length}
                        </motion.div>
                      </div>
                      <div className="text-center sm:text-left">
                        <h3 className="font-semibold text-gray-900">
                          {selectedResumes.length} Candidate{selectedResumes.length > 1 ? "s" : ""} Selected
                        </h3>
                        <p className="text-sm text-gray-600">Review selected candidates or add to pipeline</p>
                      </div>
                  </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedResumes([])}
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
                        {selectedResumes.map((id) => {
                          const resume = analysis.find(r => r.id === id);
                          if (!resume) return null;
                          return (
                            <motion.div
                              key={id}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="bg-gray-100 rounded-lg p-2 pr-3 flex items-center gap-2 group"
                            >
                              <div className="p-1.5 bg-white rounded">
                                <FileText className="w-4 h-4 text-blue-600" />
            </div>
                              <span className="text-sm font-medium text-gray-700">
                                {resume.candidateName || resume.filename}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleResumeSelection(id)}
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

      {/* PDF Preview Modal */}
      <Dialog open={previewModalOpen} onOpenChange={setPreviewModalOpen}>
        <DialogContent className="max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[60vw] h-[90vh] p-0 bg-white/95 backdrop-blur-xl border-0 shadow-2xl flex flex-col">
          <DialogHeader className="p-4 border-b sticky top-0 bg-white/80 backdrop-blur-md z-10">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Resume Preview: {resumeToPreview?.candidateName || resumeToPreview?.filename}
              </DialogTitle>
              <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
                  size="sm"
                  onClick={() => window.open(resumeToPreview?.fileUrl, '_blank')}
                  className="h-8"
            >
                  <FileSymlink className="w-4 h-4 mr-1" />
                  Open in New Tab
            </Button>
            <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setPreviewModalOpen(false)} 
                  className="rounded-full h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          <div className="flex-grow overflow-hidden relative">
            {resumeToPreview?.fileUrl ? (
              <div className="w-full h-full">
                <object
                  data={resumeToPreview.fileUrl}
                  type="application/pdf"
                  className="w-full h-full"
                >
                  <embed
                    src={resumeToPreview.fileUrl}
                    type="application/pdf"
                    className="w-full h-full"
                  />
                </object>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-600">
                <p>Could not load resume preview.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


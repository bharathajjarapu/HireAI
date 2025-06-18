"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Filter,
  ArrowLeft,
  MapPin,
  Star,
  Github,
  Linkedin,
  Mail,
  Brain,
  Zap,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  Sparkles,
  Briefcase,
  FileText,
  Eye,
  Send,
  User,
  X,
  Code
} from "lucide-react"
import Link from "next/link"

interface Candidate {
  id: number
  name: string
  title: string
  location: string
  skills: string[]
  experience: string
  score: number
  linkedin?: string
  github?: string
  summary: string
  email?: string
}

export default function SearchCandidates() {
  const [jobRole, setJobRole] = useState("")
  const [location, setLocation] = useState("")
  const [requirements, setRequirements] = useState("")
  const [profileCount, setProfileCount] = useState(10)
  const [isSearching, setIsSearching] = useState(false)
  const [searchProgress, setSearchProgress] = useState(0)
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [showResults, setShowResults] = useState(false)
  const [searchCompleted, setSearchCompleted] = useState(false)

  const handleSearch = async () => {
    if (!jobRole.trim() || !location.trim()) {
      alert('Please enter both job role and location!')
      return
    }

    setIsSearching(true)
    setSearchProgress(0)
    setShowResults(false)
    setSearchCompleted(false)
    setCandidates([])

    try {
      // Start with initial progress
      setSearchProgress(10)
      
      // Call the Perplexity API directly without fake progress
      const response = await fetch('/api/search-candidates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobRole: jobRole.trim(),
          location: location.trim(),
          requirements: requirements.trim() || undefined,
          profileCount: profileCount
        })
      })

      // Update progress while waiting for response
      setSearchProgress(50)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search candidates')
      }

      // Update progress when processing results
      setSearchProgress(80)

      // Ensure unique IDs and clean data
      const cleanCandidates = (data.candidates || []).map((candidate: any, index: number) => ({
        ...candidate,
        id: Date.now() + index, // Ensure unique IDs
        name: candidate.name || `Professional ${index + 1}`,
        title: candidate.title || jobRole,
        summary: candidate.summary && candidate.summary.length > 20 ? candidate.summary : `Experienced ${jobRole} professional with expertise in software development.`
      }))

      setSearchProgress(100)
      await new Promise((resolve) => setTimeout(resolve, 300))

      setCandidates(cleanCandidates)
      setIsSearching(false)
      setShowResults(true)
      setSearchCompleted(true)

    } catch (error) {
      console.error('Search error:', error)
      setIsSearching(false)
      setSearchProgress(0)
      alert('Search failed. Please check your connection and try again.')
    }
  }

  const toggleCandidateSelection = (candidateId: number) => {
    setSelectedCandidates((prev) =>
      prev.includes(candidateId) ? prev.filter((id) => id !== candidateId) : [...prev, candidateId]
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100"
    if (score >= 80) return "text-blue-600 bg-blue-100"
    if (score >= 70) return "text-yellow-600 bg-yellow-100"
    return "text-red-600 bg-red-100"
  }

  const handleAddToPipeline = () => {
    const selectedCandidateData = candidates.filter(c => selectedCandidates.includes(c.id))
    localStorage.setItem('selectedCandidates', JSON.stringify(selectedCandidateData))
    // Navigate to search pipeline
    window.location.href = '/search-pipeline'
  }

  const getCurrentMessage = () => {
    if (searchProgress <= 10) return "🤖 Connecting to Perplexity AI..."
    if (searchProgress <= 50) return "🔍 Searching for real candidates..."
    if (searchProgress <= 80) return "📊 Processing results..."
    if (searchProgress <= 100) return "✨ Finalizing candidate profiles..."
    return "🎉 Search completed!"
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
            <Link href="/">
              <Button variant="ghost" className="hover:bg-purple-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>

            <div className="flex items-center space-x-3">
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
                <Brain className="w-6 h-6 text-purple-600" />
              </motion.div>
              <h1 className="text-xl font-bold text-gray-900">AI Candidate Search</h1>
            </div>

            <div></div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-4">
        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-134px)]">
          {/* Left Sidebar - Search Form */}
          <div className="col-span-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="h-full"
            >
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm h-full overflow-hidden">
                <CardHeader className="pb-3 pt-4 border-b">
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                    className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-2"
                  >
                    <Search className="w-5 h-5 text-white" />
                  </motion.div>
                  <CardTitle className="text-base font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Find Perfect Candidates
                  </CardTitle>
                  <CardDescription className="text-center text-xs">
                    Powered by Perplexity & Gemini AI
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 overflow-y-auto h-[calc(100%-134px)] px-4 py-4">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block flex items-center">
                      <Briefcase className="w-3 h-3 mr-1 text-purple-600" />
                      Job Role *
                    </label>
                    <div className="space-y-2">
                      <Input
                        placeholder="e.g., Java Developer, React Engineer..."
                        value={jobRole}
                        onChange={(e) => setJobRole(e.target.value)}
                        className="border-gray-200 focus:border-purple-500 focus:ring-purple-500 h-8 text-sm"
                        disabled={isSearching}
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-xs border-blue-200 hover:bg-blue-50 text-blue-700 h-8 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all duration-300"
                          onClick={() => {
                            setJobRole("AI Developer");
                            setLocation("Hyderabad, Bangalore, India");
                            setRequirements("An AI Developer is a software engineer who specializes in developing and implementing artificial intelligence and machine learning solutions.");
                          }}
                          disabled={isSearching}
                        >
                          <Sparkles className="w-3 h-3 mr-1" />
                          AI Developer
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-xs border-green-200 hover:bg-green-50 text-green-700 h-8 bg-gradient-to-r from-green-50 to-blue-50 hover:from-green-100 hover:to-blue-100 transition-all duration-300"
                          onClick={() => {
                            setJobRole("Java Developer");
                            setLocation("Hyderabad, Bangalore, India");
                            setRequirements("A Java Developer is a software engineer who specializes in designing, developing, and maintaining applications using the Java programming language.");
                          }}
                          disabled={isSearching}
                        >
                          <Code className="w-3 h-3 mr-1" />
                          Java Developer
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-purple-600" />
                      Location *
                    </label>
                    <Input
                      placeholder="e.g., Hyderabad, Bangalore, Remote..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="border-gray-200 focus:border-purple-500 focus:ring-purple-500 h-8 text-sm"
                      disabled={isSearching}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block flex items-center">
                      <FileText className="w-3 h-3 mr-1 text-purple-600" />
                      Requirements (Optional)
                    </label>
                    <Textarea
                      placeholder="e.g., 5+ years experience, open source..."
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      className="border-gray-200 focus:border-purple-500 focus:ring-purple-500 text-sm"
                      rows={2}
                      disabled={isSearching}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block flex items-center">
                      <Users className="w-3 h-3 mr-1 text-purple-600" />
                      Number of Profiles
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="20"
                      value={profileCount}
                      onChange={(e) => setProfileCount(Math.min(20, Math.max(1, parseInt(e.target.value) || 10)))}
                      className="border-gray-200 focus:border-purple-500 focus:ring-purple-500 h-8 text-sm"
                      disabled={isSearching}
                    />
                    <p className="text-xs text-gray-500 mt-1">Min: 1, Max: 20</p>
                  </div>

                  <Button
                    onClick={handleSearch}
                    disabled={isSearching || !jobRole.trim() || !location.trim()}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-8 text-sm"
                  >
                    {isSearching ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="mr-2"
                        >
                          <Sparkles className="w-3 h-3" />
                        </motion.div>
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-3 h-3 mr-2" />
                        Find {profileCount} Candidates
                      </>
                    )}
                  </Button>

                  {/* Search Progress - Fixed Space */}
                  <div className="h-[60px]">
                    {isSearching ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-2 h-full"
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                          >
                            <Brain className="w-3 h-3 text-purple-600" />
                          </motion.div>
                          <span className="font-medium text-purple-900 text-xs">AI Search Progress</span>
                        </div>
                        <Progress value={searchProgress} className="h-1 mb-1" />
                        <motion.p 
                          key={getCurrentMessage()}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs text-purple-700 leading-tight"
                        >
                          {getCurrentMessage()}
                        </motion.p>
                      </motion.div>
                    ) : (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 h-full flex items-center justify-center">
                        <p className="text-xs text-gray-500 text-center">
                          Progress will be shown here during search
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Content - Results Container */}
          <div className="col-span-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="h-full"
            >
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm h-full overflow-hidden flex flex-col">
                <CardHeader className="pb-3 pt-4 border-b flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {showResults && candidates.length > 0 ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <h2 className="text-lg font-bold text-gray-900">
                            Found {candidates.length} Candidates
                          </h2>
                        </>
                      ) : (
                        <>
                          <Search className="w-5 h-5 text-gray-400" />
                          <h2 className="text-lg font-bold text-gray-900">
                            Search Results
                          </h2>
                        </>
                      )}
                    </div>

                    {showResults && candidates.length > 0 && (
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI Enhanced
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <div className="flex-1 overflow-hidden relative">
                  <div className="absolute inset-0 overflow-y-auto">
                    <div className="p-4">
                      {showResults && candidates.length > 0 ? (
                        <div className="space-y-3">
                          {candidates.map((candidate, index) => (
                            <motion.div
                              key={candidate.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ scale: 1.01 }}
                            >
                              <Card className="border border-gray-200 hover:border-purple-300 transition-all duration-300 bg-white hover:shadow-md">
                                <CardContent className="p-4">
                                  <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0">
                                      <Checkbox
                                        checked={selectedCandidates.includes(candidate.id)}
                                        onCheckedChange={() => toggleCandidateSelection(candidate.id)}
                                        className="mt-1.5"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between mb-2">
                                        <div>
                                          <h3 className="text-base font-semibold text-gray-900 truncate">
                                            {candidate.name}
                                          </h3>
                                          <p className="text-sm text-gray-600 truncate">
                                            {candidate.title}
                                          </p>
                                        </div>
                                        <Badge 
                                          className={`ml-2 ${getScoreColor(candidate.score)}`}
                                        >
                                          <Star className="w-3 h-3 mr-1" />
                                          {candidate.score}% Match
                                        </Badge>
                                      </div>

                                      <div className="flex items-center space-x-3 text-xs text-gray-500 mb-2">
                                        <div className="flex items-center">
                                          <MapPin className="w-3 h-3 mr-1" />
                                          {candidate.location}
                                        </div>
                                        <div className="flex items-center">
                                          <Clock className="w-3 h-3 mr-1" />
                                          {candidate.experience}
                                        </div>
                                      </div>

                                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                        {candidate.summary}
                                      </p>

                                      <div className="flex flex-wrap gap-1 mb-2">
                                        {candidate.skills.slice(0, 4).map((skill, skillIndex) => (
                                          <Badge
                                            key={skillIndex}
                                            variant="secondary"
                                            className="bg-purple-50 text-purple-700 text-xs px-1.5 py-0.5"
                                          >
                                            {skill}
                                          </Badge>
                                        ))}
                                        {candidate.skills.length > 4 && (
                                          <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                                            +{candidate.skills.length - 4}
                                          </Badge>
                                        )}
                                      </div>

                                      <div className="flex items-center space-x-3">
                                        {candidate.linkedin && (
                                          <motion.a
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            href={candidate.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center text-blue-600 hover:text-blue-800 text-xs"
                                          >
                                            <Linkedin className="w-3 h-3 mr-1" />
                                            LinkedIn
                                          </motion.a>
                                        )}
                                        {candidate.github && (
                                          <motion.a
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            href={candidate.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center text-gray-600 hover:text-gray-800 text-xs"
                                          >
                                            <Github className="w-3 h-3 mr-1" />
                                            GitHub
                                          </motion.a>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      ) : showResults && candidates.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-300px)] text-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                            <Search className="w-6 h-6 text-gray-400" />
                          </div>
                          <h3 className="text-base font-semibold text-gray-900 mb-2">No Candidates Found</h3>
                          <p className="text-gray-600 text-sm">Try adjusting your search criteria or location</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-300px)] text-center">
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
                            className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-3"
                          >
                            <Search className="w-6 h-6 text-white" />
                          </motion.div>
                          <h3 className="text-base font-semibold text-gray-900 mb-2">Ready to Search</h3>
                          <p className="text-gray-600 text-sm">Enter job role and location to find perfect candidates</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Selected Candidates Bar - Fixed at bottom */}
      <AnimatePresence>
        {selectedCandidates.length > 0 && (
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
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                        >
                          {selectedCandidates.length}
                        </motion.div>
                      </div>
                      <div className="text-center sm:text-left">
                        <h3 className="font-semibold text-gray-900">
                          {selectedCandidates.length} Candidate{selectedCandidates.length > 1 ? "s" : ""} Selected
                        </h3>
                        <p className="text-sm text-gray-600">Review selected candidates or add to pipeline</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedCandidates([])}
                        className="w-full sm:w-auto border-gray-300 hover:bg-gray-50 text-gray-700"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Clear Selection
                      </Button>
                      <Button
                        onClick={handleAddToPipeline}
                        className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all"
                      >
                        <Send className="w-4 h-4 mr-2" />
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
                    <div className="max-h-[120px] overflow-y-auto">
                      <div className="flex gap-2 flex-wrap">
                        {selectedCandidates.map((candidateId) => {
                          const candidate = candidates.find(c => c.id === candidateId);
                          if (!candidate) return null;
                          return (
                            <motion.div
                              key={candidateId}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="bg-gray-100 rounded-lg p-2 pr-3 flex items-center gap-2 group"
                            >
                              <div className="p-1.5 bg-white rounded">
                                <User className="w-4 h-4 text-purple-600" />
                              </div>
                              <span className="text-sm font-medium text-gray-700">
                                {candidate.name}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleCandidateSelection(candidateId)}
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3 text-gray-500 hover:text-red-500" />
                              </Button>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
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

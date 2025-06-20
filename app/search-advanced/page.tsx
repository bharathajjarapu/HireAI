"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Search,
  Linkedin,
  X,
  MapPin,
  Send,
  User
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Checkbox } from "@/components/ui/checkbox"

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

export default function AdvancedSearchPage() {
  const [keywords, setKeywords] = useState<string>("")
  const [location, setLocation] = useState<string>("")
  const [limit, setLimit] = useState<number>(25)
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  const POST_URL =
    "https://akshaypersonal.app.n8n.cloud/webhook/cd76eaf4-d53c-4f2b-b7ee-cf7dc1d3040e"
  const GET_URL =
    "https://api.apify.com/v2/acts/bebity~linkedin-premium-actor/runs/last/dataset/items?token=apify_api_q3WUaoC2khe153kWiW4klx6P1Wt3pK3HiWg6"

  const STORAGE_KEY_CANDIDATES = "advSearchCandidates"
  const STORAGE_KEY_SELECTED = "advSearchSelected"

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CANDIDATES)
      if (stored) {
        const parsed: Candidate[] = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length) {
          setCandidates(parsed)
          setShowResults(true)
        }
      }
      const sel = localStorage.getItem(STORAGE_KEY_SELECTED)
      if (sel) {
        const parsedSel: number[] = JSON.parse(sel)
        setSelectedCandidates(parsedSel)
      }
    } catch (e) {
      console.error("Failed to load stored data", e)
    }
  }, [])

  useEffect(() => {
    if (candidates.length) {
      localStorage.setItem(STORAGE_KEY_CANDIDATES, JSON.stringify(candidates))
    } else {
      localStorage.removeItem(STORAGE_KEY_CANDIDATES)
    }
  }, [candidates])

  useEffect(() => {
    if (selectedCandidates.length) {
      localStorage.setItem(STORAGE_KEY_SELECTED, JSON.stringify(selectedCandidates))
    } else {
      localStorage.removeItem(STORAGE_KEY_SELECTED)
    }
  }, [selectedCandidates])

  const handleSearch = async () => {
    if (!keywords.trim() || !location.trim()) {
      alert("Please fill keywords and location")
      return
    }

    setIsSearching(true)
    setProgress(0)
    setCandidates([])
    setSelectedCandidates([])
    setShowResults(false)
    setError(null)
    localStorage.removeItem(STORAGE_KEY_CANDIDATES)
    localStorage.removeItem(STORAGE_KEY_SELECTED)

    try {
      // Trigger scraping run
      await fetch(POST_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          limit,
          keywords: keywords.split(/,|\n/).map((k) => k.trim()).filter(Boolean),
          location: location.trim()
        })
      })

      // Start timer & delayed polling (first and only GET after 5 minutes)
      startTimeRef.current = Date.now()
      setProgress(5)
      pollIntervalRef.current = setInterval(async () => {
        const elapsed = Date.now() - startTimeRef.current
        if (elapsed >= 300000) {
          // Time to fetch once
          await pollResults()
        } else {
          // Just update progress bar smoothly up to 95%
          const pct = Math.min(5 + (elapsed / 300000) * 90, 95)
          setProgress(pct)
        }
      }, 5000) // update every 5 seconds
    } catch (err) {
      console.error(err)
      setError("Failed to start advanced search. Please try again.")
      setIsSearching(false)
    }
  }

  const pollResults = async () => {
    // Called only after 5 minutes; mark progress near completion
    setProgress(95)

    try {
      const res = await fetch(GET_URL)
      if (!res.ok) throw new Error("Polling error")
      const data: any[] = await res.json()

      if (Array.isArray(data) && data.length) {
        clearIntervalIfAny()
        setCandidates(
          data.slice(0, limit).map((p: any, idx: number) => ({
            id: Date.now() + idx,
            name: `${p.firstName || ""} ${p.lastName || ""}`.trim() || `Professional ${idx + 1}`,
            title: p.headline || "Software Professional",
            location: location,
            skills: keywords.split(/,|\n/).map((k) => k.trim()).filter(Boolean),
            experience: "–",
            score: 80,
            linkedin: p.url,
            summary: p.headline || "Experienced professional"
          }))
        )
        setShowResults(true)
        setProgress(100)
        setIsSearching(false)
      } else {
        // No data available even after 5 min
        clearIntervalIfAny()
        setError("No results available. Please try again later.")
        setIsSearching(false)
      }
    } catch (err) {
      console.error(err)
      clearIntervalIfAny()
      setError("Failed to retrieve results. Please try later.")
      setIsSearching(false)
    }
  }

  const clearIntervalIfAny = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
      pollIntervalRef.current = null
    }
  }

  useEffect(() => {
    return () => clearIntervalIfAny()
  }, [])

  const getCurrentMessage = () => {
    if (progress < 30) return "Setting up agent… (may take up to 5 min)"
    if (progress < 60) return "Gathering profiles… (may take up to 5 min)"
    if (progress < 90) return "Processing data… (may take up to 5 min)"
    if (progress < 100) return "Finalizing… (almost done)"
    return "Search completed!"
  }

  const toggleCandidateSelection = (candidateId: number) => {
    setSelectedCandidates((prev) =>
      prev.includes(candidateId) ? prev.filter((id) => id !== candidateId) : [...prev, candidateId]
    )
  }

  const handleAddToPipeline = () => {
    const selectedData = candidates.filter((c) => selectedCandidates.includes(c.id))
    localStorage.setItem("selectedCandidates", JSON.stringify(selectedData))
    window.location.href = "/search-pipeline"
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100"
    if (score >= 80) return "text-blue-600 bg-blue-100"
    if (score >= 70) return "text-yellow-600 bg-yellow-100"
    return "text-red-600 bg-red-100"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-100">
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/search">
            <Button variant="ghost" className="hover:bg-purple-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Basic Search
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Search className="w-6 h-6 text-purple-600" /> Advanced Candidate Search
          </h1>
          <div />
        </div>
      </header>

      <div className="container mx-auto px-6 py-6 grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <Card className="shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Structured Search
              </CardTitle>
              <CardDescription className="text-center text-xs text-gray-600">⚠️ Data may take up to 5 minutes to appear.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Keywords (comma separated) *</label>
                <Input
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g. MERN, TypeScript, React"
                  disabled={isSearching}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Location *</label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. India, San Francisco"
                  disabled={isSearching}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Limit</label>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  disabled={isSearching}
                />
              </div>
              <Button
                onClick={handleSearch}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                disabled={isSearching}
              >
                {isSearching ? "Searching…" : "Search"}
              </Button>
              {isSearching && (
                <div className="space-y-2">
                  <Progress value={progress} />
                  <p className="text-xs text-gray-600 text-center">{getCurrentMessage()}</p>
                </div>
              )}
              {error && <p className="text-xs text-red-600 text-center">{error}</p>}
            </CardContent>
          </Card>
        </div>

        <div className="col-span-8">
          <Card className="shadow-xl bg-white/90 backdrop-blur-sm h-full">
            <CardHeader className="flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-gray-600" />
                <CardTitle className="text-base font-semibold">Results</CardTitle>
                {candidates.length > 0 && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
                    {candidates.length}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-[calc(100vh-220px)] space-y-3">
              {candidates.length === 0 && !isSearching && (
                <p className="text-sm text-gray-600 text-center mt-10">No results to display.</p>
              )}
              {candidates.map((candidate, idx) => (
                <Card key={idx} className="border border-gray-200 hover:border-purple-300 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedCandidates.includes(candidate.id)}
                        onCheckedChange={() => toggleCandidateSelection(candidate.id)}
                        className="mt-1.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <h3 className="text-base font-semibold text-gray-900 truncate">{candidate.name}</h3>
                            <p className="text-sm text-gray-600 truncate">{candidate.title}</p>
                          </div>
                          <Badge className={`${getScoreColor(candidate.score)}`}>{candidate.score}% Match</Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                          {candidate.location && (
                            <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" />{candidate.location}</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2 mb-2">{candidate.summary}</p>
                        <div className="flex items-center space-x-3">
                          {candidate.linkedin && (
                            <Link href={candidate.linkedin} target="_blank" className="flex items-center text-blue-600 hover:text-blue-800 text-xs">
                              <Linkedin className="w-3 h-3 mr-1" /> LinkedIn
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {showResults && (
        <div className="container mx-auto px-6 py-6">
          <Card className="shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="select-all"
                  checked={selectedCandidates.length === candidates.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCandidates(candidates.map((c) => c.id))
                    } else {
                      setSelectedCandidates([])
                    }
                  }}
                />
                <label htmlFor="select-all" className="text-sm font-medium leading-none">
                  Select All
                </label>
              </div>
              <Button
                onClick={handleAddToPipeline}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                Add to Pipeline
              </Button>
            </CardHeader>
          </Card>
        </div>
      )}

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
                        <X className="w-4 h-4 mr-2" /> Clear Selection
                      </Button>
                      <Button
                        onClick={handleAddToPipeline}
                        className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all"
                      >
                        <Send className="w-4 h-4 mr-2" /> Add to Pipeline
                      </Button>
                    </div>
                  </div>

                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="mt-4 pt-4 border-t border-gray-200"
                  >
                    <div className="max-h-[120px] overflow-y-auto">
                      <div className="flex gap-2 flex-wrap">
                        {selectedCandidates.map((id) => {
                          const cand = candidates.find((c) => c.id === id)
                          if (!cand) return null
                          return (
                            <motion.div
                              key={id}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="bg-gray-100 rounded-lg p-2 pr-3 flex items-center gap-2 group"
                            >
                              <div className="p-1.5 bg-white rounded">
                                <User className="w-4 h-4 text-purple-600" />
                              </div>
                              <span className="text-sm font-medium text-gray-700">{cand.name}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleCandidateSelection(id)}
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3 text-gray-500 hover:text-red-500" />
                              </Button>
                            </motion.div>
                          )
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
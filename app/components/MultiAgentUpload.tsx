"use client"

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react"
import { AgentStatusManager, type AgentStatus, AGENT_CONFIGS } from './AgentStatusManager'

interface UploadedFile {
  file: File
  preview: string
  id: string
}

interface AnalysisResult {
  filename: string
  candidateName?: string
  agentResults?: Record<string, any>
  agentStatuses?: Record<string, AgentStatus>
  analysisMetadata?: {
    totalProcessingTime: number
    completedAgents: number
    totalAgents: number
  }
  error?: string
}

interface MultiAgentUploadProps {
  onAnalysisComplete?: (results: AnalysisResult[]) => void
  maxFiles?: number
}

export function MultiAgentUpload({ 
  onAnalysisComplete,
  maxFiles = 5 
}: MultiAgentUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentAgents, setCurrentAgents] = useState<Record<string, AgentStatus>>({})
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const { toast } = useToast()

  // Initialize agent states
  const initializeAgents = () => {
    const agents: Record<string, AgentStatus> = {}
    AGENT_CONFIGS.forEach(config => {
      agents[config.id] = {
        status: 'idle',
        progress: 0,
        message: 'Waiting to start...'
      }
    })
    return agents
  }

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    
    if (selectedFiles.length + files.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} files allowed`,
        variant: "destructive"
      })
      return
    }

    const newFiles: UploadedFile[] = selectedFiles.map(file => ({
      file,
      preview: file.name,
      id: Math.random().toString(36).substr(2, 9)
    }))

    setFiles(prev => [...prev, ...newFiles])
  }, [files.length, maxFiles, toast])

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    const droppedFiles = Array.from(event.dataTransfer.files)
    
    // Filter for PDF files only
    const pdfFiles = droppedFiles.filter(file => file.type === 'application/pdf')
    
    if (pdfFiles.length !== droppedFiles.length) {
      toast({
        title: "Invalid files",
        description: "Only PDF files are supported",
        variant: "destructive"
      })
    }

    if (pdfFiles.length + files.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} files allowed`,
        variant: "destructive"
      })
      return
    }

    const newFiles: UploadedFile[] = pdfFiles.map(file => ({
      file,
      preview: file.name,
      id: Math.random().toString(36).substr(2, 9)
    }))

    setFiles(prev => [...prev, ...newFiles])
  }, [files.length, maxFiles, toast])

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id))
  }

  const simulateAgentProgress = async (
    agentId: string, 
    duration: number = 3000
  ): Promise<void> => {
    return new Promise((resolve) => {
      const steps = 20
      const interval = duration / steps
      let currentStep = 0

      const updateProgress = () => {
        currentStep++
        const progress = (currentStep / steps) * 100

        setCurrentAgents(prev => ({
          ...prev,
          [agentId]: {
            ...prev[agentId],
            progress,
            status: progress < 100 ? 'working' : 'completed',
            message: progress < 100 
              ? `Processing... ${Math.round(progress)}%`
              : 'Analysis complete'
          }
        }))

        if (currentStep < steps) {
          setTimeout(updateProgress, interval)
        } else {
          resolve()
        }
      }

      updateProgress()
    })
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one PDF file to analyze",
        variant: "destructive"
      })
      return
    }

    setIsAnalyzing(true)
    setCurrentAgents(initializeAgents())
    setAnalysisResults([])
    setUploadProgress(0)

    try {
      // Start with document processor
      setCurrentAgents(prev => ({
        ...prev,
        document_processor: {
          ...prev.document_processor,
          status: 'working',
          message: 'Extracting text from PDFs...'
        }
      }))

      const formData = new FormData()
      files.forEach(({ file }) => {
        formData.append('files', file)
      })

      setUploadProgress(20)

      const response = await fetch('/api/upload-resume-multi-agent', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Failed to process files: ${response.statusText}`)
      }

      setUploadProgress(40)

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      setUploadProgress(60)

      // Simulate progressive agent completion
      const agents = AGENT_CONFIGS.slice(1) // Skip document processor as it's done
      
      for (let i = 0; i < agents.length; i++) {
        const agent = agents[i]
        
        setCurrentAgents(prev => ({
          ...prev,
          [agent.id]: {
            ...prev[agent.id],
            status: 'working',
            message: `Analyzing with ${agent.name}...`
          }
        }))

        // Simulate processing time
        await simulateAgentProgress(agent.id, 2000 + Math.random() * 2000)
        
        setUploadProgress(60 + (i + 1) * (40 / agents.length))
      }

      setAnalysisResults(data.results)
      setUploadProgress(100)

      toast({
        title: "Analysis Complete!",
        description: `Successfully analyzed ${files.length} resume(s)`,
      })

      if (onAnalysisComplete) {
        onAnalysisComplete(data.results)
      }

    } catch (error) {
      console.error('Upload error:', error)
      
      // Mark all working agents as error
      setCurrentAgents(prev => {
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

      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload Resumes for Multi-Agent Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="space-y-4">
              <div className="flex justify-center">
                <FileText className="h-12 w-12 text-gray-400" />
              </div>
              <div>
                <p className="text-lg font-medium">Drop your PDF resumes here</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  or click to browse files (Max {maxFiles} files)
                </p>
              </div>
              <input
                type="file"
                accept=".pdf"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                disabled={isAnalyzing}
              />
              <label htmlFor="file-upload">
                <Button variant="outline" className="cursor-pointer" disabled={isAnalyzing}>
                  Select Files
                </Button>
              </label>
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-6 space-y-2">
              <h4 className="font-medium">Selected Files ({files.length})</h4>
              <div className="space-y-2">
                {files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">{file.preview}</span>
                      <Badge variant="outline" className="text-xs">
                        {(file.file.size / 1024 / 1024).toFixed(2)} MB
                      </Badge>
                    </div>
                    {!isAnalyzing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {isAnalyzing && (
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Upload Progress</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Upload Button */}
          <div className="mt-6 flex justify-center">
            <Button
              onClick={handleUpload}
              disabled={files.length === 0 || isAnalyzing}
              size="lg"
              className="min-w-48"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Resumes...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Start Multi-Agent Analysis
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Agent Status Display */}
      {(isAnalyzing || Object.keys(currentAgents).length > 0) && (
        <AgentStatusManager
          agents={currentAgents}
          isAnalyzing={isAnalyzing}
        />
      )}

      {/* Results Summary */}
      {analysisResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Analysis Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{result.filename}</p>
                        {result.error ? (
                          <p className="text-sm text-red-600">{result.error}</p>
                        ) : (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {result.candidateName || 'Analysis completed'}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {result.error ? (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {result.analysisMetadata && (
                        <Badge variant="outline">
                          {result.analysisMetadata.completedAgents}/{result.analysisMetadata.totalAgents} agents
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
} 
"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from "framer-motion"
import { 
  FileText, 
  Target, 
  Wrench, 
  Briefcase, 
  TrendingUp, 
  Star, 
  Brain,
  Clock,
  CheckCircle,
  BarChart3
} from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MultiAgentAnalysisViewProps {
  multiAgentData: {
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
  candidateName?: string
}

const AGENT_SECTIONS = [
  {
    id: 'documentProcessing',
    title: 'Document Processing',
    description: 'Extracted information and document analysis',
    icon: FileText,
    color: '#3B82F6',
    key: 'documentProcessing'
  },
  {
    id: 'roleMatching',
    title: 'Role Matching',
    description: 'Job role compatibility and fit analysis',
    icon: Target,
    color: '#10B981',
    key: 'roleMatching'
  },
  {
    id: 'skillsAnalysis',
    title: 'Skills Analysis',
    description: 'Technical and soft skills evaluation',
    icon: Wrench,
    color: '#F59E0B',
    key: 'skillsAnalysis'
  },
  {
    id: 'experienceReview',
    title: 'Experience Review',
    description: 'Work history and achievements assessment',
    icon: Briefcase,
    color: '#8B5CF6',
    key: 'experienceReview'
  },
  {
    id: 'growthAnalysis',
    title: 'Growth Analysis',
    description: 'Career potential and development trajectory',
    icon: TrendingUp,
    color: '#06B6D4',
    key: 'growthAnalysis'
  },
  {
    id: 'strengthsAssessment',
    title: 'Strengths Assessment',
    description: 'Key advantages and competitive strengths',
    icon: Star,
    color: '#F97316',
    key: 'strengthsAssessment'
  },
  {
    id: 'finalSynthesis',
    title: 'Final Synthesis',
    description: 'Comprehensive analysis summary and recommendations',
    icon: Brain,
    color: '#EC4899',
    key: 'finalSynthesis'
  }
]

export function MultiAgentAnalysisView({ 
  multiAgentData, 
  candidateName 
}: MultiAgentAnalysisViewProps) {
  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  return (
    <div className="space-y-6">
      {/* Header with Metadata */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">
                  Multi-Agent Analysis: {candidateName}
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Comprehensive AI-powered resume analysis
                </p>
              </div>
            </div>
            {multiAgentData.analysisMetadata && (
              <div className="text-right space-y-1">
                <Badge variant="outline" className="mb-2">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {multiAgentData.analysisMetadata.completedAgents}/{multiAgentData.analysisMetadata.totalAgents} Agents
                </Badge>
                <div className="text-sm text-gray-600 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatTime(multiAgentData.analysisMetadata.totalProcessingTime)}
                </div>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Agent Analysis Sections */}
      <div className="grid gap-6">
        {AGENT_SECTIONS.map((section, index) => {
          const content = multiAgentData[section.key as keyof typeof multiAgentData] as string
          if (!content) return null

          const IconComponent = section.icon

          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: `${section.color}20` }}
                    >
                      <IconComponent 
                        className="h-5 w-5" 
                        style={{ color: section.color }}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg" style={{ color: section.color }}>
                        {section.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        {section.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="max-h-96">
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({ children }) => (
                            <h1 className="text-lg font-semibold text-gray-900 mb-3">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-base font-semibold text-gray-800 mb-2">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">
                              {children}
                            </h3>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal list-inside space-y-1 text-gray-700">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="text-sm leading-relaxed">{children}</li>
                          ),
                          p: ({ children }) => (
                            <p className="text-sm text-gray-700 leading-relaxed mb-3">
                              {children}
                            </p>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold text-gray-900">
                              {children}
                            </strong>
                          ),
                          code: ({ children }) => (
                            <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">
                              {children}
                            </code>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600">
                              {children}
                            </blockquote>
                          )
                        }}
                      >
                        {content}
                      </ReactMarkdown>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Agent Performance Summary */}
      {multiAgentData.agentStatuses && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Agent Performance Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(multiAgentData.agentStatuses).map(([agentId, status]: [string, any]) => {
                const agentConfig = AGENT_SECTIONS.find(s => s.id === agentId || s.key === agentId)
                if (!agentConfig) return null

                return (
                  <div key={agentId} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">
                      {agentConfig.title}
                    </div>
                    <div className="font-semibold text-sm mb-1">
                      {status.status === 'completed' ? '✅' : '❌'} {status.status}
                    </div>
                    {status.processingTime && (
                      <div className="text-xs text-gray-500">
                        {formatTime(status.processingTime)}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 
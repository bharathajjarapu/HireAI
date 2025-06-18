"use client"

import React, { useState, useEffect } from 'react'
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
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
  AlertTriangle,
  Loader2,
  Zap,
  Sparkles
} from "lucide-react"

interface AgentStatus {
  status: 'idle' | 'working' | 'completed' | 'error'
  progress: number
  message: string
  startTime?: number
  endTime?: number
  processingTime?: number
}

interface AgentStatusManagerProps {
  agents: Record<string, AgentStatus>
  isAnalyzing: boolean
  onAgentUpdate?: (agentId: string, status: AgentStatus) => void
}

const AGENT_CONFIGS = [
  {
    id: 'document_processor',
    name: 'Document Processor',
    description: 'Extracting and organizing resume content',
    icon: FileText,
    color: '#3B82F6',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    progressColor: 'from-blue-400 to-blue-600'
  },
  {
    id: 'role_matching',
    name: 'Role Matching Specialist',
    description: 'Analyzing job role compatibility',
    icon: Target,
    color: '#10B981',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    progressColor: 'from-green-400 to-green-600'
  },
  {
    id: 'skills_analysis',
    name: 'Skills Analyzer',
    description: 'Evaluating technical and soft skills',
    icon: Wrench,
    color: '#F59E0B',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    progressColor: 'from-amber-400 to-amber-600'
  },
  {
    id: 'experience_review',
    name: 'Experience Reviewer',
    description: 'Assessing work history and achievements',
    icon: Briefcase,
    color: '#8B5CF6',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    progressColor: 'from-purple-400 to-purple-600'
  },
  {
    id: 'growth_analysis',
    name: 'Growth Analyst',
    description: 'Evaluating career potential and trajectory',
    icon: TrendingUp,
    color: '#06B6D4',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    progressColor: 'from-cyan-400 to-cyan-600'
  },
  {
    id: 'strengths_assessment',
    name: 'Strengths Assessor',
    description: 'Identifying key advantages and strengths',
    icon: Star,
    color: '#F97316',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    progressColor: 'from-orange-400 to-orange-600'
  },
  {
    id: 'final_synthesis',
    name: 'Synthesis Specialist',
    description: 'Creating comprehensive final analysis',
    icon: Brain,
    color: '#EC4899',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    progressColor: 'from-pink-400 to-pink-600'
  },
  {
    id: 'finalizer',
    name: 'Finalizer',
    description: 'Generating final analysis results',
    icon: Zap,
    color: '#7C3AED',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    progressColor: 'from-violet-400 to-violet-600'
  }
]

export function AgentStatusManager({ 
  agents, 
  isAnalyzing, 
  onAgentUpdate 
}: AgentStatusManagerProps) {
  const completedAgents = Object.values(agents).filter(agent => agent.status === 'completed').length
  const totalAgents = AGENT_CONFIGS.length
  const overallProgress = totalAgents > 0 ? (completedAgents / totalAgents) * 100 : 0

  const getStatusIcon = (status: AgentStatus['status']) => {
    switch (status) {
      case 'idle':
        return <Clock className="w-4 h-4 text-gray-400" />
      case 'working':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4"
    >
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <motion.div
            animate={{ 
              scale: isAnalyzing ? [1, 1.05, 1] : 1,
            }}
            transition={{ 
              duration: 1.5, 
              repeat: isAnalyzing ? Infinity : 0,
            }}
            className="p-1.5 bg-gradient-to-br from-purple-500 to-blue-600 rounded-md"
          >
            <Brain className="w-3 h-3 text-white" />
          </motion.div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">AI Agents Processing</h4>
            <p className="text-xs text-gray-600">{completedAgents}/{totalAgents} agents completed</p>
          </div>
        </div>
        
        <div className="text-right">
          <Badge 
            variant="outline"
            className={`text-xs px-2 py-0.5 ${
              isAnalyzing ? 'border-blue-300 text-blue-700 bg-blue-50' : 
              completedAgents === totalAgents ? 'border-green-300 text-green-700 bg-green-50' : 
              'border-gray-300 text-gray-700 bg-gray-50'
            }`}
          >
            {Math.round(overallProgress)}% Complete
          </Badge>
        </div>
      </div>

      {/* Compact Progress Bar */}
      <div className="mb-3">
        <Progress value={overallProgress} className="h-1.5 bg-gray-200" />
      </div>
      
      {/* 4x2 Grid Layout for Agents */}
      <div className="grid grid-cols-2 gap-2">
        {AGENT_CONFIGS.map((config, index) => {
          const agent = agents[config.id] || { 
            status: 'idle' as const, 
            progress: 0, 
            message: 'Waiting to start...' 
          }
          const IconComponent = config.icon

          return (
            <motion.div
              key={config.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
              className={`
                relative p-3 rounded-md border transition-all duration-200
                ${agent.status === 'working' ? 'bg-blue-50 border-blue-200 shadow-sm' : ''}
                ${agent.status === 'completed' ? 'bg-green-50 border-green-200' : ''}
                ${agent.status === 'idle' ? 'bg-gray-50 border-gray-200' : ''}
                ${agent.status === 'error' ? 'bg-red-50 border-red-200' : ''}
                hover:shadow-sm
              `}
            >
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{
                    scale: agent.status === 'working' ? [1, 1.1, 1] : 1,
                  }}
                  transition={{
                    duration: 1,
                    repeat: agent.status === 'working' ? Infinity : 0
                  }}
                  className="flex-shrink-0"
                >
                  <IconComponent 
                    className="w-4 h-4" 
                    style={{ color: config.color }}
                  />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-medium text-gray-900 truncate">
                    {config.name.replace(' Specialist', '').replace(' Analyzer', '').replace(' Processor', '')}
                  </h5>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${
                      agent.status === 'working' ? 'text-blue-600' :
                      agent.status === 'completed' ? 'text-green-600' :
                      agent.status === 'error' ? 'text-red-600' :
                      'text-gray-500'
                    }`}>
                      {agent.status === 'working' ? 'Processing...' :
                       agent.status === 'completed' ? 'Complete' :
                       agent.status === 'error' ? 'Error' :
                       'Waiting'}
                    </span>
                    {getStatusIcon(agent.status)}
                  </div>
                </div>
              </div>
              
              {/* Mini Progress Bar for Working Agents */}
              {agent.status === 'working' && (
                <div className="mt-1">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <motion.div
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-1.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${agent.progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Processing Status */}
      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-center"
        >
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-600">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Sparkles className="w-3 h-3 text-purple-500" />
            </motion.div>
            <span>
              {completedAgents === 0 ? 'Initializing agents...' :
               completedAgents === totalAgents ? 'Finalizing results...' :
               'Processing with multiple AI agents...'}
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
} 
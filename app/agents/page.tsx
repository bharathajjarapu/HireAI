"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Brain, Zap, Users, Target, Code, TrendingUp, Star, FileText, Briefcase, Wrench, Play } from 'lucide-react'
import Link from 'next/link'
import { AgentStatusManager } from '../components/AgentStatusManager'

const AGENT_DETAILS = [
  {
    id: 'document_processor',
    name: 'Document Processor',
    description: 'Extracts and organizes resume content with high accuracy',
    icon: FileText,
    color: '#3B82F6',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    capabilities: [
      'PDF text extraction and parsing',
      'Document structure analysis',
      'Contact information extraction',
      'Section identification and organization',
      'Quality assessment and validation'
    ],
    specialties: ['OCR Processing', 'Text Analysis', 'Data Extraction']
  },
  {
    id: 'role_matching',
    name: 'Role Matching Specialist',
    description: 'Analyzes job role compatibility with precision',
    icon: Target,
    color: '#10B981',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    capabilities: [
      'Role compatibility analysis',
      'Skills-to-job mapping',
      'Industry fit assessment',
      'Seniority level evaluation',
      'Career transition potential analysis'
    ],
    specialties: ['Job Market Analysis', 'Role Mapping', 'Career Guidance']
  },
  {
    id: 'skills_analysis',
    name: 'Skills Analyzer',
    description: 'Evaluates technical and soft skills comprehensively',
    icon: Wrench,
    color: '#F59E0B',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    capabilities: [
      'Technical skills assessment',
      'Soft skills evaluation',
      'Proficiency level estimation',
      'Skill gap identification',
      'Learning trajectory analysis'
    ],
    specialties: ['Technical Assessment', 'Competency Mapping', 'Skill Development']
  },
  {
    id: 'experience_review',
    name: 'Experience Reviewer',
    description: 'Assesses work history and achievements thoroughly',
    icon: Briefcase,
    color: '#8B5CF6',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    capabilities: [
      'Career progression analysis',
      'Achievement quantification',
      'Impact assessment',
      'Leadership experience evaluation',
      'Project management skills review'
    ],
    specialties: ['Career Analysis', 'Achievement Metrics', 'Leadership Assessment']
  },
  {
    id: 'growth_analysis',
    name: 'Growth Analyst',
    description: 'Evaluates career potential and development trajectory',
    icon: TrendingUp,
    color: '#06B6D4',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    capabilities: [
      'Growth potential assessment',
      'Learning ability evaluation',
      'Adaptability analysis',
      'Innovation capacity review',
      'Future readiness scoring'
    ],
    specialties: ['Potential Assessment', 'Growth Prediction', 'Adaptability Analysis']
  },
  {
    id: 'strengths_assessment',
    name: 'Strengths Assessor',
    description: 'Identifies key advantages and competitive strengths',
    icon: Star,
    color: '#F97316',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    capabilities: [
      'Unique value proposition identification',
      'Competitive advantage analysis',
      'Standout skill highlighting',
      'Differentiation factor assessment',
      'Market positioning evaluation'
    ],
    specialties: ['Competitive Analysis', 'Value Proposition', 'Market Positioning']
  },
  {
    id: 'final_synthesis',
    name: 'Synthesis Specialist',
    description: 'Creates comprehensive analysis and recommendations',
    icon: Brain,
    color: '#EC4899',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    capabilities: [
      'Multi-perspective analysis synthesis',
      'Holistic candidate profiling',
      'Strategic recommendation generation',
      'Executive summary creation',
      'Decision support insights'
    ],
    specialties: ['Strategic Analysis', 'Decision Support', 'Executive Insights']
  }
]

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [isDemo, setIsDemo] = useState(false)
  const [demoAgents, setDemoAgents] = useState<Record<string, any>>({})

  const startDemo = () => {
    setIsDemo(true)
    // Initialize demo with all agents idle
    const initialStatuses: Record<string, any> = {}
    AGENT_DETAILS.forEach(agent => {
      initialStatuses[agent.id] = {
        status: 'idle',
        progress: 0,
        message: 'Ready for demonstration...'
      }
    })
    setDemoAgents(initialStatuses)
    
    // Simulate demo workflow
    setTimeout(() => simulateDemo(), 1000)
  }

  const simulateDemo = async () => {
    for (const agent of AGENT_DETAILS) {
      // Start agent
      setDemoAgents(prev => ({
        ...prev,
        [agent.id]: {
          status: 'working',
          progress: 0,
          message: `${agent.name} is analyzing...`
        }
      }))

      // Progressive updates
      for (let progress = 10; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200))
        setDemoAgents(prev => ({
          ...prev,
          [agent.id]: {
            ...prev[agent.id],
            progress,
            message: progress < 100 ? `${agent.name} processing...` : 'Analysis complete'
          }
        }))
      }

      // Complete agent
      setDemoAgents(prev => ({
        ...prev,
        [agent.id]: {
          ...prev[agent.id],
          status: 'completed',
          progress: 100,
          message: 'Analysis complete',
          processingTime: 1500 + Math.random() * 1000
        }
      }))

      await new Promise(resolve => setTimeout(resolve, 300))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-100">
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b bg-white/95 backdrop-blur-xl sticky top-0 z-50 shadow-sm"
      >
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/resume-parser">
                <Button variant="ghost" className="hover:bg-purple-50 text-gray-700 hover:text-purple-700 transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Parser
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">AI Agents System</h1>
                  <p className="text-sm text-gray-500">Multi-agent resume analysis platform</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                <Users className="w-3 h-3 mr-1" />
                {AGENT_DETAILS.length} Agents
              </Badge>
              <Button
                onClick={startDemo}
                disabled={isDemo}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                {isDemo ? 'Demo Running...' : 'Run Demo'}
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Demo Agent Status */}
        {isDemo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <AgentStatusManager
              agents={demoAgents}
              isAnalyzing={Object.values(demoAgents).some((agent: any) => agent.status === 'working')}
            />
          </motion.div>
        )}

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Multi-Agent AI Analysis System
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our advanced AI system employs 7 specialized agents that work together to provide 
            comprehensive resume analysis. Each agent focuses on specific aspects of candidate 
            evaluation, ensuring thorough and accurate insights.
          </p>
        </motion.div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {AGENT_DETAILS.map((agent, index) => {
            const IconComponent = agent.icon
            const isSelected = selectedAgent === agent.id

            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`
                  cursor-pointer transition-all duration-300
                  ${isSelected ? 'ring-2 ring-purple-500 shadow-lg' : ''}
                `}
                onClick={() => setSelectedAgent(isSelected ? null : agent.id)}
              >
                <Card className={`h-full ${agent.bgColor} ${agent.borderColor} border-2 hover:shadow-xl transition-all duration-300`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <IconComponent 
                          className="w-6 h-6" 
                          style={{ color: agent.color }}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg" style={{ color: agent.color }}>
                          {agent.name}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          {agent.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      {/* Specialties */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Specialties</h4>
                        <div className="flex flex-wrap gap-1">
                          {agent.specialties.map((specialty, i) => (
                            <Badge 
                              key={i} 
                              variant="secondary" 
                              className="text-xs"
                              style={{ 
                                backgroundColor: `${agent.color}20`,
                                color: agent.color 
                              }}
                            >
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Capabilities Preview */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                          Key Capabilities ({agent.capabilities.length})
                        </h4>
                        <p className="text-xs text-gray-600">
                          {agent.capabilities.slice(0, 2).join(', ')}
                          {agent.capabilities.length > 2 && '...'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Detailed Agent View */}
        <AnimatePresence>
          {selectedAgent && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {(() => {
                const agent = AGENT_DETAILS.find(a => a.id === selectedAgent)
                if (!agent) return null
                
                const IconComponent = agent.icon

                return (
                  <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div 
                            className="p-4 rounded-xl"
                            style={{ backgroundColor: `${agent.color}20` }}
                          >
                            <IconComponent 
                              className="w-8 h-8" 
                              style={{ color: agent.color }}
                            />
                          </div>
                          <div>
                            <CardTitle className="text-2xl" style={{ color: agent.color }}>
                              {agent.name}
                            </CardTitle>
                            <p className="text-gray-600 mt-1">
                              {agent.description}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedAgent(null)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ✕
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Capabilities */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Core Capabilities
                          </h3>
                          <ul className="space-y-3">
                            {agent.capabilities.map((capability, i) => (
                              <li key={i} className="flex items-start space-x-3">
                                <div 
                                  className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                                  style={{ backgroundColor: agent.color }}
                                />
                                <span className="text-gray-700">{capability}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Specialties & Stats */}
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                              Specialization Areas
                            </h3>
                            <div className="grid grid-cols-1 gap-3">
                              {agent.specialties.map((specialty, i) => (
                                <div 
                                  key={i}
                                  className="p-3 rounded-lg border-2"
                                  style={{ 
                                    backgroundColor: `${agent.color}10`,
                                    borderColor: `${agent.color}30`
                                  }}
                                >
                                  <span 
                                    className="font-medium"
                                    style={{ color: agent.color }}
                                  >
                                    {specialty}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                              Performance Metrics
                            </h3>
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Accuracy Rate:</span>
                                <span className="font-semibold text-green-600">98.5%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Avg. Processing Time:</span>
                                <span className="font-semibold text-blue-600">2.3s</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Confidence Level:</span>
                                <span className="font-semibold text-purple-600">95.2%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* System Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <Card className="border-0 shadow-xl bg-gradient-to-r from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Zap className="w-6 h-6 text-purple-600" />
                <span>How It Works</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Document Processing</h4>
                  <p className="text-sm text-gray-600">
                    Resume is parsed and structured data is extracted for analysis
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Multi-Agent Analysis</h4>
                  <p className="text-sm text-gray-600">
                    6 specialized agents analyze different aspects simultaneously
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Synthesis & Report</h4>
                  <p className="text-sm text-gray-600">
                    Final agent creates comprehensive analysis and recommendations
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 
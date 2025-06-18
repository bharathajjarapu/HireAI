"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Users,
  Mail,
  Eye,
  MousePointer,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Target,
  Clock,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

const analyticsData = {
  overview: {
    totalJobs: 24,
    totalCandidates: 1247,
    emailsSent: 892,
    responseRate: 68,
    hireRate: 12,
  },
  emailMetrics: {
    sent: 892,
    opened: 607,
    clicked: 234,
    replied: 156,
    scheduled: 89,
  },
  recentActivity: [
    { type: "email_sent", candidate: "Sarah Chen", job: "Backend Engineer", time: "2 hours ago", status: "sent" },
    { type: "email_opened", candidate: "David Kim", job: "AI/ML Engineer", time: "3 hours ago", status: "opened" },
    {
      type: "email_replied",
      candidate: "Emily Watson",
      job: "DevOps Engineer",
      time: "5 hours ago",
      status: "replied",
    },
    {
      type: "interview_scheduled",
      candidate: "Marcus Rodriguez",
      job: "Full Stack Developer",
      time: "1 day ago",
      status: "scheduled",
    },
  ],
  topPerformingJobs: [
    { title: "AI/ML Engineer", candidates: 67, responseRate: 78, hires: 3 },
    { title: "Backend Engineer", candidates: 45, responseRate: 72, hires: 2 },
    { title: "DevOps Engineer", candidates: 28, responseRate: 65, hires: 1 },
    { title: "Frontend Developer", candidates: 32, responseRate: 58, hires: 1 },
  ],
}

const MetricCard = ({ title, value, subtitle, icon: Icon, color, trend }: any) => (
  <motion.div whileHover={{ scale: 1.02, y: -2 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <motion.p
              className="text-3xl font-bold text-gray-900"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              {value}
            </motion.p>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>
        </div>
        {trend && (
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">{trend}%</span>
            <span className="text-gray-500 ml-1">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  </motion.div>
)

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("30d")

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "email_sent":
        return Mail
      case "email_opened":
        return Eye
      case "email_replied":
        return MousePointer
      case "interview_scheduled":
        return Calendar
      default:
        return Mail
    }
  }

  const getActivityColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-blue-100 text-blue-800"
      case "opened":
        return "bg-green-100 text-green-800"
      case "replied":
        return "bg-purple-100 text-purple-800"
      case "scheduled":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100">
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="hover:bg-indigo-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>

            <div className="flex items-center space-x-3">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
              <h1 className="text-xl font-bold text-gray-900">Analytics Dashboard</h1>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50">
                <Filter className="w-4 h-4 mr-1" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50">
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="border-indigo-200 hover:bg-indigo-50">
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-8">
        {/* Time Range Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center space-x-2 mb-8"
        >
          {["7d", "30d", "90d", "1y"].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range)}
              className={timeRange === range ? "bg-indigo-600 hover:bg-indigo-700" : "border-gray-200 hover:bg-gray-50"}
            >
              {range === "7d" && "Last 7 days"}
              {range === "30d" && "Last 30 days"}
              {range === "90d" && "Last 90 days"}
              {range === "1y" && "Last year"}
            </Button>
          ))}
        </motion.div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <MetricCard
            title="Active Jobs"
            value={analyticsData.overview.totalJobs}
            icon={Target}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            trend={15}
          />
          <MetricCard
            title="Candidates Found"
            value={analyticsData.overview.totalCandidates.toLocaleString()}
            icon={Users}
            color="bg-gradient-to-r from-green-500 to-green-600"
            trend={23}
          />
          <MetricCard
            title="Emails Sent"
            value={analyticsData.overview.emailsSent}
            icon={Mail}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
            trend={18}
          />
          <MetricCard
            title="Response Rate"
            value={`${analyticsData.overview.responseRate}%`}
            icon={TrendingUp}
            color="bg-gradient-to-r from-orange-500 to-orange-600"
            trend={8}
          />
          <MetricCard
            title="Hire Rate"
            value={`${analyticsData.overview.hireRate}%`}
            icon={CheckCircle}
            color="bg-gradient-to-r from-indigo-500 to-indigo-600"
            trend={12}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Email Funnel */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-purple-600" />
                  <span>Email Engagement Funnel</span>
                </CardTitle>
                <CardDescription>Track your email campaign performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    label: "Emails Sent",
                    value: analyticsData.emailMetrics.sent,
                    percentage: 100,
                    color: "bg-blue-500",
                  },
                  {
                    label: "Emails Opened",
                    value: analyticsData.emailMetrics.opened,
                    percentage: 68,
                    color: "bg-green-500",
                  },
                  {
                    label: "Links Clicked",
                    value: analyticsData.emailMetrics.clicked,
                    percentage: 26,
                    color: "bg-purple-500",
                  },
                  {
                    label: "Replies Received",
                    value: analyticsData.emailMetrics.replied,
                    percentage: 17,
                    color: "bg-orange-500",
                  },
                  {
                    label: "Interviews Scheduled",
                    value: analyticsData.emailMetrics.scheduled,
                    percentage: 10,
                    color: "bg-indigo-500",
                  },
                ].map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-gray-900">{metric.value}</span>
                        <span className="text-xs text-gray-500">({metric.percentage}%)</span>
                      </div>
                    </div>
                    <div className="relative">
                      <Progress value={metric.percentage} className="h-2" />
                      <motion.div
                        className={`absolute top-0 left-0 h-2 rounded-full ${metric.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.percentage}%` }}
                        transition={{ duration: 1, delay: 0.2 * index }}
                      />
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Performing Jobs */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span>Top Performing Jobs</span>
                </CardTitle>
                <CardDescription>Jobs with highest response rates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analyticsData.topPerformingJobs.map((job, index) => (
                  <motion.div
                    key={job.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="p-4 rounded-lg border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{job.title}</h4>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {job.responseRate}% response
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Candidates</p>
                        <p className="font-medium text-gray-900">{job.candidates}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Response Rate</p>
                        <p className="font-medium text-gray-900">{job.responseRate}%</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Hires</p>
                        <p className="font-medium text-gray-900">{job.hires}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>Latest interactions with candidates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.recentActivity.map((activity, index) => {
                  const Icon = getActivityIcon(activity.type)
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.01, x: 5 }}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200"
                    >
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </motion.div>

                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.candidate}</p>
                        <p className="text-sm text-gray-600">{activity.job}</p>
                      </div>

                      <div className="text-right">
                        <Badge variant="secondary" className={getActivityColor(activity.status)}>
                          {activity.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

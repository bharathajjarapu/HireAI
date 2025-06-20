"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Trash, Eye, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface JobData {
  id: string
  title: string
  description: string
  applicantCount: number
  status: string
  createdAt: string
}

export default function JobsListPage() {
  const [jobs, setJobs] = useState<JobData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchJobs = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/jobs')
      if (res.ok) {
        const data = await res.json()
        setJobs(data.jobs)
      }
    } catch (_) {}
    setIsLoading(false)
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const deleteJob = async (id: string) => {
    if (!confirm('Delete this job permanently?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/jobs?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setJobs(prev => prev.filter(j => j.id !== id))
      }
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/create-job">
            <Button variant="ghost" className="hover:bg-blue-50">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">All Jobs</h1>
          <div></div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {jobs.length === 0 ? (
            <p className="text-center text-gray-600">No jobs found.</p>
          ) : (
            jobs.map(job => (
              <Card key={job.id} className="shadow">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-bold">{job.title}</CardTitle>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 capitalize">
                      {job.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-gray-700 line-clamp-3">{job.description}</p>

                  <div className="flex gap-2">
                    <Link href={`/jobs/${job.id}/applicants`} className="flex-1">
                      <Button className="w-full" variant="outline">
                        <Eye className="w-4 h-4 mr-2" /> Applicants ({job.applicantCount})
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      onClick={() => deleteJob(job.id)}
                      disabled={deletingId === job.id}
                    >
                      {deletingId === job.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Trash className="w-4 h-4 mr-2" />
                      )}
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
} 
/*
  Shared in-memory store for demo purposes.
  In production, replace with a proper database.
*/

declare global {
  var __jobStore__: Map<string, JobRecord> | undefined
  var __appStore__: Map<string, ApplicationRecord> | undefined
}

export interface JobRecord {
  id: string
  title: string
  description: string
  requirements: string[]
  skills: string[]
  location: string
  salary: string
  experience: string
  company: string
  formUrl: string
  applicantCount: number
  status: 'active' | 'draft'
  createdAt: string
  applications: any[]
}

export interface ApplicationRecord {
  id: string
  jobId: string
  name: string
  email: string
  phone?: string
  linkedin?: string
  github?: string
  coverLetter?: string
  resumeFilename: string
  resumePath: string
  submittedAt: string
  status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected'
  score?: number | null
  ranking?: number | null
}

export const JobStore: Map<string, JobRecord> = globalThis.__jobStore__ || new Map()
export const ApplicationStore: Map<string, ApplicationRecord> = globalThis.__appStore__ || new Map()

if (!globalThis.__jobStore__) {
  globalThis.__jobStore__ = JobStore
  globalThis.__appStore__ = ApplicationStore
} 
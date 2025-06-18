import { NextRequest, NextResponse } from 'next/server'
import { JobStore, JobRecord } from '@/lib/store'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id

    // In a real app, fetch from database
    // For demo, we'll create a sample job or return from memory
    let job = JobStore.get(jobId)
    
    if (!job) {
      // Create a sample job for demo purposes
      job = {
        id: jobId,
        title: "Senior React Developer",
        description: "We are looking for a talented Senior React Developer to join our dynamic team. You will be responsible for developing and maintaining high-quality web applications using React.js and modern JavaScript technologies.",
        location: "Remote/Flexible",
        salary: "Competitive",
        company: "Tech Innovators Inc.",
        requirements: [
          "5+ years of experience with React.js",
          "Strong proficiency in JavaScript, HTML, and CSS",
          "Experience with Redux or similar state management",
          "Knowledge of modern build tools and workflows",
          "Bachelor's degree in Computer Science or equivalent"
        ],
        skills: [
          "React.js",
          "JavaScript",
          "TypeScript",
          "Redux",
          "Node.js",
          "HTML/CSS",
          "Git"
        ],
        status: 'active',
        createdAt: new Date().toISOString(),
        applications: []
      }
      JobStore.set(jobId, job)
    }

    return NextResponse.json(job)

  } catch (error) {
    console.error('Error fetching job:', error)
    return NextResponse.json(
      { error: 'Failed to fetch job details' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id
    const updates = await req.json()

    let job = JobStore.get(jobId)
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // Update job with new data
    job = { ...job, ...updates, id: jobId }
    JobStore.set(jobId, job)

    return NextResponse.json(job)

  } catch (error) {
    console.error('Error updating job:', error)
    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 }
    )
  }
} 
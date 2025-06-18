import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { ApplicationStore, JobStore } from '@/lib/store'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    
    const jobId = formData.get('jobId') as string
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const linkedin = formData.get('linkedin') as string
    const github = formData.get('github') as string
    const coverLetter = formData.get('coverLetter') as string
    const resumeFile = formData.get('resume') as File

    if (!jobId || !name || !email || !resumeFile) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create application ID
    const applicationId = Date.now().toString() + Math.random().toString(36).substr(2, 9)

    // Save resume file
    const bytes = await resumeFile.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure the uploads directory exists
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'resumes')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    const filename = `${applicationId}_${resumeFile.name}`
    const filepath = join(uploadsDir, filename)
    await writeFile(filepath, buffer)

    // Create application object
    const application = {
      id: applicationId,
      jobId,
      name,
      email,
      phone,
      linkedin,
      github,
      coverLetter,
      resumeFilename: filename,
      resumePath: `/uploads/resumes/${filename}`,
      submittedAt: new Date().toISOString(),
      status: 'pending' as const,
      score: null,
      ranking: null
    }

    // Store application
    ApplicationStore.set(applicationId, application)

    // Update job application count
    let job = JobStore.get(jobId)
    if (!job) {
      // Create basic job entry if it doesn't exist
      job = {
        id: jobId,
        applications: [],
        applicantCount: 0
      }
    }
    job.applications.push({
      id: applicationId,
      name,
      email,
      submittedAt: application.submittedAt,
      status: 'pending'
    })
    job.applicantCount = job.applications.length
    JobStore.set(jobId, job)

    // In a real application, you would:
    // 1. Save to database
    // 2. Send confirmation email
    // 3. Trigger resume parsing workflow
    console.log('Application submitted:', {
      applicationId,
      jobId,
      name,
      email,
      resumeFilename: filename
    })

    return NextResponse.json({
      success: true,
      applicationId,
      message: 'Application submitted successfully'
    })

  } catch (error) {
    console.error('Error submitting application:', error)
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const jobId = url.searchParams.get('jobId')
    
    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      )
    }

    const jobApplications = Array.from(ApplicationStore.values())
      .filter(app => app.jobId === jobId)
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())

    return NextResponse.json({
      applications: jobApplications,
      count: jobApplications.length
    })

  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
} 
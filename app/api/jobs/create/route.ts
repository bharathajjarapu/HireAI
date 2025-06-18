import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { JobStore, JobRecord } from '@/lib/store'

const GEMINI_KEY = process.env.GEMINI_API_KEY || ''
let genAI: GoogleGenerativeAI | null = null
if (GEMINI_KEY) {
  try {
    genAI = new GoogleGenerativeAI(GEMINI_KEY)
  } catch (_) {
    genAI = null
  }
}

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Job prompt is required' },
        { status: 400 }
      )
    }

    let jobData: any

    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" })
        const structuredPrompt = `
        Based on the following job description prompt, create a structured job posting:

        "${prompt}"

        Please respond with a JSON object containing:
        - title: A clear, concise job title
        - description: A well-formatted job description (2-3 paragraphs)
        - requirements: Array of key requirements
        - skills: Array of required skills
        - location: Work location (if mentioned, otherwise "Remote/Flexible")
        - salary: Salary range (if mentioned, otherwise "Competitive")
        - experience: Required experience level
        - company: Company name (if mentioned, otherwise "Hiring Company")

        Only return valid JSON, no additional text or formatting.
        `

        const result = await model.generateContent(structuredPrompt)
        const text = result.response.text()
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          jobData = JSON.parse(jsonMatch[0])
        }
      } catch (err) {
        console.error("AI generation failed, falling back:", err)
      }
    }

    // Fallback if AI disabled or failed
    if (!jobData) {
      jobData = {
        title: "Software Developer",
        description: prompt,
        requirements: ["Bachelor's degree or equivalent experience"],
        skills: ["Programming", "Problem solving"],
        location: "Remote/Flexible",
        salary: "Competitive",
        experience: "2+ years",
        company: "Hiring Company"
      }
    }

    // Generate unique job ID
    const jobId = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    
    // Create form URL
    const formUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/apply/${jobId}`

    // Save job data (in a real app, this would go to a database)
    // For now, we'll just return the structured data
    const job = {
      id: jobId,
      title: jobData.title,
      description: jobData.description,
      requirements: jobData.requirements,
      skills: jobData.skills,
      location: jobData.location,
      salary: jobData.salary,
      experience: jobData.experience,
      company: jobData.company,
      formUrl: formUrl,
      applicantCount: 0,
      status: 'active' as const,
      createdAt: new Date().toISOString(),
      applications: []
    }

    // Save to shared in-memory store
    JobStore.set(jobId, job as JobRecord)

    console.log('Created job:', job)

    return NextResponse.json(job)

  } catch (error) {
    console.error('Error creating job:', error)
    return NextResponse.json(
      { error: 'Failed to create job posting' },
      { status: 500 }
    )
  }
} 
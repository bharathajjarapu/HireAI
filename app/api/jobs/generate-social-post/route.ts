import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const GEMINI_KEY_SP = process.env.GEMINI_API_KEY || ''
let genAI: GoogleGenerativeAI | null = null
if (GEMINI_KEY_SP) {
  try {
    genAI = new GoogleGenerativeAI(GEMINI_KEY_SP)
  } catch (_) {
    genAI = null
  }
}

// Helper to build the prompt per platform
function buildPrompt(platform: string, jobTitle: string, jobDescription: string, formUrl: string) {
  switch (platform) {
    case 'linkedin':
      return `Create a professional LinkedIn job posting for the following role.\n\nJob Title: ${jobTitle}\nDescription: ${jobDescription}\nApplication Link: ${formUrl}\n\nThe tone should be engaging yet professional, include suitable hashtags and a strong call-to-action for applicants to apply via the link provided. Keep it under 300 words and format optimally for LinkedIn.`
    case 'twitter':
      return `Craft an eye-catching Twitter post to advertise the job below.\n\nJob Title: ${jobTitle}\nDescription: ${jobDescription}\nApplication Link: ${formUrl}\n\nKeep it concise (under 280 characters), include relevant hashtags and a clear call to action to apply.`
    default:
      return `Create a versatile professional job promotion message that can be posted on websites, newsletters or Slack channels.\n\nJob Title: ${jobTitle}\nDescription: ${jobDescription}\nApplication Link: ${formUrl}\n\nKeep it concise, engaging and clearly direct applicants to the link above to apply.`
  }
}

export async function POST(req: NextRequest) {
  try {
    const { jobTitle, jobDescription, formUrl, platform = 'linkedin' } = await req.json()

    if (!jobTitle || !jobDescription || !formUrl) {
      return NextResponse.json(
        { error: 'Job title, description and form URL are required' },
        { status: 400 }
      )
    }

    // Build AI prompt
    const prompt = buildPrompt(platform, jobTitle, jobDescription, formUrl)

    // Generate post
    let content = ''
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
        const result = await model.generateContent(prompt)
        content = result.response.text().replace(/```|markdown/g, '').trim()
      } catch (_) {
        content = ''
      }
    }

    // Fallback text if AI unavailable / failed
    if (!content) {
      if (platform === 'twitter') {
        content = `🔥 Hiring: ${jobTitle}. Apply here → ${formUrl} #Jobs #Hiring #${jobTitle.replace(/[^A-Za-z]/g, '')}`
      } else if (platform === 'linkedin') {
        content = `🚀 We are looking for a talented ${jobTitle}!\n\n${jobDescription}\n\nInterested candidates can apply directly here: ${formUrl}\n\n#Hiring #Career #JobOpportunity`
      } else {
        content = `${jobTitle} – ${jobDescription}. Apply now: ${formUrl}`
      }
    }

    // Build Pollinations image URL (deterministic seed based on jobTitle hash for variety)
    const encodedPrompt = encodeURIComponent(`professional illustration for ${jobTitle} job post`)
    const seed = Math.abs(
      [...jobTitle].reduce((acc, char) => acc + char.charCodeAt(0), 0)
    ) % 1000 // simple hash to keep seed within range
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=720&seed=${seed}&model=flux&nologo=true`

    return NextResponse.json({ content, imageUrl })
  } catch (error) {
    console.error('Error generating social post:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate social post'
      },
      { status: 500 }
    )
  }
} 
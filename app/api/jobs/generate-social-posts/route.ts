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

export async function POST(req: NextRequest) {
  try {
    const { jobId, jobTitle, jobDescription, formUrl } = await req.json()

    if (!jobTitle || !jobDescription || !formUrl) {
      return NextResponse.json(
        { error: 'Job title, description, and form URL are required' },
        { status: 400 }
      )
    }

    if (!genAI) {
      // If no AI key, return simple fallback posts
      return NextResponse.json({
        linkedin: `We're hiring for ${jobTitle}! Apply here: ${formUrl}`,
        facebook: `Join our team as ${jobTitle}. Apply now at ${formUrl}`,
        twitter: `Hiring ${jobTitle}! Apply: ${formUrl}`,
        general: `Opportunity: ${jobTitle}. Apply: ${formUrl}`
      })
    }

    const model = genAI?.getGenerativeModel({ model: "gemini-pro" })
    
    // Generate LinkedIn post
    const linkedinPrompt = `
    Create a professional LinkedIn job posting for the following role:
    
    Job Title: ${jobTitle}
    Description: ${jobDescription}
    Application Link: ${formUrl}
    
    Make it engaging, professional, and include relevant hashtags. Mention that candidates can apply directly through the link.
    Keep it under 300 words and format it for LinkedIn.
    `

    // Generate Facebook post
    const facebookPrompt = `
    Create a Facebook job posting for the following role:
    
    Job Title: ${jobTitle}
    Description: ${jobDescription}
    Application Link: ${formUrl}
    
    Make it friendly and engaging, suitable for Facebook's tone. Include the application link.
    Keep it under 250 words.
    `

    // Generate Twitter post
    const twitterPrompt = `
    Create a Twitter job posting for the following role:
    
    Job Title: ${jobTitle}
    Description: ${jobDescription}
    Application Link: ${formUrl}
    
    Make it concise and engaging, suitable for Twitter's character limit. Include relevant hashtags and the application link.
    Keep it under 280 characters.
    `

    // Generate general post
    const generalPrompt = `
    Create a general job posting that can be used on various platforms for the following role:
    
    Job Title: ${jobTitle}
    Description: ${jobDescription}
    Application Link: ${formUrl}
    
    Make it versatile and professional, suitable for job boards, company websites, or other platforms.
    Keep it concise but informative.
    `

    // Generate all posts in parallel
    const [linkedinResult, facebookResult, twitterResult, generalResult] = await Promise.all([
      model?.generateContent(linkedinPrompt),
      model?.generateContent(facebookPrompt),
      model?.generateContent(twitterPrompt),
      model?.generateContent(generalPrompt)
    ])

    const socialPosts = {
      linkedin: linkedinResult?.response.text().replace(/```|markdown/g, '').trim(),
      facebook: facebookResult?.response.text().replace(/```|markdown/g, '').trim(),
      twitter: twitterResult?.response.text().replace(/```|markdown/g, '').trim(),
      general: generalResult?.response.text().replace(/```|markdown/g, '').trim()
    }

    return NextResponse.json(socialPosts)

  } catch (error) {
    console.error('Error generating social posts:', error)
    
    // Fallback social posts if AI generation fails
    const fallbackPosts = {
      linkedin: `🚀 We're hiring! Looking for a talented ${req.body?.jobTitle || 'professional'} to join our team.

${req.body?.jobDescription || 'Great opportunity to grow your career!'}

Ready to take the next step in your career? Apply now: ${req.body?.formUrl}

#Hiring #Jobs #Career #Opportunity`,

      facebook: `We're looking for an amazing ${req.body?.jobTitle || 'team member'}! 

${req.body?.jobDescription || 'This could be the perfect opportunity for you!'}

Interested? Apply here: ${req.body?.formUrl}`,

      twitter: `🔥 Hiring: ${req.body?.jobTitle || 'Great Position'}

Apply now: ${req.body?.formUrl}

#Jobs #Hiring #Career`,

      general: `Position Available: ${req.body?.jobTitle || 'Open Position'}

${req.body?.jobDescription || 'Exciting opportunity to join our team!'}

To apply, please visit: ${req.body?.formUrl}`
    }

    return NextResponse.json(fallbackPosts)
  }
} 
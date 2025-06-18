import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { candidateName, jobRole, matchScore, skills } = body

    console.log('Email generation request:', { candidateName, jobRole, matchScore, skills })

    if (!candidateName || !jobRole || !skills) {
      return NextResponse.json({
        subject: `Exciting ${jobRole || 'Position'} Opportunity!`,
        body: `Dear ${candidateName || 'Candidate'},

I hope this email finds you well! We have an exciting opportunity that might interest you.

Best regards,
Hiring Team`
      })
    }

    const prompt = `Generate a professional recruitment email for the following candidate:

Candidate: ${candidateName}
Position: ${jobRole}
Match Score: ${matchScore}%
Key Skills: ${skills.join(", ")}

Create a personalized email that:
1. Has an engaging subject line
2. References their specific skills
3. Mentions their high match score if above 75%
4. Includes compelling next steps
5. Is professional yet warm
6. Mentions the specific job role prominently

Respond with ONLY a valid JSON object in this exact format:
{
  "subject": "Your subject line here",
  "body": "Your email body here"
}`

    // Try Groq API first
    const groqApiKey = process.env.GROQ_API_KEY
    
    if (groqApiKey) {
      try {
        console.log('Trying Groq API...')
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama3-8b-8192',
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 1000
          })
        })

        if (response.ok) {
          const data = await response.json()
          const content = data.choices[0]?.message?.content

          if (content) {
            console.log('Groq API response:', content)
            try {
              const emailTemplate = JSON.parse(content)
              return NextResponse.json(emailTemplate)
            } catch (parseError) {
              console.warn('Failed to parse Groq response as JSON, creating fallback')
              // Extract subject and body from the response if it's not JSON
              const lines = content.split('\n')
              let subject = `Exciting ${jobRole} Opportunity - Perfect Match!`
              let body = content
              
              if (content.includes('Subject:')) {
                const subjectLine = lines.find(line => line.toLowerCase().includes('subject:'))
                if (subjectLine) {
                  subject = subjectLine.replace(/subject:\s*/i, '').trim()
                }
              }
              
              return NextResponse.json({ subject, body })
            }
          }
        }
      } catch (groqError) {
        console.error('Groq API error:', groqError)
      }
    }

    // Try Google Gemini API as fallback
    const geminiApiKey = process.env.GOOGLE_API_KEY
    
    if (geminiApiKey) {
      try {
        console.log('Trying Gemini API...')
        const { GoogleGenerativeAI } = require('@google/generative-ai')
        const genAI = new GoogleGenerativeAI(geminiApiKey)
        const model = genAI.getGenerativeModel({ model: "gemini-pro" })
        
        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()
        
        console.log('Gemini API response:', text)
        
        try {
          const emailTemplate = JSON.parse(text)
          return NextResponse.json(emailTemplate)
        } catch (parseError) {
          console.warn('Failed to parse Gemini response as JSON, creating fallback')
          return NextResponse.json({
            subject: `Exciting ${jobRole} Opportunity - ${matchScore}% Match!`,
            body: text
          })
        }
      } catch (geminiError) {
        console.error('Gemini API error:', geminiError)
      }
    }

    // If both APIs fail, return a high-quality fallback template
    console.log('Using fallback template')
    const emailTemplate = {
      subject: `Exciting ${jobRole} Opportunity - ${matchScore}% Match!`,
      body: `Dear ${candidateName},

I hope this email finds you well! I came across your profile and was impressed by your background and skills, particularly your expertise in ${skills.slice(0, 3).join(", ")}.

We currently have an exciting ${jobRole} position that matches ${matchScore}% with your profile. Based on your experience and skills, I believe you would be an excellent fit for our team.

Key highlights of this opportunity:
• Work with cutting-edge technologies including ${skills.join(", ")}
• Competitive compensation package
• Flexible work arrangements
• Opportunity for career growth and development

I'd love to schedule a brief 15-20 minute call to discuss this opportunity further and learn more about your career goals.

Would you be available for a quick conversation this week?

Best regards,
[Your Name]
[Your Title]
[Company Name]

P.S. I noticed your expertise in ${skills[0]} - we're doing some exciting work in that area that I think you'd find very interesting!`
    }

    return NextResponse.json(emailTemplate)

  } catch (error) {
    console.error("Email generation error:", error)
    
    // Return a basic fallback template if everything fails
    return NextResponse.json({
      subject: "Exciting Career Opportunity",
      body: `Dear Candidate,

We have an exciting opportunity that might interest you.

Please let me know if you'd like to learn more.

Best regards,
Hiring Team`
    })
  }
} 
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

interface SearchRequest {
  jobRole: string
  location: string
  requirements?: string
  profileCount?: number
}

interface Candidate {
  id: number
  name: string
  title: string
  location: string
  skills: string[]
  experience: string
  score: number
  linkedin?: string
  github?: string
  summary: string
  email?: string
}

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '')
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

async function enhanceCandidateWithGemini(candidate: Candidate, jobRole: string): Promise<Candidate> {
  try {
    const prompt = `Analyze this candidate profile for a ${jobRole} position. 
    ONLY return a valid JSON object with the following fields (do not add any other text or markdown):
    
    Profile Data:
    Name: ${candidate.name}
    Title: ${candidate.title}
    Experience: ${candidate.experience}
    Skills: ${candidate.skills.join(', ')}
    Summary: ${candidate.summary}
    LinkedIn: ${candidate.linkedin || 'N/A'}
    GitHub: ${candidate.github || 'N/A'}

    Required JSON output format:
    {
      "enhancedSummary": "A detailed professional summary (2-3 sentences) based on the profile.",
      "matchScore": /* A number between 60-98 based on overall profile quality and relevance to ${jobRole} */,
      "validatedSkills": [/* An array of strings, validated skills relevant to ${jobRole} */],
      "insights": "Any additional brief insights about their expertise or potential fit (1-2 sentences)."
    }
    
    Ensure the output is ONLY the JSON object and nothing else.`

    const result = await model.generateContent(prompt)
    const response = result.response
    let text = response.text()
    
    // Clean the text to ensure it's valid JSON
    text = text.replace(/```json/g, '').replace(/```/g, '').trim()
    
    try {
      const enhancedData = JSON.parse(text)
      
      // Validate that critical fields exist
      if (enhancedData.enhancedSummary && enhancedData.matchScore && enhancedData.validatedSkills) {
        return {
          ...candidate,
          summary: enhancedData.enhancedSummary || candidate.summary,
          skills: Array.isArray(enhancedData.validatedSkills) && enhancedData.validatedSkills.length > 0 
                  ? enhancedData.validatedSkills 
                  : candidate.skills,
          score: (typeof enhancedData.matchScore === 'number' && enhancedData.matchScore >= 60 && enhancedData.matchScore <= 98) 
                 ? enhancedData.matchScore 
                 : candidate.score,
        }
      } else {
        console.warn('Gemini response missing critical fields, using original data:', text)
        return candidate
      }
    } catch (e: any) {
      console.error('Failed to parse Gemini JSON response:', e.message, 'Raw text:', text)
      return candidate 
    }
  } catch (error: any) {
    console.error('Gemini enhancement failed:', error.message)
    return candidate
  }
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.PERPLEXITY_API_KEY
    if (!apiKey) {
      throw new Error('PERPLEXITY_API_KEY is not configured')
    }
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY is not configured')
    }

    const { jobRole, location, requirements, profileCount = 10 }: SearchRequest = await request.json()

    if (!jobRole || !location) {
      return NextResponse.json(
        { error: 'Job role and location are required' },
        { status: 400 }
      )
    }

    // Get initial candidates from Perplexity
    let candidates = await searchCandidatesWithPerplexity(apiKey, jobRole, location, requirements, profileCount)

    if (candidates.length === 0) {
      console.warn('No candidates returned from Perplexity search or parsing failed.')
      // Return empty or minimal response if Perplexity yields nothing
      return NextResponse.json({
        success: true,
        candidates: [],
        query: { jobRole, location, requirements, profileCount },
        totalResults: 0,
        message: "No suitable candidates found matching your criteria after Perplexity search."
      })
    }

    // Enhance results with Gemini
    const enhancedCandidates = await Promise.all(
      candidates.map(candidate => enhanceCandidateWithGemini(candidate, jobRole))
    )
    
    const finalCandidates = enhancedCandidates.filter(c => c.score >= 60); // Filter out low-quality Gemini results

    return NextResponse.json({
      success: true,
      candidates: finalCandidates,
      query: { jobRole, location, requirements, profileCount },
      totalResults: finalCandidates.length,
      poweredBy: "Perplexity & Gemini AI"
    })

  } catch (error: any) {
    console.error('Search API error:', error.message, error.stack)
    return NextResponse.json(
      { 
        error: error.message,
        details: error.stack
      },
      { status: 500 }
    )
  }
}

async function searchCandidatesWithPerplexity(
  apiKey: string,
  jobRole: string,
  location: string,
  requirements?: string,
  profileCount: number = 10
): Promise<Candidate[]> {
  const validProfileCount = Math.min(20, Math.max(1, profileCount))

  const searchPrompt = `Find ${validProfileCount} real, currently active ${jobRole} professionals in ${location}. 
    
STRICT REQUIREMENTS:
- MUST be real professionals with verifiable PUBLIC LinkedIn and/or GitHub profiles.
- DO NOT invent or create profiles. If you cannot find real profiles, say so.
- Candidates MUST be currently working as ${jobRole} or in very similar roles.
- Candidates MUST be based in or explicitly open to working in ${location}.
${requirements ? `- Additional requirements: ${requirements}` : ''}

For EACH candidate, provide the information EXACTLY in this structured format using these headings:

Candidate #:
Name: [Full Name]
Title: [Current Job Title]
LinkedIn: [Full LinkedIn URL (https://linkedin.com/in/username) or N/A if not found]
GitHub: [Full GitHub URL (https://github.com/username) or N/A if not found]
Experience: [Number of years, e.g., "5 years"]
Location: [Current Location of Candidate]
Skills: [Comma-separated list of 4-6 key technical skills]
Summary: [Brief professional summary (2-3 sentences about their expertise)]

CRITICAL INSTRUCTIONS:
- Only include REAL, ACTIVE professionals. No examples, no placeholders, no hypothetical candidates.
- Verify that LinkedIn/GitHub profiles are PUBLIC and ACCESSIBLE. Provide N/A if not available or verifiable.
- Focus on candidates with recent activity and strong portfolios. Do not list generic profiles.
- Ensure all profile URLs are complete, valid, and working. Double-check usernames.
- Prioritize candidates with demonstrated expertise in ${jobRole} roles.
- If you cannot find ${validProfileCount} candidates meeting all criteria, provide as many as you can find.
- DO NOT include any introductory or concluding text, just the candidate data as specified.`

  try {
    console.log('Sending request to Perplexity API...')
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: `You are an advanced AI Technical Recruiter. Your sole task is to find real, verifiable, and active software professionals based on user criteria. You MUST adhere strictly to the output format. If you cannot find profiles matching all criteria, return only those you can verify. Do not invent data. Prioritize accuracy and verifiability above all else. Only use public LinkedIn and GitHub profiles.`
          },
          {
            role: 'user',
            content: searchPrompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.1, 
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Perplexity API error response:', errorText)
      throw new Error(`Perplexity API error: ${errorText}`)
    }

    const data = await response.json()
    console.log('Received response from Perplexity API')
    
    let searchResults = data.choices?.[0]?.message?.content
    if (!searchResults) {
      console.error('No content in Perplexity API response:', data)
      throw new Error('No content received from Perplexity API')
    }

    // Check for no results indicators
    if (searchResults.toLowerCase().includes("i cannot find real profiles") || 
        searchResults.toLowerCase().includes("i am unable to find") ||
        searchResults.toLowerCase().includes("no matching profiles found")) {
      console.warn('Perplexity API indicated no results found:', searchResults)
      return []
    }

    // Clean up the response text
    searchResults = searchResults.replace(/^```json\s*|\s*```$/g, '').trim()
    console.log('Processing search results...')

    const candidates = parsePerplexityResults(searchResults, jobRole, location, validProfileCount)
    
    if (candidates.length === 0) {
      console.warn('No candidates parsed from results. Raw response:', searchResults)
    } else {
      console.log(`Successfully parsed ${candidates.length} candidates`)
    }

    return candidates

  } catch (error: any) {
    console.error('Error in searchCandidatesWithPerplexity:', error.message)
    throw error
  }
}

function parsePerplexityResults(searchResults: string, jobRole: string, defaultLocation: string, profileCount: number): Candidate[] {
  const candidates: Candidate[] = []
  
  // Split by "Candidate #" while keeping the delimiter
  const candidateBlocks = searchResults.split(/(?=Candidate #\d*:)/i).filter(block => block.trim().length > 10)
  
  console.log(`Found ${candidateBlocks.length} candidate blocks to parse`)

  for (const block of candidateBlocks) {
    if (candidates.length >= profileCount) break

    try {
      const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0)
      let currentCandidate: Partial<Candidate> = { 
        id: Date.now() + Math.random(),
        score: 70 // Default score before Gemini enhancement
      }

      for (const line of lines) {
        const [key, ...valueParts] = line.split(/:(.*)/s)
        const value = valueParts.join(':').trim()

        if (!key || !value || value.toLowerCase() === 'n/a') continue

        const lowerKey = key.toLowerCase().trim()

        switch(lowerKey) {
          case 'name':
            if (value.length > 3 && !value.toLowerCase().includes('example')) {
              currentCandidate.name = value
            }
            break
          case 'title':
            if (value.length > 3) {
              currentCandidate.title = value
            }
            break
          case 'linkedin':
            if (value.includes('linkedin.com/in/')) {
              currentCandidate.linkedin = value.match(/https:\/\/(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+(?:\/)?/)?.[0]
            }
            break
          case 'github':
            if (value.includes('github.com/')) {
              currentCandidate.github = value.match(/https:\/\/(?:www\.)?github\.com\/[a-zA-Z0-9-]+(?:\/)?/)?.[0]
            }
            break
          case 'experience':
            currentCandidate.experience = value
            break
          case 'location':
            currentCandidate.location = value
            break
          case 'skills':
            currentCandidate.skills = value
              .split(',')
              .map(s => s.trim())
              .filter(s => s.length > 1 && s.length < 30)
            break
          case 'summary':
            if (value.length > 10) {
              currentCandidate.summary = value
            }
            break
        }
      }

      // Validate the candidate has required fields
      if (currentCandidate.name && 
          (currentCandidate.linkedin || currentCandidate.github) && 
          currentCandidate.skills?.length > 0) {
        
        candidates.push({
          id: currentCandidate.id!,
          name: currentCandidate.name,
          title: currentCandidate.title || jobRole,
          location: currentCandidate.location || defaultLocation,
          skills: currentCandidate.skills,
          experience: currentCandidate.experience || 'Not specified',
          score: currentCandidate.score!,
          linkedin: currentCandidate.linkedin,
          github: currentCandidate.github,
          summary: currentCandidate.summary || `Professional ${jobRole} based in ${currentCandidate.location || defaultLocation}.`,
        })
      } else {
        console.warn('Skipped invalid candidate block:', currentCandidate)
      }
    } catch (error) {
      console.error('Error parsing candidate block:', error)
      // Continue to next block
    }
  }

  return candidates
} 
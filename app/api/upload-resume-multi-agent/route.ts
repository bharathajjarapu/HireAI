import { NextResponse } from 'next/server';
import pdf from 'pdf-parse/lib/pdf-parse.js';
import { getModel } from '@/lib/google-ai';

// Agent status tracking
interface AgentStatus {
  status: 'idle' | 'working' | 'completed' | 'error'
  progress: number
  message: string
  startTime?: number
  endTime?: number
  processingTime?: number
}

interface AgentResponse {
  agentName: string
  content: string
  confidence: number
  processingTime: number
}

class MultiAgentResumeAnalyzer {
  private agents: Record<string, AgentStatus> = {}
  private model: any

  constructor() {
    this.model = getModel()
    this.initializeAgents()
  }

  private initializeAgents() {
    const agentIds = [
      'document_processor',
      'role_matching', 
      'skills_analysis',
      'experience_review',
      'growth_analysis',
      'strengths_assessment',
      'final_synthesis'
    ]

    agentIds.forEach(id => {
      this.agents[id] = {
        status: 'idle',
        progress: 0,
        message: 'Waiting to start...'
      }
    })
  }

  private updateAgentStatus(agentId: string, status: Partial<AgentStatus>) {
    this.agents[agentId] = { ...this.agents[agentId], ...status }
  }

  private async createAgent(systemPrompt: string) {
    return async (input: string): Promise<string> => {
      const prompt = `${systemPrompt}\n\nAnalyze the following resume:\n\n${input}`
      
      try {
        const result = await this.model.generateContent(prompt)
        return result.response.text()
      } catch (error) {
        throw new Error(`AI analysis failed: ${error}`)
      }
    }
  }

  private getAgentPrompts() {
    return {
      document_processor: `You are a document processing specialist for resumes.
        Extract and organize all relevant information from the resume text.
        Return a structured summary of the document content including:
        - Personal information and contact details
        - Overall document quality and readability
        - Key sections identified (experience, education, skills, etc.)
        Focus on accuracy and completeness of extraction.`,

      role_matching: `You are a role matching specialist.
        Analyze the resume to determine suitable job roles and positions.
        Provide detailed analysis including:
        - Primary role matches based on experience and skills
        - Secondary role opportunities
        - Industry compatibility
        - Seniority level assessment
        - Role transition potential
        Return specific job titles and justifications.`,

      skills_analysis: `You are a technical and soft skills assessment expert.
        Analyze all skills mentioned or implied in the resume.
        Provide comprehensive evaluation including:
        - Technical skills categorized by proficiency level
        - Programming languages, frameworks, and tools
        - Soft skills and leadership capabilities
        - Skill gaps for target roles
        - Emerging skills and learning trajectory
        Rate each skill category and provide improvement suggestions.`,

      experience_review: `You are a work experience evaluation specialist.
        Assess the candidate's professional journey and achievements.
        Provide detailed analysis including:
        - Career progression and growth trajectory
        - Quality and relevance of work experience
        - Key achievements and impact metrics
        - Industry exposure and domain expertise
        - Leadership and project management experience
        Highlight standout accomplishments and career highlights.`,

      growth_analysis: `You are a career growth and potential assessment expert.
        Analyze the candidate's growth trajectory and future potential.
        Provide insights including:
        - Career advancement pattern
        - Learning and adaptation capability
        - Innovation and problem-solving examples
        - Leadership development progression
        - Potential for future growth
        - Areas for development and improvement
        Assess scalability and long-term value proposition.`,

      strengths_assessment: `You are a strengths and competitive advantages analyst.
        Identify and evaluate the candidate's key strengths and unique value proposition.
        Provide comprehensive assessment including:
        - Top 5-7 key strengths with evidence
        - Unique skills or experiences that differentiate the candidate
        - Competitive advantages in the job market
        - Value proposition for potential employers
        - Areas where the candidate excels compared to peers
        Focus on what makes this candidate stand out.`,

      final_synthesis: `You are a comprehensive resume analysis synthesizer.
        Create a final, holistic assessment combining all previous analyses.
        Provide executive summary including:
        - Overall candidate profile and positioning
        - Key recommendations for the candidate
        - Hiring recommendations for employers
        - Salary range expectations based on experience
        - Best-fit role types and companies
        - Priority areas for candidate development
        Create a compelling narrative that ties everything together.`
    }
  }

  async analyzeResume(resumeText: string, extractedLinks: any[]): Promise<{
    results: Record<string, AgentResponse>,
    agents: Record<string, AgentStatus>
  }> {
    const results: Record<string, AgentResponse> = {}
    const prompts = this.getAgentPrompts()
    
    // Augment resume text with extracted links
    const linkText = extractedLinks.map(link => `${link.text} -> ${link.url}`).join('\n')
    const augmentedText = `${resumeText}\n\nExtracted Links:\n${linkText}`

    try {
      // Process agents sequentially with status updates
      for (const [agentId, prompt] of Object.entries(prompts)) {
        this.updateAgentStatus(agentId, {
          status: 'working',
          progress: 0,
          message: 'Starting analysis...',
          startTime: Date.now()
        })

        try {
          this.updateAgentStatus(agentId, {
            progress: 25,
            message: 'Processing content...'
          })

          const agent = await this.createAgent(prompt)
          
          this.updateAgentStatus(agentId, {
            progress: 75,
            message: 'Generating analysis...'
          })

          const startTime = Date.now()
          const response = await agent(augmentedText)
          const processingTime = Date.now() - startTime

          results[agentId] = {
            agentName: agentId,
            content: response,
            confidence: 0.9,
            processingTime
          }

          this.updateAgentStatus(agentId, {
            status: 'completed',
            progress: 100,
            message: 'Analysis complete',
            endTime: Date.now(),
            processingTime
          })

          // Small delay to show progression
          await new Promise(resolve => setTimeout(resolve, 500))

        } catch (error) {
          this.updateAgentStatus(agentId, {
            status: 'error',
            progress: 100,
            message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
          })
          
          results[agentId] = {
            agentName: agentId,
            content: `Error analyzing ${agentId}: ${error}`,
            confidence: 0,
            processingTime: 0
          }
        }
      }

      return { results, agents: this.agents }
    } catch (error) {
      throw new Error(`Multi-agent analysis failed: ${error}`)
    }
  }
}

// Helper functions to extract structured data from AI responses
function extractCandidateName(content: string): string {
  const namePatterns = [
    /Name[:\s]*([A-Za-z\s]+)/i,
    /Candidate[:\s]*([A-Za-z\s]+)/i,
    /([A-Z][a-z]+\s+[A-Z][a-z]+)/,
  ];
  
  for (const pattern of namePatterns) {
    const match = content.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  return 'Candidate';
}

function extractSkills(content: string): string[] {
  const skills: string[] = [];
  const skillPatterns = [
    /(?:Skills?|Technologies?|Tools?)[:\s]*([^.]+)/gi,
    /(?:Programming Languages?|Languages?)[:\s]*([^.]+)/gi,
    /(?:Frameworks?|Libraries?)[:\s]*([^.]+)/gi,
  ];
  
  skillPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const skillsText = match[1];
      const extractedSkills = skillsText.split(/[,;•\n]/).map(s => s.trim()).filter(s => s.length > 1);
      skills.push(...extractedSkills);
    }
  });
  
  // Also extract bullet points that might be skills
  const bulletPoints = content.match(/[-•]\s*([^.\n]+)/g);
  if (bulletPoints) {
    bulletPoints.forEach(bullet => {
      const skill = bullet.replace(/[-•]\s*/, '').trim();
      if (skill.length > 1 && skill.length < 50) {
        skills.push(skill);
      }
    });
  }
  
  return [...new Set(skills)].slice(0, 15); // Remove duplicates and limit to 15
}

function extractExperience(content: string): string {
  const experiencePatterns = [
    /Experience[:\s]*([^]+?)(?=Education|Skills|Summary|$)/i,
    /Work History[:\s]*([^]+?)(?=Education|Skills|Summary|$)/i,
    /Professional Experience[:\s]*([^]+?)(?=Education|Skills|Summary|$)/i,
  ];
  
  for (const pattern of experiencePatterns) {
    const match = content.match(pattern);
    if (match) {
      return match[1].trim().substring(0, 500); // Limit length
    }
  }
  
  // Extract first paragraph if no specific pattern found
  const sentences = content.split('.').slice(0, 3);
  return sentences.join('.').substring(0, 300);
}

function extractEducation(content: string): string {
  const educationPatterns = [
    /Education[:\s]*([^]+?)(?=Experience|Skills|Summary|$)/i,
    /Academic Background[:\s]*([^]+?)(?=Experience|Skills|Summary|$)/i,
    /Qualifications[:\s]*([^]+?)(?=Experience|Skills|Summary|$)/i,
  ];
  
  for (const pattern of educationPatterns) {
    const match = content.match(pattern);
    if (match) {
      return match[1].trim().substring(0, 300);
    }
  }
  
  // Look for degree mentions
  const degreePattern = /(Bachelor|Master|PhD|B\.?\s*[A-Z]|M\.?\s*[A-Z]|Degree)[^.]+/i;
  const degreeMatch = content.match(degreePattern);
  if (degreeMatch) {
    return degreeMatch[0].trim();
  }
  
  return 'Education details extracted from resume';
}

function extractAchievements(content: string): string[] {
  const achievements: string[] = [];
  const achievementPatterns = [
    /(?:Achievement|Accomplishment)[:\s]*([^.]+)/gi,
    /(?:Award|Recognition|Honor)[:\s]*([^.]+)/gi,
    /(?:Led|Managed|Increased|Improved|Developed|Created)[^.]+/gi,
  ];
  
  achievementPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      achievements.push(match[0].trim());
    }
  });
  
  // Extract bullet points that sound like achievements
  const bulletPoints = content.match(/[-•]\s*([^.\n]+)/g);
  if (bulletPoints) {
    bulletPoints.forEach(bullet => {
      const achievement = bullet.replace(/[-•]\s*/, '').trim();
      if (achievement.includes('achieved') || achievement.includes('led') || 
          achievement.includes('improved') || achievement.includes('increased')) {
        achievements.push(achievement);
      }
    });
  }
  
  return [...new Set(achievements)].slice(0, 10);
}

function extractTechnicalProficiency(content: string): {
  languages: string[], frameworks: string[], tools: string[]
} {
  const languages: string[] = [];
  const frameworks: string[] = [];
  const tools: string[] = [];
  
  // Common programming languages
  const languageKeywords = ['JavaScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Go', 'Rust', 'TypeScript', 'Swift', 'Kotlin'];
  // Common frameworks
  const frameworkKeywords = ['React', 'Angular', 'Vue', 'Node.js', 'Django', 'Flask', 'Spring', 'Express', 'Laravel', '.NET'];
  // Common tools
  const toolKeywords = ['Git', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis'];
  
  languageKeywords.forEach(keyword => {
    if (content.toLowerCase().includes(keyword.toLowerCase())) {
      languages.push(keyword);
    }
  });
  
  frameworkKeywords.forEach(keyword => {
    if (content.toLowerCase().includes(keyword.toLowerCase())) {
      frameworks.push(keyword);
    }
  });
  
  toolKeywords.forEach(keyword => {
    if (content.toLowerCase().includes(keyword.toLowerCase())) {
      tools.push(keyword);
    }
  });
  
  return { languages, frameworks, tools };
}

function extractRoleMatches(content: string): string[] {
  const roles: string[] = [];
  const rolePatterns = [
    /(?:Role|Position|Job Title)[:\s]*([^.]+)/gi,
    /(?:Suitable for|Ideal for|Perfect for)[:\s]*([^.]+)/gi,
    /(Engineer|Developer|Manager|Analyst|Specialist|Consultant|Director)[^.]*position/gi,
  ];
  
  rolePatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      roles.push(match[1] || match[0]);
    }
  });
  
  return [...new Set(roles)].slice(0, 5);
}

function extractImprovementAreas(content: string): string[] {
  const areas: string[] = [];
  const patterns = [
    /(?:Improvement|Development|Growth)[:\s]*([^.]+)/gi,
    /(?:Should focus on|Needs to|Could improve)[:\s]*([^.]+)/gi,
    /(?:Weakness|Gap|Area for development)[:\s]*([^.]+)/gi,
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      areas.push(match[1].trim());
    }
  });
  
  return [...new Set(areas)].slice(0, 5);
}

function extractStrengths(content: string): string[] {
  const strengths: string[] = [];
  const patterns = [
    /(?:Strength|Strong in|Excellent at)[:\s]*([^.]+)/gi,
    /(?:Advantage|Benefit|Asset)[:\s]*([^.]+)/gi,
    /(?:Skilled in|Expert in|Proficient in)[:\s]*([^.]+)/gi,
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      strengths.push(match[1].trim());
    }
  });
  
  return [...new Set(strengths)].slice(0, 7);
}

function extractWeaknesses(content: string): string[] {
  const weaknesses: string[] = [];
  const patterns = [
    /(?:Weakness|Limitation|Challenge)[:\s]*([^.]+)/gi,
    /(?:Lacks|Missing|Limited experience in)[:\s]*([^.]+)/gi,
    /(?:Could improve|Should develop)[:\s]*([^.]+)/gi,
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      weaknesses.push(match[1].trim());
    }
  });
  
  return [...new Set(weaknesses)].slice(0, 5);
}

function extractSummary(content: string): string {
  const summaryPatterns = [
    /Summary[:\s]*([^]+?)(?=Recommendation|Conclusion|$)/i,
    /Overall[:\s]*([^]+?)(?=Recommendation|Conclusion|$)/i,
    /In conclusion[:\s]*([^]+?)$/i,
  ];
  
  for (const pattern of summaryPatterns) {
    const match = content.match(pattern);
    if (match) {
      return match[1].trim().substring(0, 500);
    }
  }
  
  // Use first two sentences as summary
  const sentences = content.split('.').slice(0, 2);
  return sentences.join('.').substring(0, 300);
}

function calculateMatchScore(analysisResults: Record<string, any>): number {
  let score = 70; // Base score
  
  // Boost score based on agent confidence and content quality
  Object.values(analysisResults).forEach((result: any) => {
    if (result?.confidence) {
      score += result.confidence * 5;
    }
    if (result?.content && result.content.length > 100) {
      score += 5; // Bonus for detailed analysis
    }
  });
  
  return Math.min(Math.max(Math.round(score), 60), 99); // Clamp between 60-99
}

async function extractTextFromPDF(file: Blob): Promise<{ text: string, links: { url: string, text: string }[] }> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const data = await pdf(buffer);
    
    const text = data.text || '';
    let links: { url: string, text: string }[] = [];
    
    // Extract links using regex patterns
    const patterns = {
      linkedin: [
        /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?/gi,
        /LinkedIn:?\s*(?:—|-)?\s*([^\s,]+)/gi,
      ],
      github: [
        /(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9-]+\/?/gi,
        /GitHub:?\s*(?:—|-)?\s*([^\s,]+)/gi,
      ],
      email: [
        /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi,
      ]
    };

    for (const [platform, platformPatterns] of Object.entries(patterns)) {
      for (const pattern of platformPatterns) {
        let match;
        while ((match = pattern.exec(text)) !== null) {
          const url = match[0];
          if (!links.some(link => link.url === url)) {
            links.push({ url, text: match[0] });
          }
        }
      }
    }

    return { text, links };
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF. Please make sure it is a valid PDF file.');
  }
}

export async function POST(request: Request) {
  try {
    // Check if we have a Google API key
    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: 'Google API key is not configured. Please add GOOGLE_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const results = [];

    for (const file of files) {
      try {
        // Extract text and links
        const { text, links } = await extractTextFromPDF(file);
        
        if (!text || text.trim().length === 0) {
          results.push({
            filename: file.name,
            error: 'No readable text found in the PDF. Please ensure the PDF contains selectable text.',
          });
          continue;
        }

        // Initialize multi-agent analyzer
        const analyzer = new MultiAgentResumeAnalyzer();
        
        // Perform multi-agent analysis
        const { results: analysisResults, agents } = await analyzer.analyzeResume(text, links);

        // Combine all agent outputs into a structured response
        const combinedAnalysis = {
          id: Date.now() + Math.random(),
          filename: file.name,
          candidateName: extractCandidateName(analysisResults.document_processor?.content || ''),
          
          // Core analysis data
          documentProcessing: analysisResults.document_processor?.content || '',
          roleMatching: analysisResults.role_matching?.content || '',
          skillsAnalysis: analysisResults.skills_analysis?.content || '',
          experienceReview: analysisResults.experience_review?.content || '',
          growthAnalysis: analysisResults.growth_analysis?.content || '',
          strengthsAssessment: analysisResults.strengths_assessment?.content || '',
          finalSynthesis: analysisResults.final_synthesis?.content || '',
          
          // Legacy fields extracted from AI analysis
          skills: extractSkills(analysisResults.skills_analysis?.content || ''),
          experience: extractExperience(analysisResults.experience_review?.content || ''),
          education: extractEducation(analysisResults.document_processor?.content || ''),
          achievements: extractAchievements(analysisResults.strengths_assessment?.content || ''),
          technical_proficiency: extractTechnicalProficiency(analysisResults.skills_analysis?.content || ''),
          role_matches: extractRoleMatches(analysisResults.role_matching?.content || ''),
          improvement_areas: extractImprovementAreas(analysisResults.growth_analysis?.content || ''),
          pros: extractStrengths(analysisResults.strengths_assessment?.content || ''),
          cons: extractWeaknesses(analysisResults.growth_analysis?.content || ''),
          summary: extractSummary(analysisResults.final_synthesis?.content || ''),
          matchScore: calculateMatchScore(analysisResults),
          timestamp: new Date().toISOString(),
          contact: {
            linkedin: links.find(l => l.url.includes('linkedin'))?.url || '',
            github: links.find(l => l.url.includes('github'))?.url || '',
            email: links.find(l => l.url.includes('@'))?.url || ''
          },
          
          // Multi-agent specific data
          agentResults: analysisResults,
          agentStatuses: agents,
          analysisMetadata: {
            totalProcessingTime: Object.values(agents).reduce((total, agent) => 
              total + (agent.processingTime || 0), 0),
            completedAgents: Object.values(agents).filter(a => a.status === 'completed').length,
            totalAgents: Object.keys(agents).length
          }
        };

        results.push(combinedAnalysis);
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        results.push({
          filename: file.name,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        });
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Upload endpoint error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
} 
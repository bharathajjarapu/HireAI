import { NextResponse } from 'next/server';
import { getModel } from '@/lib/google-ai';

export async function POST(request: Request) {
  if (!process.env.GOOGLE_API_KEY) {
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { message, resumeContext } = await request.json();

    const model = getModel();

    const prompt = `You are an AI assistant helping to analyze a resume. Here is the context about the resume:

Resume Information:
- Skills: ${resumeContext.skills.join(', ')}
- Experience: ${resumeContext.experience}
- Education: ${resumeContext.education}
- Technical Proficiency:
  * Languages: ${resumeContext.technical_proficiency.languages.join(', ')}
  * Frameworks: ${resumeContext.technical_proficiency.frameworks.join(', ')}
  * Tools: ${resumeContext.technical_proficiency.tools.join(', ')}
- Achievements: ${resumeContext.achievements.join(', ')}

User Question: ${message}

Please provide a helpful, professional response based on the resume information above. Be specific and reference the actual resume details in your response.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return NextResponse.json({ response: response.text() });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
} 
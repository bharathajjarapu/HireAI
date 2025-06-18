import { NextResponse } from 'next/server';
import pdf from 'pdf-parse/lib/pdf-parse.js';
import { getModel } from '@/lib/google-ai';

async function extractTextFromPDF(file: Blob): Promise<{ text: string, links: { url: string, text: string }[] }> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const data = await pdf(buffer, {
      pagerender: function(pageData: any) {
        // Get raw text content
        let textContent = pageData.getTextContent();
        return textContent.then(function(text: any) {
          let finalString = "";
          let links: { url: string, text: string }[] = [];
          
          // Process each text item
          for (let item of text.items) {
            finalString += item.str + " ";
            
            // Check for hyperlink properties
            if (item.hasOwnProperty('link')) {
              links.push({
                url: item.link,
                text: item.str
              });
            }
          }
          
          return finalString;
        });
      }
    });
    
    const text = data.text || '';
    let links: { url: string, text: string }[] = [];
    
    // First try to extract href links from PDF annotations
    try {
      const pdfData = await pdf(buffer, { includeAnnotations: true });
      if (pdfData.annotations) {
        pdfData.annotations.forEach((annotation: any) => {
          if (annotation.type === 'Link' && annotation.url) {
            links.push({
              url: annotation.url,
              text: annotation.text || annotation.url
            });
          }
        });
      }
    } catch (e) {
      console.warn('Could not extract annotations:', e);
    }
    
    // Then use regex patterns as backup
    const patterns = {
      linkedin: [
        /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?/gi,
        /LinkedIn:?\s*(?:—|-)?\s*([^\s,]+)/gi,
        /\[LinkedIn\]\((https?:\/\/[^\s)]+)\)/gi
      ],
      github: [
        /(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9-]+\/?/gi,
        /GitHub:?\s*(?:—|-)?\s*([^\s,]+)/gi,
        /\[GitHub\]\((https?:\/\/[^\s)]+)\)/gi
      ],
      leetcode: [
        /(?:https?:\/\/)?(?:www\.)?leetcode\.com\/[a-zA-Z0-9-]+\/?/gi,
        /LeetCode:?\s*(?:—|-)?\s*([^\s,]+)/gi
      ],
      geeksforgeeks: [
        /(?:https?:\/\/)?(?:www\.)?geeksforgeeks\.org\/(?:user\/)?[a-zA-Z0-9-]+\/?/gi,
        /GeeksforGeeks:?\s*(?:—|-)?\s*([^\s,]+)/gi
      ],
      email: [
        /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi,
        /Email:?\s*(?:—|-)?\s*([^\s,]+@[^\s,]+)/gi
      ]
    };

    // Extract all matches
    for (const [platform, platformPatterns] of Object.entries(patterns)) {
      for (const pattern of platformPatterns) {
        let match;
        while ((match = pattern.exec(text)) !== null) {
          let url = '';
          let matchText = '';
          
          // Handle markdown link format
          if (pattern.toString().includes('\\[')) {
            url = match[1];
            matchText = match[0];
          } else {
            // Handle other formats
            const username = match[1] || match[0];
            matchText = match[0];
            
            // Clean up the username/url
            const cleanUsername = username.replace(/^[@:]/, '').trim();
            
            switch(platform) {
              case 'linkedin':
                if (cleanUsername.includes('linkedin.com')) {
                  url = cleanUsername.startsWith('http') ? cleanUsername : `https://${cleanUsername}`;
                } else {
                  url = `https://linkedin.com/in/${cleanUsername}`;
                }
                break;
              case 'github':
                if (cleanUsername.includes('github.com')) {
                  url = cleanUsername.startsWith('http') ? cleanUsername : `https://${cleanUsername}`;
                } else {
                  url = `https://github.com/${cleanUsername}`;
                }
                break;
              case 'leetcode':
                if (cleanUsername.includes('leetcode.com')) {
                  url = cleanUsername.startsWith('http') ? cleanUsername : `https://${cleanUsername}`;
                } else {
                  url = `https://leetcode.com/${cleanUsername}`;
                }
                break;
              case 'geeksforgeeks':
                if (cleanUsername.includes('geeksforgeeks.org')) {
                  url = cleanUsername.startsWith('http') ? cleanUsername : `https://${cleanUsername}`;
                } else {
                  url = `https://auth.geeksforgeeks.org/user/${cleanUsername}`;
                }
                break;
              case 'email':
                url = `mailto:${cleanUsername}`;
                break;
            }
          }
          
          if (url && !links.some(link => link.url === url)) {
            links.push({ url, text: matchText });
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

async function analyzeResume(text: string, links: { url: string, text: string }[]) {
  try {
    // Check if we have a Google API key
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('Google API key is not configured. Please add GOOGLE_API_KEY to your .env.local file.');
    }

    const model = getModel();

    // Create a formatted list of extracted links for the AI
    const extractedLinksText = links.map(link => `${link.text} -> ${link.url}`).join('\n');

    const prompt = `Analyze the following resume text and extracted links, providing a detailed analysis STRICTLY in JSON format. 
    Ensure the response starts with { and ends with } and contains NO other text or markdown formatting outside of the JSON structure. 
    Be accurate and realistic. Include only the information that is actually present in the resume text.

    Extracted Links:
    ${extractedLinksText}

    Format the response as follows:
    {
      "candidateName": "full name of the candidate as it appears in the resume",
      "skills": ["list of technical and soft skills found in resume"],
      "experience": "summary of total years and key experience",
      "education": "highest education qualification with institution",
      "achievements": ["list of key achievements"],
      "technical_proficiency": {
        "languages": ["programming languages found in resume"],
        "frameworks": ["frameworks and libraries mentioned"],
        "tools": ["tools and platforms listed"]
      },
      "role_matches": ["potential roles this candidate is suitable for based on their experience"],
      "improvement_areas": ["areas where the candidate could improve"],
      "pros": ["list of strengths based on the resume"],
      "cons": ["list of potential improvement areas"],
      "summary": "a brief summary of the candidate's profile",
      "contact": {
        "email": "email address if found in resume",
        "phone": "phone number if found in resume",
        "linkedin": "full LinkedIn URL if found in resume",
        "github": "full GitHub URL if found in resume",
        "leetcode": "LeetCode profile URL if found in resume",
        "geeksforgeeks": "GeeksforGeeks profile URL if found in resume"
      }
    }

    Resume text to analyze:
    ${text}

    Important: Only include information that is explicitly mentioned in the resume. If a section would be empty, use an empty array [] or empty string "". Ensure the response is in valid JSON format. Verify the JSON structure before responding.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysisText = response.text();
    
    // Function to strip markdown from JSON
    const stripJsonMarkdown = (rawJson: string): string => {
      const match = rawJson.match(/```(json)?\s*([\s\S]*?)\s*```/);
      if (match && match[2]) {
        return match[2].trim();
      }
      return rawJson.trim();
    };
    
    try {
      const cleanedText = stripJsonMarkdown(analysisText);
      const parsedResult = JSON.parse(cleanedText);
      
      // Ensure all required fields exist with default values
      const defaultAnalysis = {
        candidateName: "",
        skills: [],
        experience: "",
        education: "",
        achievements: [],
        technical_proficiency: {
          languages: [],
          frameworks: [],
          tools: []
        },
        role_matches: [],
        improvement_areas: [],
        pros: [],
        cons: [],
        summary: "",
        contact: {
          email: "",
          phone: "",
          linkedin: "",
          github: "",
          leetcode: "",
          geeksforgeeks: ""
        }
      };

      // Add extracted links to contact info
      const contactInfo = { ...defaultAnalysis.contact };
      links.forEach(link => {
        if (link.url.includes('linkedin.com')) contactInfo.linkedin = link.url;
        else if (link.url.includes('github.com')) contactInfo.github = link.url;
        else if (link.url.includes('leetcode.com')) contactInfo.leetcode = link.url;
        else if (link.url.includes('geeksforgeeks.org')) contactInfo.geeksforgeeks = link.url;
        else if (link.url.startsWith('mailto:')) contactInfo.email = link.url.replace('mailto:', '');
      });

      // Merge with defaults and ensure proper structure
      const finalResult = {
        ...defaultAnalysis,
        ...parsedResult,
        technical_proficiency: {
          ...defaultAnalysis.technical_proficiency,
          ...(parsedResult.technical_proficiency || {})
        },
        contact: {
          ...contactInfo,
          ...(parsedResult.contact || {})
        },
        text: text,
        extractedLinks: links
      };

      return finalResult;
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      throw new Error('Failed to parse AI analysis. The AI response was not in valid JSON format.');
    }
  } catch (error) {
    console.error('Error analyzing resume:', error);
      throw error;
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as Blob | null;
    
    if (!file) {
      return new NextResponse(
        JSON.stringify({ error: 'No file uploaded' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if it's a PDF
    if (!file.type || !file.type.toLowerCase().includes('pdf')) {
      return new NextResponse(
        JSON.stringify({ error: 'Only PDF files are supported' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Extract text and links from PDF
    let extractedData;
    try {
      extractedData = await extractTextFromPDF(file);
      if (!extractedData.text || extractedData.text.trim().length === 0) {
        throw new Error('No text content found in PDF. Please ensure the PDF contains readable text.');
      }
    } catch (error) {
      console.error('PDF extraction error:', error);
      return new NextResponse(
        JSON.stringify({ 
          error: error instanceof Error ? error.message : 'Failed to extract text from PDF'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Analyze the resume
    try {
      const analysis = await analyzeResume(extractedData.text, extractedData.links);
      return new NextResponse(
        JSON.stringify(analysis),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('Analysis error:', error);
      return new NextResponse(
        JSON.stringify({ 
          error: error instanceof Error ? error.message : 'Failed to analyze resume'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error processing resume:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Failed to process resume. Please try again.'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 
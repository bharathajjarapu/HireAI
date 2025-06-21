// Application configuration
export const APP_CONFIG = {
  name: "HireAI",
  description: "AI-Powered Hiring Platform"
}

// API configuration
export const API_CONFIG = {
  ENDPOINTS: {
    UPLOAD_RESUME: '/api/upload-resume',
    CREATE_JOB: '/api/jobs/create',
    GENERATE_EMAIL: '/api/generate-email',
    GENERATE_SOCIAL_POST: '/api/jobs/generate-social-post',
  }
}

/**
 * Get the correct base URL based on environment
 * - Development: localhost:3000
 * - Production: Uses NEXT_PUBLIC_BASE_URL or fallback
 */
export const getBaseUrl = (): string => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }
  return process.env.NEXT_PUBLIC_BASE_URL || 'https://hireai-t0pl.onrender.com'
}

/**
 * Get API endpoint URL
 */
export const getApiUrl = (endpoint: keyof typeof API_CONFIG.ENDPOINTS): string => {
  return API_CONFIG.ENDPOINTS[endpoint]
}

/**
 * Generate a form URL for job applications
 */
export const generateFormUrl = (jobId: string): string => {
  const baseUrl = getBaseUrl()
  return `${baseUrl}/apply/${jobId}`
} 
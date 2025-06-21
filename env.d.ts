declare namespace NodeJS {
  interface ProcessEnv {
    /** 
     * Base URL for the application in production
     * Only used when NODE_ENV !== 'development'
     * In development, localhost:3000 is used automatically
     */
    NEXT_PUBLIC_BASE_URL?: string;
    
    /** Google AI/Gemini API key for AI features */
    GOOGLE_API_KEY: string;
    
    /** Alternative Gemini API key */
    GEMINI_API_KEY?: string;
    
    /** Email user for SMTP */
    EMAIL_USER?: string;
    
    /** Email password for SMTP */
    EMAIL_PASS?: string;
    
    /** SMTP host server */
    SMTP_HOST?: string;
    
    /** SMTP port number */
    SMTP_PORT?: string;
  }
} 
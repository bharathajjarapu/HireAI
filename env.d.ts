declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_BASE_URL?: string;
    GOOGLE_API_KEY: string;
    GEMINI_API_KEY?: string;
    EMAIL_USER?: string;
    EMAIL_PASS?: string;
    SMTP_HOST?: string;
    SMTP_PORT?: string;
  }
} 
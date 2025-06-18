declare namespace NodeJS {
  interface ProcessEnv {
    GOOGLE_API_KEY: string;
    EMAIL_USER?: string;
    EMAIL_PASS?: string;
    SMTP_HOST?: string;
    SMTP_PORT?: string;
  }
} 
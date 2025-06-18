export const API_CONFIG = {
    ENDPOINTS: {
        UPLOAD_RESUME: '/api/upload-resume',
        QUERY_RESUME: '/api/query-resume',
        CHAT_RESUME: '/api/chat-resume'
    }
}

export const getApiUrl = (endpoint: keyof typeof API_CONFIG.ENDPOINTS) => {
    return API_CONFIG.ENDPOINTS[endpoint]
} 
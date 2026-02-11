// Gemini API service for AI interactions
import { GoogleGenerativeAI, GenerativeModel, ChatSession } from '@google/generative-ai';

let genAI: GoogleGenerativeAI | null = null;
let model: GenerativeModel | null = null;
let chatSession: ChatSession | null = null;

// Initialize Gemini with API key
export const initializeGemini = (apiKey: string) => {
    try {
        genAI = new GoogleGenerativeAI(apiKey);
        model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        return true;
    } catch (error) {
        console.error('Failed to initialize Gemini:', error);
        return false;
    }
};

// Validate API key by making a simple request
export const validateApiKey = async (apiKey: string): Promise<{ valid: boolean; error?: string }> => {
    try {
        const testGenAI = new GoogleGenerativeAI(apiKey);
        const testModel = testGenAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        await testModel.generateContent('Xin chào');
        return { valid: true };
    } catch (error: any) {
        return { valid: false, error: error.message };
    }
};

// Generate customer profile from description
export const generateCustomerProfile = async (prompt: string): Promise<string> => {
    if (!model) {
        throw new Error('Gemini chưa được khởi tạo. Vui lòng nhập API key.');
    }

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Failed to generate customer profile:', error);
        throw error;
    }
};

// Start a new roleplay chat session
export const startRoleplaySession = (systemPrompt: string): ChatSession => {
    if (!model) {
        throw new Error('Gemini chưa được khởi tạo. Vui lòng nhập API key.');
    }

    chatSession = model.startChat({
        history: [
            {
                role: 'user',
                parts: [{ text: systemPrompt }]
            },
            {
                role: 'model',
                parts: [{ text: 'Tôi đã hiểu vai trò của mình. Tôi sẵn sàng bắt đầu cuộc trò chuyện với tư vấn viên.' }]
            }
        ],
        generationConfig: {
            temperature: 0.9,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 1024,
        }
    });

    return chatSession;
};

// Send message in roleplay session
export const sendRoleplayMessage = async (message: string): Promise<string> => {
    if (!chatSession) {
        throw new Error('Chưa có phiên roleplay nào được bắt đầu.');
    }

    try {
        const result = await chatSession.sendMessage(message);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Failed to send roleplay message:', error);
        throw error;
    }
};

// End current chat session
export const endRoleplaySession = () => {
    chatSession = null;
};

// Send a single message (not a chat session) - used for one-shot prompts like Review
export const sendMessage = async (prompt: string): Promise<string> => {
    if (!model) {
        throw new Error('Gemini chưa được khởi tạo. Vui lòng nhập API key.');
    }

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Failed to send message:', error);
        throw error;
    }
};

// Check if Gemini is initialized
export const isGeminiInitialized = () => {
    return model !== null;
};

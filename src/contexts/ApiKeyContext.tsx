// API Key Context - manages Gemini API key state globally
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getApiKey, saveApiKey, removeApiKey } from '../services/storageService';
import { initializeGemini, validateApiKey, isGeminiInitialized } from '../services/geminiService';

interface ApiKeyContextType {
    apiKey: string;
    isValid: boolean;
    isLoading: boolean;
    error: string;
    setApiKey: (key: string) => Promise<{ success: boolean; error?: string }>;
    clearApiKey: () => void;
    isInitialized: () => boolean;
}

const ApiKeyContext = createContext<ApiKeyContextType | null>(null);

interface ApiKeyProviderProps {
    children: ReactNode;
}

export const ApiKeyProvider: React.FC<ApiKeyProviderProps> = ({ children }) => {
    const [apiKey, setApiKeyState] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Load API key on mount
    useEffect(() => {
        const loadApiKey = async () => {
            const savedKey = getApiKey();
            if (savedKey) {
                setApiKeyState(savedKey);
                const result = await validateApiKey(savedKey);
                if (result.valid) {
                    initializeGemini(savedKey);
                    setIsValid(true);
                } else {
                    setError('API key không hợp lệ. Vui lòng nhập lại.');
                }
            }
            setIsLoading(false);
        };
        loadApiKey();
    }, []);

    const setApiKey = async (key: string) => {
        setIsLoading(true);
        setError('');

        if (!key) {
            removeApiKey();
            setApiKeyState('');
            setIsValid(false);
            setIsLoading(false);
            return { success: true };
        }

        const result = await validateApiKey(key);
        if (result.valid) {
            saveApiKey(key);
            initializeGemini(key);
            setApiKeyState(key);
            setIsValid(true);
            setIsLoading(false);
            return { success: true };
        } else {
            setError(result.error || 'API key không hợp lệ');
            setIsLoading(false);
            return { success: false, error: result.error };
        }
    };

    const clearApiKey = () => {
        removeApiKey();
        setApiKeyState('');
        setIsValid(false);
        setError('');
    };

    return (
        <ApiKeyContext.Provider value={{
            apiKey,
            isValid,
            isLoading,
            error,
            setApiKey,
            clearApiKey,
            isInitialized: isGeminiInitialized
        }}>
            {children}
        </ApiKeyContext.Provider>
    );
};

export const useApiKey = () => {
    const context = useContext(ApiKeyContext);
    if (!context) {
        throw new Error('useApiKey must be used within ApiKeyProvider');
    }
    return context;
};

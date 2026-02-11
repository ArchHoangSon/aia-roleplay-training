// Session Context - manages current roleplay session state
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
    saveSession,
    saveCurrentSession,
    getCurrentSession,
    clearCurrentSession,
    createNewSession,
    Session
} from '../services/storageService';
import {
    startRoleplaySession,
    sendRoleplayMessage,
    endRoleplaySession
} from '../services/geminiService';
import { buildRoleplaySystemPrompt } from '../prompts/roleplayPrompts';
import { getStagesForFlow } from '../constants/consultingFlows';

interface SessionContextType {
    session: Session | null;
    isLoading: boolean;
    error: string;
    startSession: (customer: any, flowType: string, segment: string) => Promise<Session>;
    sendMessage: (userMessage: string) => Promise<string>;
    setCurrentStage: (stageIndex: number) => void;
    endSession: (note?: string) => Session | undefined;
    resumeSession: () => Session | null;
    cancelSession: () => void;
}

const SessionContext = createContext<SessionContextType | null>(null);

interface SessionProviderProps {
    children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Start new roleplay session
    const startSession = useCallback(async (customer: any, flowType: string, segment: string) => {
        setIsLoading(true);
        setError('');

        try {
            const newSession = createNewSession(customer, flowType, segment);
            const systemPrompt = buildRoleplaySystemPrompt(customer, flowType, 0);

            startRoleplaySession(systemPrompt);

            setSession(newSession);
            saveCurrentSession(newSession);
            setIsLoading(false);

            return newSession;
        } catch (err: any) {
            setError(err.message);
            setIsLoading(false);
            throw err;
        }
    }, []);

    // Send message in current session
    const sendMessage = useCallback(async (userMessage: string) => {
        if (!session) {
            throw new Error('Không có phiên roleplay đang hoạt động');
        }

        setIsLoading(true);
        setError('');

        try {
            // Add user message
            const updatedMessages = [
                ...session.messages,
                { role: 'user', content: userMessage, timestamp: new Date().toISOString() }
            ];

            // Get AI response
            const aiResponse = await sendRoleplayMessage(userMessage);

            // Add AI message
            updatedMessages.push({
                role: 'assistant',
                content: aiResponse,
                timestamp: new Date().toISOString()
            });

            // Update session
            const updatedSession: Session = {
                ...session,
                messages: updatedMessages,
                updatedAt: new Date().toISOString()
            };

            setSession(updatedSession);
            saveCurrentSession(updatedSession);
            setIsLoading(false);

            return aiResponse;
        } catch (err: any) {
            setError(err.message);
            setIsLoading(false);
            throw err;
        }
    }, [session]);

    // Change current stage
    const setCurrentStage = useCallback((stageIndex: number) => {
        if (!session) return;

        const stages = getStagesForFlow(session.flowType);
        if (stageIndex >= 0 && stageIndex < stages.length) {
            const updatedSession: Session = {
                ...session,
                currentStage: stageIndex,
                updatedAt: new Date().toISOString()
            };
            setSession(updatedSession);
            saveCurrentSession(updatedSession);
        }
    }, [session]);

    // End current session
    const endSession = useCallback((note = '') => {
        if (!session) return;

        const completedSession: Session = {
            ...session,
            status: 'completed',
            note,
            completedAt: new Date().toISOString()
        };

        saveSession(completedSession);
        clearCurrentSession();
        endRoleplaySession();
        setSession(null);

        return completedSession;
    }, [session]);

    // Resume saved session
    const resumeSession = useCallback(() => {
        const savedSession = getCurrentSession();
        if (savedSession) {
            setSession(savedSession);
            // Note: This won't restore the chat history in Gemini
            // User will need to start a new session for full roleplay
            return savedSession;
        }
        return null;
    }, []);

    // Cancel current session without saving
    const cancelSession = useCallback(() => {
        clearCurrentSession();
        endRoleplaySession();
        setSession(null);
    }, []);

    return (
        <SessionContext.Provider value={{
            session,
            isLoading,
            error,
            startSession,
            sendMessage,
            setCurrentStage,
            endSession,
            resumeSession,
            cancelSession
        }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within SessionProvider');
    }
    return context;
};

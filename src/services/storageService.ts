// Local storage service for API key, sessions, and notes

const STORAGE_KEYS = {
    API_KEY: 'aia_roleplay_api_key',
    SESSIONS: 'aia_roleplay_sessions',
    CURRENT_SESSION: 'aia_roleplay_current_session',
    ADVISOR_PROFILE: 'aia_roleplay_advisor_profile',
    GENERATED_PROMPTS: 'aia_roleplay_generated_prompts'
} as const;

export interface Session {
    id: string;
    customer: any;
    flowType: string;
    segment: string;
    messages: any[];
    currentStage: number;
    note: string;
    noteUpdatedAt?: string;
    createdAt: string;
    updatedAt: string;
    completedAt?: string;
    status: 'active' | 'completed';
}

// API Key management
export const saveApiKey = (key: string) => {
    localStorage.setItem(STORAGE_KEYS.API_KEY, key);
};

export const getApiKey = () => {
    return localStorage.getItem(STORAGE_KEYS.API_KEY);
};

export const removeApiKey = () => {
    localStorage.removeItem(STORAGE_KEYS.API_KEY);
};

// Advisor Profile management
export const getAdvisorProfile = () => {
    const profile = localStorage.getItem(STORAGE_KEYS.ADVISOR_PROFILE);
    return profile ? JSON.parse(profile) : null;
};

export const saveAdvisorProfile = (profile: any) => {
    localStorage.setItem(STORAGE_KEYS.ADVISOR_PROFILE, JSON.stringify(profile));
    return profile;
};

// Export/Import advisor profile as JSON file
export const exportProfileAsJSON = () => {
    const profile = getAdvisorProfile();
    if (!profile) {
        throw new Error('Chưa có hồ sơ để xuất');
    }

    const exportData = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        advisorProfile: profile
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aia-advisor-profile-${profile.name?.replace(/\s+/g, '-') || 'export'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const importProfileFromJSON = (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result as string);

                // Validate import data
                if (!data.advisorProfile) {
                    reject(new Error('File không hợp lệ: không tìm thấy hồ sơ tư vấn viên'));
                    return;
                }

                // Save to localStorage
                saveAdvisorProfile(data.advisorProfile);
                resolve(data.advisorProfile);
            } catch (error: any) {
                reject(new Error('Không thể đọc file JSON: ' + error.message));
            }
        };
        reader.onerror = () => reject(new Error('Lỗi đọc file'));
        reader.readAsText(file);
    });
};

// Generated Prompts history
export const getGeneratedPrompts = () => {
    const prompts = localStorage.getItem(STORAGE_KEYS.GENERATED_PROMPTS);
    return prompts ? JSON.parse(prompts) : [];
};

export const saveGeneratedPrompt = (promptData: any) => {
    const prompts = getGeneratedPrompts();
    const newPrompt = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...promptData,
        createdAt: new Date().toISOString()
    };
    prompts.unshift(newPrompt);
    // Keep only last 20 prompts
    const trimmed = prompts.slice(0, 20);
    localStorage.setItem(STORAGE_KEYS.GENERATED_PROMPTS, JSON.stringify(trimmed));
    return newPrompt;
};

// Sessions management
export const getSessions = (): Session[] => {
    const sessions = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    return sessions ? JSON.parse(sessions) : [];
};

export const saveSession = (session: Session) => {
    const sessions = getSessions();
    const existingIndex = sessions.findIndex(s => s.id === session.id);

    if (existingIndex >= 0) {
        sessions[existingIndex] = session;
    } else {
        sessions.unshift(session);
    }

    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    return session;
};

export const getSession = (sessionId: string) => {
    const sessions = getSessions();
    return sessions.find(s => s.id === sessionId);
};

export const deleteSession = (sessionId: string) => {
    const sessions = getSessions().filter(s => s.id !== sessionId);
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
};

// Current session (for mid-roleplay persistence)
export const saveCurrentSession = (session: Session) => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(session));
};

export const getCurrentSession = (): Session | null => {
    const session = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
    return session ? JSON.parse(session) : null;
};

export const clearCurrentSession = () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
};

// Notes management (stored within sessions)
export const saveNote = (sessionId: string, note: string) => {
    const sessions = getSessions();
    const session = sessions.find(s => s.id === sessionId);

    if (session) {
        session.note = note;
        session.noteUpdatedAt = new Date().toISOString();
        localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    }

    return session;
};

export const getNote = (sessionId: string) => {
    const session = getSession(sessionId);
    return session?.note || '';
};

// Utility: Generate unique ID
export const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Utility: Create new session object
export const createNewSession = (customer: any, flowType: string, segment: string): Session => {
    return {
        id: generateId(),
        customer,
        flowType,
        segment,
        messages: [],
        currentStage: 0,
        note: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active' // active | completed
    };
};

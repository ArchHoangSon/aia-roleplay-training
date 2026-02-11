// Review Page - Analyze roleplay conversations
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateReviewPrompt } from '../prompts/reviewPrompts';
import { getAdvisorProfile, getApiKey } from '../services/storageService';
import { initializeGemini, sendMessage } from '../services/geminiService';
import './ReviewPage.css';

const ReviewPage: React.FC = () => {
    const navigate = useNavigate();
    const [chatLog, setChatLog] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [advisorProfile, setAdvisorProfile] = useState<any>(null);

    useEffect(() => {
        const profile = getAdvisorProfile();
        setAdvisorProfile(profile);
        const savedApiKey = getApiKey();
        if (savedApiKey) {
            setApiKey(savedApiKey);
        }
    }, []);

    const handleAnalyze = async () => {
        if (!chatLog.trim()) {
            setError('Vui lòng paste cuộc trò chuyện cần phân tích');
            return;
        }

        if (!apiKey.trim()) {
            setError('Vui lòng nhập API Key Gemini');
            return;
        }

        setIsAnalyzing(true);
        setError(null);
        setResult(null);

        try {
            // Initialize Gemini with API key
            const initialized = initializeGemini(apiKey);
            if (!initialized) {
                throw new Error('Không thể khởi tạo Gemini API');
            }

            // Generate review prompt
            const reviewPrompt = generateReviewPrompt(chatLog, advisorProfile || {});

            // Send to Gemini
            const response = await sendMessage(reviewPrompt);
            setResult(response);
        } catch (err: any) {
            console.error('Review error:', err);
            setError(err.message || 'Có lỗi xảy ra khi phân tích. Vui lòng thử lại.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleCopyResult = () => {
        if (result) {
            navigator.clipboard.writeText(result);
            alert('Đã copy kết quả phân tích!');
        }
    };

    const handleReset = () => {
        setChatLog('');
        setResult(null);
        setError(null);
    };

    return (
        <div className="review-page">
            <div className="review-container">
                <div className="review-header">
                    <h1>📋 Review Cuộc Trò Chuyện</h1>
                    <p className="review-description">
                        Paste cuộc trò chuyện roleplay đã hoàn tất để được AI phân tích ưu/khuyết điểm và nhận gợi ý cải thiện.
                    </p>
                </div>

                {!result ? (
                    <div className="review-input-section">
                        {/* API Key Input */}
                        <div className="api-key-section">
                            <label>🔑 Gemini API Key</label>
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="Nhập API Key từ Google AI Studio..."
                                className="api-key-input"
                            />
                            <span className="api-hint">
                                Lấy API Key miễn phí tại{' '}
                                <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">
                                    Google AI Studio
                                </a>
                            </span>
                        </div>

                        {/* Chat Log Input */}
                        <div className="chatlog-section">
                            <label>💬 Cuộc trò chuyện</label>
                            <textarea
                                value={chatLog}
                                onChange={(e) => setChatLog(e.target.value)}
                                placeholder={`Paste toàn bộ cuộc trò chuyện roleplay ở đây...\n\nVí dụ:\nTVV: Chào anh Minh, em là Lan từ AIA ạ...\nKH: À chào em, có việc gì không em?\nTVV: Em được anh Hùng giới thiệu ạ...\n...`}
                                rows={15}
                                className="chatlog-input"
                            />
                            <span className="chatlog-hint">
                                Copy từ Gemini/ChatGPT và paste vào đây
                            </span>
                        </div>

                        {error && (
                            <div className="error-message">
                                ⚠️ {error}
                            </div>
                        )}

                        <div className="review-actions">
                            <button className="btn btn-secondary" onClick={() => navigate('/')}>
                                ← Quay lại
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleAnalyze}
                                disabled={isAnalyzing}
                            >
                                {isAnalyzing ? (
                                    <>
                                        <span className="spinner"></span>
                                        Đang phân tích...
                                    </>
                                ) : (
                                    '🔍 Phân tích cuộc trò chuyện'
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="review-result-section">
                        <div className="result-header">
                            <h2>📊 Kết quả phân tích</h2>
                            <div className="result-actions">
                                <button className="btn btn-ghost btn-sm" onClick={handleCopyResult}>
                                    📋 Copy kết quả
                                </button>
                                <button className="btn btn-ghost btn-sm" onClick={handleReset}>
                                    🔄 Phân tích mới
                                </button>
                            </div>
                        </div>

                        <div className="result-content">
                            <pre>{result}</pre>
                        </div>

                        <div className="review-actions">
                            <button className="btn btn-secondary" onClick={() => navigate('/')}>
                                ← Về trang chủ
                            </button>
                            <button className="btn btn-primary" onClick={handleReset}>
                                📝 Phân tích cuộc khác
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewPage;

// Roleplay Page - Main chat interface
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../contexts/SessionContext';
import { getStagesForFlow } from '../constants/consultingFlows';
import { getCustomerDisplayName } from '../services/customerGenerator';
import { PERSONALITY_BEHAVIORS } from '../constants/behaviorPatterns';
import './RoleplayPage.css';

const RoleplayPage: React.FC = () => {
    const navigate = useNavigate();
    const { session, sendMessage, setCurrentStage, endSession, isLoading, error } = useSession();
    const [inputMessage, setInputMessage] = useState('');
    const [showEndModal, setShowEndModal] = useState(false);
    const [note, setNote] = useState('');
    const [showSidebar, setShowSidebar] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Redirect if no session
    useEffect(() => {
        if (!session) {
            navigate('/'); // Changed from /setup to / as backup
        }
    }, [session, navigate]);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [session?.messages]);

    // Focus input after loading
    useEffect(() => {
        if (!isLoading) {
            inputRef.current?.focus();
        }
    }, [isLoading]);

    if (!session) return null;

    const stages = getStagesForFlow(session.flowType);
    const currentStage = stages[session.currentStage];
    const personalityType = session.customer?.personalityType as keyof typeof PERSONALITY_BEHAVIORS;
    const personality = PERSONALITY_BEHAVIORS[personalityType];

    const handleSend = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const message = inputMessage.trim();
        setInputMessage('');

        try {
            await sendMessage(message);
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleEndSession = () => {
        endSession(note);
        navigate('/history');
    };

    return (
        <div className="roleplay-page">
            {/* Sidebar */}
            <aside className={`roleplay-sidebar ${showSidebar ? 'open' : 'closed'}`}>
                <button className="sidebar-toggle" onClick={() => setShowSidebar(!showSidebar)}>
                    {showSidebar ? '←' : '→'}
                </button>

                {showSidebar && (
                    <>
                        <div className="sidebar-section">
                            <h3>👤 Khách hàng</h3>
                            <div className="customer-info">
                                <p className="customer-name">{getCustomerDisplayName(session.customer)}</p>
                                <span className="personality-tag">{personality?.label || 'N/A'}</span>
                            </div>
                            {session.customer?.backgroundStory && (
                                <p className="customer-story">{session.customer.backgroundStory}</p>
                            )}
                        </div>

                        <div className="sidebar-section">
                            <h3>📊 Giai đoạn</h3>
                            <div className="stage-list">
                                {stages.map((stage, index) => (
                                    <button
                                        key={stage.id}
                                        className={`stage-item ${index === session.currentStage ? 'active' : ''} ${index < session.currentStage ? 'completed' : ''}`}
                                        onClick={() => setCurrentStage(index)}
                                    >
                                        <span className="stage-number">{index + 1}</span>
                                        <span className="stage-name">{stage.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="sidebar-section">
                            <h3>💡 Tips</h3>
                            {currentStage?.tips && (
                                <ul className="tips-list">
                                    {(currentStage.tips as string[]).map((tip, i) => (
                                        <li key={i}>{tip}</li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <button className="btn btn-secondary end-btn" onClick={() => setShowEndModal(true)}>
                            Kết thúc phiên
                        </button>
                    </>
                )}
            </aside>

            {/* Main chat area */}
            <main className="roleplay-main">
                <div className="chat-header">
                    <div className="chat-info">
                        <h2>{getCustomerDisplayName(session.customer)}</h2>
                        <span className="stage-badge">{currentStage?.name}</span>
                    </div>
                </div>

                <div className="chat-messages">
                    {session.messages.length === 0 && (
                        <div className="chat-empty">
                            <p>💬 Bắt đầu cuộc trò chuyện với khách hàng</p>
                            <p className="text-sm text-gray">Gửi tin nhắn đầu tiên để mở đầu buổi tư vấn</p>
                        </div>
                    )}

                    {session.messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.role}`}>
                            <div className="message-content">
                                {msg.content}
                            </div>
                            <span className="message-time">
                                {new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="message assistant">
                            <div className="message-content typing">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {error && <div className="chat-error">{error}</div>}

                <div className="chat-input">
                    <textarea
                        ref={inputRef}
                        className="input-field"
                        placeholder="Nhập tin nhắn tư vấn..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        disabled={isLoading}
                    />
                    <button
                        className="btn btn-primary send-btn"
                        onClick={handleSend}
                        disabled={isLoading || !inputMessage.trim()}
                    >
                        Gửi
                    </button>
                </div>
            </main>

            {/* End Session Modal */}
            {showEndModal && (
                <div className="modal-overlay" onClick={() => setShowEndModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h3>Kết thúc phiên roleplay</h3>
                        <p className="text-gray">Ghi chú kết quả buổi tư vấn:</p>
                        <textarea
                            className="textarea"
                            placeholder="Điểm mạnh, điểm cần cải thiện, bài học rút ra..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={5}
                        />
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setShowEndModal(false)}>
                                Tiếp tục
                            </button>
                            <button className="btn btn-primary" onClick={handleEndSession}>
                                Lưu & Kết thúc
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoleplayPage;

// Roleplay Page - Main chat interface
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../contexts/SessionContext';
import { getStagesForFlow } from '../constants/consultingFlows';
import { getCustomerDisplayName } from '../services/customerGenerator';
import { PERSONALITY_BEHAVIORS } from '../constants/behaviorPatterns';
import { UserIcon, BarChartIcon, LightbulbIcon, ChevronLeftIcon, ChevronRightIcon, SendIcon, PanelLeftIcon, MessageSquareIcon, XIcon, SaveIcon } from '../components/common/Icons';
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

    useEffect(() => {
        if (!session) {
            navigate('/');
        }
    }, [session, navigate]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [session?.messages]);

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
                <button
                    className="sidebar-toggle"
                    onClick={() => setShowSidebar(!showSidebar)}
                    aria-label={showSidebar ? 'Ẩn sidebar' : 'Hiện sidebar'}
                >
                    {showSidebar ? <ChevronLeftIcon size={16} /> : <ChevronRightIcon size={16} />}
                </button>

                {showSidebar && (
                    <>
                        <div className="sidebar-section">
                            <h3><UserIcon size={14} /> Khách hàng</h3>
                            <div className="customer-info">
                                <p className="customer-name">{getCustomerDisplayName(session.customer)}</p>
                                <span className="personality-tag">{personality?.label || 'N/A'}</span>
                            </div>
                            {session.customer?.backgroundStory && (
                                <p className="customer-story">{session.customer.backgroundStory}</p>
                            )}
                        </div>

                        <div className="sidebar-section">
                            <h3><BarChartIcon size={14} /> Giai đoạn</h3>
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
                            <h3><LightbulbIcon size={14} /> Tips</h3>
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
                    {!showSidebar && (
                        <button className="btn-icon sidebar-open-btn" onClick={() => setShowSidebar(true)} aria-label="Mở sidebar">
                            <PanelLeftIcon size={18} />
                        </button>
                    )}
                    <div className="chat-info">
                        <h2>{getCustomerDisplayName(session.customer)}</h2>
                        <span className="stage-badge">{currentStage?.name}</span>
                    </div>
                </div>

                <div className="chat-messages">
                    {session.messages.length === 0 && (
                        <div className="chat-empty">
                            <div className="chat-empty-icon">
                                <MessageSquareIcon size={32} />
                            </div>
                            <p>Bắt đầu cuộc trò chuyện với khách hàng</p>
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
                        aria-label="Gửi tin nhắn"
                    >
                        <SendIcon size={18} />
                    </button>
                </div>
            </main>

            {/* End Session Modal */}
            {showEndModal && (
                <div className="modal-overlay" onClick={() => setShowEndModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Kết thúc phiên roleplay</h3>
                            <button className="btn-icon modal-close" onClick={() => setShowEndModal(false)} aria-label="Đóng">
                                <XIcon size={18} />
                            </button>
                        </div>
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
                                <SaveIcon size={16} />
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

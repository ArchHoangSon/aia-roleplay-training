// History Page - View past sessions and notes
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSessions, deleteSession, saveNote, getGeneratedPrompts, Session } from '../services/storageService';
import { getCustomerDisplayName } from '../services/customerGenerator';
import { PlusIcon, UserIcon, MessageSquareIcon, EditIcon, TrashIcon, CheckIcon, FileTextIcon, SparklesIcon, CopyIcon, ClipboardIcon } from '../components/common/Icons';
import './HistoryPage.css';

const HistoryPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'sessions' | 'prompts'>('sessions');
    const [sessions, setSessions] = useState<Session[]>([]);
    const [prompts, setPrompts] = useState<any[]>([]);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [editingNote, setEditingNote] = useState(false);
    const [noteText, setNoteText] = useState('');

    useEffect(() => {
        setSessions(getSessions());
        setPrompts(getGeneratedPrompts());
    }, []);

    const handleSelectItem = (item: any) => {
        setSelectedItem(item);
        setNoteText(item.note || '');
        setEditingNote(false);
    };

    const handleSaveNote = () => {
        if (!selectedItem || activeTab !== 'sessions') return;
        saveNote(selectedItem.id, noteText);
        setSelectedItem({ ...selectedItem, note: noteText });
        setSessions(getSessions());
        setEditingNote(false);
    };

    const handleDeleteSession = (sessionId: string) => {
        if (window.confirm('Bạn có chắc muốn xóa phiên này?')) {
            deleteSession(sessionId);
            setSessions(getSessions());
            if (selectedItem?.id === sessionId) {
                setSelectedItem(null);
            }
        }
    };

    const handleCopyPrompt = (prompt: string) => {
        navigator.clipboard.writeText(prompt);
        alert('Đã copy prompt!');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="history-page">
            <div className="history-container">
                {/* Sessions list */}
                <aside className="sessions-list">
                    <div className="list-header">
                        <h2>Lịch sử</h2>
                        <Link to="/customer-setup" className="btn btn-primary btn-sm" aria-label="Tạo mới">
                            <PlusIcon size={14} />
                            Mới
                        </Link>
                    </div>

                    <div className="history-tabs">
                        <button
                            className={`tab-btn ${activeTab === 'sessions' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('sessions'); setSelectedItem(null); }}
                        >
                            Roleplay
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'prompts' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('prompts'); setSelectedItem(null); }}
                        >
                            Prompts
                        </button>
                    </div>

                    <div className="sessions">
                        {activeTab === 'sessions' ? (
                            sessions.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-state-icon"><MessageSquareIcon size={32} /></div>
                                    <p>Chưa có phiên roleplay nào</p>
                                </div>
                            ) : (
                                sessions.map(session => (
                                    <button
                                        key={session.id}
                                        className={`session-item ${selectedItem?.id === session.id ? 'selected' : ''}`}
                                        onClick={() => handleSelectItem(session)}
                                    >
                                        <div className="session-info">
                                            <span className="session-name">{getCustomerDisplayName(session.customer)}</span>
                                            <span className="session-meta">
                                                {session.flowType === 'ecm' ? 'ECM' : 'New'} •
                                                {session.segment === 'hnw' ? ' HNW' : ' Mass'}
                                            </span>
                                            <span className="session-date">{formatDate(session.createdAt)}</span>
                                        </div>
                                        <div className="session-badges">
                                            <span className={`status-badge ${session.status}`}>
                                                {session.status === 'completed' ? <CheckIcon size={12} /> : '...'}
                                            </span>
                                            {session.note && <span className="note-badge"><FileTextIcon size={12} /></span>}
                                        </div>
                                    </button>
                                ))
                            )
                        ) : (
                            prompts.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-state-icon"><SparklesIcon size={32} /></div>
                                    <p>Chưa có prompt nào được tạo</p>
                                </div>
                            ) : (
                                prompts.map(p => (
                                    <button
                                        key={p.id}
                                        className={`session-item ${selectedItem?.id === p.id ? 'selected' : ''}`}
                                        onClick={() => handleSelectItem(p)}
                                    >
                                        <div className="session-info">
                                            <span className="session-name">{p.customerName || 'Khách hàng'}</span>
                                            <span className="session-meta">
                                                {p.flowType === 'ecm' ? 'ECM' : 'New'} •
                                                {p.segment === 'hnw' ? ' HNW' : ' Mass'}
                                            </span>
                                            <span className="session-date">{formatDate(p.createdAt)}</span>
                                        </div>
                                        <div className="session-badges">
                                            <span className="note-badge"><SparklesIcon size={12} /></span>
                                        </div>
                                    </button>
                                ))
                            )
                        )}
                    </div>
                </aside>

                {/* Session detail */}
                <main className="session-detail">
                    {selectedItem ? (
                        <>
                            <div className="detail-header">
                                <div>
                                    <h2>{activeTab === 'sessions' ? getCustomerDisplayName(selectedItem.customer) : selectedItem.customerName}</h2>
                                    <p className="detail-meta">
                                        {selectedItem.flowType === 'ecm' ? 'ECM' : 'New Customer'} •
                                        {selectedItem.segment === 'hnw' ? ' HNW' : ' Mass Market'} •
                                        {formatDate(selectedItem.createdAt)}
                                    </p>
                                </div>
                                {activeTab === 'sessions' && (
                                    <button
                                        className="btn btn-ghost text-error"
                                        onClick={() => handleDeleteSession(selectedItem.id)}
                                        aria-label="Xóa phiên"
                                    >
                                        <TrashIcon size={16} />
                                        Xóa
                                    </button>
                                )}
                                {activeTab === 'prompts' && (
                                    <button
                                        className="btn btn-ghost"
                                        onClick={() => handleCopyPrompt(selectedItem.prompt)}
                                    >
                                        <CopyIcon size={16} />
                                        Copy Prompt
                                    </button>
                                )}
                            </div>

                            {activeTab === 'sessions' ? (
                                <>
                                    {/* Customer info */}
                                    <section className="detail-section">
                                        <h3><UserIcon size={16} /> Thông tin khách hàng</h3>
                                        <div className="info-grid">
                                            {selectedItem.customer?.basicInfo &&
                                                Object.entries(selectedItem.customer.basicInfo).map(([key, value]) => (
                                                    value && (
                                                        <div key={key} className="info-item">
                                                            <span className="info-label">{key}</span>
                                                            <span className="info-value">{String(value)}</span>
                                                        </div>
                                                    )
                                                ))
                                            }
                                        </div>
                                        {selectedItem.customer?.backgroundStory && (
                                            <p className="customer-story-detail">
                                                "{selectedItem.customer.backgroundStory}"
                                            </p>
                                        )}
                                    </section>

                                    {/* Conversation */}
                                    <section className="detail-section">
                                        <h3><MessageSquareIcon size={16} /> Cuộc trò chuyện ({selectedItem.messages?.length || 0} tin nhắn)</h3>
                                        <div className="conversation">
                                            {selectedItem.messages?.map((msg: any, index: number) => (
                                                <div key={index} className={`conv-message ${msg.role}`}>
                                                    <span className="conv-role">
                                                        {msg.role === 'user' ? 'TVV' : 'Khách'}
                                                    </span>
                                                    <p className="conv-content">{msg.content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Notes */}
                                    <section className="detail-section">
                                        <div className="section-header">
                                            <h3><EditIcon size={16} /> Ghi chú</h3>
                                            {!editingNote && (
                                                <button className="btn btn-ghost btn-sm" onClick={() => setEditingNote(true)}>
                                                    Chỉnh sửa
                                                </button>
                                            )}
                                        </div>

                                        {editingNote ? (
                                            <div className="note-editor">
                                                <textarea
                                                    className="textarea"
                                                    value={noteText}
                                                    onChange={(e) => setNoteText(e.target.value)}
                                                    placeholder="Ghi chú kết quả, bài học rút ra..."
                                                    rows={5}
                                                />
                                                <div className="note-actions">
                                                    <button className="btn btn-secondary" onClick={() => setEditingNote(false)}>
                                                        Hủy
                                                    </button>
                                                    <button className="btn btn-primary" onClick={handleSaveNote}>
                                                        Lưu
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="note-content">
                                                {selectedItem.note || <span className="text-gray">Chưa có ghi chú</span>}
                                            </p>
                                        )}
                                    </section>
                                </>
                            ) : (
                                <>
                                    <section className="detail-section">
                                        <h3><ClipboardIcon size={16} /> Context Prompt</h3>
                                        <div className="prompt-preview" style={{ maxHeight: '500px', overflowY: 'auto', background: 'var(--gray-50)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)' }}>
                                            <pre style={{ whiteSpace: 'pre-wrap', fontSize: 'var(--font-size-sm)' }}>{selectedItem.prompt}</pre>
                                        </div>
                                    </section>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="empty-detail">
                            <div className="empty-detail-icon">
                                <MessageSquareIcon size={40} />
                            </div>
                            <p>Chọn một {activeTab === 'sessions' ? 'phiên' : 'prompt'} để xem chi tiết</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default HistoryPage;

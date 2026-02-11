// History Page - View past sessions and notes
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSessions, deleteSession, saveNote, Session } from '../services/storageService';
import { getCustomerDisplayName } from '../services/customerGenerator';
import { PlusIcon, UserIcon, MessageSquareIcon, EditIcon, TrashIcon, CheckIcon, FileTextIcon } from '../components/common/Icons';
import './HistoryPage.css';

const HistoryPage: React.FC = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const [editingNote, setEditingNote] = useState(false);
    const [noteText, setNoteText] = useState('');

    useEffect(() => {
        setSessions(getSessions());
    }, []);

    const handleSelectSession = (session: Session) => {
        setSelectedSession(session);
        setNoteText(session.note || '');
        setEditingNote(false);
    };

    const handleSaveNote = () => {
        if (!selectedSession) return;
        saveNote(selectedSession.id, noteText);
        setSelectedSession({ ...selectedSession, note: noteText });
        setSessions(getSessions());
        setEditingNote(false);
    };

    const handleDeleteSession = (sessionId: string) => {
        if (window.confirm('Bạn có chắc muốn xóa phiên này?')) {
            deleteSession(sessionId);
            setSessions(getSessions());
            if (selectedSession?.id === sessionId) {
                setSelectedSession(null);
            }
        }
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
                        <h2>Lịch sử Roleplay</h2>
                        <Link to="/customer-setup" className="btn btn-primary btn-sm" aria-label="Tạo phiên mới">
                            <PlusIcon size={14} />
                            Mới
                        </Link>
                    </div>

                    {sessions.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <MessageSquareIcon size={32} />
                            </div>
                            <p>Chưa có phiên roleplay nào</p>
                            <Link to="/customer-setup" className="btn btn-secondary">Bắt đầu ngay</Link>
                        </div>
                    ) : (
                        <div className="sessions">
                            {sessions.map(session => (
                                <button
                                    key={session.id}
                                    className={`session-item ${selectedSession?.id === session.id ? 'selected' : ''}`}
                                    onClick={() => handleSelectSession(session)}
                                >
                                    <div className="session-info">
                                        <span className="session-name">
                                            {getCustomerDisplayName(session.customer)}
                                        </span>
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
                            ))}
                        </div>
                    )}
                </aside>

                {/* Session detail */}
                <main className="session-detail">
                    {selectedSession ? (
                        <>
                            <div className="detail-header">
                                <div>
                                    <h2>{getCustomerDisplayName(selectedSession.customer)}</h2>
                                    <p className="detail-meta">
                                        {selectedSession.flowType === 'ecm' ? 'ECM' : 'New Customer'} •
                                        {selectedSession.segment === 'hnw' ? ' HNW' : ' Mass Market'} •
                                        {formatDate(selectedSession.createdAt)}
                                    </p>
                                </div>
                                <button
                                    className="btn btn-ghost text-error"
                                    onClick={() => handleDeleteSession(selectedSession.id)}
                                    aria-label="Xóa phiên"
                                >
                                    <TrashIcon size={16} />
                                    Xóa
                                </button>
                            </div>

                            {/* Customer info */}
                            <section className="detail-section">
                                <h3><UserIcon size={16} /> Thông tin khách hàng</h3>
                                <div className="info-grid">
                                    {selectedSession.customer?.basicInfo &&
                                        Object.entries(selectedSession.customer.basicInfo).map(([key, value]) => (
                                            value && (
                                                <div key={key} className="info-item">
                                                    <span className="info-label">{key}</span>
                                                    <span className="info-value">{String(value)}</span>
                                                </div>
                                            )
                                        ))
                                    }
                                </div>
                                {selectedSession.customer?.backgroundStory && (
                                    <p className="customer-story-detail">
                                        "{selectedSession.customer.backgroundStory}"
                                    </p>
                                )}
                            </section>

                            {/* Conversation */}
                            <section className="detail-section">
                                <h3><MessageSquareIcon size={16} /> Cuộc trò chuyện ({selectedSession.messages.length} tin nhắn)</h3>
                                <div className="conversation">
                                    {selectedSession.messages.map((msg, index) => (
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
                                        {selectedSession.note || <span className="text-gray">Chưa có ghi chú</span>}
                                    </p>
                                )}
                            </section>
                        </>
                    ) : (
                        <div className="empty-detail">
                            <div className="empty-detail-icon">
                                <MessageSquareIcon size={40} />
                            </div>
                            <p>Chọn một phiên để xem chi tiết</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default HistoryPage;

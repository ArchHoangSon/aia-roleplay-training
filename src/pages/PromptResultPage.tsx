// Prompt Result Page - Display generated context prompt with copy functionality
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateContextPrompt } from '../prompts/roleplayPrompts';
import { saveGeneratedPrompt } from '../services/storageService';
import { getFlowById, getStagesForFlow } from '../constants/consultingFlows';
import './PromptResultPage.css';

interface LocationState {
    customerData: any;
    flowType: string;
    segment: string;
    advisorProfile: any;
    selectedStages: string[];
}

const PromptResultPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [contextPrompt, setContextPrompt] = useState('');
    const [copied, setCopied] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const { customerData, flowType, segment, advisorProfile, selectedStages = [] } = (location.state as LocationState) || {};

    useEffect(() => {
        if (!customerData || !advisorProfile) {
            navigate('/customer-setup');
            return;
        }

        // Generate the context prompt with selectedStages
        const prompt = generateContextPrompt({
            advisor: advisorProfile,
            customer: customerData,
            flowType,
            segment,
            selectedStages
        });

        setContextPrompt(prompt);

        // Save to history
        saveGeneratedPrompt({
            customerName: customerData.name,
            flowType,
            segment,
            selectedStages,
            prompt
        });
    }, [customerData, advisorProfile, flowType, segment, selectedStages, navigate]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(contextPrompt);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        } catch (err) {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = contextPrompt;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        }
    };

    const handleDownloadJSON = () => {
        const exportData = {
            version: '1.0',
            exportedAt: new Date().toISOString(),
            advisor: advisorProfile,
            customer: customerData,
            flowType,
            segment,
            selectedStages,
            prompt: contextPrompt
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `roleplay-prompt-${customerData.name?.replace(/\s+/g, '-') || 'export'}-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleNewPrompt = () => {
        navigate('/customer-setup');
    };

    const flow = getFlowById(flowType);
    const stages = getStagesForFlow(flowType);

    if (!customerData) return null;

    return (
        <div className="prompt-result-page">
            <div className="result-container">
                {/* Success Header */}
                <div className="result-header">
                    <div className="success-icon">✅</div>
                    <h1>Context Prompt đã sẵn sàng!</h1>
                    <p className="subtitle">
                        Copy và paste vào Gemini, ChatGPT, hoặc AI khác để bắt đầu roleplay
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="summary-cards">
                    <div className="summary-card">
                        <div className="card-label">Tư vấn viên</div>
                        <div className="card-value">{advisorProfile.name}</div>
                    </div>
                    <div className="summary-card">
                        <div className="card-label">Khách hàng</div>
                        <div className="card-value">{customerData.name}</div>
                    </div>
                    <div className="summary-card">
                        <div className="card-label">Luồng</div>
                        <div className="card-value">{flow?.name || flowType}</div>
                    </div>
                    <div className="summary-card">
                        <div className="card-label">Phân khúc</div>
                        <div className="card-value">{segment === 'hnw' ? 'HNW' : 'Mass Market'}</div>
                    </div>
                </div>

                {/* Stages Preview */}
                <div className="stages-preview">
                    <h4>Các giai đoạn tư vấn:</h4>
                    <div className="stages-list">
                        {stages.map((stage, index) => (
                            <span key={stage.id} className="stage-badge">
                                {index + 1}. {stage.name}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Copy Section */}
                <div className="copy-section">
                    <div className="copy-header">
                        <button
                            className={`btn-copy ${copied ? 'copied' : ''}`}
                            onClick={handleCopy}
                        >
                            {copied ? (
                                <>✓ Đã copy!</>
                            ) : (
                                <>📋 Copy Prompt</>
                            )}
                        </button>
                        <button
                            className="btn-preview"
                            onClick={() => setShowPreview(!showPreview)}
                        >
                            {showPreview ? '🙈 Ẩn' : '👁️ Xem'} prompt
                        </button>
                        <button
                            className="btn-download"
                            onClick={handleDownloadJSON}
                        >
                            📥 Download JSON
                        </button>
                    </div>

                    {showPreview && (
                        <div className="prompt-preview">
                            <pre>{contextPrompt}</pre>
                        </div>
                    )}
                </div>

                {/* Instructions */}
                <div className="instructions">
                    <h4>📖 Hướng dẫn sử dụng:</h4>
                    <ol>
                        <li>Nhấn <strong>Copy Prompt</strong> ở trên</li>
                        <li>Mở <a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer">Gemini</a>, <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer">ChatGPT</a>, hoặc AI khác</li>
                        <li>Paste và gửi tin nhắn</li>
                        <li>Bắt đầu roleplay - AI sẽ đóng vai khách hàng!</li>
                    </ol>
                </div>

                {/* Actions */}
                <div className="result-actions">
                    <button className="btn btn-secondary" onClick={handleNewPrompt}>
                        ← Tạo khách hàng khác
                    </button>
                    <button className="btn btn-primary" onClick={handleCopy}>
                        {copied ? '✓ Đã copy!' : '📋 Copy Prompt'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PromptResultPage;

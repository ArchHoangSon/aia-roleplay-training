// Advisor Setup Page - One-time setup for advisor profile
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ADVISOR_PROFILE_FIELDS, DEFAULT_ADVISOR_PROFILE } from '../constants/advisorProfile';
import { getAdvisorProfile, saveAdvisorProfile, exportProfileAsJSON, importProfileFromJSON } from '../services/storageService';
import './AdvisorSetupPage.css';

interface AdvisorProfile {
    name: string;
    gender: string;
    age: string | number;
    experienceMonths: string | number;
    personality: string;
    strengths: string;
    improvements: string;
    [key: string]: any;
}

const AdvisorSetupPage: React.FC = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<AdvisorProfile>(DEFAULT_ADVISOR_PROFILE as AdvisorProfile);
    const [isEditing, setIsEditing] = useState(false);
    const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const saved = getAdvisorProfile();
        if (saved) {
            setProfile(saved);
        } else {
            setIsEditing(true);
        }
    }, []);

    const handleChange = (field: string, value: string) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        if (!profile.name.trim()) {
            alert('Vui lòng nhập họ tên');
            return;
        }
        saveAdvisorProfile(profile);
        setIsEditing(false);
    };

    const handleContinue = () => {
        if (!profile.name.trim()) {
            alert('Vui lòng nhập họ tên trước khi tiếp tục');
            setIsEditing(true);
            return;
        }
        navigate('/customer-setup');
    };

    const handleExport = () => {
        try {
            exportProfileAsJSON();
            setImportStatus({ type: 'success', message: 'Đã xuất file thành công!' });
            setTimeout(() => setImportStatus(null), 3000);
        } catch (error: any) {
            setImportStatus({ type: 'error', message: error.message });
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const importedProfile = await importProfileFromJSON(file);
            setProfile(importedProfile);
            setIsEditing(false);
            setImportStatus({ type: 'success', message: 'Nhập hồ sơ thành công!' });
            setTimeout(() => setImportStatus(null), 3000);
        } catch (error: any) {
            setImportStatus({ type: 'error', message: error.message });
        }

        // Reset input
        e.target.value = '';
    };

    const renderField = (fieldKey: string, fieldConfig: any) => {
        const value = profile[fieldKey] || '';

        if (!isEditing) {
            return (
                <div key={fieldKey} className="field-display">
                    <span className="field-label">{fieldConfig.label}:</span>
                    <span className="field-value">{value || <em className="text-gray">Chưa có</em>}</span>
                </div>
            );
        }

        switch (fieldConfig.type) {
            case 'select':
                return (
                    <div key={fieldKey} className="form-field">
                        <label>{fieldConfig.label}</label>
                        <select
                            value={value}
                            onChange={(e) => handleChange(fieldKey, e.target.value)}
                        >
                            <option value="">-- Chọn --</option>
                            {fieldConfig.options.map((opt: string) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                );
            case 'textarea':
                return (
                    <div key={fieldKey} className="form-field">
                        <label>{fieldConfig.label}</label>
                        <textarea
                            value={value}
                            onChange={(e) => handleChange(fieldKey, e.target.value)}
                            placeholder={fieldConfig.placeholder}
                            rows={3}
                        />
                    </div>
                );
            default:
                return (
                    <div key={fieldKey} className="form-field">
                        <label>
                            {fieldConfig.label}
                            {fieldConfig.required && <span className="required">*</span>}
                        </label>
                        <input
                            type={fieldConfig.type}
                            value={value}
                            onChange={(e) => handleChange(fieldKey, e.target.value)}
                            placeholder={fieldConfig.placeholder}
                        />
                    </div>
                );
        }
    };

    return (
        <div className="advisor-setup-page">
            <div className="setup-container">
                <div className="setup-header">
                    <h1>👤 Hồ sơ Tư vấn viên</h1>
                    <p className="subtitle">
                        Thông tin này giúp tạo context prompt phù hợp với bạn
                    </p>
                </div>

                {/* Import/Export Section */}
                <div className="import-export-section">
                    <button className="btn btn-ghost btn-sm" onClick={handleExport} disabled={!profile.name}>
                        📤 Xuất JSON
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={handleImportClick}>
                        📥 Nhập JSON
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImportFile}
                        accept=".json"
                        style={{ display: 'none' }}
                    />
                </div>

                {importStatus && (
                    <div className={`import-status ${importStatus.type}`}>
                        {importStatus.type === 'success' ? '✅' : '⚠️'} {importStatus.message}
                    </div>
                )}

                <div className="profile-card">
                    {isEditing ? (
                        <>
                            <div className="form-section">
                                <h3>Thông tin cơ bản</h3>
                                {renderField('name', ADVISOR_PROFILE_FIELDS.name)}
                                <div className="form-row">
                                    {(renderField as any)('gender', ADVISOR_PROFILE_FIELDS.gender)}
                                    {(renderField as any)('age', ADVISOR_PROFILE_FIELDS.age)}
                                </div>
                                {renderField('experienceMonths', ADVISOR_PROFILE_FIELDS.experienceMonths)}
                            </div>

                            <div className="form-section">
                                <h3>Phong cách & Thế mạnh</h3>
                                {renderField('personality', ADVISOR_PROFILE_FIELDS.personality)}
                                {renderField('strengths', ADVISOR_PROFILE_FIELDS.strengths)}
                            </div>

                            <div className="form-section">
                                <h3>Mục tiêu cải thiện</h3>
                                {renderField('improvements', ADVISOR_PROFILE_FIELDS.improvements)}
                            </div>

                            <div className="form-actions">
                                <button className="btn btn-primary" onClick={handleSave}>
                                    💾 Lưu hồ sơ
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="profile-summary">
                                <h2>{profile.name}</h2>
                                <div className="profile-meta">
                                    {profile.gender && <span>{profile.gender}</span>}
                                    {profile.age && <span>{profile.age} tuổi</span>}
                                    {profile.experienceMonths && <span>{profile.experienceMonths} tháng kinh nghiệm</span>}
                                </div>
                            </div>

                            <div className="profile-details">
                                {profile.personality && (
                                    <div className="detail-item">
                                        <strong>Tính cách:</strong> {profile.personality}
                                    </div>
                                )}
                                {profile.strengths && (
                                    <div className="detail-item">
                                        <strong>Thế mạnh:</strong> {profile.strengths}
                                    </div>
                                )}
                                {profile.improvements && (
                                    <div className="detail-item">
                                        <strong>Cần cải thiện:</strong> {profile.improvements}
                                    </div>
                                )}
                            </div>

                            <div className="form-actions">
                                <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
                                    ✏️ Chỉnh sửa
                                </button>
                                <button className="btn btn-primary" onClick={handleContinue}>
                                    Tiếp tục → Tạo khách hàng
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdvisorSetupPage;

// Customer Setup Page - Enhanced with stage selection
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CUSTOMER_FORM_FIELDS, DEFAULT_CUSTOMER_DATA } from '../constants/customerFormFields';
import { FLOW_TYPES, SEGMENT_TYPES, getStagesForFlow } from '../constants/consultingFlows';
import { getAdvisorProfile } from '../services/storageService';
import './CustomerSetupPage.css';

const CustomerSetupPage: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Flow/Segment, 2: Customer info, 3: Stage selection
    const [flowType, setFlowType] = useState(FLOW_TYPES.NEW_CUSTOMER);
    const [segment, setSegment] = useState(SEGMENT_TYPES.MASS_MARKET);
    const [customerData, setCustomerData] = useState<any>(DEFAULT_CUSTOMER_DATA);
    const [advisorProfile, setAdvisorProfile] = useState<any>(null);
    const [selectedStages, setSelectedStages] = useState<string[]>([]); // Array of stage ids

    useEffect(() => {
        const profile = getAdvisorProfile();
        if (!profile) {
            navigate('/advisor-setup');
            return;
        }
        setAdvisorProfile(profile);
    }, [navigate]);

    // Reset stage selection when flow changes
    useEffect(() => {
        setSelectedStages([]);
    }, [flowType]);

    const handleChange = (field: string, value: string) => {
        setCustomerData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleStageToggle = (stageId: string) => {
        setSelectedStages(prev => {
            if (prev.includes(stageId)) {
                return prev.filter(id => id !== stageId);
            }
            return [...prev, stageId];
        });
    };

    const handleSelectAllStages = () => {
        const allStages = getStagesForFlow(flowType).map(s => s.id);
        setSelectedStages(allStages);
    };

    const handleClearStages = () => {
        setSelectedStages([]);
    };

    const handleNext = () => {
        if (step === 1) {
            setStep(2);
        } else if (step === 2) {
            // Validate name at minimum
            if (!customerData.name.trim()) {
                alert('Vui lòng nhập tên khách hàng');
                return;
            }
            setStep(3);
        } else {
            // Step 3 -> Generate prompt
            if (selectedStages.length === 0) {
                // Default to first stage if none selected
                const firstStage = getStagesForFlow(flowType)[0];
                setSelectedStages([firstStage.id]);
            }
            navigate('/prompt-result', {
                state: {
                    customerData,
                    flowType,
                    segment,
                    advisorProfile,
                    selectedStages: selectedStages.length > 0 ? selectedStages : [getStagesForFlow(flowType)[0].id]
                }
            });
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        } else {
            navigate('/');
        }
    };

    const renderFormField = (fieldKey: string, fieldConfig: any) => {
        const value = customerData[fieldKey] || '';

        switch (fieldConfig.type) {
            case 'select':
                // Handle object options (from PERSONALITY_TYPES, etc.)
                const options = fieldConfig.options || [];
                const isObjectOptions = options.length > 0 && typeof options[0] === 'object';

                return (
                    <div key={fieldKey} className="form-field">
                        <label>{fieldConfig.label}</label>
                        <select
                            value={value as string}
                            onChange={(e) => handleChange(fieldKey, e.target.value)}
                        >
                            <option value="">-- Chọn --</option>
                            {isObjectOptions
                                ? options.map((opt: any) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))
                                : options.map((opt: string) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))
                            }
                        </select>
                        {fieldConfig.hint && <span className="field-hint">{fieldConfig.hint}</span>}
                    </div>
                );
            case 'textarea':
                return (
                    <div key={fieldKey} className="form-field form-field-full">
                        <label>{fieldConfig.label}</label>
                        <textarea
                            value={value as string}
                            onChange={(e) => handleChange(fieldKey, e.target.value)}
                            placeholder={fieldConfig.placeholder}
                            rows={3}
                        />
                        {fieldConfig.hint && <span className="field-hint">{fieldConfig.hint}</span>}
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
                            value={value as string}
                            onChange={(e) => handleChange(fieldKey, e.target.value)}
                            placeholder={fieldConfig.placeholder}
                        />
                        {fieldConfig.hint && <span className="field-hint">{fieldConfig.hint}</span>}
                    </div>
                );
        }
    };

    const renderSection = (sectionKey: string, sectionConfig: any) => {
        // Skip HNW section if not HNW segment
        if (sectionConfig.showFor === 'hnw' && segment !== SEGMENT_TYPES.HNW) {
            return null;
        }

        return (
            <div key={sectionKey} className="form-section">
                <h3>{sectionConfig.title}</h3>
                <div className="form-grid">
                    {Object.entries(sectionConfig.fields).map(([fieldKey, fieldConfig]) =>
                        renderFormField(fieldKey, fieldConfig)
                    )}
                </div>
            </div>
        );
    };

    const stages = getStagesForFlow(flowType);

    if (!advisorProfile) return null;

    return (
        <div className="customer-setup-page">
            <div className="setup-container">
                <div className="setup-progress">
                    <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1. Luồng & Phân khúc</div>
                    <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2. Thông tin KH</div>
                    <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>3. Chọn bước roleplay</div>
                </div>

                {/* Step 1: Flow & Segment */}
                {step === 1 && (
                    <div className="setup-step">
                        <h2>Chọn loại tư vấn</h2>

                        <div className="selection-group">
                            <h4>Luồng tư vấn</h4>
                            <div className="option-grid">
                                <button
                                    className={`option-card ${flowType === FLOW_TYPES.NEW_CUSTOMER ? 'selected' : ''}`}
                                    onClick={() => setFlowType(FLOW_TYPES.NEW_CUSTOMER)}
                                >
                                    <span className="option-icon">🆕</span>
                                    <span className="option-title">Khách hàng Mới</span>
                                    <span className="option-desc">7 giai đoạn</span>
                                </button>
                                <button
                                    className={`option-card ${flowType === FLOW_TYPES.ECM ? 'selected' : ''}`}
                                    onClick={() => setFlowType(FLOW_TYPES.ECM)}
                                >
                                    <span className="option-icon">🔄</span>
                                    <span className="option-title">ECM</span>
                                    <span className="option-desc">6 giai đoạn</span>
                                </button>
                            </div>
                        </div>

                        <div className="selection-group">
                            <h4>Phân khúc khách hàng</h4>
                            <div className="option-grid">
                                <button
                                    className={`option-card ${segment === SEGMENT_TYPES.MASS_MARKET ? 'selected' : ''}`}
                                    onClick={() => setSegment(SEGMENT_TYPES.MASS_MARKET)}
                                >
                                    <span className="option-icon">👥</span>
                                    <span className="option-title">Mass Market</span>
                                    <span className="option-desc">Khách hàng phổ thông</span>
                                </button>
                                <button
                                    className={`option-card ${segment === SEGMENT_TYPES.HNW ? 'selected' : ''}`}
                                    onClick={() => setSegment(SEGMENT_TYPES.HNW)}
                                >
                                    <span className="option-icon">💎</span>
                                    <span className="option-title">HNW</span>
                                    <span className="option-desc">Khách hàng cao cấp</span>
                                </button>
                            </div>
                        </div>

                        <div className="step-actions">
                            <button className="btn btn-secondary" onClick={handleBack}>← Quay lại</button>
                            <button className="btn btn-primary" onClick={handleNext}>Tiếp tục →</button>
                        </div>
                    </div>
                )}

                {/* Step 2: Customer Info Form */}
                {step === 2 && (
                    <div className="setup-step">
                        <h2>Thông tin khách hàng</h2>
                        <p className="step-description">
                            Điền những gì bạn biết. Các trường để trống sẽ được AI bổ sung chi tiết.
                        </p>

                        {Object.entries(CUSTOMER_FORM_FIELDS).map(([sectionKey, sectionConfig]) =>
                            renderSection(sectionKey, sectionConfig)
                        )}

                        <div className="step-actions">
                            <button className="btn btn-secondary" onClick={handleBack}>← Quay lại</button>
                            <button className="btn btn-primary" onClick={handleNext}>Tiếp tục →</button>
                        </div>
                    </div>
                )}

                {/* Step 3: Stage Selection */}
                {step === 3 && (
                    <div className="setup-step">
                        <h2>Chọn bước muốn roleplay</h2>
                        <p className="step-description">
                            Chọn các giai đoạn bạn muốn luyện tập. AI sẽ bắt đầu từ giai đoạn đầu tiên được chọn.
                        </p>

                        <div className="stage-selection">
                            <div className="stage-actions">
                                <button className="btn btn-ghost btn-sm" onClick={handleSelectAllStages}>
                                    Chọn tất cả
                                </button>
                                <button className="btn btn-ghost btn-sm" onClick={handleClearStages}>
                                    Bỏ chọn tất cả
                                </button>
                            </div>

                            <div className="stages-list">
                                {stages.map((stage, index) => (
                                    <div
                                        key={stage.id}
                                        className={`stage-item ${selectedStages.includes(stage.id) ? 'selected' : ''}`}
                                        onClick={() => handleStageToggle(stage.id)}
                                    >
                                        <div className="stage-checkbox">
                                            {selectedStages.includes(stage.id) ? '✓' : ''}
                                        </div>
                                        <div className="stage-number">{index + 1}</div>
                                        <div className="stage-content">
                                            <div className="stage-name">{stage.name}</div>
                                            <div className="stage-desc">{stage.description}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {selectedStages.length === 0 && (
                                <p className="stage-hint">
                                    💡 Nếu không chọn, AI sẽ bắt đầu từ giai đoạn đầu tiên
                                </p>
                            )}
                        </div>

                        <div className="step-actions">
                            <button className="btn btn-secondary" onClick={handleBack}>← Quay lại</button>
                            <button className="btn btn-primary" onClick={handleNext}>
                                🎯 Tạo Context Prompt
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerSetupPage;

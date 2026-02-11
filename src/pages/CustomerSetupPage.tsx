// Customer Setup Page - Enhanced with stage selection
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CUSTOMER_FORM_FIELDS, DEFAULT_CUSTOMER_DATA } from '../constants/customerFormFields';
import { FLOW_TYPES, SEGMENT_TYPES, getStagesForFlow } from '../constants/consultingFlows';
import { getAdvisorProfile } from '../services/storageService';
import { UsersIcon, DiamondIcon, RefreshIcon, PlusIcon, TargetIcon, LightbulbIcon, ArrowLeftIcon, ArrowRightIcon, CheckIcon } from '../components/common/Icons';
import './CustomerSetupPage.css';

const CustomerSetupPage: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [flowType, setFlowType] = useState(FLOW_TYPES.NEW_CUSTOMER);
    const [segment, setSegment] = useState(SEGMENT_TYPES.MASS_MARKET);
    const [customerData, setCustomerData] = useState<any>(DEFAULT_CUSTOMER_DATA);
    const [advisorProfile, setAdvisorProfile] = useState<any>(null);
    const [selectedStages, setSelectedStages] = useState<string[]>([]);

    useEffect(() => {
        const profile = getAdvisorProfile();
        if (!profile) {
            navigate('/advisor-setup');
            return;
        }
        setAdvisorProfile(profile);
    }, [navigate]);

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
            if (!customerData.name.trim()) {
                alert('Vui lòng nhập tên khách hàng');
                return;
            }
            setStep(3);
        } else {
            if (selectedStages.length === 0) {
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
                {/* Progress Stepper */}
                <div className="setup-progress">
                    <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${((step - 1) / 2) * 100}%` }} />
                    </div>
                    <div className="progress-steps">
                        <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                            <div className="step-dot">{step > 1 ? <CheckIcon size={12} /> : '1'}</div>
                            <span>Luồng & Phân khúc</span>
                        </div>
                        <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                            <div className="step-dot">{step > 2 ? <CheckIcon size={12} /> : '2'}</div>
                            <span>Thông tin KH</span>
                        </div>
                        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
                            <div className="step-dot">3</div>
                            <span>Chọn bước</span>
                        </div>
                    </div>
                </div>

                {/* Step 1: Flow & Segment */}
                {step === 1 && (
                    <div className="setup-step animate-in">
                        <h2>Chọn loại tư vấn</h2>

                        <div className="selection-group">
                            <h4>Luồng tư vấn</h4>
                            <div className="option-grid">
                                <button
                                    className={`option-card ${flowType === FLOW_TYPES.NEW_CUSTOMER ? 'selected' : ''}`}
                                    onClick={() => setFlowType(FLOW_TYPES.NEW_CUSTOMER)}
                                    aria-pressed={flowType === FLOW_TYPES.NEW_CUSTOMER}
                                >
                                    <div className="option-icon-wrap" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
                                        <PlusIcon size={22} />
                                    </div>
                                    <span className="option-title">Khách hàng Mới</span>
                                    <span className="option-desc">7 giai đoạn</span>
                                </button>
                                <button
                                    className={`option-card ${flowType === FLOW_TYPES.ECM ? 'selected' : ''}`}
                                    onClick={() => setFlowType(FLOW_TYPES.ECM)}
                                    aria-pressed={flowType === FLOW_TYPES.ECM}
                                >
                                    <div className="option-icon-wrap" style={{ background: 'var(--info-light)', color: 'var(--info)' }}>
                                        <RefreshIcon size={22} />
                                    </div>
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
                                    aria-pressed={segment === SEGMENT_TYPES.MASS_MARKET}
                                >
                                    <div className="option-icon-wrap" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
                                        <UsersIcon size={22} />
                                    </div>
                                    <span className="option-title">Mass Market</span>
                                    <span className="option-desc">Khách hàng phổ thông</span>
                                </button>
                                <button
                                    className={`option-card ${segment === SEGMENT_TYPES.HNW ? 'selected' : ''}`}
                                    onClick={() => setSegment(SEGMENT_TYPES.HNW)}
                                    aria-pressed={segment === SEGMENT_TYPES.HNW}
                                >
                                    <div className="option-icon-wrap" style={{ background: '#F5F3FF', color: '#7C3AED' }}>
                                        <DiamondIcon size={22} />
                                    </div>
                                    <span className="option-title">HNW</span>
                                    <span className="option-desc">Khách hàng cao cấp</span>
                                </button>
                            </div>
                        </div>

                        <div className="step-actions">
                            <button className="btn btn-secondary" onClick={handleBack}>
                                <ArrowLeftIcon size={16} />
                                Quay lại
                            </button>
                            <button className="btn btn-primary" onClick={handleNext}>
                                Tiếp tục
                                <ArrowRightIcon size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Customer Info Form */}
                {step === 2 && (
                    <div className="setup-step animate-in">
                        <h2>Thông tin khách hàng</h2>
                        <p className="step-description">
                            Điền những gì bạn biết. Các trường để trống sẽ được AI bổ sung chi tiết.
                        </p>

                        {Object.entries(CUSTOMER_FORM_FIELDS).map(([sectionKey, sectionConfig]) =>
                            renderSection(sectionKey, sectionConfig)
                        )}

                        <div className="step-actions">
                            <button className="btn btn-secondary" onClick={handleBack}>
                                <ArrowLeftIcon size={16} />
                                Quay lại
                            </button>
                            <button className="btn btn-primary" onClick={handleNext}>
                                Tiếp tục
                                <ArrowRightIcon size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Stage Selection */}
                {step === 3 && (
                    <div className="setup-step animate-in">
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
                                        role="checkbox"
                                        aria-checked={selectedStages.includes(stage.id)}
                                        tabIndex={0}
                                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleStageToggle(stage.id); }}
                                    >
                                        <div className="stage-checkbox">
                                            {selectedStages.includes(stage.id) && <CheckIcon size={14} />}
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
                                    <LightbulbIcon size={14} />
                                    Nếu không chọn, AI sẽ bắt đầu từ giai đoạn đầu tiên
                                </p>
                            )}
                        </div>

                        <div className="step-actions">
                            <button className="btn btn-secondary" onClick={handleBack}>
                                <ArrowLeftIcon size={16} />
                                Quay lại
                            </button>
                            <button className="btn btn-primary" onClick={handleNext}>
                                <TargetIcon size={16} />
                                Tạo Context Prompt
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerSetupPage;

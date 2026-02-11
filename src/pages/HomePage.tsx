// Home Page - Context Prompt Generator
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdvisorProfile, getGeneratedPrompts } from '../services/storageService';
import { UserIcon, TargetIcon, HandshakeIcon, BarChartIcon, DiamondIcon, ArrowRightIcon, ClipboardIcon, SparklesIcon } from '../components/common/Icons';
import './HomePage.css';

const HomePage: React.FC = () => {
    const [advisorProfile, setAdvisorProfile] = useState<any>(null);
    const [recentPrompts, setRecentPrompts] = useState<any[]>([]);

    useEffect(() => {
        setAdvisorProfile(getAdvisorProfile());
        setRecentPrompts(getGeneratedPrompts().slice(0, 3));
    }, []);

    const hasProfile = !!advisorProfile?.name;

    return (
        <div className="home-page">
            <section className="hero">
                <div className="hero-bg-blob" aria-hidden="true" />
                <div className="hero-content">
                    <div className="hero-badge">
                        <SparklesIcon size={14} />
                        <span>AI-Powered Context Generator</span>
                    </div>
                    <h1>Tạo Context Prompt<br /><span className="hero-accent">Roleplay Tư vấn</span></h1>
                    <p className="hero-subtitle">
                        Tạo prompt chi tiết để roleplay tư vấn bảo hiểm với Gemini, ChatGPT, hoặc AI khác
                    </p>

                    {!hasProfile && (
                        <div className="api-notice">
                            <UserIcon size={16} />
                            <span>Bắt đầu bằng việc thiết lập hồ sơ tư vấn viên của bạn</span>
                        </div>
                    )}

                    <div className="hero-actions">
                        {hasProfile ? (
                            <Link to="/customer-setup" className="btn btn-primary btn-lg">
                                <TargetIcon size={18} />
                                Tạo Prompt Mới
                                <ArrowRightIcon size={16} />
                            </Link>
                        ) : (
                            <Link to="/advisor-setup" className="btn btn-primary btn-lg">
                                <UserIcon size={18} />
                                Thiết lập Hồ sơ TVV
                                <ArrowRightIcon size={16} />
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            <section className="how-it-works animate-in">
                <h2>Cách sử dụng</h2>
                <div className="steps-grid">
                    <div className="step-card">
                        <div className="step-number">1</div>
                        <h3>Thiết lập hồ sơ TVV</h3>
                        <p>Nhập thông tin về bản thân bạn (làm 1 lần)</p>
                    </div>
                    <div className="step-connector" aria-hidden="true">
                        <ArrowRightIcon size={16} />
                    </div>
                    <div className="step-card">
                        <div className="step-number">2</div>
                        <h3>Tạo khách hàng</h3>
                        <p>Điền thông tin khách hàng bạn muốn roleplay</p>
                    </div>
                    <div className="step-connector" aria-hidden="true">
                        <ArrowRightIcon size={16} />
                    </div>
                    <div className="step-card">
                        <div className="step-number">3</div>
                        <h3>Copy prompt</h3>
                        <p>App tạo context prompt chi tiết cho bạn</p>
                    </div>
                    <div className="step-connector" aria-hidden="true">
                        <ArrowRightIcon size={16} />
                    </div>
                    <div className="step-card">
                        <div className="step-number">4</div>
                        <h3>Paste & Roleplay</h3>
                        <p>Paste vào Gemini/ChatGPT và bắt đầu!</p>
                    </div>
                </div>
            </section>

            <section className="features animate-in" style={{ animationDelay: '0.1s' }}>
                <h2>Tính năng</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon" style={{ background: 'var(--info-light)', color: 'var(--info)' }}>
                            <UserIcon size={22} />
                        </div>
                        <h3>Chân dung Khách hàng</h3>
                        <p>Form có cấu trúc giúp bạn mô tả khách hàng đầy đủ</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
                            <HandshakeIcon size={22} />
                        </div>
                        <h3>Mối quan hệ TVV-KH</h3>
                        <p>Context prompt bao gồm mối quan hệ giữa bạn và khách hàng</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
                            <BarChartIcon size={22} />
                        </div>
                        <h3>2 Luồng Tư vấn</h3>
                        <p>New Customer (7 giai đoạn) và ECM (6 giai đoạn)</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon" style={{ background: '#F5F3FF', color: '#7C3AED' }}>
                            <DiamondIcon size={22} />
                        </div>
                        <h3>Mass Market & HNW</h3>
                        <p>Hỗ trợ cả khách hàng phổ thông và cao cấp</p>
                    </div>
                </div>
            </section>

            <section className="flows animate-in" style={{ animationDelay: '0.2s' }}>
                <h2>Hai Luồng Tư vấn</h2>
                <div className="flows-grid">
                    <div className="flow-card">
                        <div className="flow-badge new">Khách hàng Mới</div>
                        <h3>New Customer</h3>
                        <ul className="flow-stages">
                            <li>Mở đầu & Tạo thiện cảm</li>
                            <li>Khơi gợi & Thăm dò nhu cầu</li>
                            <li>Phân tích nhu cầu</li>
                            <li>Trình bày giải pháp</li>
                            <li>Xử lý từ chối</li>
                            <li>Chốt sale</li>
                            <li>Follow-up</li>
                        </ul>
                    </div>

                    <div className="flow-card">
                        <div className="flow-badge ecm">Khách hàng Hiện hữu</div>
                        <h3>ECM</h3>
                        <ul className="flow-stages">
                            <li>Kết nối lại</li>
                            <li>Kiểm tra hợp đồng hiện tại</li>
                            <li>Khám phá nhu cầu mới</li>
                            <li>Đề xuất nâng cấp/mua thêm</li>
                            <li>Xử lý từ chối ECM</li>
                            <li>Chốt & Xin giới thiệu</li>
                        </ul>
                    </div>
                </div>
            </section>

            {recentPrompts.length > 0 && (
                <section className="recent animate-in" style={{ animationDelay: '0.3s' }}>
                    <div className="section-header">
                        <h2>Prompt gần đây</h2>
                        <Link to="/history" className="view-all">
                            Xem tất cả
                            <ArrowRightIcon size={14} />
                        </Link>
                    </div>
                    <div className="recent-list">
                        {recentPrompts.map((prompt: any) => (
                            <div key={prompt.id} className="recent-item">
                                <div className="recent-icon">
                                    <ClipboardIcon size={16} />
                                </div>
                                <div className="recent-info">
                                    <span className="recent-name">{prompt.customerName || 'Khách hàng'}</span>
                                    <span className="recent-meta">
                                        {prompt.flowType === 'ecm' ? 'ECM' : 'New'} •
                                        {prompt.segment === 'hnw' ? ' HNW' : ' Mass'} •
                                        {new Date(prompt.createdAt).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default HomePage;

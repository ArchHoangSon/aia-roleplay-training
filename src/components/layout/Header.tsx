// Header component - Simplified for Prompt Generator
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAdvisorProfile } from '../../services/storageService';
import './Header.css';

const Header: React.FC = () => {
    const location = useLocation();
    const [advisorName, setAdvisorName] = useState<string | null>(null);

    useEffect(() => {
        const profile = getAdvisorProfile();
        if (profile?.name) {
            setAdvisorName(profile.name);
        }
    }, [location]); // Refresh on route change

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="header-logo">
                    <span className="logo-text">AIA</span>
                    <span className="logo-subtitle">Context Generator</span>
                </Link>

                <nav className="header-nav">
                    <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                        Trang chủ
                    </Link>
                    <Link to="/advisor-setup" className={`nav-link ${isActive('/advisor-setup') ? 'active' : ''}`}>
                        Hồ sơ TVV
                    </Link>
                    <Link to="/review" className={`nav-link ${isActive('/review') ? 'active' : ''}`}>
                        Review
                    </Link>
                    <Link to="/history" className={`nav-link ${isActive('/history') ? 'active' : ''}`}>
                        Lịch sử
                    </Link>
                </nav>

                <div className="header-actions">
                    {advisorName ? (
                        <Link to="/advisor-setup" className="advisor-badge">
                            👤 {advisorName}
                        </Link>
                    ) : (
                        <Link to="/advisor-setup" className="btn btn-secondary btn-sm">
                            Thiết lập hồ sơ
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;

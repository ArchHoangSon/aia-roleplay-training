// Header component - Premium glassmorphism design
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAdvisorProfile } from '../../services/storageService';
import { UserIcon, HomeIcon, ClipboardIcon, SearchIcon, HistoryIcon, MenuIcon, XIcon } from '../common/Icons';
import './Header.css';

const Header: React.FC = () => {
    const location = useLocation();
    const [advisorName, setAdvisorName] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const profile = getAdvisorProfile();
        if (profile?.name) {
            setAdvisorName(profile.name);
        }
    }, [location]);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="header-logo" aria-label="Trang chủ AIA Roleplay Training">
                    <span className="logo-icon">AIA</span>
                    <span className="logo-text">Roleplay Training</span>
                </Link>

                <button
                    className="mobile-menu-toggle"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
                    aria-expanded={mobileMenuOpen}
                >
                    {mobileMenuOpen ? <XIcon size={22} /> : <MenuIcon size={22} />}
                </button>

                <nav className={`header-nav ${mobileMenuOpen ? 'nav-open' : ''}`} aria-label="Navigation chính">
                    <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                        <HomeIcon size={16} />
                        <span>Trang chủ</span>
                    </Link>
                    <Link to="/advisor-setup" className={`nav-link ${isActive('/advisor-setup') ? 'active' : ''}`}>
                        <ClipboardIcon size={16} />
                        <span>Hồ sơ TVV</span>
                    </Link>
                    <Link to="/review" className={`nav-link ${isActive('/review') ? 'active' : ''}`}>
                        <SearchIcon size={16} />
                        <span>Review</span>
                    </Link>
                    <Link to="/history" className={`nav-link ${isActive('/history') ? 'active' : ''}`}>
                        <HistoryIcon size={16} />
                        <span>Lịch sử</span>
                    </Link>
                </nav>

                <div className="header-actions">
                    {advisorName ? (
                        <Link to="/advisor-setup" className="advisor-badge" aria-label={`Hồ sơ tư vấn viên: ${advisorName}`}>
                            <UserIcon size={14} />
                            <span>{advisorName}</span>
                        </Link>
                    ) : (
                        <Link to="/advisor-setup" className="btn btn-primary btn-sm">
                            <UserIcon size={14} />
                            Thiết lập hồ sơ
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;

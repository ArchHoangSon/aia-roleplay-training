// Main App component with routing - Updated for Prompt Generator
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import AdvisorSetupPage from './pages/AdvisorSetupPage';
import CustomerSetupPage from './pages/CustomerSetupPage';
import PromptResultPage from './pages/PromptResultPage';
import ReviewPage from './pages/ReviewPage';
import HistoryPage from './pages/HistoryPage';
import './styles/global.css';

function App() {
    return (
        <Router>
            <div className="app">
                <Header />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/advisor-setup" element={<AdvisorSetupPage />} />
                    <Route path="/customer-setup" element={<CustomerSetupPage />} />
                    <Route path="/prompt-result" element={<PromptResultPage />} />
                    <Route path="/review" element={<ReviewPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

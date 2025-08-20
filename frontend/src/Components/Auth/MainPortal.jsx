import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Users, BarChart3, Shield, ChevronRight, Sparkles, Video, Database } from 'lucide-react';
import './style.css';

const MainPortal = () => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    { Icon: Play, label: 'HD Streaming', color: '#60a5fa' },
    { Icon: Shield, label: 'Secure Access', color: '#34d399' },
    { Icon: BarChart3, label: 'Analytics', color: '#a78bfa' },
    { Icon: Database, label: 'Content Management', color: '#fb7185' }
  ];

  return (
    <div
      className="portal-container"
      style={{ ['--mx']: `${mousePosition.x}%`, ['--my']: `${mousePosition.y}%` }}
    >
      <div className="portal-bg-overlay" />
      <div className="floating-elements">
        <div className="floating-1" />
        <div className="floating-2" />
        <div className="floating-3" />
      </div>

      <div className="portal-main">
        <div className={`portal-wrapper${isLoaded ? ' loaded' : ''}`}>
          <div className="portal-header">
            <div className="logo-container">
              <div className="logo">
                <div className="logo-box">
                  <Play size={32} color="white" fill="white" />
                </div>
                <div className="sparkle">
                  <Sparkles size={12} color="white" />
                </div>
              </div>
            </div>

            <h1 className="portal-title">Streamify</h1>
            <p className="portal-subtitle">Content Management System</p>
            <p className="portal-desc">
              Powerful, intuitive, and secure platform for managing your digital content ecosystem. Choose your access level to begin your journey.
            </p>
          </div>

          <div className="cards-grid">
            <div className="card-wrapper user">
              <div className="card-glow user" />
              <div className="card">
                <div className="card-header">
                  <div className="icon-box user">
                    <Users size={20} color="#ffffff" />
                  </div>
                  <div className="chevron user">
                    <ChevronRight size={18} />
                  </div>
                </div>
                <h3 className="card-title">User Portal</h3>
                <p className="card-desc">
                  Access your personalized streaming experience. Discover content, manage your watchlist, and enjoy seamless playback across all devices.
                </p>
                <div className="features-row">
                  <div className="feature"><Video size={16} /><span>Stream Content</span></div>
                  <div className="feature"><BarChart3 size={16} /><span>Track Progress</span></div>
                </div>
                <button onClick={() => navigate('/user')} className="portal-button user">Enter User Portal</button>
              </div>
            </div>

            <div className="card-wrapper admin">
              <div className="card-glow admin" />
              <div className="card">
                <div className="card-header">
                  <div className="icon-box admin">
                    <Shield size={20} color="#ffffff" />
                  </div>
                  <div className="chevron admin">
                    <ChevronRight size={18} />
                  </div>
                </div>
                <h3 className="card-title">Admin Portal</h3>
                <p className="card-desc">
                  Complete control over your content ecosystem. Manage users, analyze performance, and configure system settings with advanced administrative tools.
                </p>
                <div className="features-row">
                  <div className="feature"><Database size={16} /><span>Manage Content</span></div>
                  <div className="feature"><BarChart3 size={16} /><span>View Analytics</span></div>
                </div>
                <button onClick={() => navigate('/admin/login')} className="portal-button admin">Enter Admin Portal</button>
              </div>
            </div>
          </div>

          <div className="features-grid">
            {features.map(({ Icon, label, color }, idx) => (
              <div key={idx} className="feature-card">
                <Icon size={24} className="feature-icon" style={{ color }} />
                <span className="feature-label">{label}</span>
              </div>
            ))}
          </div>

          <div className="portal-footer">
            <p>© 2025 Streamify CMS. Master piece work by Aswanth Murali.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPortal;
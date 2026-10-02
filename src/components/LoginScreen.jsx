import React, { useState } from 'react';
import { useFleet } from '../context/FleetContext';
import { 
  Car, 
  Lock, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Shield, 
  KeyRound, 
  CheckCircle2, 
  MapPin 
} from 'lucide-react';

export default function LoginScreen() {
  const { login, supervisors } = useFleet();
  const [activeTab, setActiveTab] = useState('admin'); // 'admin' or 'supervisor'
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const result = login(username, password);
      if (!result.success) {
        setErrorMessage(result.error || 'Authentication failed. Please verify your credentials.');
      }
      setIsLoading(false);
    }, 250);
  };

  const handleSelectRoleTab = (role) => {
    setActiveTab(role);
    setErrorMessage('');
    if (role === 'admin') {
      setUsername('admin');
      setPassword('admin123');
    } else {
      const firstSup = supervisors[0];
      setUsername(firstSup ? firstSup.username : 'imran');
      setPassword(firstSup ? firstSup.password : 'password123');
    }
  };

  const handleQuickFill = (u, p) => {
    setUsername(u);
    setPassword(p);
    setErrorMessage('');
    login(u, p);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      background: 'radial-gradient(ellipse at 50% 30%, #ecfdf5 0%, #f8fafc 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Matrix Grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(5, 150, 105, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(5, 150, 105, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '36px 36px',
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%',
        maxWidth: '480px',
        background: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '24px',
        padding: '2.5rem',
        boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.15), 0 0 30px rgba(5, 150, 105, 0.08)',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Brand Header with Amaze Logistics Green Icon */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '58px',
            height: '58px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 6px 20px rgba(5, 150, 105, 0.35)'
          }}>
            <Car size={32} color="#ffffff" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <h1 style={{ fontSize: '1.55rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              AMAZE<span style={{ color: '#059669' }}>LOGISTICS</span>
            </h1>
            <span className="badge badge-present" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
              CRM
            </span>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
            Enterprise Fleet & Multi-Supervisor Security Portal
          </p>
        </div>

        {/* Role Tab Switcher */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: '#f1f5f9',
          padding: '0.35rem',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          border: '1px solid #e2e8f0'
        }}>
          <button
            type="button"
            onClick={() => handleSelectRoleTab('admin')}
            style={{
              padding: '0.65rem',
              borderRadius: '9px',
              border: 'none',
              background: activeTab === 'admin' ? '#ffffff' : 'transparent',
              color: activeTab === 'admin' ? '#059669' : '#64748b',
              fontWeight: 800,
              fontSize: '0.825rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              boxShadow: activeTab === 'admin' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Shield size={16} /> Admin Login
          </button>

          <button
            type="button"
            onClick={() => handleSelectRoleTab('supervisor')}
            style={{
              padding: '0.65rem',
              borderRadius: '9px',
              border: 'none',
              background: activeTab === 'supervisor' ? '#ffffff' : 'transparent',
              color: activeTab === 'supervisor' ? '#059669' : '#64748b',
              fontWeight: 800,
              fontSize: '0.825rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              boxShadow: activeTab === 'supervisor' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <KeyRound size={16} /> Supervisor Hub Login
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            fontSize: '0.825rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.25rem'
          }}>
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div className="input-group">
            <label className="input-label">
              {activeTab === 'admin' ? 'Admin Username / Email' : 'Supervisor Login ID / Username'}
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder={activeTab === 'admin' ? 'e.g. admin' : 'e.g. imran, rajesh, sarah'}
                className="input-control"
                style={{ paddingLeft: '2.25rem' }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password..."
                className="input-control"
                style={{ paddingLeft: '2.25rem', paddingRight: '2.25rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', marginTop: '0.5rem' }}
          >
            {isLoading ? 'Verifying Security Credentials...' : <>Secure Sign In <ArrowRight size={16} /></>}
          </button>
        </form>

        {/* Quick Demo 1-Click Login Shortcuts for Client Review */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center', marginBottom: '0.75rem' }}>
            ⚡ 1-Click Demo Login Shortcuts:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            <button
              type="button"
              onClick={() => handleQuickFill('admin', 'admin123')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.55rem 0.85rem',
                borderRadius: '10px',
                border: '1px solid #a7f3d0',
                background: '#ecfdf5',
                color: '#047857',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>👑</span>
                <span><strong>Admin Login</strong> (Master Access)</span>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 800 }}>admin / admin123 →</span>
            </button>

            {supervisors.map(sup => (
              <button
                key={sup.id}
                type="button"
                onClick={() => handleQuickFill(sup.username, sup.password)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.55rem 0.85rem',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  color: '#0f172a',
                  fontWeight: 600,
                  fontSize: '0.785rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>👤</span>
                  <span><strong>{sup.name}</strong> ({sup.hub.split('&')[0]})</span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{sup.username} / {sup.password} →</span>
              </button>
            ))}
          </div>
        </div>

        {/* Security Trust Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '1.5rem', fontSize: '0.725rem', color: '#64748b', fontWeight: 600 }}>
          <ShieldCheck size={15} color="#059669" />
          <span>AES-256 Bit Encryption • Multi-Tenant Isolated Access</span>
        </div>
      </div>
    </div>
  );
}

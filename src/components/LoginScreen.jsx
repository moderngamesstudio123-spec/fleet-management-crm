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
  Building2,
  KeyRound
} from 'lucide-react';

export default function LoginScreen() {
  const { login, supervisors } = useFleet();
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
    }, 300);
  };

  const handleQuickLogin = (userType, supUser = null) => {
    if (userType === 'admin') {
      setUsername('admin');
      setPassword('admin123');
      login('admin', 'admin123');
    } else if (supUser) {
      setUsername(supUser.username);
      setPassword(supUser.password);
      login(supUser.username, supUser.password);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      background: 'radial-gradient(ellipse at center, #f0fdf4 0%, #f8fafc 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background grid */}
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
        maxWidth: '460px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '24px',
        padding: '2.5rem',
        boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.12), 0 0 25px rgba(5, 150, 105, 0.06)',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 6px 20px rgba(5, 150, 105, 0.35)'
          }}>
            <Car size={32} color="#ffffff" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              AMAZE<span style={{ color: '#059669' }}>LOGISTICS</span>
            </h1>
            <span className="badge badge-present" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
              CRM v3.0
            </span>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
            Enterprise Fleet, Shifts & Supervisor Portal
          </p>
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
            <label className="input-label">Login Username / Email</label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Username or email (e.g. admin, imran, rajesh)"
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
            style={{ width: '100%', padding: '0.8rem', fontSize: '0.95rem', marginTop: '0.5rem' }}
          >
            {isLoading ? 'Authenticating...' : <>Secure Sign In <ArrowRight size={16} /></>}
          </button>
        </form>

        {/* Quick Demo One-Click Logins */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center', marginBottom: '0.75rem' }}>
            ⚡ Instant Demo Logins (Click to Login):
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.6rem 0.85rem',
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
                <span><strong>Admin Login</strong> (admin / admin123)</span>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#059669' }}>Master Access →</span>
            </button>

            {supervisors.map(sup => (
              <button
                key={sup.id}
                type="button"
                onClick={() => handleQuickLogin('supervisor', sup)}
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
                  <span><strong>{sup.name}</strong> ({sup.username} / password123)</span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{sup.id} →</span>
              </button>
            ))}
          </div>
        </div>

        {/* Security Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '1.5rem', fontSize: '0.725rem', color: '#94a3b8' }}>
          <ShieldCheck size={14} color="#059669" />
          <span>Multi-Tenant Hub Security Enabled • AES-256 Protected</span>
        </div>
      </div>
    </div>
  );
}

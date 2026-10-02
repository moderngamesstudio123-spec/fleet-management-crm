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
  Shield 
} from 'lucide-react';

export default function LoginScreen() {
  const { login } = useFleet();
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
        setErrorMessage(result.error || 'Invalid credentials. Please verify your Username and Password.');
      }
      setIsLoading(false);
    }, 250);
  };

  const handleQuickAdminLogin = () => {
    setUsername('admin');
    setPassword('admin123');
    login('admin', 'admin123');
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
      {/* Decorative Matrix Grid */}
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
        maxWidth: '440px',
        background: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '24px',
        padding: '2.5rem',
        boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.15), 0 0 30px rgba(5, 150, 105, 0.08)',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 6px 20px rgba(5, 150, 105, 0.35)'
          }}>
            <Car size={34} color="#ffffff" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              AMAZE<span style={{ color: '#059669' }}>LOGISTICS</span>
            </h1>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.35rem' }}>
            Admin Management & Fleet Command Portal
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

        {/* Admin Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="input-group">
            <label className="input-label">Admin Username / Email</label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Enter admin username (e.g. admin)"
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
            {isLoading ? 'Authenticating Admin...' : <>Sign In as Admin <ArrowRight size={16} /></>}
          </button>
        </form>

        {/* Quick 1-Click Admin Login Shortcut */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9' }}>
          <button
            type="button"
            onClick={handleQuickAdminLogin}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.7rem 0.95rem',
              borderRadius: '10px',
              border: '1px solid #a7f3d0',
              background: '#ecfdf5',
              color: '#047857',
              fontWeight: 700,
              fontSize: '0.825rem',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={16} color="#059669" />
              <span><strong>1-Click Quick Demo Login</strong></span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 800 }}>admin / admin123 →</span>
          </button>
        </div>

        {/* Security Trust Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '1.5rem', fontSize: '0.725rem', color: '#64748b', fontWeight: 600 }}>
          <ShieldCheck size={15} color="#059669" />
          <span>AES-256 Bit Encryption • Master Admin Gateway</span>
        </div>
      </div>
    </div>
  );
}

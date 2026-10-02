import React, { useState } from 'react';
import { useFleet } from '../context/FleetContext';
import { 
  Shield, 
  UserCheck, 
  RefreshCw, 
  Car, 
  LogOut, 
  MapPin, 
  Filter, 
  Menu, 
  X 
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, mobileMenuOpen, setMobileMenuOpen }) {
  const { 
    currentUser, 
    logout, 
    resetDemoData, 
    supervisors,
    adminSupervisorFilter,
    setAdminSupervisorFilter 
  } = useFleet();

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.85rem 1.5rem',
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      {/* Brand & Mobile Menu Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="btn btn-secondary btn-sm btn-icon"
          style={{ display: 'none' }}
          id="mobile-menu-btn"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
        }}>
          <Car size={22} color="#ffffff" />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a' }}>
              AMAZE<span style={{ color: '#059669' }}>LOGISTICS</span>
            </span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <MapPin size={11} color="#059669" />
            <span>{currentUser?.hub || 'Central Command'}</span>
          </div>
        </div>
      </div>

      {/* Admin Global Supervisor View Filter */}
      {currentUser?.role === 'admin' && (
        <div className="mobile-hide" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          padding: '0.3rem 0.65rem',
          borderRadius: '10px'
        }}>
          <Filter size={13} color="#047857" />
          <span style={{ fontSize: '0.725rem', color: '#047857', fontWeight: 800 }}>Supervisor:</span>
          <select
            value={adminSupervisorFilter}
            onChange={(e) => setAdminSupervisorFilter(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#065f46',
              fontWeight: 800,
              fontSize: '0.785rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all">🌐 All Hubs</option>
            {supervisors.map(s => (
              <option key={s.id} value={s.id}>👤 {s.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Right User & Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <button 
          onClick={resetDemoData}
          className="btn btn-secondary btn-sm mobile-hide"
          title="Reset demo data"
          style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem' }}
        >
          <RefreshCw size={12} /> Reset
        </button>

        {/* User Card */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.7rem',
            borderRadius: '10px',
            background: currentUser?.role === 'admin' ? '#ecfdf5' : '#f0fdf4',
            border: `1px solid ${currentUser?.role === 'admin' ? '#a7f3d0' : '#bbf7d0'}`
          }}
        >
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 800,
            fontSize: '0.8rem'
          }}>
            {currentUser?.role === 'admin' ? <Shield size={14} /> : <UserCheck size={14} />}
          </div>

          <div>
            <div style={{ fontSize: '0.785rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
              {currentUser?.name?.split(' ')[0]}
            </div>
            <div style={{ fontSize: '0.65rem', color: '#059669', fontWeight: 700, textTransform: 'uppercase' }}>
              {currentUser?.role}
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => {
            if (window.confirm('Do you want to sign out?')) logout();
          }}
          className="btn btn-secondary btn-sm"
          title="Sign Out"
          style={{ color: '#dc2626', borderColor: '#fecaca', background: '#fef2f2', padding: '0.35rem 0.6rem' }}
        >
          <LogOut size={14} /> <span className="mobile-hide">Logout</span>
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #mobile-menu-btn { display: inline-flex !important; }
        }
      `}</style>
    </header>
  );
}

import React, { useState } from 'react';
import { useFleet } from '../context/FleetContext';
import { 
  Shield, 
  UserCheck, 
  RefreshCw, 
  Car, 
  Bell, 
  LogOut,
  MapPin,
  ChevronDown,
  Filter
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { 
    currentUser, 
    logout, 
    resetDemoData, 
    attendance, 
    vehicles, 
    supervisors,
    adminSupervisorFilter,
    setAdminSupervisorFilter 
  } = useFleet();

  const [showSwitchModal, setShowSwitchModal] = useState(false);

  const adhocPendingCount = attendance.filter(a => a.isAdhocReplacement && a.adhocDetails?.paymentStatus === 'Pending').length;
  const maintenanceAlerts = vehicles.filter(v => v.status === 'Maintenance').length;

  return (
    <>
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.85rem 2rem',
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        {/* Brand & Green Logo (Amaze Logistics Signature Theme) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
          }}>
            <Car size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a' }}>
                AMAZE<span style={{ color: '#059669' }}>LOGISTICS</span>
              </span>
              <span className="badge badge-present" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
                Fleet CRM
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={12} color="#059669" />
              <span>{currentUser?.hub || 'Bangalore Central Command'}</span>
            </div>
          </div>
        </div>

        {/* Admin Global Supervisor View Filter (Only visible to Admin) */}
        {currentUser?.role === 'admin' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            padding: '0.35rem 0.75rem',
            borderRadius: '10px'
          }}>
            <Filter size={14} color="#047857" />
            <span style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 800 }}>Supervisor Filter:</span>
            <select
              value={adminSupervisorFilter}
              onChange={(e) => setAdminSupervisorFilter(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#065f46',
                fontWeight: 800,
                fontSize: '0.8rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">🌐 All Hubs & Supervisors</option>
              {supervisors.map(s => (
                <option key={s.id} value={s.id}>👤 {s.name} ({s.id})</option>
              ))}
            </select>
          </div>
        )}

        {/* Right User State & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button 
            onClick={resetDemoData}
            className="btn btn-secondary btn-sm"
            title="Reset demo data"
            style={{ fontSize: '0.75rem', padding: '0.4rem 0.65rem' }}
          >
            <RefreshCw size={13} /> Reset Data
          </button>

          {/* User Profile Card */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.4rem 0.85rem',
              borderRadius: '12px',
              background: currentUser?.role === 'admin' ? '#ecfdf5' : '#f0fdf4',
              border: `1px solid ${currentUser?.role === 'admin' ? '#a7f3d0' : '#bbf7d0'}`
            }}
          >
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 800,
              fontSize: '0.85rem'
            }}>
              {currentUser?.role === 'admin' ? <Shield size={17} /> : <UserCheck size={17} />}
            </div>

            <div>
              <div style={{ fontSize: '0.825rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                {currentUser?.name}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700, textTransform: 'uppercase' }}>
                {currentUser?.role === 'admin' ? '👑 Master Admin' : '👤 Hub Supervisor'}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => {
              if (window.confirm('Do you want to log out of Amaze Logistics Fleet CRM?')) {
                logout();
              }
            }}
            className="btn btn-secondary btn-sm"
            title="Sign Out"
            style={{ color: '#dc2626', borderColor: '#fecaca', background: '#fef2f2' }}
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </header>
    </>
  );
}

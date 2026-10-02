import React from 'react';
import { useFleet } from '../context/FleetContext';
import { 
  LayoutDashboard, 
  Building2, 
  Car, 
  Users, 
  CalendarClock, 
  ClipboardCheck, 
  MapPin, 
  Receipt,
  KeyRound,
  Shield,
  UserCheck
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, mobileMenuOpen, setMobileMenuOpen }) {
  const { currentUser, attendance, vehicles, shifts, companies, drivers, supervisors } = useFleet();

  const adhocCount = attendance.filter(a => a.isAdhocReplacement).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    ...(currentUser?.role === 'admin' ? [
      { id: 'supervisors', label: `Supervisors Access (${supervisors.length})`, icon: KeyRound, badge: 'Admin', badgeColor: 'badge-present' }
    ] : []),
    { id: 'attendance', label: 'Weekly Attendance & Ad-hoc', icon: ClipboardCheck, badge: adhocCount > 0 ? `${adhocCount} Paid` : null, badgeColor: 'badge-adhoc' },
    { id: 'shifts', label: 'Shifts & Route Planner', icon: CalendarClock, badge: `${shifts.length} Active`, badgeColor: 'badge-info' },
    { id: 'companies', label: `Companies (${companies.length})`, icon: Building2 },
    { id: 'vehicles', label: `Vehicles & Cabs (${vehicles.length})`, icon: Car },
    { id: 'drivers', label: `Drivers (${drivers.length})`, icon: Users },
    { id: 'gps', label: 'Live Fleet Radar', icon: MapPin },
    { id: 'billing', label: 'Invoices & Reports', icon: Receipt },
  ];

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    if (setMobileMenuOpen) setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 45
          }}
        />
      )}

      <aside 
        id="app-sidebar"
        style={{
          width: '260px',
          minWidth: '260px',
          background: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.25rem 0.85rem',
          height: 'calc(100vh - 60px)',
          position: 'sticky',
          top: '60px',
          zIndex: 48,
          transition: 'transform 0.25s ease'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{ padding: '0 0.75rem 0.65rem', borderBottom: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              OPERATIONS CONSOLE
            </span>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive ? '#ecfdf5' : 'transparent',
                  borderLeft: isActive ? '3px solid #059669' : '3px solid transparent',
                  color: isActive ? '#047857' : '#475569',
                  fontWeight: isActive ? 800 : 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={18} color={isActive ? '#059669' : '#64748b'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`badge ${item.badgeColor}`} style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Isolation Hub Card */}
        <div style={{
          background: currentUser?.role === 'admin' ? '#ecfdf5' : '#f0fdf4',
          border: `1px solid ${currentUser?.role === 'admin' ? '#a7f3d0' : '#bbf7d0'}`,
          padding: '0.75rem',
          borderRadius: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
            {currentUser?.role === 'admin' ? <Shield size={15} color="#059669" /> : <UserCheck size={15} color="#059669" />}
            <span style={{ fontSize: '0.785rem', fontWeight: 800, color: '#047857' }}>
              {currentUser?.role === 'admin' ? 'Master Admin' : `${currentUser?.name?.split(' ')[0]} Hub`}
            </span>
          </div>
          <p style={{ fontSize: '0.7rem', color: '#64748b', lineHeight: 1.3 }}>
            {currentUser?.role === 'admin' ? 'Full access across all supervisors.' : 'Isolated supervisor operations portal.'}
          </p>
        </div>
      </aside>

      <style>{`
        @media (max-width: 768px) {
          #app-sidebar {
            position: fixed !important;
            top: 60px !important;
            bottom: 0 !important;
            left: 0 !important;
            height: calc(100vh - 60px) !important;
            transform: ${mobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)'} !important;
            box-shadow: ${mobileMenuOpen ? '0 10px 30px rgba(0,0,0,0.2)' : 'none'} !important;
          }
        }
      `}</style>
    </>
  );
}

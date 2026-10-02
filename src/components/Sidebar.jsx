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

export default function Sidebar({ activeTab, setActiveTab }) {
  const { currentUser, attendance, vehicles, shifts, companies, drivers, supervisors } = useFleet();

  const adhocCount = attendance.filter(a => a.isAdhocReplacement).length;

  // Nav items list
  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    ...(currentUser?.role === 'admin' ? [
      { id: 'supervisors', label: `Supervisors Access (${supervisors.length})`, icon: KeyRound, badge: 'Admin Only', badgeColor: 'badge-present' }
    ] : []),
    { id: 'attendance', label: 'Weekly Attendance & Ad-hoc', icon: ClipboardCheck, badge: adhocCount > 0 ? `${adhocCount} Adhoc` : null, badgeColor: 'badge-adhoc' },
    { id: 'shifts', label: 'Shifts & Route Planner', icon: CalendarClock, badge: `${shifts.length} Active`, badgeColor: 'badge-info' },
    { id: 'companies', label: `Companies (${companies.length})`, icon: Building2 },
    { id: 'vehicles', label: `Vehicles & Cabs (${vehicles.length})`, icon: Car },
    { id: 'drivers', label: `Drivers (${drivers.length})`, icon: Users },
    { id: 'gps', label: 'Live Fleet Radar', icon: MapPin },
    { id: 'billing', label: 'Invoices & Reports', icon: Receipt },
  ];

  return (
    <aside style={{
      width: '270px',
      minWidth: '270px',
      background: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.25rem 0.85rem',
      height: 'calc(100vh - 65px)',
      position: 'sticky',
      top: '65px'
    }}>
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
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.7rem 0.85rem',
                borderRadius: '10px',
                border: 'none',
                background: isActive 
                  ? '#ecfdf5' 
                  : 'transparent',
                borderLeft: isActive ? '3px solid #059669' : '3px solid transparent',
                color: isActive ? '#047857' : '#475569',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.color = '#0f172a';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#475569';
                }
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

      {/* Isolation Info Card */}
      <div style={{
        background: currentUser?.role === 'admin' ? '#ecfdf5' : '#f0fdf4',
        border: `1px solid ${currentUser?.role === 'admin' ? '#a7f3d0' : '#bbf7d0'}`,
        padding: '0.85rem',
        borderRadius: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
          {currentUser?.role === 'admin' ? <Shield size={16} color="#059669" /> : <UserCheck size={16} color="#059669" />}
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#047857' }}>
            {currentUser?.role === 'admin' ? 'Master Admin Mode' : `${currentUser?.name} Hub`}
          </span>
        </div>
        <p style={{ fontSize: '0.725rem', color: '#64748b', lineHeight: 1.4 }}>
          {currentUser?.role === 'admin' 
            ? 'Full visibility across all supervisors. You can filter by supervisor or reassign accounts.'
            : 'Strict data isolation active: You can only view and manage companies & drivers in your hub.'
          }
        </p>
      </div>
    </aside>
  );
}

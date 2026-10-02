import React from 'react';
import { useFleet } from '../context/FleetContext';
import { 
  Building2, 
  Car, 
  Users, 
  CalendarClock, 
  ClipboardCheck, 
  DollarSign, 
  AlertCircle, 
  Clock, 
  MapPin, 
  ArrowUpRight, 
  ArrowRight,
  TrendingUp,
  Shield,
  Activity,
  UserCheck
} from 'lucide-react';

export default function DashboardView({ setActiveTab }) {
  const { 
    companies, 
    vehicles, 
    drivers, 
    shifts, 
    attendance, 
    totalAdhocExpense,
    currentUser 
  } = useFleet();

  const todayStr = '2026-10-02';
  const todayAttendance = attendance.filter(a => a.date === todayStr);
  const todayPresent = todayAttendance.filter(a => a.status === 'Present').length;
  const todayAbsent = todayAttendance.filter(a => a.status === 'Absent').length;
  const todayAdhoc = todayAttendance.filter(a => a.isAdhocReplacement).length;

  const activeVehicles = vehicles.filter(v => v.status === 'Active').length;
  const inServiceVehicles = vehicles.filter(v => v.status === 'Maintenance').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Welcome Banner (Amaze Logistics Inspiration) */}
      <div className="glass-panel" style={{
        padding: '1.75rem 2rem',
        background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)',
        border: '1px solid #bfdbfe',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.25rem',
        boxShadow: '0 4px 20px -2px rgba(37, 99, 235, 0.08)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.6rem' }}>👋</span>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a' }}>
              Welcome back, {currentUser.name}
            </h1>
          </div>
          <p style={{ color: '#475569', fontSize: '0.9rem', marginTop: '0.35rem', maxWidth: '700px' }}>
            Hub: <strong>{currentUser.hub || 'Central Logistics Command'}</strong>. Active fleet roster: <strong>{activeVehicles} active cabs</strong> on route, <strong>{shifts.length} shifts scheduled</strong>, and <strong>{todayAdhoc} replacement cabs</strong> logged.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => setActiveTab('attendance')} className="btn btn-warning">
            <ClipboardCheck size={16} /> Mark Today's Attendance
          </button>
          <button onClick={() => setActiveTab('shifts')} className="btn btn-primary">
            <CalendarClock size={16} /> Dispatch Shift / Route
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid-4">
        {/* Companies Managed */}
        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #2563eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.785rem', color: '#64748b', fontWeight: 700 }}>MANAGED COMPANIES</span>
            <Building2 size={20} color="#2563eb" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.35rem', color: '#1d4ed8' }}>
            {companies.length} <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>Clients</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            Assigned to your operational zone
          </div>
        </div>

        {/* Ad-hoc Outsourced Expense */}
        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #ea580c' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.785rem', color: '#64748b', fontWeight: 700 }}>AD-HOC VENDOR EXPENSE</span>
            <Activity size={20} color="#ea580c" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.35rem', color: '#c2410c' }}>
            ₹{totalAdhocExpense.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            {attendance.filter(a => a.isAdhocReplacement).length} replacement cab payouts
          </div>
        </div>

        {/* Cabs on Road */}
        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #059669' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.785rem', color: '#64748b', fontWeight: 700 }}>FLEET CABS ON ROAD</span>
            <Car size={20} color="#059669" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.35rem', color: '#047857' }}>
            {activeVehicles} <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>/ {vehicles.length} Cabs</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            {inServiceVehicles > 0 ? `⚠️ ${inServiceVehicles} Cab in workshop` : '100% Active Cabs'}
          </div>
        </div>

        {/* Drivers Active */}
        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #7c3aed' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.785rem', color: '#64748b', fontWeight: 700 }}>DRIVER WORKFORCE</span>
            <Users size={20} color="#7c3aed" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.35rem', color: '#6b21a8' }}>
            {drivers.filter(d => d.status === 'On Duty').length} <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>/ {drivers.length} Drivers</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            {todayAbsent} Absent today (Replacements Active)
          </div>
        </div>
      </div>

      {/* Main Sections Grid */}
      <div className="grid-2" style={{ alignItems: 'flex-start' }}>
        {/* Left: Driver Absent & Ad-hoc Replacements */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={20} color="#ea580c" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                Driver Absenteeism & Replacement Payouts
              </h2>
            </div>
            <button onClick={() => setActiveTab('attendance')} className="btn btn-secondary btn-sm">
              View All <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {todayAttendance.filter(a => a.isAdhocReplacement).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.75rem', color: '#64748b', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                ✓ No ad-hoc replacements required today for your hub.
              </div>
            ) : (
              todayAttendance.filter(a => a.isAdhocReplacement).map(adhoc => (
                <div key={adhoc.id} style={{
                  background: '#fff7ed',
                  border: '1px solid #fed7aa',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span className="badge badge-absent">Absent: {adhoc.driverName}</span>
                      <span className="badge badge-adhoc">🚨 Outsourced Cab</span>
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#c2410c' }}>
                      ₹{Number(adhoc.adhocDetails?.costAmount || 0).toLocaleString()}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#334155' }}>
                    <strong>Reason:</strong> {adhoc.absenceReason}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#64748b', borderTop: '1px solid #fed7aa', paddingTop: '0.4rem' }}>
                    <span>Vendor: <strong style={{ color: '#0f172a' }}>{adhoc.adhocDetails?.vendorName}</strong></span>
                    <span>Status: <strong style={{ color: '#047857' }}>{adhoc.adhocDetails?.paymentStatus} ({adhoc.adhocDetails?.paymentType})</strong></span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Active Shifts & Dispatches */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CalendarClock size={20} color="#2563eb" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                Active Shifts & Dispatches
              </h2>
            </div>
            <button onClick={() => setActiveTab('shifts')} className="btn btn-secondary btn-sm">
              Manage Shifts <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {shifts.slice(0, 4).map(s => {
              const drv = drivers.find(d => d.id === s.driverId);
              const veh = vehicles.find(v => v.id === s.vehicleId);

              return (
                <div key={s.id} style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>{s.shiftName}</span>
                      <span className={`badge ${s.cabType === 'SUV' ? 'badge-suv' : 'badge-sedan'}`} style={{ fontSize: '0.68rem' }}>
                        {s.cabType}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                      <MapPin size={12} color="#2563eb" /> {s.routeName}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.3rem' }}>
                      <Clock size={12} /> {s.loginTime || s.expectedLogin} - {s.logoutTime || s.expectedLogout}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.15rem' }}>
                      {drv?.name || 'Driver'} • {veh?.regNumber || 'Cab'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

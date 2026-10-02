import React, { useState } from 'react';
import { useFleet } from '../context/FleetContext';
import { 
  CalendarClock, 
  Plus, 
  Search, 
  MapPin, 
  Clock, 
  Car, 
  Building2, 
  CheckCircle2, 
  Edit2, 
  Trash2, 
  Calendar,
  ArrowRight
} from 'lucide-react';

export default function ShiftsView() {
  const { 
    shifts, 
    addShift, 
    updateShift, 
    deleteShift, 
    drivers, 
    vehicles, 
    companies,
    currentUser
  } = useFleet();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCabType, setFilterCabType] = useState('all');
  const [filterDate, setFilterDate] = useState('2026-10-02');
  const [showModal, setShowModal] = useState(false);
  const [editingShift, setEditingShift] = useState(null);

  const [formData, setFormData] = useState({
    date: '2026-10-02',
    shiftName: 'Morning Shift 1',
    companyId: 'COMP-101',
    driverId: 'DRV-01',
    vehicleId: 'CAB-01',
    cabType: 'SUV',
    routeName: 'Route 101 - Airport Express to Tech Park',
    expectedLogin: '06:00 AM',
    expectedLogout: '02:30 PM',
    loginTime: '05:55 AM',
    logoutTime: '02:35 PM',
    status: 'Scheduled',
    kmRun: 120
  });

  const handleOpenModal = (shift = null) => {
    if (shift) {
      setEditingShift(shift);
      setFormData({
        id: shift.id,
        date: shift.date,
        shiftName: shift.shiftName,
        companyId: shift.companyId,
        driverId: shift.driverId,
        vehicleId: shift.vehicleId,
        cabType: shift.cabType,
        routeName: shift.routeName,
        expectedLogin: shift.expectedLogin || '06:00 AM',
        expectedLogout: shift.expectedLogout || '02:30 PM',
        loginTime: shift.loginTime || '',
        logoutTime: shift.logoutTime || '',
        status: shift.status,
        kmRun: shift.kmRun || 0
      });
    } else {
      setEditingShift(null);
      const firstDrv = drivers[0];
      const firstVeh = vehicles[0];
      const firstComp = companies[0];

      setFormData({
        date: filterDate || new Date().toISOString().split('T')[0],
        shiftName: 'Morning Shift 1 (06:00 - 14:30)',
        companyId: firstComp?.id || '',
        driverId: firstDrv?.id || '',
        vehicleId: firstVeh?.id || '',
        cabType: firstVeh?.type || 'SUV',
        routeName: 'Route 101 - Airport Express to Tech Park',
        expectedLogin: '06:00 AM',
        expectedLogout: '02:30 PM',
        loginTime: '05:50 AM',
        logoutTime: '02:30 PM',
        status: 'Scheduled',
        kmRun: 0
      });
    }
    setShowModal(true);
  };

  const handleDriverChange = (driverId) => {
    const drv = drivers.find(d => d.id === driverId);
    if (drv) {
      const veh = vehicles.find(v => v.id === drv.assignedVehicleId) || vehicles[0];
      setFormData(prev => ({
        ...prev,
        driverId: drv.id,
        companyId: drv.assignedCompanyId || prev.companyId,
        vehicleId: drv.assignedVehicleId || (veh ? veh.id : ''),
        cabType: drv.assignedVehicleType || (veh ? veh.type : 'Sedan'),
        routeName: drv.routeName || prev.routeName
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingShift) {
      updateShift(editingShift.id, formData);
    } else {
      addShift(formData);
    }
    setShowModal(false);
  };

  const filteredShifts = shifts.filter(s => {
    const matchesSearch = 
      s.routeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.shiftName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.cabType?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCab = filterCabType === 'all' ? true : s.cabType === filterCabType;
    const matchesDate = filterDate ? s.date === filterDate : true;

    return matchesSearch && matchesCab && matchesDate;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <CalendarClock size={26} color="#2563eb" />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Weekly Shift & Route Dispatch Planner</h1>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Supervisor console to schedule driver weekly shifts, assign routes, cab types (SUV / Sedan / Van), and track login & logout timings.
          </p>
        </div>

        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <Plus size={16} /> Schedule Shift / Route
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
          <div style={{ position: 'relative', minWidth: '220px', flex: 1 }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text"
              placeholder="Search route name, shift name, driver..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-control"
              style={{ paddingLeft: '2.25rem' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={16} color="#64748b" />
            <input 
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="input-control"
              style={{ width: '155px' }}
            />
            {filterDate && (
              <button onClick={() => setFilterDate('')} className="btn btn-secondary btn-sm">
                All Dates
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {['all', 'SUV', 'Sedan', 'Van'].map(c => (
              <button
                key={c}
                onClick={() => setFilterCabType(c)}
                className={`btn btn-sm ${filterCabType === c ? 'btn-primary' : 'btn-secondary'}`}
              >
                {c === 'all' ? 'All Cabs' : c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Shifts Grid Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {filteredShifts.map(shift => {
          const drv = drivers.find(d => d.id === shift.driverId);
          const veh = vehicles.find(v => v.id === shift.vehicleId);
          const comp = companies.find(c => c.id === shift.companyId);

          return (
            <div key={shift.id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>
                    {shift.shiftName}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                    <Calendar size={12} /> {shift.date}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <span className={`badge ${
                    shift.status === 'Completed' ? 'badge-present' : 
                    shift.status === 'In-Progress' ? 'badge-warning' : 'badge-info'
                  }`}>
                    {shift.status}
                  </span>
                  <span className={`badge ${
                    shift.cabType === 'SUV' ? 'badge-suv' : 
                    shift.cabType === 'Sedan' ? 'badge-sedan' : 'badge-purple'
                  }`}>
                    {shift.cabType}
                  </span>
                </div>
              </div>

              {/* Route Info */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '0.75rem'
              }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                  Assigned Route
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem', fontWeight: 700, color: '#0284c7', fontSize: '0.9rem' }}>
                  <MapPin size={15} color="#0284c7" />
                  {shift.routeName}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Building2 size={13} /> {comp ? comp.name : 'Corporate Client'}
                </div>
              </div>

              {/* Driver & Cab Details */}
              <div className="grid-2" style={{ gap: '0.75rem' }}>
                <div style={{ background: '#ffffff', padding: '0.6rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Driver Assigned</div>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.85rem', marginTop: '0.15rem' }}>
                    {drv ? drv.name : 'Unassigned'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{drv?.phone || 'No phone'}</div>
                </div>

                <div style={{ background: '#ffffff', padding: '0.6rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Cab Details</div>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.85rem', marginTop: '0.15rem' }}>
                    {veh?.regNumber || 'KA-XX-0000'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{veh?.model || 'Sedan / SUV'}</div>
                </div>
              </div>

              {/* Login Kab Hua & Logout Kab Hua Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '10px',
                padding: '0.75rem 0.95rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#1e40af', fontWeight: 700 }}>LOGIN TIME (KAB HORA)</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#047857', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={13} /> {shift.loginTime || shift.expectedLogin || '--:--'}
                  </div>
                </div>

                <ArrowRight size={16} color="#94a3b8" />

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: '#1e40af', fontWeight: 700 }}>LOGOUT TIME (KAB HORA)</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#b91c1c', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.3rem' }}>
                    <Clock size={13} /> {shift.logoutTime || shift.expectedLogout || '--:--'}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                <button onClick={() => handleOpenModal(shift)} className="btn btn-secondary btn-sm">
                  <Edit2 size={13} color="#2563eb" /> Edit Shift
                </button>
                <button 
                  onClick={() => {
                    if (window.confirm('Delete this shift schedule?')) {
                      deleteShift(shift.id);
                    }
                  }} 
                  className="btn btn-secondary btn-sm"
                >
                  <Trash2 size={13} color="#dc2626" /> Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Add / Edit Shift */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CalendarClock size={20} color="#2563eb" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                  {editingShift ? 'Edit Weekly Shift & Route' : 'Schedule New Shift & Route Dispatch'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.25rem' }}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div className="grid-2">
                  <div className="input-group">
                    <label className="input-label">Shift Date</label>
                    <input 
                      type="date"
                      className="input-control"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Shift Slot Name</label>
                    <select
                      className="select-control"
                      value={formData.shiftName}
                      onChange={(e) => setFormData({ ...formData, shiftName: e.target.value })}
                    >
                      <option value="Morning Shift 1 (06:00 - 14:30)">Morning Shift 1 (06:00 - 14:30)</option>
                      <option value="Evening Shift 2 (14:00 - 22:30)">Evening Shift 2 (14:00 - 22:30)</option>
                      <option value="Night Shift (22:00 - 06:30)">Night Shift (22:00 - 06:30)</option>
                      <option value="General Shift (09:00 - 18:00)">General Shift (09:00 - 18:00)</option>
                      <option value="Custom Special Dispatch">Custom Special Dispatch</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="input-group">
                    <label className="input-label">Client Company</label>
                    <select
                      className="select-control"
                      value={formData.companyId}
                      onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                    >
                      {companies.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Assigned Driver</label>
                    <select
                      className="select-control"
                      value={formData.driverId}
                      onChange={(e) => handleDriverChange(e.target.value)}
                    >
                      {drivers.map(d => (
                        <option key={d.id} value={d.id}>{d.name} ({d.assignedVehicleType})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="input-group">
                    <label className="input-label">Cab / Vehicle</label>
                    <select
                      className="select-control"
                      value={formData.vehicleId}
                      onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                    >
                      {vehicles.map(v => (
                        <option key={v.id} value={v.id}>
                          {v.regNumber} - {v.model} ({v.type})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Cab Type (SUV / Sedan / Van)</label>
                    <select
                      className="select-control"
                      value={formData.cabType}
                      onChange={(e) => setFormData({ ...formData, cabType: e.target.value })}
                    >
                      <option value="SUV">SUV (Innova / Scorpio / Ertiga)</option>
                      <option value="Sedan">Sedan (Dzire / Etios / Ciaz)</option>
                      <option value="Van">Van (Traveller 12-17 Seater)</option>
                      <option value="Hatchback">Hatchback (WagonR / Tiago)</option>
                      <option value="Electric">Electric Vehicle (EV)</option>
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Route Name & Destination *</label>
                  <input 
                    type="text"
                    placeholder="e.g. Route 101 - Airport Express to Manyata Tech Park"
                    className="input-control"
                    value={formData.routeName}
                    onChange={(e) => setFormData({ ...formData, routeName: e.target.value })}
                    required
                  />
                </div>

                <div className="grid-2" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div className="input-group">
                    <label className="input-label" style={{ color: '#047857' }}>
                      Login Time (Kab Login Hora) *
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. 06:00 AM"
                      className="input-control"
                      value={formData.loginTime}
                      onChange={(e) => setFormData({ ...formData, loginTime: e.target.value })}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label" style={{ color: '#b91c1c' }}>
                      Logout Time (Kab Logout Hora) *
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. 02:30 PM"
                      className="input-control"
                      value={formData.logoutTime}
                      onChange={(e) => setFormData({ ...formData, logoutTime: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle2 size={16} /> Save Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

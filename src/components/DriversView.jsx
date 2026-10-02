import React, { useState } from 'react';
import { useFleet } from '../context/FleetContext';
import { 
  Users, 
  Plus, 
  Search, 
  Phone, 
  Star, 
  Edit2, 
  Trash2, 
  CheckCircle2
} from 'lucide-react';

export default function DriversView() {
  const { 
    drivers, 
    addDriver, 
    updateDriver, 
    deleteDriver, 
    vehicles, 
    companies,
    currentUser 
  } = useFleet();

  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    licenseNumber: '',
    assignedVehicleId: '',
    assignedVehicleType: 'SUV',
    assignedCompanyId: '',
    shiftTiming: 'Morning (06:00 AM - 02:30 PM)',
    routeName: 'Route 101 - Airport Express to Tech Park',
    status: 'On Duty',
    salaryMonthly: 24000,
    rating: 4.9
  });

  const handleOpenModal = (d = null) => {
    if (d) {
      setEditingDriver(d);
      setFormData({
        id: d.id,
        name: d.name,
        phone: d.phone,
        licenseNumber: d.licenseNumber,
        assignedVehicleId: d.assignedVehicleId || '',
        assignedVehicleType: d.assignedVehicleType || 'SUV',
        assignedCompanyId: d.assignedCompanyId || '',
        shiftTiming: d.shiftTiming || 'Morning (06:00 AM - 02:30 PM)',
        routeName: d.routeName || '',
        status: d.status || 'On Duty',
        salaryMonthly: d.salaryMonthly || 22000,
        rating: d.rating || 5.0
      });
    } else {
      setEditingDriver(null);
      setFormData({
        name: '',
        phone: '+91 ',
        licenseNumber: 'KA01202500',
        assignedVehicleId: vehicles[0]?.id || '',
        assignedVehicleType: vehicles[0]?.type || 'SUV',
        assignedCompanyId: companies[0]?.id || '',
        shiftTiming: 'Morning (06:00 AM - 02:30 PM)',
        routeName: 'Route 101 - Airport Express to Tech Park',
        status: 'On Duty',
        salaryMonthly: 23000,
        rating: 5.0
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const veh = vehicles.find(v => v.id === formData.assignedVehicleId);
    const formatted = {
      ...formData,
      assignedVehicleType: veh ? veh.type : formData.assignedVehicleType,
      salaryMonthly: Number(formData.salaryMonthly) || 22000,
      rating: Number(formData.rating) || 4.8
    };

    if (editingDriver) {
      updateDriver(editingDriver.id, formatted);
    } else {
      addDriver(formatted);
    }
    setShowModal(false);
  };

  const filteredDrivers = drivers.filter(d => 
    d.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.licenseNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.routeName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Users size={26} color="#2563eb" />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Driver Workforce Directory</h1>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Driver profiles, licenses, KYC status, and assigned route & shift schedules.
          </p>
        </div>

        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <Plus size={16} /> Register New Driver
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '450px' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text"
            placeholder="Search driver name, phone, license, route..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-control"
            style={{ paddingLeft: '2.25rem' }}
          />
        </div>
      </div>

      {/* Drivers Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.25rem' }}>
        {filteredDrivers.map(drv => {
          const assignedVeh = vehicles.find(v => v.id === drv.assignedVehicleId);
          const assignedComp = companies.find(c => c.id === drv.assignedCompanyId);

          return (
            <div key={drv.id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    color: '#ffffff',
                    fontSize: '1.05rem',
                    boxShadow: '0 2px 8px rgba(37,99,235,0.25)'
                  }}>
                    {drv.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>{drv.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#b45309', marginTop: '0.1rem', fontWeight: 700 }}>
                      <Star size={13} fill="#f59e0b" color="#f59e0b" /> <span>{drv.rating}</span> (Verified)
                    </div>
                  </div>
                </div>

                <span className={`badge ${
                  drv.status === 'On Duty' ? 'badge-present' : 
                  drv.status === 'On Break' ? 'badge-warning' : 'badge-absent'
                }`}>
                  {drv.status}
                </span>
              </div>

              {/* License & Phone */}
              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Phone:</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{drv.phone}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>DL No:</span>
                  <span style={{ fontFamily: 'monospace', color: '#1d4ed8', fontWeight: 700 }}>{drv.licenseNumber}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Monthly Salary:</span>
                  <span style={{ fontWeight: 800, color: '#047857' }}>₹{(drv.salaryMonthly || 22000).toLocaleString()}</span>
                </div>
              </div>

              {/* Assigned Vehicle & Route */}
              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Assigned Cab:</span>
                  <span className={`badge ${drv.assignedVehicleType === 'SUV' ? 'badge-suv' : 'badge-sedan'}`} style={{ fontSize: '0.7rem' }}>
                    {assignedVeh ? assignedVeh.regNumber : 'No Cab'} ({drv.assignedVehicleType || 'SUV'})
                  </span>
                </div>
                <div style={{ marginTop: '0.2rem' }}>
                  <span style={{ color: '#64748b', fontSize: '0.72rem' }}>Route:</span>
                  <div style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.825rem', marginTop: '0.1rem' }}>
                    {drv.routeName}
                  </div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.72rem' }}>Shift Timing:</span>
                  <div style={{ color: '#047857', fontWeight: 700, fontSize: '0.8rem' }}>
                    {drv.shiftTiming}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                <button onClick={() => handleOpenModal(drv)} className="btn btn-secondary btn-sm">
                  <Edit2 size={13} color="#2563eb" /> Edit Profile
                </button>
                <button 
                  onClick={() => {
                    if (window.confirm(`Delete driver "${drv.name}"?`)) {
                      deleteDriver(drv.id);
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

      {/* Modal for Add / Edit Driver */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={20} color="#2563eb" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                  {editingDriver ? 'Edit Driver Profile' : 'Register New Fleet Driver'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.25rem' }}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div className="grid-2">
                  <div className="input-group">
                    <label className="input-label">Driver Full Name *</label>
                    <input 
                      type="text"
                      placeholder="e.g. Mohammed Rafiq"
                      className="input-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Contact Phone Number *</label>
                    <input 
                      type="text"
                      placeholder="e.g. +91 99887 11223"
                      className="input-control"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="input-group">
                    <label className="input-label">Driving License Number (DL) *</label>
                    <input 
                      type="text"
                      placeholder="e.g. KA0120190045811"
                      className="input-control"
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Assigned Cab</label>
                    <select
                      className="select-control"
                      value={formData.assignedVehicleId}
                      onChange={(e) => setFormData({ ...formData, assignedVehicleId: e.target.value })}
                    >
                      {vehicles.map(v => (
                        <option key={v.id} value={v.id}>
                          {v.regNumber} ({v.model} - {v.type})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="input-group">
                    <label className="input-label">Assigned Client Company</label>
                    <select
                      className="select-control"
                      value={formData.assignedCompanyId}
                      onChange={(e) => setFormData({ ...formData, assignedCompanyId: e.target.value })}
                    >
                      {companies.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Monthly Salary (₹)</label>
                    <input 
                      type="number"
                      placeholder="e.g. 24000"
                      className="input-control"
                      value={formData.salaryMonthly}
                      onChange={(e) => setFormData({ ...formData, salaryMonthly: e.target.value })}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Assigned Route Name</label>
                  <input 
                    type="text"
                    placeholder="e.g. Route 101 - Airport Express to Tech Park"
                    className="input-control"
                    value={formData.routeName}
                    onChange={(e) => setFormData({ ...formData, routeName: e.target.value })}
                  />
                </div>

                <div className="grid-2">
                  <div className="input-group">
                    <label className="input-label">Shift Timing</label>
                    <select
                      className="select-control"
                      value={formData.shiftTiming}
                      onChange={(e) => setFormData({ ...formData, shiftTiming: e.target.value })}
                    >
                      <option value="Morning (06:00 AM - 02:30 PM)">Morning (06:00 AM - 02:30 PM)</option>
                      <option value="Evening (02:00 PM - 10:30 PM)">Evening (02:00 PM - 10:30 PM)</option>
                      <option value="Night (10:00 PM - 06:30 AM)">Night (10:00 PM - 06:30 AM)</option>
                      <option value="General (09:00 AM - 06:00 PM)">General (09:00 AM - 06:00 PM)</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Status</label>
                    <select
                      className="select-control"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="On Duty">On Duty</option>
                      <option value="On Break">On Break</option>
                      <option value="Off Duty">Off Duty</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle2 size={16} /> Save Driver Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

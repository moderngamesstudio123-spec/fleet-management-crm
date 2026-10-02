import React, { useState } from 'react';
import { useFleet } from '../context/FleetContext';
import { 
  Users, 
  Plus, 
  Search, 
  KeyRound, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  Building2, 
  Car, 
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

export default function SupervisorsView() {
  const { 
    supervisors, 
    addSupervisor, 
    updateSupervisor, 
    deleteSupervisor, 
    rawCompanies, 
    rawDrivers, 
    rawVehicles 
  } = useFleet();

  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSupervisor, setEditingSupervisor] = useState(null);
  const [showPass, setShowPass] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: 'password123',
    email: '',
    phone: '',
    hub: 'Bangalore West Logistics Hub'
  });

  const handleOpenModal = (sup = null) => {
    if (sup) {
      setEditingSupervisor(sup);
      setFormData({
        id: sup.id,
        name: sup.name,
        username: sup.username,
        password: sup.password,
        email: sup.email,
        phone: sup.phone,
        hub: sup.hub
      });
    } else {
      setEditingSupervisor(null);
      const nextNum = supervisors.length + 1;
      setFormData({
        name: '',
        username: `sup0${nextNum}`,
        password: 'password123',
        email: `supervisor${nextNum}@amazelogistics.com`,
        phone: '+91 98',
        hub: 'Bangalore West Logistics Hub'
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingSupervisor) {
      updateSupervisor(editingSupervisor.id, formData);
    } else {
      addSupervisor(formData);
    }
    setShowModal(false);
  };

  const filtered = supervisors.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.hub.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <KeyRound size={26} color="#059669" />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
              Supervisor Accounts & Login Credentials Hub
            </h1>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Master Admin control: Create new supervisors, assign Login ID & Passwords, manage hub zones, and monitor isolated fleets.
          </p>
        </div>

        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <Plus size={16} /> Create New Supervisor Account
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '450px' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text"
            placeholder="Search supervisor name, login username, hub zone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-control"
            style={{ paddingLeft: '2.25rem' }}
          />
        </div>
      </div>

      {/* Supervisors Grid Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {filtered.map(sup => {
          const supCompanies = rawCompanies.filter(c => c.supervisorId === sup.id);
          const supDrivers = rawDrivers.filter(d => d.supervisorId === sup.id);
          const supVehicles = rawVehicles.filter(v => v.supervisorId === sup.id);

          return (
            <div key={sup.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    color: '#059669',
                    fontSize: '1.1rem'
                  }}>
                    {sup.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{sup.name}</h3>
                    <span className="badge badge-supervisor" style={{ fontSize: '0.7rem', padding: '0.1rem 0.45rem', marginTop: '0.15rem' }}>
                      ID: {sup.id}
                    </span>
                  </div>
                </div>

                <span className="badge badge-present" style={{ fontSize: '0.72rem' }}>
                  Active Supervisor
                </span>
              </div>

              {/* Login Credentials Box */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '0.85rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem'
              }}>
                <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  🔐 Login ID & Access Credentials:
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                  <span style={{ color: '#64748b' }}>Username / ID:</span>
                  <strong style={{ color: '#0f172a', fontFamily: 'monospace', fontSize: '0.9rem' }}>{sup.username}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                  <span style={{ color: '#64748b' }}>Password:</span>
                  <span style={{ color: '#b91c1c', fontFamily: 'monospace', fontWeight: 700, background: '#fef2f2', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                    {sup.password}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.785rem', marginTop: '0.2rem', paddingTop: '0.3rem', borderTop: '1px solid #e2e8f0' }}>
                  <span style={{ color: '#64748b' }}>Hub Zone:</span>
                  <span style={{ color: '#047857', fontWeight: 600 }}>{sup.hub}</span>
                </div>
              </div>

              {/* Managed Fleet Stats */}
              <div className="grid-3" style={{ gap: '0.5rem' }}>
                <div style={{ background: '#f8fafc', padding: '0.5rem', borderRadius: '8px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>COMPANIES</div>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>{supCompanies.length}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.5rem', borderRadius: '8px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>DRIVERS</div>
                  <div style={{ fontWeight: 800, color: '#059669', fontSize: '0.95rem' }}>{supDrivers.length}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.5rem', borderRadius: '8px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>CABS</div>
                  <div style={{ fontWeight: 800, color: '#0284c7', fontSize: '0.95rem' }}>{supVehicles.length}</div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                <button onClick={() => handleOpenModal(sup)} className="btn btn-secondary btn-sm">
                  <Edit2 size={13} color="#059669" /> Edit / Reset Password
                </button>
                {supervisors.length > 1 && (
                  <button 
                    onClick={() => {
                      if (window.confirm(`Delete supervisor account "${sup.name}"?`)) {
                        deleteSupervisor(sup.id);
                      }
                    }} 
                    className="btn btn-secondary btn-sm"
                  >
                    <Trash2 size={13} color="#dc2626" /> Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Add / Edit Supervisor Account */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <KeyRound size={20} color="#059669" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                  {editingSupervisor ? 'Edit Supervisor & Reset Password' : 'Create New Supervisor Login Account'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.25rem' }}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div className="grid-2">
                  <div className="input-group">
                    <label className="input-label">Supervisor Full Name *</label>
                    <input 
                      type="text"
                      placeholder="e.g. Imran Khan / Rajesh Verma"
                      className="input-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Contact Phone *</label>
                    <input 
                      type="text"
                      placeholder="e.g. +91 98800 12345"
                      className="input-control"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Assigned Hub / Operations Zone *</label>
                  <input 
                    type="text"
                    placeholder="e.g. Bangalore North & Whitefield Zone"
                    className="input-control"
                    value={formData.hub}
                    onChange={(e) => setFormData({ ...formData, hub: e.target.value })}
                    required
                  />
                </div>

                {/* Login ID and Password configuration */}
                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '1rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ fontSize: '0.825rem', fontWeight: 800, color: '#047857' }}>
                    🔐 Assign Supervisor Login Credentials:
                  </div>

                  <div className="grid-2">
                    <div className="input-group">
                      <label className="input-label" style={{ color: '#047857' }}>
                        Login Username / ID *
                      </label>
                      <input 
                        type="text"
                        placeholder="e.g. imran / rajesh / sup04"
                        className="input-control"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label" style={{ color: '#047857' }}>
                        Login Password *
                      </label>
                      <input 
                        type="text"
                        placeholder="e.g. password123"
                        className="input-control"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label" style={{ color: '#047857' }}>Official Email Address</label>
                    <input 
                      type="email"
                      placeholder="e.g. imran.ops@amazelogistics.com"
                      className="input-control"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle2 size={16} /> Save Supervisor Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

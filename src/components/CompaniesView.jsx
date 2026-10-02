import React, { useState } from 'react';
import { useFleet } from '../context/FleetContext';
import { 
  Building2, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Edit2, 
  Trash2, 
  CheckCircle2
} from 'lucide-react';

export default function CompaniesView() {
  const { 
    companies, 
    addCompany, 
    updateCompany, 
    deleteCompany, 
    vehicles, 
    drivers,
    supervisors,
    currentUser 
  } = useFleet();

  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    supervisorId: currentUser?.supervisorId || supervisors[0]?.id || 'SUP-01',
    shiftsRequired: 'Morning (06:00), Evening (14:00), Night (22:00)'
  });

  const handleOpenModal = (comp = null) => {
    if (comp) {
      setEditingCompany(comp);
      setFormData({
        id: comp.id,
        name: comp.name,
        contactPerson: comp.contactPerson,
        phone: comp.phone,
        email: comp.email,
        address: comp.address,
        supervisorId: comp.supervisorId || currentUser?.supervisorId || 'SUP-01',
        shiftsRequired: Array.isArray(comp.shiftsRequired) ? comp.shiftsRequired.join(', ') : comp.shiftsRequired
      });
    } else {
      setEditingCompany(null);
      setFormData({
        name: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: '',
        supervisorId: currentUser?.supervisorId || supervisors[0]?.id || 'SUP-01',
        shiftsRequired: 'Morning (06:00), Evening (14:00), Night (22:00)'
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      shiftsRequired: typeof formData.shiftsRequired === 'string' 
        ? formData.shiftsRequired.split(',').map(s => s.trim()) 
        : formData.shiftsRequired
    };

    if (editingCompany) {
      updateCompany(editingCompany.id, formattedData);
    } else {
      addCompany(formattedData);
    }
    setShowModal(false);
  };

  const filteredCompanies = companies.filter(c => 
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.contactPerson?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Building2 size={26} color="#059669" />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Corporate Client Companies</h1>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Register and manage client companies, transport SPOCs, and shift requirements.
          </p>
        </div>

        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <Plus size={16} /> Register New Company
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '450px' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text"
            placeholder="Search company name, SPOC, address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-control"
            style={{ paddingLeft: '2.25rem' }}
          />
        </div>
      </div>

      {/* Companies Grid Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.25rem' }}>
        {filteredCompanies.map(company => {
          const compCabs = vehicles.filter(v => v.assignedCompanyId === company.id);
          const compDrivers = drivers.filter(d => d.assignedCompanyId === company.id);
          const supervisor = supervisors.find(s => s.id === company.supervisorId);

          return (
            <div key={company.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #a7f3d0' }}>
                    <Building2 size={22} color="#059669" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{company.name}</h3>
                    <span style={{ fontSize: '0.725rem', color: '#64748b' }}>ID: {company.id}</span>
                  </div>
                </div>

                <span className="badge badge-present" style={{ fontSize: '0.725rem' }}>
                  Active Contract
                </span>
              </div>

              {/* SPOC Contact */}
              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>SPOC / Contact Person</div>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.925rem', marginTop: '0.15rem' }}>
                  {company.contactPerson}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.4rem', fontSize: '0.8rem', color: '#334155' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Phone size={13} color="#059669" /> {company.phone}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Mail size={13} color="#7c3aed" /> {company.email}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={13} color="#0284c7" /> {company.address}
                  </div>
                </div>
              </div>

              {/* Assigned Supervisor & Deployed Cabs */}
              <div className="grid-2" style={{ gap: '0.5rem' }}>
                <div style={{ background: '#f0fdf4', padding: '0.65rem', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>ASSIGNED SUPERVISOR</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#15803d', marginTop: '0.15rem' }}>
                    {supervisor ? supervisor.name : (company.supervisorId || 'Imran Khan')}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{company.supervisorId || 'SUP-01'}</div>
                </div>

                <div style={{ background: '#ecfdf5', padding: '0.65rem', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>ACTIVE CABS</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#047857', marginTop: '0.15rem' }}>
                    {compCabs.length || company.activeCabs || 0} Cabs
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{compDrivers.length} Dedicated Drivers</div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                <button onClick={() => handleOpenModal(company)} className="btn btn-secondary btn-sm">
                  <Edit2 size={13} color="#059669" /> Edit Details
                </button>
                <button 
                  onClick={() => {
                    if (window.confirm(`Delete client company "${company.name}"?`)) {
                      deleteCompany(company.id);
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

      {/* Modal for Register New Company */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={20} color="#059669" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                  {editingCompany ? 'Edit Company Information' : 'Register New Corporate Client Company'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.25rem' }}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div className="input-group">
                  <label className="input-label">Company Name *</label>
                  <input 
                    type="text"
                    placeholder="e.g. TCS CyberTech Hub / Infosys Campus"
                    className="input-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid-2">
                  <div className="input-group">
                    <label className="input-label">Transport SPOC / Contact Person *</label>
                    <input 
                      type="text"
                      placeholder="e.g. Arun Sharma (Transport Mgr)"
                      className="input-control"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Contact Phone *</label>
                    <input 
                      type="text"
                      placeholder="e.g. +91 98765 43210"
                      className="input-control"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="input-group">
                    <label className="input-label">Official Transport Email</label>
                    <input 
                      type="email"
                      placeholder="e.g. transport@company.com"
                      className="input-control"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Assigned Supervisor *</label>
                    <select
                      className="select-control"
                      value={formData.supervisorId}
                      onChange={(e) => setFormData({ ...formData, supervisorId: e.target.value })}
                    >
                      {supervisors.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.hub.slice(0, 25)}...)</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Campus / Office Address *</label>
                  <textarea 
                    rows={2}
                    placeholder="e.g. Gate 4, Whitefield Tech Park, Bangalore"
                    className="textarea-control"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Daily Shifts Required</label>
                  <input 
                    type="text"
                    placeholder="e.g. Morning (06:00), Evening (14:00), Night (22:00)"
                    className="input-control"
                    value={formData.shiftsRequired}
                    onChange={(e) => setFormData({ ...formData, shiftsRequired: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle2 size={16} /> Register Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

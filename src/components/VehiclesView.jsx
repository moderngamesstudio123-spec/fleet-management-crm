import React, { useState } from 'react';
import { useFleet } from '../context/FleetContext';
import { 
  Car, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  MapPin
} from 'lucide-react';

export default function VehiclesView() {
  const { 
    vehicles, 
    addVehicle, 
    updateVehicle, 
    deleteVehicle, 
    drivers, 
    companies,
    currentUser 
  } = useFleet();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const [formData, setFormData] = useState({
    regNumber: '',
    model: '',
    type: 'SUV',
    seatingCapacity: 7,
    fuelType: 'Diesel',
    assignedDriverId: '',
    assignedCompanyId: '',
    supervisorId: currentUser.supervisorId || 'SUP-01',
    status: 'Active',
    insuranceExpiry: '2026-12-31',
    fitnessExpiry: '2027-04-15',
    currentOdometer: 45000,
    lastServiceKm: 40000,
    location: 'Bangalore Fleet Hub'
  });

  const handleOpenModal = (v = null) => {
    if (v) {
      setEditingVehicle(v);
      setFormData({
        id: v.id,
        regNumber: v.regNumber,
        model: v.model,
        type: v.type,
        seatingCapacity: v.seatingCapacity,
        fuelType: v.fuelType,
        assignedDriverId: v.assignedDriverId || '',
        assignedCompanyId: v.assignedCompanyId || '',
        supervisorId: v.supervisorId || currentUser.supervisorId || 'SUP-01',
        status: v.status,
        insuranceExpiry: v.insuranceExpiry || '2026-12-31',
        fitnessExpiry: v.fitnessExpiry || '2027-04-15',
        currentOdometer: v.currentOdometer || 40000,
        lastServiceKm: v.lastServiceKm || 35000,
        location: v.location || 'Bangalore Fleet Hub'
      });
    } else {
      setEditingVehicle(null);
      setFormData({
        regNumber: 'KA-01-XX-0000',
        model: 'Toyota Innova Crysta',
        type: 'SUV',
        seatingCapacity: 7,
        fuelType: 'Diesel',
        assignedDriverId: drivers[0]?.id || '',
        assignedCompanyId: companies[0]?.id || '',
        supervisorId: currentUser.supervisorId || 'SUP-01',
        status: 'Active',
        insuranceExpiry: '2026-12-31',
        fitnessExpiry: '2027-04-15',
        currentOdometer: 45000,
        lastServiceKm: 40000,
        location: 'Bangalore Fleet Hub'
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formatted = {
      ...formData,
      seatingCapacity: Number(formData.seatingCapacity) || 4,
      currentOdometer: Number(formData.currentOdometer) || 0,
      lastServiceKm: Number(formData.lastServiceKm) || 0
    };

    if (editingVehicle) {
      updateVehicle(editingVehicle.id, formatted);
    } else {
      addVehicle(formatted);
    }
    setShowModal(false);
  };

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = 
      v.regNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.location?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'all' ? true : v.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Car size={26} color="#2563eb" />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Fleet Vehicles & Cab Details</h1>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Manage fleet cabs (SUV, Sedan, Van, EV), seating capacity, assigned drivers, and insurance compliance.
          </p>
        </div>

        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <Plus size={16} /> Add New Vehicle / Cab
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', minWidth: '240px', flex: 1 }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text"
            placeholder="Search registration number, vehicle model, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-control"
            style={{ paddingLeft: '2.25rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {[
            { id: 'all', label: 'All Fleet' },
            { id: 'SUV', label: '🚙 SUV' },
            { id: 'Sedan', label: '🚗 Sedan' },
            { id: 'Van', label: '🚐 Van' },
            { id: 'Electric', label: '⚡ EV' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setFilterType(t.id)}
              className={`btn btn-sm ${filterType === t.id ? 'btn-primary' : 'btn-secondary'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vehicles Grid Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.25rem' }}>
        {filteredVehicles.map(veh => {
          const assignedDriver = drivers.find(d => d.id === veh.assignedDriverId);
          const assignedComp = companies.find(c => c.id === veh.assignedCompanyId);

          return (
            <div key={veh.id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', letterSpacing: '0.02em' }}>
                    {veh.regNumber}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600, marginTop: '0.15rem' }}>
                    {veh.model}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                  <span className={`badge ${
                    veh.type === 'SUV' ? 'badge-suv' : 
                    veh.type === 'Sedan' ? 'badge-sedan' : 'badge-purple'
                  }`}>
                    {veh.type}
                  </span>
                  <span className={`badge ${veh.status === 'Active' ? 'badge-present' : 'badge-warning'}`}>
                    {veh.status}
                  </span>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid-3" style={{ gap: '0.5rem' }}>
                <div style={{ background: '#f8fafc', padding: '0.5rem', borderRadius: '8px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>CAPACITY</div>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>{veh.seatingCapacity} Seater</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.5rem', borderRadius: '8px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>FUEL TYPE</div>
                  <div style={{ fontWeight: 800, color: '#0284c7', fontSize: '0.9rem' }}>{veh.fuelType}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.5rem', borderRadius: '8px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>ODOMETER</div>
                  <div style={{ fontWeight: 800, color: '#059669', fontSize: '0.85rem' }}>{veh.currentOdometer.toLocaleString()} km</div>
                </div>
              </div>

              {/* Assignment & Location */}
              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Driver:</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{assignedDriver ? assignedDriver.name : 'Unassigned'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Client:</span>
                  <span style={{ fontWeight: 700, color: '#2563eb' }}>{assignedComp ? assignedComp.name : 'Not Assigned'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Live Location:</span>
                  <span style={{ fontWeight: 600, color: '#334155' }}>{veh.location}</span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                <button onClick={() => handleOpenModal(veh)} className="btn btn-secondary btn-sm">
                  <Edit2 size={13} color="#2563eb" /> Edit Cab
                </button>
                <button 
                  onClick={() => {
                    if (window.confirm(`Delete vehicle "${veh.regNumber}"?`)) {
                      deleteVehicle(veh.id);
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

      {/* Modal for Add/Edit Vehicle */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Car size={20} color="#2563eb" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                  {editingVehicle ? 'Edit Vehicle / Cab Details' : 'Add New Fleet Vehicle (SUV / Sedan / Van)'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.25rem' }}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div className="grid-2">
                  <div className="input-group">
                    <label className="input-label">Vehicle Registration Number *</label>
                    <input 
                      type="text"
                      placeholder="e.g. KA-01-MJ-4050"
                      className="input-control"
                      value={formData.regNumber}
                      onChange={(e) => setFormData({ ...formData, regNumber: e.target.value })}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Vehicle Model & Make *</label>
                    <input 
                      type="text"
                      placeholder="e.g. Toyota Innova Crysta"
                      className="input-control"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid-3">
                  <div className="input-group">
                    <label className="input-label">Cab Type *</label>
                    <select
                      className="select-control"
                      value={formData.type}
                      onChange={(e) => {
                        const t = e.target.value;
                        const defaultCap = t === 'SUV' ? 7 : t === 'Sedan' ? 4 : t === 'Van' ? 12 : 4;
                        setFormData({ ...formData, type: t, seatingCapacity: defaultCap });
                      }}
                    >
                      <option value="SUV">SUV (Innova, Scorpio, Ertiga)</option>
                      <option value="Sedan">Sedan (Dzire, Etios, Ciaz)</option>
                      <option value="Van">Van (Traveller 12-17)</option>
                      <option value="Hatchback">Hatchback (WagonR, Tiago)</option>
                      <option value="Electric">Electric (Tigor EV / Nexon)</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Seating Capacity</label>
                    <input 
                      type="number"
                      placeholder="e.g. 7"
                      className="input-control"
                      value={formData.seatingCapacity}
                      onChange={(e) => setFormData({ ...formData, seatingCapacity: e.target.value })}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Fuel Type</label>
                    <select
                      className="select-control"
                      value={formData.fuelType}
                      onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                    >
                      <option value="Diesel">Diesel</option>
                      <option value="CNG">CNG</option>
                      <option value="Petrol">Petrol</option>
                      <option value="Electric">Electric</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="input-group">
                    <label className="input-label">Assigned Driver</label>
                    <select
                      className="select-control"
                      value={formData.assignedDriverId}
                      onChange={(e) => setFormData({ ...formData, assignedDriverId: e.target.value })}
                    >
                      <option value="">-- Unassigned --</option>
                      {drivers.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Assigned Client Company</label>
                    <select
                      className="select-control"
                      value={formData.assignedCompanyId}
                      onChange={(e) => setFormData({ ...formData, assignedCompanyId: e.target.value })}
                    >
                      <option value="">-- Unassigned --</option>
                      {companies.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="input-group">
                    <label className="input-label">Insurance Expiry Date</label>
                    <input 
                      type="date"
                      className="input-control"
                      value={formData.insuranceExpiry}
                      onChange={(e) => setFormData({ ...formData, insuranceExpiry: e.target.value })}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Fitness Certificate Expiry</label>
                    <input 
                      type="date"
                      className="input-control"
                      value={formData.fitnessExpiry}
                      onChange={(e) => setFormData({ ...formData, fitnessExpiry: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle2 size={16} /> Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

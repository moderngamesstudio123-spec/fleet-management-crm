import React, { useState } from 'react';
import { useFleet } from '../context/FleetContext';
import { 
  Wrench, 
  Fuel, 
  Plus, 
  Calendar, 
  DollarSign, 
  Gauge, 
  CheckCircle2, 
  AlertTriangle, 
  Clock,
  Car
} from 'lucide-react';

export default function MaintenanceView() {
  const { 
    maintenance, 
    addMaintenanceRecord, 
    fuelLogs, 
    addFuelLog, 
    vehicles, 
    drivers 
  } = useFleet();

  const [activeSubTab, setActiveSubTab] = useState('maintenance'); // 'maintenance' or 'fuel'
  const [showMntModal, setShowMntModal] = useState(false);
  const [showFuelModal, setShowFuelModal] = useState(false);

  // Maintenance Form
  const [mntForm, setMntForm] = useState({
    vehicleId: vehicles[0]?.id || '',
    type: 'Routine Oil & Filter Change',
    cost: 4500,
    serviceCenter: 'Authorized Service Hub Bangalore',
    date: '2026-10-02',
    odometer: 45000,
    notes: 'Engine oil 5W-30 synthetic, air filter & brake inspection'
  });

  // Fuel Form
  const [fuelForm, setFuelForm] = useState({
    vehicleId: vehicles[0]?.id || '',
    driverId: drivers[0]?.id || '',
    fuelType: 'Diesel',
    liters: 40,
    ratePerLiter: 88.5,
    totalCost: 3540,
    odometer: 46800,
    station: 'Shell Whitefield Express Hub',
    date: '2026-10-02'
  });

  const handleMntSubmit = (e) => {
    e.preventDefault();
    const veh = vehicles.find(v => v.id === mntForm.vehicleId);
    addMaintenanceRecord({
      ...mntForm,
      regNumber: veh ? veh.regNumber : 'KA-01-XX-0000',
      cost: Number(mntForm.cost) || 0,
      odometer: Number(mntForm.odometer) || 0
    });
    setShowMntModal(false);
  };

  const handleFuelSubmit = (e) => {
    e.preventDefault();
    const veh = vehicles.find(v => v.id === fuelForm.vehicleId);
    const ltr = Number(fuelForm.liters) || 0;
    const rate = Number(fuelForm.ratePerLiter) || 0;
    addFuelLog({
      ...fuelForm,
      regNumber: veh ? veh.regNumber : 'KA-01-XX-0000',
      liters: ltr,
      ratePerLiter: rate,
      totalCost: ltr * rate,
      odometer: Number(fuelForm.odometer) || 0
    });
    setShowFuelModal(false);
  };

  const totalMntCost = maintenance.reduce((acc, m) => acc + (Number(m.cost) || 0), 0);
  const totalFuelCost = fuelLogs.reduce((acc, f) => acc + (Number(f.totalCost) || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Wrench size={26} color="#38bdf8" />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Maintenance & Fuel Logs</h1>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Log workshop repairs, periodic service schedules, diesel/CNG fill-ups, and cost breakdown.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => setShowFuelModal(true)} className="btn btn-secondary">
            <Fuel size={16} color="#f59e0b" /> Add Fuel Log
          </button>
          <button onClick={() => setShowMntModal(true)} className="btn btn-primary">
            <Wrench size={16} /> New Service Ticket
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-2">
        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #38bdf8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>TOTAL WORKSHOP & SERVICE EXPENSE</span>
            <Wrench size={20} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.35rem', color: '#60a5fa' }}>
            ₹{totalMntCost.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
            {maintenance.length} total repair & periodic service tickets
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>TOTAL FUEL & CNG CONSUMPTION</span>
            <Fuel size={20} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.35rem', color: '#fbbf24' }}>
            ₹{totalFuelCost.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
            {fuelLogs.length} verified refuel transactions
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveSubTab('maintenance')}
          className={`btn ${activeSubTab === 'maintenance' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Wrench size={16} /> Service & Workshop Tickets ({maintenance.length})
        </button>
        <button
          onClick={() => setActiveSubTab('fuel')}
          className={`btn ${activeSubTab === 'fuel' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Fuel size={16} /> Fuel & Energy Logs ({fuelLogs.length})
        </button>
      </div>

      {/* Table based on active sub tab */}
      {activeSubTab === 'maintenance' ? (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Cab Registration</th>
                <th>Service Type</th>
                <th>Service Center / Workshop</th>
                <th>Odometer</th>
                <th>Cost (INR)</th>
                <th>Status</th>
                <th>Notes / Work Done</th>
              </tr>
            </thead>
            <tbody>
              {maintenance.map(m => (
                <tr key={m.id}>
                  <td>{m.date}</td>
                  <td><strong>{m.regNumber}</strong></td>
                  <td>{m.type}</td>
                  <td>{m.serviceCenter}</td>
                  <td>{Number(m.odometer || 0).toLocaleString()} km</td>
                  <td style={{ fontWeight: 800, color: '#60a5fa' }}>₹{Number(m.cost || 0).toLocaleString()}</td>
                  <td>
                    <span className={`badge ${m.status === 'Completed' ? 'badge-present' : 'badge-warning'}`}>
                      {m.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{m.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Cab Reg</th>
                <th>Fuel Station</th>
                <th>Fuel Type</th>
                <th>Quantity</th>
                <th>Rate / Unit</th>
                <th>Total Cost</th>
                <th>Odometer Reading</th>
              </tr>
            </thead>
            <tbody>
              {fuelLogs.map(f => (
                <tr key={f.id}>
                  <td>{f.date}</td>
                  <td><strong>{f.regNumber}</strong></td>
                  <td>{f.station}</td>
                  <td><span className="badge badge-info">{f.fuelType}</span></td>
                  <td>{f.liters} {f.fuelType === 'CNG' ? 'kg' : 'L'}</td>
                  <td>₹{f.ratePerLiter}</td>
                  <td style={{ fontWeight: 800, color: '#fbbf24' }}>₹{Number(f.totalCost || 0).toLocaleString()}</td>
                  <td>{Number(f.odometer || 0).toLocaleString()} km</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Maintenance Modal */}
      {showMntModal && (
        <div className="modal-overlay" onClick={() => setShowMntModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Log Vehicle Maintenance Ticket</h3>
              <button onClick={() => setShowMntModal(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.25rem' }}>✕</button>
            </div>
            <form onSubmit={handleMntSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="grid-2">
                  <div className="input-group">
                    <label className="input-label">Vehicle Cab</label>
                    <select
                      className="select-control"
                      value={mntForm.vehicleId}
                      onChange={(e) => setMntForm({ ...mntForm, vehicleId: e.target.value })}
                    >
                      {vehicles.map(v => (
                        <option key={v.id} value={v.id}>{v.regNumber} ({v.model})</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Service Date</label>
                    <input 
                      type="date"
                      className="input-control"
                      value={mntForm.date}
                      onChange={(e) => setMntForm({ ...mntForm, date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="input-group">
                    <label className="input-label">Service Type</label>
                    <input 
                      type="text"
                      className="input-control"
                      placeholder="e.g. Brake replacement / Oil Service"
                      value={mntForm.type}
                      onChange={(e) => setMntForm({ ...mntForm, type: e.target.value })}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Repair Cost (₹)</label>
                    <input 
                      type="number"
                      className="input-control"
                      value={mntForm.cost}
                      onChange={(e) => setMntForm({ ...mntForm, cost: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Authorized Workshop / Service Center</label>
                  <input 
                    type="text"
                    className="input-control"
                    value={mntForm.serviceCenter}
                    onChange={(e) => setMntForm({ ...mntForm, serviceCenter: e.target.value })}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Notes & Parts Replaced</label>
                  <textarea 
                    rows={2}
                    className="textarea-control"
                    value={mntForm.notes}
                    onChange={(e) => setMntForm({ ...mntForm, notes: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowMntModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary"><CheckCircle2 size={16} /> Save Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fuel Modal */}
      {showFuelModal && (
        <div className="modal-overlay" onClick={() => setShowFuelModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Log Fuel / Gas Entry</h3>
              <button onClick={() => setShowFuelModal(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.25rem' }}>✕</button>
            </div>
            <form onSubmit={handleFuelSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="grid-2">
                  <div className="input-group">
                    <label className="input-label">Vehicle Cab</label>
                    <select
                      className="select-control"
                      value={fuelForm.vehicleId}
                      onChange={(e) => setFuelForm({ ...fuelForm, vehicleId: e.target.value })}
                    >
                      {vehicles.map(v => (
                        <option key={v.id} value={v.id}>{v.regNumber} ({v.fuelType})</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Refuel Date</label>
                    <input 
                      type="date"
                      className="input-control"
                      value={fuelForm.date}
                      onChange={(e) => setFuelForm({ ...fuelForm, date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-3">
                  <div className="input-group">
                    <label className="input-label">Fuel Type</label>
                    <select
                      className="select-control"
                      value={fuelForm.fuelType}
                      onChange={(e) => setFuelForm({ ...fuelForm, fuelType: e.target.value })}
                    >
                      <option value="Diesel">Diesel</option>
                      <option value="CNG">CNG</option>
                      <option value="Petrol">Petrol</option>
                      <option value="Electric (kWh)">Electric (kWh)</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Liters / Units</label>
                    <input 
                      type="number"
                      step="0.1"
                      className="input-control"
                      value={fuelForm.liters}
                      onChange={(e) => setFuelForm({ ...fuelForm, liters: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Rate / Unit (₹)</label>
                    <input 
                      type="number"
                      step="0.1"
                      className="input-control"
                      value={fuelForm.ratePerLiter}
                      onChange={(e) => setFuelForm({ ...fuelForm, ratePerLiter: e.target.value })}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Fuel Station Name & City</label>
                  <input 
                    type="text"
                    className="input-control"
                    value={fuelForm.station}
                    onChange={(e) => setFuelForm({ ...fuelForm, station: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowFuelModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary"><CheckCircle2 size={16} /> Save Fuel Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

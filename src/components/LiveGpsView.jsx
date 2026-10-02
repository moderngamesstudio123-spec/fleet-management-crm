import React, { useState } from 'react';
import { useFleet } from '../context/FleetContext';
import { 
  Radio, 
  Search, 
  MapPin, 
  Car, 
  CheckCircle2, 
  Clock
} from 'lucide-react';

export default function LiveGpsView() {
  const { vehicles, drivers } = useFleet();
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const mockCoordinates = [
    { x: '45%', y: '35%', name: 'Airport Express Road' },
    { x: '65%', y: '55%', name: 'Whitefield Tech Park' },
    { x: '52%', y: '72%', name: 'Electronic City Flyover' },
    { x: '35%', y: '48%', name: 'Manyata Tech Park Hub' },
    { x: '58%', y: '62%', name: 'Outer Ring Rd Bellandur' },
    { x: '30%', y: '60%', name: 'Peenya Industrial Area' }
  ];

  const filtered = vehicles.filter(v => 
    v.regNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Radio size={26} color="#059669" className="animate-pulse" />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Live Fleet GPS Radar & Route Telemetry</h1>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Real-time GPS telemetry, vehicle speed tracking, active Bangalore routes, and geofencing.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.4rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', color: '#047857', fontWeight: 700 }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669', display: 'inline-block' }}></span>
          GPS Stream Active (Live 10s Poll)
        </div>
      </div>

      {/* Main Map & Sidebar Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.25rem' }}>
        {/* Visual Map Simulator */}
        <div className="glass-panel" style={{
          position: 'relative',
          height: '560px',
          background: '#f1f5f9',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid #cbd5e1',
          boxShadow: 'inset 0 0 25px rgba(15, 23, 42, 0.05)'
        }}>
          {/* Radar Grid Lines */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(37, 99, 235, 0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(37, 99, 235, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }} />

          {/* Concentric Radar Rings */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            border: '1px dashed rgba(37, 99, 235, 0.25)',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            border: '1px solid rgba(37, 99, 235, 0.2)',
            pointerEvents: 'none'
          }} />

          {/* Map Landmarks */}
          <div style={{ position: 'absolute', top: '15%', left: '45%', fontSize: '0.75rem', color: '#475569', fontWeight: 800, background: 'rgba(255,255,255,0.85)', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
            🛫 KIAL Kempegowda Airport
          </div>
          <div style={{ position: 'absolute', top: '55%', left: '72%', fontSize: '0.75rem', color: '#475569', fontWeight: 800, background: 'rgba(255,255,255,0.85)', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
            🏢 Whitefield IT Hub
          </div>
          <div style={{ position: 'absolute', top: '78%', left: '50%', fontSize: '0.75rem', color: '#475569', fontWeight: 800, background: 'rgba(255,255,255,0.85)', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
            🏭 Electronic City Phase 1
          </div>
          <div style={{ position: 'absolute', top: '42%', left: '25%', fontSize: '0.75rem', color: '#475569', fontWeight: 800, background: 'rgba(255,255,255,0.85)', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
            🏙️ Manyata Tech Park
          </div>

          {/* Render Vehicles on Light Map */}
          {vehicles.map((veh, index) => {
            const coord = mockCoordinates[index % mockCoordinates.length];
            const isSelected = selectedVehicle?.id === veh.id;
            const isMoving = veh.speedKmH > 0;

            return (
              <div
                key={veh.id}
                onClick={() => setSelectedVehicle(veh)}
                style={{
                  position: 'absolute',
                  top: coord.y,
                  left: coord.x,
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer',
                  zIndex: isSelected ? 30 : 10,
                  transition: 'all 0.25s ease'
                }}
              >
                <div style={{
                  background: isSelected ? '#2563eb' : veh.status === 'Active' ? '#059669' : '#ea580c',
                  color: 'white',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '9999px',
                  boxShadow: '0 4px 12px rgba(15,23,42,0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  border: isSelected ? '2px solid #ffffff' : '1px solid rgba(255,255,255,0.3)'
                }}>
                  <Car size={13} />
                  <span>{veh.regNumber.split('-').slice(0, 2).join('-')}..</span>
                  {isMoving && (
                    <span style={{ fontSize: '0.68rem', background: 'rgba(0,0,0,0.25)', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>
                      {veh.speedKmH} km/h
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Selected Vehicle Info Overlay */}
          {selectedVehicle && (
            <div style={{
              position: 'absolute',
              bottom: '1rem',
              left: '1rem',
              right: '1rem',
              background: 'rgba(255, 255, 255, 0.96)',
              backdropFilter: 'blur(10px)',
              border: '1px solid #cbd5e1',
              borderRadius: '14px',
              padding: '1rem 1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
              boxShadow: '0 8px 24px rgba(15,23,42,0.12)',
              zIndex: 40
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.1rem' }}>
                    {selectedVehicle.regNumber}
                  </span>
                  <span className={`badge ${selectedVehicle.type === 'SUV' ? 'badge-suv' : 'badge-sedan'}`} style={{ fontSize: '0.7rem' }}>
                    {selectedVehicle.type}
                  </span>
                  <span className="badge badge-present" style={{ fontSize: '0.7rem' }}>
                    {selectedVehicle.speedKmH > 0 ? `🟢 Moving @ ${selectedVehicle.speedKmH} km/h` : '🟡 Parked'}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={13} color="#2563eb" /> {selectedVehicle.location} • {selectedVehicle.model}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>DRIVER IN CAB</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a' }}>
                  {drivers.find(d => d.id === selectedVehicle.assignedDriverId)?.name || 'Mohammed Rafiq'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Vehicles Telemetry List */}
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '560px', overflowY: 'auto' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>Fleet Telemetry List</h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Select cab to inspect GPS location</span>
          </div>

          <div style={{ position: 'relative' }}>
            <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text"
              placeholder="Search cab..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-control"
              style={{ paddingLeft: '2rem', fontSize: '0.8rem', padding: '0.4rem 0.5rem 0.4rem 2rem' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {filtered.map(v => {
              const isSelected = selectedVehicle?.id === v.id;
              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedVehicle(v)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    background: isSelected ? '#eff6ff' : '#ffffff',
                    border: isSelected ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.85rem' }}>{v.regNumber}</span>
                    <span className={`badge ${v.speedKmH > 0 ? 'badge-present' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>
                      {v.speedKmH > 0 ? `${v.speedKmH} km/h` : 'Parked'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                    {v.model} ({v.type})
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#0284c7', marginTop: '0.15rem', fontWeight: 600 }}>
                    📍 {v.location}
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

import React, { useState } from 'react';
import { useFleet } from '../context/FleetContext';
import { 
  ClipboardCheck, 
  UserX, 
  UserCheck, 
  DollarSign, 
  Car, 
  Plus, 
  Search, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Edit2,
  Trash2,
  Download,
  Zap,
  ArrowRight
} from 'lucide-react';

export default function AttendanceView() {
  const { 
    attendance, 
    saveAttendanceRecord, 
    deleteAttendanceRecord, 
    quickSettleAbsentPayment,
    drivers, 
    currentUser
  } = useFleet();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, Present, Absent, adhoc
  const [filterDate, setFilterDate] = useState('2026-10-02');
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // Quick Inline Absent Payment Settlement Modal
  const [quickPayRecord, setQuickPayRecord] = useState(null);
  const [quickPayAmount, setQuickPayAmount] = useState('');
  const [quickPayVendor, setQuickPayVendor] = useState('');
  const [quickPayMode, setQuickPayMode] = useState('Online / UPI');

  // Form State
  const [formData, setFormData] = useState({
    date: '2026-10-02',
    day: 'Friday',
    driverId: '',
    status: 'Present',
    loginTime: '06:00 AM',
    logoutTime: '02:30 PM',
    absenceReason: '',
    isAdhocReplacement: false,
    adhocDetails: {
      vendorName: '',
      cabRegNo: '',
      cabType: 'Sedan',
      replacementDriver: '',
      costAmount: '',
      paymentType: 'Online / UPI',
      paymentStatus: 'Paid'
    }
  });

  const handleOpenModal = (record = null) => {
    if (record) {
      setEditingRecord(record);
      setFormData({
        id: record.id,
        date: record.date,
        day: record.day || getDayName(record.date),
        driverId: record.driverId,
        status: record.status,
        loginTime: record.loginTime || '',
        logoutTime: record.logoutTime || '',
        absenceReason: record.absenceReason || '',
        isAdhocReplacement: record.isAdhocReplacement || false,
        adhocDetails: {
          vendorName: record.adhocDetails?.vendorName || '',
          cabRegNo: record.adhocDetails?.cabRegNo || '',
          cabType: record.adhocDetails?.cabType || 'Sedan',
          replacementDriver: record.adhocDetails?.replacementDriver || '',
          costAmount: record.adhocDetails?.costAmount || '',
          paymentType: record.adhocDetails?.paymentType || 'Online / UPI',
          paymentStatus: record.adhocDetails?.paymentStatus || 'Paid'
        }
      });
    } else {
      setEditingRecord(null);
      const defaultDrv = drivers[0];
      setFormData({
        date: filterDate || new Date().toISOString().split('T')[0],
        day: getDayName(filterDate || new Date().toISOString().split('T')[0]),
        driverId: defaultDrv ? defaultDrv.id : '',
        status: 'Present',
        loginTime: '06:00 AM',
        logoutTime: '02:30 PM',
        absenceReason: '',
        isAdhocReplacement: false,
        adhocDetails: {
          vendorName: '',
          cabRegNo: '',
          cabType: 'Sedan',
          replacementDriver: '',
          costAmount: '',
          paymentType: 'Online / UPI',
          paymentStatus: 'Paid'
        }
      });
    }
    setShowModal(true);
  };

  const getDayName = (dateStr) => {
    if (!dateStr) return 'Friday';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedDriver = drivers.find(d => d.id === formData.driverId);
    
    const recordToSave = {
      ...formData,
      driverName: selectedDriver ? selectedDriver.name : 'Unknown Driver',
      vehicleType: selectedDriver ? selectedDriver.assignedVehicleType : 'Sedan',
      companyId: selectedDriver ? selectedDriver.assignedCompanyId : 'COMP-101',
      routeName: selectedDriver ? selectedDriver.routeName : 'Default Route',
      day: getDayName(formData.date),
      adhocDetails: {
        ...formData.adhocDetails,
        costAmount: Number(formData.adhocDetails.costAmount) || 0
      }
    };

    saveAttendanceRecord(recordToSave);
    setShowModal(false);
  };

  const handleQuickPaySubmit = (e) => {
    e.preventDefault();
    if (!quickPayRecord) return;
    quickSettleAbsentPayment(quickPayRecord.id, quickPayAmount, quickPayVendor, quickPayMode);
    setQuickPayRecord(null);
    setQuickPayAmount('');
    setQuickPayVendor('');
  };

  // Filter attendance
  const filteredAttendance = attendance.filter(item => {
    const matchesSearch = 
      item.driverName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.routeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.adhocDetails?.vendorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.absenceReason?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = 
      filterStatus === 'all' ? true :
      filterStatus === 'adhoc' ? item.isAdhocReplacement :
      item.status === filterStatus;

    const matchesDate = filterDate ? item.date === filterDate : true;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalPresent = attendance.filter(a => (filterDate ? a.date === filterDate : true) && a.status === 'Present').length;
  const totalAbsent = attendance.filter(a => (filterDate ? a.date === filterDate : true) && a.status === 'Absent').length;
  const totalAdhoc = attendance.filter(a => (filterDate ? a.date === filterDate : true) && a.isAdhocReplacement).length;
  const totalAdhocPayout = attendance
    .filter(a => (filterDate ? a.date === filterDate : true) && a.isAdhocReplacement)
    .reduce((acc, curr) => acc + (Number(curr.adhocDetails?.costAmount) || 0), 0);

  const exportCSV = () => {
    const headers = ['Date', 'Day', 'Driver Name', 'Route', 'Cab Type', 'Status', 'Login Time', 'Logout Time', 'Absence Reason', 'Is Ad-hoc Replacement', 'Vendor Name', 'Adhoc Cab Reg', 'Adhoc Cost (INR)', 'Payment Status'];
    const rows = attendance.map(a => [
      a.date,
      a.day,
      `"${a.driverName}"`,
      `"${a.routeName}"`,
      a.vehicleType,
      a.status,
      a.loginTime,
      a.logoutTime,
      `"${a.absenceReason || 'N/A'}"`,
      a.isAdhocReplacement ? 'YES' : 'NO',
      `"${a.adhocDetails?.vendorName || 'N/A'}"`,
      a.adhocDetails?.cabRegNo || 'N/A',
      a.adhocDetails?.costAmount || 0,
      a.adhocDetails?.paymentStatus || 'N/A'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Fleet_Attendance_${currentUser.supervisorId || 'admin'}_${filterDate || 'all'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ClipboardCheck size={26} color="#2563eb" />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
              Weekly Attendance & Driver Absent Payment Hub
            </h1>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Driver present/absent tracking. Driver absent hone par supervisor replacement cab ka payment input enter karke direct save karein.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={exportCSV} className="btn btn-secondary">
            <Download size={16} /> Export CSV
          </button>
          <button onClick={() => handleOpenModal()} className="btn btn-primary">
            <Plus size={16} /> Mark / Add Attendance
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-4">
        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #059669' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.785rem', color: '#64748b', fontWeight: 700 }}>DRIVERS PRESENT</span>
            <UserCheck size={20} color="#059669" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.35rem', color: '#047857' }}>
            {totalPresent} <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>Drivers</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            On regular roster routes
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #dc2626' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.785rem', color: '#64748b', fontWeight: 700 }}>DRIVERS ABSENT</span>
            <UserX size={20} color="#dc2626" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.35rem', color: '#b91c1c' }}>
            {totalAbsent} <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>Absent</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            Medical & emergency leaves
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #ea580c' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.785rem', color: '#64748b', fontWeight: 700 }}>AD-HOC REPLACEMENTS</span>
            <Car size={20} color="#ea580c" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.35rem', color: '#c2410c' }}>
            {totalAdhoc} <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>Dispatched</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            External outsourced cabs
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #2563eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.785rem', color: '#64748b', fontWeight: 700 }}>SUPERVISOR AD-HOC PAYOUT</span>
            <DollarSign size={20} color="#2563eb" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.35rem', color: '#1d4ed8' }}>
            ₹{totalAdhocPayout.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            Direct replacement cost settled
          </div>
        </div>
      </div>

      {/* Filter and Date Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
          <div style={{ position: 'relative', minWidth: '240px', flex: 1 }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text"
              placeholder="Search driver, route, adhoc vendor, absence reason..."
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
              style={{ width: '160px' }}
            />
            {filterDate && (
              <button 
                onClick={() => setFilterDate('')} 
                className="btn btn-secondary btn-sm"
              >
                All Dates
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {[
              { id: 'all', label: 'All Records' },
              { id: 'Present', label: 'Present' },
              { id: 'Absent', label: 'Absent' },
              { id: 'adhoc', label: '🚨 Ad-hoc Replaced' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id)}
                className={`btn btn-sm ${filterStatus === f.id ? 'btn-primary' : 'btn-secondary'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Attendance & Ad-hoc Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Date & Day</th>
              <th>Driver & Vehicle</th>
              <th>Assigned Route</th>
              <th>Status</th>
              <th>Login / Logout</th>
              <th>Absence Reason</th>
              <th>Ad-hoc Replacement Details</th>
              <th>Supervisor Payment Input (₹)</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                  <AlertCircle size={36} color="#94a3b8" style={{ margin: '0 auto 0.75rem', display: 'block' }} />
                  <p style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>No attendance records found for this supervisor filter.</p>
                  <p style={{ fontSize: '0.825rem', marginTop: '0.25rem' }}>Click "Mark / Add Attendance" to log a record.</p>
                </td>
              </tr>
            ) : (
              filteredAttendance.map((record) => {
                const isAbsent = record.status === 'Absent';
                const hasAdhoc = record.isAdhocReplacement;

                return (
                  <tr key={record.id} style={{ background: hasAdhoc ? '#fffbeb' : undefined }}>
                    <td>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>{record.date}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{record.day || 'Weekday'}</div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>{record.driverName}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                        <span className={`badge ${record.vehicleType === 'SUV' ? 'badge-suv' : 'badge-sedan'}`}>
                          {record.vehicleType || 'Cab'}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{record.driverId}</span>
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: '0.85rem', color: '#334155', maxWidth: '200px', fontWeight: 500 }}>
                        {record.routeName}
                      </div>
                    </td>

                    <td>
                      <span className={`badge ${record.status === 'Present' ? 'badge-present' : 'badge-absent'}`}>
                        {record.status === 'Present' ? '✓ Present' : '✕ Absent'}
                      </span>
                    </td>

                    <td>
                      {record.status === 'Present' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                          <div style={{ fontSize: '0.8rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                            <Clock size={12} /> In: {record.loginTime || '--:--'}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Clock size={12} /> Out: {record.logoutTime || '--:--'}
                          </div>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: '#dc2626', fontWeight: 600 }}>— On Leave —</span>
                      )}
                    </td>

                    <td style={{ maxWidth: '200px' }}>
                      {record.absenceReason ? (
                        <div style={{
                          fontSize: '0.8rem',
                          color: '#b91c1c',
                          background: '#fef2f2',
                          border: '1px solid #fecaca',
                          padding: '0.4rem 0.6rem',
                          borderRadius: '6px',
                          fontWeight: 500
                        }}>
                          {record.absenceReason}
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Regular Duty</span>
                      )}
                    </td>

                    <td>
                      {hasAdhoc ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <span className="badge badge-adhoc">
                            🚨 Outsourced Cab
                          </span>
                          <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0f172a' }}>
                            {record.adhocDetails?.vendorName || 'Outsourced Vendor'}
                          </div>
                          <div style={{ fontSize: '0.725rem', color: '#64748b' }}>
                            {record.adhocDetails?.cabRegNo || 'KA-XX-0000'} ({record.adhocDetails?.cabType || 'Sedan'})
                          </div>
                        </div>
                      ) : isAbsent ? (
                        <button
                          onClick={() => {
                            setQuickPayRecord(record);
                            setQuickPayAmount(record.adhocDetails?.costAmount || '');
                            setQuickPayVendor(record.adhocDetails?.vendorName || '');
                          }}
                          className="btn btn-warning btn-sm"
                          style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                        >
                          <Zap size={13} /> Settle Payment
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>None</span>
                      )}
                    </td>

                    {/* SUPERVISOR PAYMENT INPUT DISPLAY */}
                    <td>
                      {hasAdhoc ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#c2410c' }}>
                            ₹{Number(record.adhocDetails?.costAmount || 0).toLocaleString()}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span className="badge badge-present" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>
                              {record.adhocDetails?.paymentStatus || 'Paid'}
                            </span>
                            <span style={{ fontSize: '0.725rem', color: '#64748b' }}>
                              via {record.adhocDetails?.paymentType || 'UPI'}
                            </span>
                          </div>
                        </div>
                      ) : isAbsent ? (
                        <span style={{ fontSize: '0.785rem', color: '#ea580c', fontWeight: 600 }}>Payment Pending</span>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>₹0.00</span>
                      )}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                        <button 
                          onClick={() => handleOpenModal(record)} 
                          className="btn btn-secondary btn-sm btn-icon"
                          title="Edit Attendance & Payment"
                        >
                          <Edit2 size={14} color="#2563eb" />
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm('Delete this attendance record?')) {
                              deleteAttendanceRecord(record.id);
                            }
                          }} 
                          className="btn btn-secondary btn-sm btn-icon"
                          title="Delete Record"
                        >
                          <Trash2 size={14} color="#dc2626" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* QUICK INLINE SETTLE ABSENT PAYMENT MODAL */}
      {quickPayRecord && (
        <div className="modal-overlay" onClick={() => setQuickPayRecord(null)}>
          <div className="modal-content" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <DollarSign size={20} color="#ea580c" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  Enter Absent Cab Replacement Payment
                </h3>
              </div>
              <button onClick={() => setQuickPayRecord(null)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.25rem' }}>✕</button>
            </div>

            <form onSubmit={handleQuickPaySubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '0.75rem', borderRadius: '10px' }}>
                  <div style={{ fontWeight: 800, color: '#991b1b', fontSize: '0.9rem' }}>
                    Driver Absent: {quickPayRecord.driverName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#b91c1c', marginTop: '0.15rem' }}>
                    Reason: {quickPayRecord.absenceReason || 'Medical / Emergency leave'}
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label" style={{ color: '#c2410c' }}>
                    Payment Amount (Iske Kitne Paise Hore) (₹) *
                  </label>
                  <input 
                    type="number"
                    placeholder="e.g. 1850"
                    className="input-control"
                    style={{ borderColor: '#ea580c', fontWeight: 800, fontSize: '1.15rem', color: '#c2410c' }}
                    value={quickPayAmount}
                    onChange={(e) => setQuickPayAmount(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Outsourced Vendor / Driver Name</label>
                  <input 
                    type="text"
                    placeholder="e.g. Sri Balaji Travels / Outsourced Cab"
                    className="input-control"
                    value={quickPayVendor}
                    onChange={(e) => setQuickPayVendor(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Payment Mode</label>
                  <select
                    className="select-control"
                    value={quickPayMode}
                    onChange={(e) => setQuickPayMode(e.target.value)}
                  >
                    <option value="Online / UPI">Online / UPI (GooglePay / PhonePe)</option>
                    <option value="Cash">Cash Handover</option>
                    <option value="Vendor Account">Vendor Monthly Ledger</option>
                    <option value="Direct Client Billable">Direct Client Billable</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setQuickPayRecord(null)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-warning">
                  <CheckCircle2 size={16} /> Save Payment & Settle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Add/Edit Attendance Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ClipboardCheck size={20} color="#2563eb" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                  {editingRecord ? 'Edit Attendance & Absent Payment' : 'Mark Driver Attendance / Absent Replacement'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.25rem' }}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="grid-2">
                  <div className="input-group">
                    <label className="input-label">Select Driver</label>
                    <select
                      className="select-control"
                      value={formData.driverId}
                      onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                      required
                    >
                      {drivers.map(d => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.assignedVehicleType} - {d.routeName.slice(0, 25)}...)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Attendance Date</label>
                    <input 
                      type="date"
                      className="input-control"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Status Toggle Buttons */}
                <div className="input-group">
                  <label className="input-label">Attendance Status</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, status: 'Present', isAdhocReplacement: false, absenceReason: '' })}
                      style={{
                        padding: '0.85rem',
                        borderRadius: '12px',
                        border: formData.status === 'Present' ? '2px solid #059669' : '1px solid #e2e8f0',
                        background: formData.status === 'Present' ? '#ecfdf5' : '#f8fafc',
                        color: formData.status === 'Present' ? '#047857' : '#64748b',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <UserCheck size={18} /> Present (Regular Duty)
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, status: 'Absent', loginTime: '--:--', logoutTime: '--:--' })}
                      style={{
                        padding: '0.85rem',
                        borderRadius: '12px',
                        border: formData.status === 'Absent' ? '2px solid #dc2626' : '1px solid #e2e8f0',
                        background: formData.status === 'Absent' ? '#fef2f2' : '#f8fafc',
                        color: formData.status === 'Absent' ? '#b91c1c' : '#64748b',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <UserX size={18} /> Absent / Leave
                    </button>
                  </div>
                </div>

                {/* If Present: Login & Logout times */}
                {formData.status === 'Present' && (
                  <div className="grid-2">
                    <div className="input-group">
                      <label className="input-label">Shift Login Time (Kab Login Hua)</label>
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
                      <label className="input-label">Shift Logout Time (Kab Logout Hua)</label>
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
                )}

                {/* If Absent: TEXT FIELD FOR ABSENCE REASON & SUPERVISOR PAYMENT INPUT */}
                {formData.status === 'Absent' && (
                  <div style={{
                    background: '#fff7ed',
                    border: '1px solid #fed7aa',
                    borderRadius: '14px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c2410c', fontWeight: 800 }}>
                      <AlertCircle size={18} />
                      <span>Driver Absent Handling & Supervisor Payment Input</span>
                    </div>

                    <div className="input-group">
                      <label className="input-label" style={{ color: '#9a3412' }}>
                        Reason for Absence (Text Type Field) *
                      </label>
                      <textarea
                        rows={2}
                        className="textarea-control"
                        placeholder="Driver absent hone ki wajah (e.g. Medical emergency fever, family leave, vehicle breakdown)..."
                        value={formData.absenceReason}
                        onChange={(e) => setFormData({ ...formData, absenceReason: e.target.value })}
                        required
                        style={{ borderColor: '#fed7aa' }}
                      />
                    </div>

                    {/* Ad-hoc Option Toggle */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#ffffff',
                      padding: '0.85rem 1rem',
                      borderRadius: '10px',
                      border: '1px solid #fed7aa'
                    }}>
                      <div>
                        <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>
                          Did you dispatch an Ad-hoc / External Replacement Cab?
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          (Bahar se cab bhejte samjho uske kitne paise hore bolke)
                        </div>
                      </div>

                      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.5rem' }}>
                        <input
                          type="checkbox"
                          checked={formData.isAdhocReplacement}
                          onChange={(e) => setFormData({
                            ...formData,
                            isAdhocReplacement: e.target.checked
                          })}
                          style={{ width: '20px', height: '20px', accentColor: '#ea580c' }}
                        />
                        <span style={{ fontWeight: 800, color: formData.isAdhocReplacement ? '#c2410c' : '#64748b' }}>
                          {formData.isAdhocReplacement ? 'YES (Active)' : 'NO'}
                        </span>
                      </label>
                    </div>

                    {/* If Ad-hoc Option: DIRECT SUPERVISOR PAYMENT INPUT */}
                    {formData.isAdhocReplacement && (
                      <div style={{
                        background: '#ffffff',
                        border: '1px solid #fdba74',
                        borderRadius: '12px',
                        padding: '1.15rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                      }}>
                        <div className="grid-2">
                          <div className="input-group">
                            <label className="input-label" style={{ color: '#c2410c', fontWeight: 800 }}>
                              Payment Input / Cost (Kitne Paise Hore) (₹) *
                            </label>
                            <input 
                              type="number"
                              placeholder="e.g. 1850"
                              className="input-control"
                              style={{ borderColor: '#ea580c', color: '#c2410c', fontWeight: 800, fontSize: '1.1rem' }}
                              value={formData.adhocDetails.costAmount}
                              onChange={(e) => setFormData({
                                ...formData,
                                adhocDetails: { ...formData.adhocDetails, costAmount: e.target.value }
                              })}
                              required
                            />
                          </div>

                          <div className="input-group">
                            <label className="input-label">Payment Mode / Type</label>
                            <select
                              className="select-control"
                              value={formData.adhocDetails.paymentType}
                              onChange={(e) => setFormData({
                                ...formData,
                                adhocDetails: { ...formData.adhocDetails, paymentType: e.target.value }
                              })}
                            >
                              <option value="Online / UPI">Online / UPI (GooglePay / PhonePe)</option>
                              <option value="Cash">Cash Handover</option>
                              <option value="Vendor Account">Vendor Monthly Ledger</option>
                              <option value="Direct Client Billable">Direct Client Billable</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid-2">
                          <div className="input-group">
                            <label className="input-label">Outsourced Vendor / Agency</label>
                            <input 
                              type="text"
                              placeholder="e.g. Sri Balaji Travels / Outsourced Cab"
                              className="input-control"
                              value={formData.adhocDetails.vendorName}
                              onChange={(e) => setFormData({
                                ...formData,
                                adhocDetails: { ...formData.adhocDetails, vendorName: e.target.value }
                              })}
                              required
                            />
                          </div>

                          <div className="input-group">
                            <label className="input-label">Replacement Cab Type</label>
                            <select
                              className="select-control"
                              value={formData.adhocDetails.cabType}
                              onChange={(e) => setFormData({
                                ...formData,
                                adhocDetails: { ...formData.adhocDetails, cabType: e.target.value }
                              })}
                            >
                              <option value="Sedan">Sedan (Dzire / Etios)</option>
                              <option value="SUV">SUV (Innova / Ertiga / Scorpio)</option>
                              <option value="Van">Van / Traveller</option>
                              <option value="Hatchback">Hatchback (WagonR / Tiago)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle2 size={16} /> Save Attendance Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

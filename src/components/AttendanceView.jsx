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
  Calendar as CalendarIcon, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Edit2, 
  Trash2, 
  Download, 
  Zap, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle,
  BadgeCheck
} from 'lucide-react';

export default function AttendanceView() {
  const { 
    attendance, 
    saveAttendanceRecord, 
    deleteAttendanceRecord, 
    quickSettleAbsentPayment,
    drivers, 
    companies,
    currentUser
  } = useFleet();

  const [viewMode, setViewMode] = useState('weekly_grid'); // 'weekly_grid' or 'list_view'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWeekOffset, setSelectedWeekOffset] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // Quick Settle Payment Modal State
  const [quickPayRecord, setQuickPayRecord] = useState(null);
  const [quickPayAmount, setQuickPayAmount] = useState('');
  const [quickPayVendor, setQuickPayVendor] = useState('');
  const [quickPayMode, setQuickPayMode] = useState('Online / UPI');
  const [quickPayTime, setQuickPayTime] = useState('');

  // Main Form State
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
      paymentStatus: 'PAID',
      paidAtTime: '08:30 AM',
      paidAtDate: '02 Oct 2026'
    }
  });

  // Generate 7 days of the currently selected week
  const getWeekDates = (offset = 0) => {
    const baseDate = new Date(2026, 9, 2); // Oct 2, 2026 (Friday)
    baseDate.setDate(baseDate.getDate() + (offset * 7));

    const monday = new Date(baseDate);
    const dayOfWeek = monday.getDay();
    const distanceToMonday = (dayOfWeek + 6) % 7;
    monday.setDate(monday.getDate() - distanceToMonday);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const isoStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      weekDays.push({ date: isoStr, dayName, formattedDate, fullDate: d });
    }
    return weekDays;
  };

  const currentWeekDates = getWeekDates(selectedWeekOffset);
  const weekStartStr = currentWeekDates[0].formattedDate;
  const weekEndStr = currentWeekDates[6].formattedDate;

  const getRecord = (driverId, dateStr) => {
    return attendance.find(a => a.driverId === driverId && a.date === dateStr);
  };

  const handleCellClick = (driver, dateObj) => {
    const existing = getRecord(driver.id, dateObj.date);
    if (existing) {
      handleOpenModal(existing);
    } else {
      setEditingRecord(null);
      const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const nowDate = new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });

      setFormData({
        date: dateObj.date,
        day: dateObj.fullDate.toLocaleDateString('en-US', { weekday: 'long' }),
        driverId: driver.id,
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
          paymentStatus: 'PAID',
          paidAtTime: nowTime,
          paidAtDate: nowDate
        }
      });
      setShowModal(true);
    }
  };

  const handleOpenModal = (record = null) => {
    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const nowDate = new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });

    if (record) {
      setEditingRecord(record);
      setFormData({
        id: record.id,
        date: record.date,
        day: record.day,
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
          paymentStatus: record.adhocDetails?.paymentStatus || 'PAID',
          paidAtTime: record.adhocDetails?.paidAtTime || nowTime,
          paidAtDate: record.adhocDetails?.paidAtDate || nowDate
        }
      });
    } else {
      setEditingRecord(null);
      const defaultDrv = drivers[0];
      setFormData({
        date: '2026-10-02',
        day: 'Friday',
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
          paymentStatus: 'PAID',
          paidAtTime: nowTime,
          paidAtDate: nowDate
        }
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedDriver = drivers.find(d => d.id === formData.driverId);
    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const nowDate = new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });

    const recordToSave = {
      ...formData,
      driverName: selectedDriver ? selectedDriver.name : 'Unknown Driver',
      vehicleType: selectedDriver ? selectedDriver.assignedVehicleType : 'Sedan',
      companyId: selectedDriver ? selectedDriver.assignedCompanyId : 'COMP-101',
      routeName: selectedDriver ? selectedDriver.routeName : 'Default Route',
      adhocDetails: {
        ...formData.adhocDetails,
        costAmount: Number(formData.adhocDetails.costAmount) || 0,
        paidAtTime: formData.adhocDetails.paidAtTime || nowTime,
        paidAtDate: formData.adhocDetails.paidAtDate || nowDate,
        paymentStatus: 'PAID' // Stamped as PAID for ad-hoc driver
      }
    };

    saveAttendanceRecord(recordToSave);
    setShowModal(false);
  };

  const handleOpenQuickPay = (record) => {
    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setQuickPayRecord(record);
    setQuickPayAmount(record.adhocDetails?.costAmount || '1850');
    setQuickPayVendor(record.adhocDetails?.vendorName || 'Outsourced Ad-hoc Cab');
    setQuickPayTime(nowTime);
  };

  const handleQuickPaySubmit = (e) => {
    e.preventDefault();
    if (!quickPayRecord) return;
    quickSettleAbsentPayment(quickPayRecord.id, quickPayAmount, quickPayVendor, quickPayMode, quickPayTime);
    setQuickPayRecord(null);
    setQuickPayAmount('');
    setQuickPayVendor('');
  };

  const handleMarkAllPresentToday = () => {
    const todayStr = '2026-10-02';
    drivers.forEach(drv => {
      const exists = getRecord(drv.id, todayStr);
      if (!exists) {
        saveAttendanceRecord({
          date: todayStr,
          day: 'Friday',
          driverId: drv.id,
          driverName: drv.name,
          vehicleType: drv.assignedVehicleType || 'Sedan',
          companyId: drv.assignedCompanyId || 'COMP-101',
          routeName: drv.routeName || 'Assigned Route',
          status: 'Present',
          loginTime: '06:00 AM',
          logoutTime: '02:30 PM',
          absenceReason: '',
          isAdhocReplacement: false,
          adhocDetails: { vendorName: '', cabRegNo: '', cabType: '', costAmount: 0, paymentType: 'None', paymentStatus: 'None' }
        });
      }
    });
  };

  const filteredDrivers = drivers.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.routeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAdhocExpenseAll = attendance
    .filter(a => a.isAdhocReplacement)
    .reduce((acc, curr) => acc + (Number(curr.adhocDetails?.costAmount) || 0), 0);

  const pendingAdhocPayouts = attendance
    .filter(a => a.isAdhocReplacement && a.adhocDetails?.paymentStatus === 'Pending');

  const pendingAmountTotal = pendingAdhocPayouts
    .reduce((acc, curr) => acc + (Number(curr.adhocDetails?.costAmount) || 0), 0);

  const exportCSV = () => {
    const headers = ['Date', 'Day', 'Regular Driver Status', 'Driver Name', 'Assigned Route', 'Absence Reason', 'Adhoc Replacement Sent', 'Adhoc Driver Payment Status', 'Payment Amount (INR)', 'Payment Timestamp', 'Payment Mode', 'Vendor Name'];
    const rows = attendance.map(a => [
      a.date,
      a.day,
      a.status,
      `"${a.driverName}"`,
      `"${a.routeName}"`,
      `"${a.absenceReason || 'Regular Duty'}"`,
      a.isAdhocReplacement ? 'YES' : 'NO',
      a.isAdhocReplacement ? 'PAID TO AD-HOC DRIVER' : 'N/A',
      a.adhocDetails?.costAmount || 0,
      `"${a.adhocDetails?.paidAtTime || 'N/A'}, ${a.adhocDetails?.paidAtDate || ''}"`,
      a.adhocDetails?.paymentType || 'N/A',
      `"${a.adhocDetails?.vendorName || 'N/A'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Fleet_Attendance_Payment_Audit_${currentUser.supervisorId || 'admin'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ClipboardCheck size={26} color="#059669" />
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>
              Weekly Attendance & Ad-hoc Driver Payment Settlement
            </h1>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Regular driver absent hone par replacement cab ka payment time-stamp ke sath <strong>"PAID"</strong> mark karein.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={exportCSV} className="btn btn-secondary btn-sm">
            <Download size={15} /> Export Audit CSV
          </button>
          <button onClick={handleMarkAllPresentToday} className="btn btn-secondary btn-sm">
            <CheckCircle2 size={15} color="#059669" /> Mark All Present Today
          </button>
          <button onClick={() => handleOpenModal()} className="btn btn-primary btn-sm">
            <Plus size={15} /> Mark Entry
          </button>
        </div>
      </div>

      {/* Payment Summary Bar */}
      <div className="grid-3" style={{ gap: '0.75rem' }}>
        <div className="glass-panel" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #059669' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>TOTAL AD-HOC PAYMENTS SETTLED</span>
            <DollarSign size={18} color="#059669" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.25rem', color: '#047857' }}>
            ₹{totalAdhocExpenseAll.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.15rem' }}>
            Stamped with exact payment time & mode
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1rem 1.25rem', borderLeft: `4px solid ${pendingAmountTotal > 0 ? '#ea580c' : '#059669'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>PENDING SETTLEMENTS</span>
            <AlertTriangle size={18} color={pendingAmountTotal > 0 ? '#ea580c' : '#059669'} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.25rem', color: pendingAmountTotal > 0 ? '#c2410c' : '#047857' }}>
            ₹{pendingAmountTotal.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.15rem' }}>
            {pendingAdhocPayouts.length > 0 ? `⚠️ ${pendingAdhocPayouts.length} payout pending` : '✓ 100% Ad-hoc payments settled'}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #0284c7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>ACTIVE DRIVER ROSTER</span>
            <UserCheck size={18} color="#0284c7" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.25rem', color: '#0369a1' }}>
            {drivers.length} Drivers
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.15rem' }}>
            Under {currentUser.name}
          </div>
        </div>
      </div>

      {/* Week Navigator Bar */}
      <div className="glass-panel" style={{ padding: '0.85rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '280px' }}>
          <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text"
            placeholder="Search driver name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-control"
            style={{ paddingLeft: '2.25rem', fontSize: '0.85rem', padding: '0.45rem 0.5rem 0.45rem 2.25rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.25rem 0.5rem', borderRadius: '10px' }}>
          <button 
            onClick={() => setSelectedWeekOffset(prev => prev - 1)}
            className="btn btn-secondary btn-sm btn-icon"
          >
            <ChevronLeft size={15} />
          </button>
          <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.825rem', padding: '0 0.35rem' }}>
            {weekStartStr} - {weekEndStr}
          </span>
          <button 
            onClick={() => setSelectedWeekOffset(prev => prev + 1)}
            className="btn btn-secondary btn-sm btn-icon"
          >
            <ChevronRight size={15} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button 
            onClick={() => setViewMode('weekly_grid')}
            className={`btn btn-sm ${viewMode === 'weekly_grid' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.785rem' }}
          >
            📅 Weekly Calendar Matrix
          </button>
          <button 
            onClick={() => setViewMode('list_view')}
            className={`btn btn-sm ${viewMode === 'list_view' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.785rem' }}
          >
            📋 Audit Table
          </button>
        </div>
      </div>

      {/* 1. WEEKLY CALENDAR MATRIX (Optimized with Horizontal Scroll for Mobile) */}
      {viewMode === 'weekly_grid' && (
        <div className="table-container" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table className="custom-table" style={{ minWidth: '950px' }}>
            <thead>
              <tr>
                <th style={{ width: '200px', background: '#f1f5f9' }}>Driver & Route</th>
                {currentWeekDates.map(day => (
                  <th key={day.date} style={{ textAlign: 'center', background: day.date === '2026-10-02' ? '#ecfdf5' : '#f8fafc' }}>
                    <div style={{ fontSize: '0.785rem', fontWeight: 800, color: day.date === '2026-10-02' ? '#047857' : '#0f172a' }}>
                      {day.dayName}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: day.date === '2026-10-02' ? '#059669' : '#64748b' }}>
                      {day.formattedDate}
                    </div>
                  </th>
                ))}
                <th style={{ textAlign: 'center', width: '120px', background: '#f1f5f9' }}>Ad-hoc Paid (₹)</th>
              </tr>
            </thead>
            <tbody>
              {filteredDrivers.map(drv => {
                let driverWeeklyCost = 0;

                return (
                  <tr key={drv.id}>
                    {/* Driver Column */}
                    <td style={{ background: '#fcfdfd' }}>
                      <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>{drv.name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.1rem' }}>
                        {drv.routeName.slice(0, 22)}...
                      </div>
                      <span className={`badge ${drv.assignedVehicleType === 'SUV' ? 'badge-suv' : 'badge-sedan'}`} style={{ fontSize: '0.65rem', marginTop: '0.2rem' }}>
                        {drv.assignedVehicleType}
                      </span>
                    </td>

                    {/* 7 Days Cells */}
                    {currentWeekDates.map(day => {
                      const rec = getRecord(drv.id, day.date);
                      if (rec?.isAdhocReplacement && rec.adhocDetails?.costAmount) {
                        driverWeeklyCost += Number(rec.adhocDetails.costAmount);
                      }

                      return (
                        <td 
                          key={day.date}
                          onClick={() => handleCellClick(drv, day)}
                          style={{
                            textAlign: 'center',
                            cursor: 'pointer',
                            padding: '0.55rem 0.35rem',
                            borderRight: '1px solid #f1f5f9'
                          }}
                        >
                          {!rec ? (
                            <div style={{
                              padding: '0.4rem',
                              borderRadius: '8px',
                              border: '1px dashed #cbd5e1',
                              color: '#94a3b8',
                              fontSize: '0.7rem',
                              fontWeight: 600
                            }}>
                              + Mark
                            </div>
                          ) : rec.status === 'Present' ? (
                            <div style={{
                              background: '#ecfdf5',
                              border: '1px solid #a7f3d0',
                              borderRadius: '8px',
                              padding: '0.35rem 0.25rem'
                            }}>
                              <div style={{ fontWeight: 800, color: '#047857', fontSize: '0.75rem' }}>
                                ✓ Present
                              </div>
                              <div style={{ fontSize: '0.65rem', color: '#059669' }}>
                                {rec.loginTime?.split(' ')[0] || '06:00'} - {rec.logoutTime?.split(' ')[0] || '14:30'}
                              </div>
                            </div>
                          ) : (
                            /* DRIVER ABSENT + AD-HOC DRIVER PAID WITH TIME */
                            <div style={{
                              background: '#fff7ed',
                              border: '1px solid #fed7aa',
                              borderRadius: '8px',
                              padding: '0.35rem 0.25rem',
                              boxShadow: '0 2px 6px rgba(234, 88, 12, 0.1)'
                            }}>
                              {/* Regular Driver Status */}
                              <div style={{ fontWeight: 800, color: '#b91c1c', fontSize: '0.725rem' }}>
                                🔴 ABSENT
                              </div>

                              {/* Adhoc Payment Tag */}
                              {rec.isAdhocReplacement ? (
                                <div style={{ marginTop: '0.2rem', paddingTop: '0.2rem', borderTop: '1px solid #fed7aa' }}>
                                  <div style={{ fontSize: '0.785rem', fontWeight: 800, color: '#c2410c' }}>
                                    ₹{rec.adhocDetails?.costAmount}
                                  </div>
                                  <div style={{
                                    fontSize: '0.65rem',
                                    color: '#15803d',
                                    fontWeight: 800,
                                    background: '#f0fdf4',
                                    padding: '0.05rem 0.25rem',
                                    borderRadius: '4px',
                                    display: 'inline-block',
                                    marginTop: '0.1rem',
                                    border: '1px solid #bbf7d0'
                                  }}>
                                    PAID {rec.adhocDetails?.paidAtTime ? `@ ${rec.adhocDetails.paidAtTime}` : ''}
                                  </div>
                                </div>
                              ) : (
                                <div style={{ fontSize: '0.65rem', color: '#ea580c', fontWeight: 700 }}>
                                  No Cab
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      );
                    })}

                    {/* Weekly Total */}
                    <td style={{ textAlign: 'center', background: '#fcfdfd' }}>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: driverWeeklyCost > 0 ? '#c2410c' : '#0f172a' }}>
                        ₹{driverWeeklyCost.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Ad-hoc Paid</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 2. AUDIT LIST VIEW TABLE */}
      {viewMode === 'list_view' && (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Driver & Route</th>
                <th>Driver Status</th>
                <th>Absence Reason</th>
                <th>Ad-hoc Replacement</th>
                <th>Ad-hoc Driver Payment</th>
                <th>Payment Time Stamp</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map(rec => (
                <tr key={rec.id} style={{ background: rec.isAdhocReplacement ? '#fffbeb' : undefined }}>
                  <td>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>{rec.date}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{rec.day}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>{rec.driverName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{rec.routeName}</div>
                  </td>
                  <td>
                    <span className={`badge ${rec.status === 'Present' ? 'badge-present' : 'badge-absent'}`}>
                      {rec.status === 'Present' ? '✓ Present' : '🔴 ABSENT'}
                    </span>
                  </td>
                  <td style={{ maxWidth: '180px', fontSize: '0.8rem' }}>
                    {rec.absenceReason || <span style={{ color: '#94a3b8' }}>Regular Duty</span>}
                  </td>
                  <td>
                    {rec.isAdhocReplacement ? (
                      <div>
                        <span className="badge badge-adhoc">🚨 Outsourced Cab</span>
                        <div style={{ fontSize: '0.785rem', fontWeight: 700, color: '#0f172a', marginTop: '0.15rem' }}>
                          {rec.adhocDetails?.vendorName} ({rec.adhocDetails?.cabType || 'Sedan'})
                        </div>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.785rem', color: '#94a3b8' }}>None</span>
                    )}
                  </td>
                  <td>
                    {rec.isAdhocReplacement ? (
                      <div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#c2410c' }}>
                          ₹{Number(rec.adhocDetails?.costAmount || 0).toLocaleString()}
                        </div>
                        <span className="badge badge-paid" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>
                          ✓ PAID TO AD-HOC DRIVER
                        </span>
                      </div>
                    ) : rec.status === 'Absent' ? (
                      <button onClick={() => handleOpenQuickPay(rec)} className="btn btn-warning btn-sm" style={{ fontSize: '0.75rem' }}>
                        <Zap size={13} /> Pay Ad-hoc Driver
                      </button>
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>₹0.00</span>
                    )}
                  </td>
                  <td>
                    {rec.isAdhocReplacement ? (
                      <div style={{ fontSize: '0.785rem', color: '#047857', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={13} /> {rec.adhocDetails?.paidAtTime || '08:30 AM'} ({rec.adhocDetails?.paymentType || 'UPI'})
                      </div>
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>—</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={() => handleOpenModal(rec)} className="btn btn-secondary btn-sm btn-icon">
                      <Edit2 size={14} color="#059669" />
                    </button>
                    <button onClick={() => { if (window.confirm('Delete record?')) deleteAttendanceRecord(rec.id); }} className="btn btn-secondary btn-sm btn-icon" style={{ marginLeft: '0.3rem' }}>
                      <Trash2 size={14} color="#dc2626" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* QUICK SETTLE AD-HOC PAYMENT MODAL */}
      {quickPayRecord && (
        <div className="modal-overlay" onClick={() => setQuickPayRecord(null)}>
          <div className="modal-content" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <DollarSign size={20} color="#c2410c" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  Pay & Settle Ad-hoc Replacement Cab
                </h3>
              </div>
              <button onClick={() => setQuickPayRecord(null)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.25rem' }}>✕</button>
            </div>

            <form onSubmit={handleQuickPaySubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '0.75rem', borderRadius: '10px' }}>
                  <div style={{ fontWeight: 800, color: '#991b1b', fontSize: '0.9rem' }}>
                    Regular Driver: {quickPayRecord.driverName} (🔴 ABSENT)
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#b91c1c', marginTop: '0.15rem' }}>
                    Reason: {quickPayRecord.absenceReason || 'Medical / Emergency Leave'}
                  </div>
                </div>

                <div className="grid-2">
                  <div className="input-group">
                    <label className="input-label" style={{ color: '#c2410c' }}>Payment Amount (₹) *</label>
                    <input 
                      type="number"
                      placeholder="e.g. 1850"
                      className="input-control"
                      style={{ borderColor: '#ea580c', color: '#c2410c', fontWeight: 800, fontSize: '1.1rem' }}
                      value={quickPayAmount}
                      onChange={(e) => setQuickPayAmount(e.target.value)}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label" style={{ color: '#059669' }}>Payment Time (Timestamp) *</label>
                    <input 
                      type="text"
                      placeholder="e.g. 08:35 AM"
                      className="input-control"
                      value={quickPayTime}
                      onChange={(e) => setQuickPayTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Outsourced Vendor / Ad-hoc Driver Name</label>
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
                    <option value="Online / UPI (GooglePay/PhonePe)">Online / UPI (GooglePay / PhonePe)</option>
                    <option value="Cash Handover">Cash Handover</option>
                    <option value="Vendor Ledger Account">Vendor Monthly Ledger</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setQuickPayRecord(null)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-warning">
                  <CheckCircle2 size={16} /> Mark Ad-hoc Driver as PAID
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Add/Edit Attendance & Payment Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ClipboardCheck size={20} color="#059669" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                  {editingRecord ? 'Edit Attendance & Ad-hoc Payment' : 'Mark Driver Attendance & Settlement'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.25rem' }}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
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
                          {d.name} ({d.assignedVehicleType} - {d.routeName.slice(0, 22)}...)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Date</label>
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
                      <UserX size={18} /> 🔴 Absent / Leave
                    </button>
                  </div>
                </div>

                {/* If Present: Login & Logout times */}
                {formData.status === 'Present' && (
                  <div className="grid-2">
                    <div className="input-group">
                      <label className="input-label">Login Time</label>
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
                      <label className="input-label">Logout Time</label>
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

                {/* If Absent: TEXT FIELD & TIMESTAMPED AD-HOC DRIVER PAYMENT */}
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
                      <span>Regular Driver Absent Handling & Ad-hoc Driver Payment</span>
                    </div>

                    <div className="input-group">
                      <label className="input-label" style={{ color: '#9a3412' }}>
                        Reason for Regular Driver Absence *
                      </label>
                      <textarea
                        rows={2}
                        className="textarea-control"
                        placeholder="Reason (e.g. Medical emergency fever, family leave, breakdown)..."
                        value={formData.absenceReason}
                        onChange={(e) => setFormData({ ...formData, absenceReason: e.target.value })}
                        required
                        style={{ borderColor: '#fed7aa' }}
                      />
                    </div>

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
                          Did you dispatch an Ad-hoc Replacement Cab?
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          (Ad-hoc driver ko payment karke timestamp save karein)
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

                    {/* AD-HOC DRIVER PAYMENT FIELDS */}
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
                              Payment Amount (₹) *
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
                            <label className="input-label" style={{ color: '#059669', fontWeight: 800 }}>
                              Payment Time (Kya Time Pe Payment Kare) *
                            </label>
                            <input 
                              type="text"
                              placeholder="e.g. 08:35 AM"
                              className="input-control"
                              value={formData.adhocDetails.paidAtTime}
                              onChange={(e) => setFormData({
                                ...formData,
                                adhocDetails: { ...formData.adhocDetails, paidAtTime: e.target.value }
                              })}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid-2">
                          <div className="input-group">
                            <label className="input-label">Payment Mode</label>
                            <select
                              className="select-control"
                              value={formData.adhocDetails.paymentType}
                              onChange={(e) => setFormData({
                                ...formData,
                                adhocDetails: { ...formData.adhocDetails, paymentType: e.target.value }
                              })}
                            >
                              <option value="Online / UPI">Online / UPI (GooglePay / PhonePe)</option>
                              <option value="Cash Handover">Cash Handover</option>
                              <option value="Vendor Account">Vendor Monthly Ledger</option>
                            </select>
                          </div>

                          <div className="input-group">
                            <label className="input-label">Outsourced Vendor / Cab Name</label>
                            <input 
                              type="text"
                              placeholder="e.g. Sri Balaji Travels"
                              className="input-control"
                              value={formData.adhocDetails.vendorName}
                              onChange={(e) => setFormData({
                                ...formData,
                                adhocDetails: { ...formData.adhocDetails, vendorName: e.target.value }
                              })}
                              required
                            />
                          </div>
                        </div>

                        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.6rem 0.85rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#15803d', fontWeight: 700 }}>
                          <CheckCircle2 size={16} />
                          <span>Ad-hoc Driver will be stamped as: <strong>PAID</strong> with exact timestamp.</span>
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

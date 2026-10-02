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
  Receipt,
  FileSpreadsheet,
  AlertTriangle,
  ArrowRight
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
  const [selectedWeekOffset, setSelectedWeekOffset] = useState(0); // 0 = current week
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // Quick Settle Modal
  const [quickPayRecord, setQuickPayRecord] = useState(null);
  const [quickPayAmount, setQuickPayAmount] = useState('');
  const [quickPayVendor, setQuickPayVendor] = useState('');
  const [quickPayMode, setQuickPayMode] = useState('Online / UPI');

  // Attendance Form
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

  // Generate 7 days of the currently selected week (Oct 2026 reference week)
  const getWeekDates = (offset = 0) => {
    // Base Friday: 2026-10-02
    const baseDate = new Date(2026, 9, 2); // Oct 2, 2026 (Friday)
    baseDate.setDate(baseDate.getDate() + (offset * 7));

    // Find Monday of this week (subtract 4 days from Friday)
    const monday = new Date(baseDate);
    const dayOfWeek = monday.getDay(); // 5 = Friday
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

  // Helper to find attendance record for a specific driver and date
  const getRecord = (driverId, dateStr) => {
    return attendance.find(a => a.driverId === driverId && a.date === dateStr);
  };

  // Open modal with pre-selected driver & date
  const handleCellClick = (driver, dateObj) => {
    const existing = getRecord(driver.id, dateObj.date);
    if (existing) {
      handleOpenModal(existing);
    } else {
      setEditingRecord(null);
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
          paymentStatus: 'Paid'
        }
      });
      setShowModal(true);
    }
  };

  const handleOpenModal = (record = null) => {
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
          paymentStatus: record.adhocDetails?.paymentStatus || 'Paid'
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
          paymentStatus: 'Paid'
        }
      });
    }
    setShowModal(true);
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

  // Quick 1-Click "Mark All Drivers Present for Today"
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

  // Filter drivers for the calendar table
  const filteredDrivers = drivers.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.routeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Financial calculations to prevent missed payments
  const totalAdhocExpenseAll = attendance
    .filter(a => a.isAdhocReplacement)
    .reduce((acc, curr) => acc + (Number(curr.adhocDetails?.costAmount) || 0), 0);

  const pendingAdhocPayouts = attendance
    .filter(a => a.isAdhocReplacement && a.adhocDetails?.paymentStatus === 'Pending');

  const pendingAmountTotal = pendingAdhocPayouts
    .reduce((acc, curr) => acc + (Number(curr.adhocDetails?.costAmount) || 0), 0);

  const exportCSV = () => {
    const headers = ['Date', 'Day', 'Driver Name', 'Route', 'Status', 'Login Time', 'Logout Time', 'Absence Reason', 'Is Adhoc Replacement', 'Vendor Name', 'Adhoc Payment Amount (INR)', 'Payment Status', 'Payment Mode'];
    const rows = attendance.map(a => [
      a.date,
      a.day,
      `"${a.driverName}"`,
      `"${a.routeName}"`,
      a.status,
      a.loginTime || 'N/A',
      a.logoutTime || 'N/A',
      `"${a.absenceReason || 'Regular Duty'}"`,
      a.isAdhocReplacement ? 'YES' : 'NO',
      `"${a.adhocDetails?.vendorName || 'N/A'}"`,
      a.adhocDetails?.costAmount || 0,
      a.adhocDetails?.paymentStatus || 'N/A',
      a.adhocDetails?.paymentType || 'N/A'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Fleet_Monthly_Attendance_Payment_Audit_${currentUser.supervisorId || 'admin'}.csv`);
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
            <ClipboardCheck size={28} color="#059669" />
            <h1 style={{ fontSize: '1.55rem', fontWeight: 800, color: '#0f172a' }}>
              Weekly Attendance & Monthly Payment Audit Calendar
            </h1>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Visual weekly calendar grid: Click any date to mark Present/Absent, log external replacement cabs, and ensure <strong>zero missed payments</strong> for monthly client billing.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button onClick={exportCSV} className="btn btn-secondary">
            <Download size={16} /> Export Monthly Audit CSV
          </button>
          <button onClick={handleMarkAllPresentToday} className="btn btn-secondary" title="Auto mark all drivers present for today">
            <CheckCircle2 size={16} color="#059669" /> Mark All Present Today
          </button>
          <button onClick={() => handleOpenModal()} className="btn btn-primary">
            <Plus size={16} /> Mark Entry
          </button>
        </div>
      </div>

      {/* Payment Security & Audit Bar (Prevents missed payments) */}
      <div className="grid-3">
        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #059669' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.785rem', color: '#64748b', fontWeight: 700 }}>TOTAL AD-HOC REPLACEMENT PAYMENTS</span>
            <DollarSign size={20} color="#059669" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.35rem', color: '#047857' }}>
            ₹{totalAdhocExpenseAll.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
            Tracked across {attendance.filter(a => a.isAdhocReplacement).length} replacement trips
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: `4px solid ${pendingAmountTotal > 0 ? '#ea580c' : '#059669'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.785rem', color: '#64748b', fontWeight: 700 }}>PENDING / UNSETTLED PAYMENTS</span>
            <AlertTriangle size={20} color={pendingAmountTotal > 0 ? '#ea580c' : '#059669'} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.35rem', color: pendingAmountTotal > 0 ? '#c2410c' : '#047857' }}>
            ₹{pendingAmountTotal.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
            {pendingAdhocPayouts.length > 0 ? `⚠️ ${pendingAdhocPayouts.length} payment requires supervisor settlement` : '✓ All payments settled'}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #0284c7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.785rem', color: '#64748b', fontWeight: 700 }}>ACTIVE DRIVER ROSTER</span>
            <UserCheck size={20} color="#0284c7" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.35rem', color: '#0369a1' }}>
            {drivers.length} Drivers
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
            Assigned to {companies.length} corporate clients
          </div>
        </div>
      </div>

      {/* Week Navigator & View Controls */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Search */}
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text"
            placeholder="Search driver name, route..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-control"
            style={{ paddingLeft: '2.25rem' }}
          />
        </div>

        {/* Week Navigator Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.35rem 0.65rem', borderRadius: '12px' }}>
          <button 
            onClick={() => setSelectedWeekOffset(prev => prev - 1)}
            className="btn btn-secondary btn-sm btn-icon"
            title="Previous Week"
          >
            <ChevronLeft size={16} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0 0.5rem' }}>
            <CalendarIcon size={16} color="#059669" />
            <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.875rem' }}>
              Week: {weekStartStr} - {weekEndStr}, 2026
            </span>
          </div>

          <button 
            onClick={() => setSelectedWeekOffset(prev => prev + 1)}
            className="btn btn-secondary btn-sm btn-icon"
            title="Next Week"
          >
            <ChevronRight size={16} />
          </button>

          {selectedWeekOffset !== 0 && (
            <button 
              onClick={() => setSelectedWeekOffset(0)}
              className="btn btn-primary btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
            >
              Current Week
            </button>
          )}
        </div>

        {/* View Mode Toggle */}
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <button 
            onClick={() => setViewMode('weekly_grid')}
            className={`btn btn-sm ${viewMode === 'weekly_grid' ? 'btn-primary' : 'btn-secondary'}`}
          >
            📅 Weekly Calendar Matrix
          </button>
          <button 
            onClick={() => setViewMode('list_view')}
            className={`btn btn-sm ${viewMode === 'list_view' ? 'btn-primary' : 'btn-secondary'}`}
          >
            📋 Audit Table View
          </button>
        </div>
      </div>

      {/* 1. WEEKLY CALENDAR MATRIX VIEW (Ultra Intuitive for Supervisors) */}
      {viewMode === 'weekly_grid' && (
        <div className="table-container" style={{ boxShadow: '0 4px 20px rgba(15,23,42,0.06)' }}>
          <table className="custom-table" style={{ minWidth: '1000px' }}>
            <thead>
              <tr>
                <th style={{ width: '220px', background: '#f1f5f9' }}>Driver & Assigned Route</th>
                {currentWeekDates.map(day => (
                  <th key={day.date} style={{ textAlign: 'center', background: day.date === '2026-10-02' ? '#ecfdf5' : '#f8fafc' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: day.date === '2026-10-02' ? '#047857' : '#0f172a' }}>
                      {day.dayName}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: day.date === '2026-10-02' ? '#059669' : '#64748b' }}>
                      {day.formattedDate} {day.date === '2026-10-02' ? '(Today)' : ''}
                    </div>
                  </th>
                ))}
                <th style={{ textAlign: 'center', width: '130px', background: '#f1f5f9' }}>Weekly Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {filteredDrivers.map(drv => {
                // Calculate driver weekly total replacement cost
                let driverWeeklyAdhocCost = 0;
                let presentCount = 0;
                let absentCount = 0;

                currentWeekDates.forEach(day => {
                  const rec = getRecord(drv.id, day.date);
                  if (rec) {
                    if (rec.status === 'Present') presentCount++;
                    if (rec.status === 'Absent') {
                      absentCount++;
                      if (rec.isAdhocReplacement && rec.adhocDetails?.costAmount) {
                        driverWeeklyAdhocCost += Number(rec.adhocDetails.costAmount);
                      }
                    }
                  }
                });

                return (
                  <tr key={drv.id}>
                    {/* Driver Profile */}
                    <td style={{ background: '#fcfdfd' }}>
                      <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.925rem' }}>{drv.name}</div>
                      <div style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '0.15rem' }}>
                        {drv.routeName.slice(0, 24)}...
                      </div>
                      <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.35rem' }}>
                        <span className={`badge ${drv.assignedVehicleType === 'SUV' ? 'badge-suv' : 'badge-sedan'}`} style={{ fontSize: '0.65rem' }}>
                          {drv.assignedVehicleType}
                        </span>
                        <span style={{ fontSize: '0.68rem', color: '#047857', fontWeight: 700 }}>
                          {presentCount}P / {absentCount}A
                        </span>
                      </div>
                    </td>

                    {/* 7 Days Calendar Cells */}
                    {currentWeekDates.map(day => {
                      const rec = getRecord(drv.id, day.date);

                      return (
                        <td 
                          key={day.date}
                          onClick={() => handleCellClick(drv, day)}
                          style={{
                            textAlign: 'center',
                            cursor: 'pointer',
                            padding: '0.65rem 0.4rem',
                            borderRight: '1px solid #f1f5f9',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          {!rec ? (
                            <div style={{
                              padding: '0.45rem',
                              borderRadius: '8px',
                              border: '1px dashed #cbd5e1',
                              color: '#94a3b8',
                              fontSize: '0.72rem',
                              fontWeight: 600
                            }}>
                              + Click to Mark
                            </div>
                          ) : rec.status === 'Present' ? (
                            <div style={{
                              background: '#ecfdf5',
                              border: '1px solid #a7f3d0',
                              borderRadius: '8px',
                              padding: '0.4rem 0.3rem'
                            }}>
                              <div style={{ fontWeight: 800, color: '#047857', fontSize: '0.785rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
                                <UserCheck size={13} /> Present
                              </div>
                              <div style={{ fontSize: '0.68rem', color: '#059669', marginTop: '0.1rem' }}>
                                {rec.loginTime ? rec.loginTime.split(' ')[0] : '06:00'} - {rec.logoutTime ? rec.logoutTime.split(' ')[0] : '14:30'}
                              </div>
                            </div>
                          ) : (
                            <div style={{
                              background: '#fff7ed',
                              border: '1px solid #fed7aa',
                              borderRadius: '8px',
                              padding: '0.4rem 0.3rem',
                              boxShadow: '0 2px 6px rgba(234, 88, 12, 0.12)'
                            }}>
                              <div style={{ fontWeight: 800, color: '#b91c1c', fontSize: '0.785rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
                                <UserX size={13} /> Absent
                              </div>

                              {rec.isAdhocReplacement ? (
                                <div style={{ marginTop: '0.2rem' }}>
                                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#c2410c' }}>
                                    ₹{rec.adhocDetails?.costAmount}
                                  </div>
                                  <div style={{ fontSize: '0.65rem', color: rec.adhocDetails?.paymentStatus === 'Paid' ? '#047857' : '#ea580c', fontWeight: 700 }}>
                                    {rec.adhocDetails?.paymentStatus || 'Paid'}
                                  </div>
                                </div>
                              ) : (
                                <div style={{ fontSize: '0.65rem', color: '#ea580c', fontWeight: 700, marginTop: '0.15rem' }}>
                                  No Cab Sent
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      );
                    })}

                    {/* Weekly Total Amount */}
                    <td style={{ textAlign: 'center', background: '#fcfdfd' }}>
                      <div style={{ fontWeight: 800, fontSize: '1.05rem', color: driverWeeklyAdhocCost > 0 ? '#c2410c' : '#0f172a' }}>
                        ₹{driverWeeklyAdhocCost.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                        Ad-hoc Payouts
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 2. LIST VIEW TABLE */}
      {viewMode === 'list_view' && (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Date & Day</th>
                <th>Driver & Vehicle</th>
                <th>Assigned Route</th>
                <th>Attendance</th>
                <th>Login / Logout</th>
                <th>Absence Reason</th>
                <th>Ad-hoc Replacement Details</th>
                <th>Payment Amount (₹)</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map(rec => (
                <tr key={rec.id} style={{ background: rec.isAdhocReplacement ? '#fffbeb' : undefined }}>
                  <td>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>{rec.date}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{rec.day}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>{rec.driverName}</div>
                    <span className={`badge ${rec.vehicleType === 'SUV' ? 'badge-suv' : 'badge-sedan'}`} style={{ fontSize: '0.68rem', marginTop: '0.2rem' }}>
                      {rec.vehicleType}
                    </span>
                  </td>
                  <td>{rec.routeName}</td>
                  <td>
                    <span className={`badge ${rec.status === 'Present' ? 'badge-present' : 'badge-absent'}`}>
                      {rec.status === 'Present' ? '✓ Present' : '✕ Absent'}
                    </span>
                  </td>
                  <td>{rec.loginTime || '--'} / {rec.logoutTime || '--'}</td>
                  <td>{rec.absenceReason || 'Regular Duty'}</td>
                  <td>
                    {rec.isAdhocReplacement ? (
                      <div>
                        <span className="badge badge-adhoc">🚨 Outsourced Cab</span>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
                          {rec.adhocDetails?.vendorName}
                        </div>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>None</span>
                    )}
                  </td>
                  <td>
                    {rec.isAdhocReplacement ? (
                      <div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#c2410c' }}>
                          ₹{Number(rec.adhocDetails?.costAmount || 0).toLocaleString()}
                        </div>
                        <span className="badge badge-present" style={{ fontSize: '0.65rem' }}>
                          {rec.adhocDetails?.paymentStatus || 'Paid'} ({rec.adhocDetails?.paymentType || 'UPI'})
                        </span>
                      </div>
                    ) : (
                      '₹0.00'
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={() => handleOpenModal(rec)} className="btn btn-secondary btn-sm btn-icon">
                      <Edit2 size={14} color="#059669" />
                    </button>
                    <button 
                      onClick={() => {
                        if (window.confirm('Delete record?')) deleteAttendanceRecord(rec.id);
                      }} 
                      className="btn btn-secondary btn-sm btn-icon"
                      style={{ marginLeft: '0.35rem' }}
                    >
                      <Trash2 size={14} color="#dc2626" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Main Mark Attendance & Payment Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ClipboardCheck size={20} color="#059669" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                  {editingRecord ? 'Edit Attendance & Absent Payment' : 'Mark Driver Attendance & Settlement'}
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
                          {d.name} ({d.assignedVehicleType} - {d.routeName.slice(0, 25)}...)
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
                      <UserX size={18} /> Absent / Leave
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
                      <span>Driver Absent Handling & Replacement Payout</span>
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

                    {/* If Ad-hoc Option: DIRECT PAYMENT INPUT */}
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
                              Payment Amount (Iske Kitne Paise Hore) (₹) *
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

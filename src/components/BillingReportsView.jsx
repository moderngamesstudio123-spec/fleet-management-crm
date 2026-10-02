import React, { useState } from 'react';
import { useFleet } from '../context/FleetContext';
import { 
  Receipt, 
  DollarSign, 
  Printer, 
  Building2, 
  Car, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2,
  Calendar
} from 'lucide-react';

export default function BillingReportsView() {
  const { 
    companies, 
    vehicles, 
    drivers, 
    shifts, 
    attendance, 
    totalAdhocExpense,
    currentUser 
  } = useFleet();

  const [selectedCompanyId, setSelectedCompanyId] = useState(companies[0]?.id || 'COMP-101');
  const [selectedMonth, setSelectedMonth] = useState('October 2026');

  const selectedCompany = companies.find(c => c.id === selectedCompanyId) || companies[0];

  const totalDriverSalaries = drivers.reduce((acc, d) => acc + (Number(d.salaryMonthly) || 0), 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Receipt size={26} color="#2563eb" />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Invoicing, P&L & Ad-hoc Expense Reports</h1>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Monthly client invoice generation, outsourced ad-hoc replacement cab expense audit, and driver payroll summary.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handlePrint} className="btn btn-primary">
            <Printer size={16} /> Print / Save Invoice PDF
          </button>
        </div>
      </div>

      {/* Financial Executive Summary Cards */}
      <div className="grid-3">
        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #ea580c' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.785rem', color: '#64748b', fontWeight: 700 }}>AD-HOC REPLACEMENT PAYOUTS</span>
            <Car size={20} color="#ea580c" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.35rem', color: '#c2410c' }}>
            ₹{totalAdhocExpense.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            Outsourced external cabs expense
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #059669' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.785rem', color: '#64748b', fontWeight: 700 }}>DRIVER PAYROLL ESTIMATE</span>
            <DollarSign size={20} color="#059669" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.35rem', color: '#047857' }}>
            ₹{totalDriverSalaries.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            {drivers.length} Dedicated fleet drivers
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #2563eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.785rem', color: '#64748b', fontWeight: 700 }}>ACTIVE CLIENT CONTRACTS</span>
            <Building2 size={20} color="#2563eb" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.35rem', color: '#1d4ed8' }}>
            {companies.length} Corporate Accounts
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            Under {currentUser.name} zone
          </div>
        </div>
      </div>

      {/* Invoice Generator & Preview */}
      <div className="grid-2" style={{ alignItems: 'flex-start' }}>
        {/* Controls */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
            Generate Client Transport Invoice
          </h2>

          <div className="input-group">
            <label className="input-label">Select Client Company</label>
            <select
              className="select-control"
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
            >
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.id})</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Billing Cycle / Month</label>
            <select
              className="select-control"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="October 2026">October 2026 (Current Cycle)</option>
              <option value="September 2026">September 2026</option>
              <option value="August 2026">August 2026</option>
            </select>
          </div>

          {/* Adhoc replacement deductions */}
          <div style={{
            background: '#fff7ed',
            border: '1px solid #fed7aa',
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#c2410c' }}>
              🚨 Ad-hoc Outsourced Replacement Cabs Audit:
            </div>
            {attendance.filter(a => a.companyId === selectedCompany?.id && a.isAdhocReplacement).length === 0 ? (
              <div style={{ fontSize: '0.785rem', color: '#64748b' }}>
                Zero ad-hoc cab replacements logged for this client.
              </div>
            ) : (
              attendance.filter(a => a.companyId === selectedCompany?.id && a.isAdhocReplacement).map(adhoc => (
                <div key={adhoc.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', borderBottom: '1px solid #fed7aa', paddingBottom: '0.3rem' }}>
                  <span>{adhoc.date}: {adhoc.adhocDetails?.vendorName} ({adhoc.adhocDetails?.cabType})</span>
                  <strong style={{ color: '#c2410c' }}>₹{adhoc.adhocDetails?.costAmount}</strong>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Printable Tax Invoice Card Preview */}
        <div style={{
          background: '#ffffff',
          color: '#0f172a',
          borderRadius: '16px',
          padding: '2rem',
          border: '1px solid #cbd5e1',
          boxShadow: '0 8px 30px rgba(15,23,42,0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          {/* Invoice Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1d4ed8' }}>AMAZE FLEET LOGISTICS</h2>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Tax Invoice & Monthly Transport Statement</p>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>GSTIN: 29AAAAA0000A1Z5 | Zone: {currentUser.hub || 'Bangalore Hub'}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ background: '#dbeafe', color: '#1e40af', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>
                ORIGINAL INVOICE
              </span>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, marginTop: '0.4rem' }}>INV-2026-10-884</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Date: 2026-10-02</div>
            </div>
          </div>

          {/* Billed To */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem' }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>BILLED TO:</span>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>{selectedCompany?.name}</div>
              <div style={{ color: '#475569' }}>{selectedCompany?.address}</div>
              <div style={{ color: '#475569' }}>Attn: {selectedCompany?.contactPerson} ({selectedCompany?.phone})</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>BILLING PERIOD:</span>
              <div style={{ fontWeight: 700 }}>{selectedMonth}</div>
              <div style={{ color: '#059669', fontWeight: 700 }}>Terms: Net 15 Days</div>
            </div>
          </div>

          {/* Line Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem', marginTop: '0.5rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #cbd5e1' }}>
                <th style={{ textAlign: 'left', padding: '0.6rem' }}>Description</th>
                <th style={{ textAlign: 'center', padding: '0.6rem' }}>Cabs Deployed</th>
                <th style={{ textAlign: 'right', padding: '0.6rem' }}>Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.6rem' }}>
                  <strong>Monthly Employee Transport Services</strong>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Daily Shift Pickups & Route Dispatches</div>
                </td>
                <td style={{ textAlign: 'center', padding: '0.6rem' }}>{selectedCompany?.activeCabs || 6} Cabs</td>
                <td style={{ textAlign: 'right', padding: '0.6rem', fontWeight: 800, color: '#0f172a' }}>
                  ₹1,85,000
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.6rem' }}>
                  <strong>GST (IGST / CGST+SGST @ 5%)</strong>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Transport of passengers by road</div>
                </td>
                <td style={{ textAlign: 'center', padding: '0.6rem' }}>5%</td>
                <td style={{ textAlign: 'right', padding: '0.6rem', fontWeight: 800, color: '#0f172a' }}>
                  ₹9,250
                </td>
              </tr>
            </tbody>
          </table>

          {/* Total Box */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <div style={{ width: '240px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b' }}>Subtotal:</span>
                <span style={{ fontWeight: 600 }}>₹1,85,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b' }}>Tax (5%):</span>
                <span style={{ fontWeight: 600 }}>₹9,250</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, borderTop: '2px solid #0f172a', paddingTop: '0.4rem', color: '#1d4ed8' }}>
                <span>TOTAL DUE:</span>
                <span>₹1,94,250</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

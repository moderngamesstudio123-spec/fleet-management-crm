import React, { useState } from 'react';
import { FleetProvider, useFleet } from './context/FleetContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LoginScreen from './components/LoginScreen';
import DashboardView from './components/DashboardView';
import SupervisorsView from './components/SupervisorsView';
import AttendanceView from './components/AttendanceView';
import ShiftsView from './components/ShiftsView';
import CompaniesView from './components/CompaniesView';
import VehiclesView from './components/VehiclesView';
import DriversView from './components/DriversView';
import LiveGpsView from './components/LiveGpsView';
import BillingReportsView from './components/BillingReportsView';

function FleetAppContent() {
  const { currentUser } = useFleet();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If not logged in, display the secure login screen
  if (!currentUser) {
    return <LoginScreen />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView setActiveTab={setActiveTab} />;
      case 'supervisors':
        return <SupervisorsView />;
      case 'attendance':
        return <AttendanceView />;
      case 'shifts':
        return <ShiftsView />;
      case 'companies':
        return <CompaniesView />;
      case 'vehicles':
        return <VehiclesView />;
      case 'drivers':
        return <DriversView />;
      case 'gps':
        return <LiveGpsView />;
      case 'billing':
        return <BillingReportsView />;
      default:
        return <DashboardView setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
        
        <main style={{
          flex: 1,
          padding: '1.25rem',
          maxWidth: '1600px',
          width: '100%',
          margin: '0 auto',
          overflowY: 'auto',
          minWidth: 0
        }}>
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <FleetProvider>
      <FleetAppContent />
    </FleetProvider>
  );
}

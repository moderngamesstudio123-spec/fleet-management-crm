import React, { createContext, useContext, useState, useEffect } from 'react';

const FleetContext = createContext();

// Default Supervisors Directory with Login Credentials
export const DEFAULT_SUPERVISORS = [
  {
    id: 'SUP-01',
    username: 'imran',
    password: 'password123',
    name: 'Imran Khan',
    email: 'imran.ops@fleetcore.com',
    phone: '+91 98800 12345',
    hub: 'Bangalore North & Whitefield Zone',
    status: 'Active',
    createdDate: '2026-01-10'
  },
  {
    id: 'SUP-02',
    username: 'rajesh',
    password: 'password123',
    name: 'Rajesh Verma',
    email: 'rajesh.ops@fleetcore.com',
    phone: '+91 97700 67890',
    hub: 'Bangalore South & Electronic City Zone',
    status: 'Active',
    createdDate: '2026-01-15'
  },
  {
    id: 'SUP-03',
    username: 'sarah',
    password: 'password123',
    name: 'Sarah Ahmed',
    email: 'sarah.ops@fleetcore.com',
    phone: '+91 96600 45678',
    hub: 'Central & Airport Express Hub',
    status: 'Active',
    createdDate: '2026-02-01'
  }
];

const INITIAL_COMPANIES = [
  {
    id: 'COMP-101',
    supervisorId: 'SUP-01',
    name: 'TCS CyberTech Hub',
    contactPerson: 'Arun Sharma',
    phone: '+91 98765 43210',
    email: 'ops@tcs-hub.com',
    address: 'Gate 4, Whitefield Tech Park, Bangalore',
    activeCabs: 8,
    shiftsRequired: ['Morning (06:00)', 'Evening (14:00)', 'Night (22:00)'],
    createdDate: '2026-01-15'
  },
  {
    id: 'COMP-102',
    supervisorId: 'SUP-02',
    name: 'Amazon Prime Logistics HQ',
    contactPerson: 'Meera Nambiar',
    phone: '+91 98450 11223',
    email: 'transport@amazon-hq.in',
    address: 'Brigade Gateway, Rajajinagar, Bangalore',
    activeCabs: 12,
    shiftsRequired: ['Shift 1 (07:00)', 'Shift 2 (16:00)'],
    createdDate: '2026-02-01'
  },
  {
    id: 'COMP-103',
    supervisorId: 'SUP-01',
    name: 'Deloitte Global Solutions',
    contactPerson: 'Farhan Zaidi',
    phone: '+91 97112 34567',
    email: 'fleet@deloitte-gs.com',
    address: 'Manyata Tech Park, Nagavara, Bangalore',
    activeCabs: 6,
    shiftsRequired: ['General (09:00)', 'US Shift (18:30)'],
    createdDate: '2026-02-20'
  },
  {
    id: 'COMP-104',
    supervisorId: 'SUP-02',
    name: 'Wipro Technologies SEZ',
    contactPerson: 'Sunil Nair',
    phone: '+91 98200 88991',
    email: 'admin@wipro-sez.com',
    address: 'Sarjapur Main Road, Bangalore',
    activeCabs: 5,
    shiftsRequired: ['Shift A (06:30)', 'Shift B (15:00)'],
    createdDate: '2026-03-05'
  },
  {
    id: 'COMP-105',
    supervisorId: 'SUP-03',
    name: 'Infosys Gateway Campus',
    contactPerson: 'Pooja Hegde',
    phone: '+91 98112 99002',
    email: 'transport@infosys-gate.com',
    address: 'Hosur Road, Electronics City Phase 1, Bangalore',
    activeCabs: 10,
    shiftsRequired: ['Morning (06:30)', 'General (09:30)', 'Night (21:00)'],
    createdDate: '2026-03-20'
  }
];

const INITIAL_VEHICLES = [
  {
    id: 'CAB-01',
    supervisorId: 'SUP-01',
    regNumber: 'KA-01-MJ-4050',
    model: 'Toyota Innova Crysta',
    type: 'SUV',
    seatingCapacity: 7,
    fuelType: 'Diesel',
    assignedDriverId: 'DRV-01',
    assignedCompanyId: 'COMP-101',
    status: 'Active',
    insuranceExpiry: '2026-12-31',
    fitnessExpiry: '2027-04-15',
    currentOdometer: 46800,
    gpsStatus: 'Online',
    speedKmH: 42,
    location: 'Outer Ring Rd, Marathahalli'
  },
  {
    id: 'CAB-02',
    supervisorId: 'SUP-01',
    regNumber: 'KA-04-NB-1822',
    model: 'Maruti Suzuki Dzire Tour',
    type: 'Sedan',
    seatingCapacity: 4,
    fuelType: 'CNG',
    assignedDriverId: 'DRV-02',
    assignedCompanyId: 'COMP-101',
    status: 'Active',
    insuranceExpiry: '2026-11-20',
    fitnessExpiry: '2027-02-10',
    currentOdometer: 31200,
    gpsStatus: 'Online',
    speedKmH: 55,
    location: 'Airport Toll Plaza, NH44'
  },
  {
    id: 'CAB-03',
    supervisorId: 'SUP-02',
    regNumber: 'KA-51-EX-9904',
    model: 'Mahindra Scorpio-N',
    type: 'SUV',
    seatingCapacity: 7,
    fuelType: 'Diesel',
    assignedDriverId: 'DRV-03',
    assignedCompanyId: 'COMP-102',
    status: 'Active',
    insuranceExpiry: '2027-01-10',
    fitnessExpiry: '2027-06-30',
    currentOdometer: 22100,
    gpsStatus: 'Online',
    speedKmH: 38,
    location: 'Electronic City Phase 1'
  },
  {
    id: 'CAB-04',
    supervisorId: 'SUP-01',
    regNumber: 'KA-03-AA-7711',
    model: 'Tata Tigor EV',
    type: 'Sedan',
    seatingCapacity: 4,
    fuelType: 'Electric',
    assignedDriverId: 'DRV-04',
    assignedCompanyId: 'COMP-103',
    status: 'Active',
    insuranceExpiry: '2026-10-15',
    fitnessExpiry: '2027-03-01',
    currentOdometer: 18400,
    gpsStatus: 'Online',
    speedKmH: 0,
    location: 'Charging Hub, Manyata'
  },
  {
    id: 'CAB-05',
    supervisorId: 'SUP-02',
    regNumber: 'KA-05-MK-3301',
    model: 'Force Urbania / Traveller',
    type: 'Van',
    seatingCapacity: 12,
    fuelType: 'Diesel',
    assignedDriverId: 'DRV-05',
    assignedCompanyId: 'COMP-102',
    status: 'Active',
    insuranceExpiry: '2026-09-28',
    fitnessExpiry: '2026-11-15',
    currentOdometer: 61000,
    gpsStatus: 'Online',
    speedKmH: 48,
    location: 'Koramangala 80ft Rd'
  },
  {
    id: 'CAB-06',
    supervisorId: 'SUP-02',
    regNumber: 'KA-02-TC-5520',
    model: 'Hyundai Aura',
    type: 'Sedan',
    seatingCapacity: 4,
    fuelType: 'CNG',
    assignedDriverId: 'DRV-06',
    assignedCompanyId: 'COMP-104',
    status: 'Maintenance',
    insuranceExpiry: '2026-08-30',
    fitnessExpiry: '2026-12-10',
    currentOdometer: 52000,
    gpsStatus: 'Offline',
    speedKmH: 0,
    location: 'Authorized Workshop, Peenya'
  },
  {
    id: 'CAB-07',
    supervisorId: 'SUP-03',
    regNumber: 'KA-03-MZ-1199',
    model: 'Toyota Innova Hycross',
    type: 'SUV',
    seatingCapacity: 7,
    fuelType: 'Hybrid Petrol',
    assignedDriverId: 'DRV-07',
    assignedCompanyId: 'COMP-105',
    status: 'Active',
    insuranceExpiry: '2027-02-15',
    fitnessExpiry: '2027-08-20',
    currentOdometer: 14500,
    gpsStatus: 'Online',
    speedKmH: 62,
    location: 'Hebbal Flyover Expressway'
  }
];

const INITIAL_DRIVERS = [
  {
    id: 'DRV-01',
    supervisorId: 'SUP-01',
    name: 'Mohammed Rafiq',
    phone: '+91 99887 11223',
    licenseNumber: 'KA0120190045811',
    assignedVehicleId: 'CAB-01',
    assignedVehicleType: 'SUV',
    assignedCompanyId: 'COMP-101',
    shiftTiming: 'Morning (06:00 AM - 02:30 PM)',
    routeName: 'Route 101 - Airport Express to Tech Park',
    status: 'On Duty',
    rating: 4.9,
    joiningDate: '2024-03-10',
    salaryMonthly: 24000
  },
  {
    id: 'DRV-02',
    supervisorId: 'SUP-01',
    name: 'Suresh Kumar Reddy',
    phone: '+91 97412 88440',
    licenseNumber: 'KA0420200099412',
    assignedVehicleId: 'CAB-02',
    assignedVehicleType: 'Sedan',
    assignedCompanyId: 'COMP-101',
    shiftTiming: 'Evening (02:00 PM - 10:30 PM)',
    routeName: 'Route 102 - Whitefield to Bellandur SEZ',
    status: 'On Duty',
    rating: 4.8,
    joiningDate: '2024-06-15',
    salaryMonthly: 22000
  },
  {
    id: 'DRV-03',
    supervisorId: 'SUP-02',
    name: 'Syed Tanveer Ahmed',
    phone: '+91 98440 33441',
    licenseNumber: 'KA5120180021345',
    assignedVehicleId: 'CAB-03',
    assignedVehicleType: 'SUV',
    assignedCompanyId: 'COMP-102',
    shiftTiming: 'Night (10:00 PM - 06:30 AM)',
    routeName: 'Route 103 - Electronic City to Silk Board',
    status: 'On Duty',
    rating: 4.95,
    joiningDate: '2023-11-01',
    salaryMonthly: 26000
  },
  {
    id: 'DRV-04',
    supervisorId: 'SUP-01',
    name: 'Prakash Rao',
    phone: '+91 98801 77665',
    licenseNumber: 'KA0320210012890',
    assignedVehicleId: 'CAB-04',
    assignedVehicleType: 'Sedan',
    assignedCompanyId: 'COMP-103',
    shiftTiming: 'General (09:00 AM - 06:00 PM)',
    routeName: 'Route 104 - Manyata Tech Park Outer Ring',
    status: 'On Break',
    rating: 4.7,
    joiningDate: '2025-01-20',
    salaryMonthly: 21000
  },
  {
    id: 'DRV-05',
    supervisorId: 'SUP-02',
    name: 'Abdul Wahid',
    phone: '+91 99002 44556',
    licenseNumber: 'KA0520170077889',
    assignedVehicleId: 'CAB-05',
    assignedVehicleType: 'Van',
    assignedCompanyId: 'COMP-102',
    shiftTiming: 'Morning (07:00 AM - 04:00 PM)',
    routeName: 'Route 105 - Koramangala to Amazon Campus',
    status: 'On Duty',
    rating: 4.85,
    joiningDate: '2023-08-12',
    salaryMonthly: 28000
  },
  {
    id: 'DRV-06',
    supervisorId: 'SUP-02',
    name: 'Ramesh Babu',
    phone: '+91 97311 99001',
    licenseNumber: 'KA0220220033441',
    assignedVehicleId: 'CAB-06',
    assignedVehicleType: 'Sedan',
    assignedCompanyId: 'COMP-104',
    shiftTiming: 'Evening (03:00 PM - 11:30 PM)',
    routeName: 'Route 106 - Sarjapur to Marathahalli Hub',
    status: 'Off Duty',
    rating: 4.6,
    joiningDate: '2025-04-10',
    salaryMonthly: 21000
  },
  {
    id: 'DRV-07',
    supervisorId: 'SUP-03',
    name: 'Naveen Kumar',
    phone: '+91 98860 11998',
    licenseNumber: 'KA0320200088123',
    assignedVehicleId: 'CAB-07',
    assignedVehicleType: 'SUV',
    assignedCompanyId: 'COMP-105',
    shiftTiming: 'Morning (06:30 AM - 03:00 PM)',
    routeName: 'Route 107 - Airport Express Hub to Infosys Gate',
    status: 'On Duty',
    rating: 4.9,
    joiningDate: '2024-01-10',
    salaryMonthly: 25000
  }
];

const INITIAL_SHIFTS = [
  {
    id: 'SH-001',
    supervisorId: 'SUP-01',
    date: '2026-10-02',
    shiftName: 'Morning Shift 1',
    companyId: 'COMP-101',
    driverId: 'DRV-01',
    vehicleId: 'CAB-01',
    cabType: 'SUV',
    routeName: 'Route 101 - Airport Express to Tech Park',
    loginTime: '05:50 AM',
    logoutTime: '02:35 PM',
    expectedLogin: '06:00 AM',
    expectedLogout: '02:30 PM',
    status: 'Completed',
    kmRun: 124
  },
  {
    id: 'SH-002',
    supervisorId: 'SUP-01',
    date: '2026-10-02',
    shiftName: 'Evening Shift 2',
    companyId: 'COMP-101',
    driverId: 'DRV-02',
    vehicleId: 'CAB-02',
    cabType: 'Sedan',
    routeName: 'Route 102 - Whitefield to Bellandur SEZ',
    loginTime: '01:55 PM',
    logoutTime: '10:30 PM',
    expectedLogin: '02:00 PM',
    expectedLogout: '10:30 PM',
    status: 'In-Progress',
    kmRun: 88
  },
  {
    id: 'SH-003',
    supervisorId: 'SUP-02',
    date: '2026-10-02',
    shiftName: 'Night Shift',
    companyId: 'COMP-102',
    driverId: 'DRV-03',
    vehicleId: 'CAB-03',
    cabType: 'SUV',
    routeName: 'Route 103 - Electronic City to Silk Board',
    loginTime: '09:50 PM',
    logoutTime: '06:30 AM',
    expectedLogin: '10:00 PM',
    expectedLogout: '06:30 AM',
    status: 'Scheduled',
    kmRun: 0
  },
  {
    id: 'SH-004',
    supervisorId: 'SUP-01',
    date: '2026-10-02',
    shiftName: 'General Shift',
    companyId: 'COMP-103',
    driverId: 'DRV-04',
    vehicleId: 'CAB-04',
    cabType: 'Sedan',
    routeName: 'Route 104 - Manyata Tech Park Outer Ring',
    loginTime: '08:45 AM',
    logoutTime: '06:05 PM',
    expectedLogin: '09:00 AM',
    expectedLogout: '06:00 PM',
    status: 'Completed',
    kmRun: 95
  },
  {
    id: 'SH-005',
    supervisorId: 'SUP-02',
    date: '2026-10-02',
    shiftName: 'Morning Shift 1',
    companyId: 'COMP-102',
    driverId: 'DRV-05',
    vehicleId: 'CAB-05',
    cabType: 'Van',
    routeName: 'Route 105 - Koramangala to Amazon Campus',
    loginTime: '06:50 AM',
    logoutTime: '04:10 PM',
    expectedLogin: '07:00 AM',
    expectedLogout: '04:00 PM',
    status: 'Completed',
    kmRun: 110
  }
];

const INITIAL_ATTENDANCE = [
  {
    id: 'ATT-20261002-01',
    supervisorId: 'SUP-01',
    date: '2026-10-02',
    day: 'Friday',
    driverId: 'DRV-01',
    driverName: 'Mohammed Rafiq',
    vehicleType: 'SUV',
    companyId: 'COMP-101',
    routeName: 'Route 101 - Airport Express',
    status: 'Present',
    loginTime: '05:50 AM',
    logoutTime: '02:35 PM',
    absenceReason: '',
    isAdhocReplacement: false,
    adhocDetails: { vendorName: '', cabRegNo: '', cabType: '', costAmount: 0, paymentType: 'None', paymentStatus: 'None' }
  },
  {
    id: 'ATT-20261002-02',
    supervisorId: 'SUP-01',
    date: '2026-10-02',
    day: 'Friday',
    driverId: 'DRV-02',
    driverName: 'Suresh Kumar Reddy',
    vehicleType: 'Sedan',
    companyId: 'COMP-101',
    routeName: 'Route 102 - Whitefield to Bellandur',
    status: 'Present',
    loginTime: '01:55 PM',
    logoutTime: '10:30 PM',
    absenceReason: '',
    isAdhocReplacement: false,
    adhocDetails: { vendorName: '', cabRegNo: '', cabType: '', costAmount: 0, paymentType: 'None', paymentStatus: 'None' }
  },
  {
    id: 'ATT-20261002-06',
    supervisorId: 'SUP-02',
    date: '2026-10-02',
    day: 'Friday',
    driverId: 'DRV-06',
    driverName: 'Ramesh Babu',
    vehicleType: 'Sedan',
    companyId: 'COMP-104',
    routeName: 'Route 106 - Sarjapur to Marathahalli',
    status: 'Absent',
    loginTime: '--:--',
    logoutTime: '--:--',
    absenceReason: 'Driver severe fever reported in morning (Medical Emergency)',
    isAdhocReplacement: true,
    adhocDetails: {
      vendorName: 'Sri Balaji Travels / Outsourced Cab',
      cabRegNo: 'KA-53-Z-8899',
      cabType: 'Sedan (Dzire)',
      costAmount: 1850,
      paymentType: 'Online / UPI',
      paymentStatus: 'Paid'
    }
  },
  {
    id: 'ATT-20261001-01',
    supervisorId: 'SUP-01',
    date: '2026-10-01',
    day: 'Thursday',
    driverId: 'DRV-01',
    driverName: 'Mohammed Rafiq',
    vehicleType: 'SUV',
    companyId: 'COMP-101',
    routeName: 'Route 101 - Airport Express',
    status: 'Present',
    loginTime: '05:55 AM',
    logoutTime: '02:30 PM',
    absenceReason: '',
    isAdhocReplacement: false,
    adhocDetails: { vendorName: '', cabRegNo: '', cabType: '', costAmount: 0, paymentType: 'None', paymentStatus: 'None' }
  },
  {
    id: 'ATT-20261001-03',
    supervisorId: 'SUP-02',
    date: '2026-10-01',
    day: 'Thursday',
    driverId: 'DRV-03',
    driverName: 'Syed Tanveer Ahmed',
    vehicleType: 'SUV',
    companyId: 'COMP-102',
    routeName: 'Route 103 - Electronic City',
    status: 'Absent',
    loginTime: '--:--',
    logoutTime: '--:--',
    absenceReason: 'Family wedding leave approved',
    isAdhocReplacement: true,
    adhocDetails: {
      vendorName: 'Royal Cabs & Tours',
      cabRegNo: 'KA-05-AA-4411',
      cabType: 'SUV (Ertiga)',
      costAmount: 2400,
      paymentType: 'Vendor Account',
      paymentStatus: 'Pending'
    }
  }
];

export function FleetProvider({ children }) {
  // Supervisors in State
  const [supervisors, setSupervisors] = useState(() => {
    const saved = localStorage.getItem('fleet_supervisors_v3');
    return saved ? JSON.parse(saved) : DEFAULT_SUPERVISORS;
  });

  // Authenticated user session
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('fleet_auth_user_v3');
    return saved ? JSON.parse(saved) : {
      role: 'admin',
      id: 'USR-ADMIN',
      username: 'admin',
      name: 'Super Administrator',
      email: 'admin@amazelogistics.com',
      supervisorId: null,
      hub: 'Central Command HQ'
    };
  });

  // Admin Supervisor Filter (Admin can filter view by specific supervisor or 'all')
  const [adminSupervisorFilter, setAdminSupervisorFilter] = useState('all');

  const [rawCompanies, setRawCompanies] = useState(() => {
    const saved = localStorage.getItem('fleet_companies_v3');
    return saved ? JSON.parse(saved) : INITIAL_COMPANIES;
  });

  const [rawVehicles, setRawVehicles] = useState(() => {
    const saved = localStorage.getItem('fleet_vehicles_v3');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [rawDrivers, setRawDrivers] = useState(() => {
    const saved = localStorage.getItem('fleet_drivers_v3');
    return saved ? JSON.parse(saved) : INITIAL_DRIVERS;
  });

  const [rawShifts, setRawShifts] = useState(() => {
    const saved = localStorage.getItem('fleet_shifts_v3');
    return saved ? JSON.parse(saved) : INITIAL_SHIFTS;
  });

  const [rawAttendance, setRawAttendance] = useState(() => {
    const saved = localStorage.getItem('fleet_attendance_v3');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('fleet_supervisors_v3', JSON.stringify(supervisors));
  }, [supervisors]);

  useEffect(() => {
    localStorage.setItem('fleet_auth_user_v3', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('fleet_companies_v3', JSON.stringify(rawCompanies));
  }, [rawCompanies]);

  useEffect(() => {
    localStorage.setItem('fleet_vehicles_v3', JSON.stringify(rawVehicles));
  }, [rawVehicles]);

  useEffect(() => {
    localStorage.setItem('fleet_drivers_v3', JSON.stringify(rawDrivers));
  }, [rawDrivers]);

  useEffect(() => {
    localStorage.setItem('fleet_shifts_v3', JSON.stringify(rawShifts));
  }, [rawShifts]);

  useEffect(() => {
    localStorage.setItem('fleet_attendance_v3', JSON.stringify(rawAttendance));
  }, [rawAttendance]);

  // Real Login with Username / Email & Password
  const login = (usernameOrEmail, password) => {
    const input = usernameOrEmail.trim().toLowerCase();
    
    // Check Admin Credentials
    if ((input === 'admin' || input === 'admin@amazelogistics.com') && password === 'admin123') {
      const adminUser = {
        role: 'admin',
        id: 'USR-ADMIN',
        username: 'admin',
        name: 'Super Administrator',
        email: 'admin@amazelogistics.com',
        supervisorId: null,
        hub: 'All Hubs & Master Command'
      };
      setCurrentUser(adminUser);
      return { success: true, user: adminUser };
    }

    // Check Supervisor Credentials
    const foundSup = supervisors.find(s => 
      (s.username.toLowerCase() === input || s.email.toLowerCase() === input || s.id.toLowerCase() === input) &&
      s.password === password
    );

    if (foundSup) {
      const supUser = {
        role: 'supervisor',
        id: foundSup.id,
        username: foundSup.username,
        name: `${foundSup.name} (${foundSup.id})`,
        email: foundSup.email,
        supervisorId: foundSup.id,
        hub: foundSup.hub
      };
      setCurrentUser(supUser);
      return { success: true, user: supUser };
    }

    return { success: false, error: 'Invalid Username/ID or Password. Please try again.' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Supervisor CRUD for Admin Panel
  const addSupervisor = (supData) => {
    const newId = `SUP-0${supervisors.length + 1}`;
    const newSup = {
      id: newId,
      username: supData.username || `sup0${supervisors.length + 1}`,
      password: supData.password || 'password123',
      name: supData.name,
      email: supData.email,
      phone: supData.phone,
      hub: supData.hub,
      status: 'Active',
      createdDate: new Date().toISOString().split('T')[0]
    };
    setSupervisors(prev => [...prev, newSup]);
    return newSup;
  };

  const updateSupervisor = (id, updated) => {
    setSupervisors(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
  };

  const deleteSupervisor = (id) => {
    setSupervisors(prev => prev.filter(s => s.id !== id));
  };

  // DATA SCOPING (STRICT ISOLATION):
  // 1. If user is Supervisor: STRICTLY show ONLY his records! Other supervisors' data is 100% hidden.
  // 2. If user is Admin: Show all records, with optional Admin Supervisor filter dropdown!
  const isSupervisor = currentUser?.role === 'supervisor';
  const activeSupId = currentUser?.supervisorId;

  const targetFilterSup = isSupervisor 
    ? activeSupId 
    : (adminSupervisorFilter !== 'all' ? adminSupervisorFilter : null);

  const companies = targetFilterSup
    ? rawCompanies.filter(c => c.supervisorId === targetFilterSup)
    : rawCompanies;

  const vehicles = targetFilterSup
    ? rawVehicles.filter(v => v.supervisorId === targetFilterSup)
    : rawVehicles;

  const drivers = targetFilterSup
    ? rawDrivers.filter(d => d.supervisorId === targetFilterSup)
    : rawDrivers;

  const shifts = targetFilterSup
    ? rawShifts.filter(s => s.supervisorId === targetFilterSup)
    : rawShifts;

  const attendance = targetFilterSup
    ? rawAttendance.filter(a => a.supervisorId === targetFilterSup)
    : rawAttendance;

  // CRUD Actions
  const addCompany = (companyData) => {
    const newComp = {
      id: `COMP-${Date.now().toString().slice(-4)}`,
      supervisorId: isSupervisor ? activeSupId : (companyData.supervisorId || supervisors[0]?.id || 'SUP-01'),
      createdDate: new Date().toISOString().split('T')[0],
      activeCabs: 0,
      shiftsRequired: ['Morning (06:00)', 'Evening (14:00)'],
      ...companyData
    };
    setRawCompanies(prev => [newComp, ...prev]);
    return newComp;
  };

  const updateCompany = (id, updated) => {
    setRawCompanies(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
  };

  const deleteCompany = (id) => {
    setRawCompanies(prev => prev.filter(c => c.id !== id));
  };

  const addVehicle = (vehicleData) => {
    const newVeh = {
      id: `CAB-${(rawVehicles.length + 1).toString().padStart(2, '0')}`,
      supervisorId: isSupervisor ? activeSupId : (vehicleData.supervisorId || supervisors[0]?.id || 'SUP-01'),
      status: 'Active',
      gpsStatus: 'Online',
      speedKmH: 0,
      location: 'Central Fleet Garage',
      ...vehicleData
    };
    setRawVehicles(prev => [newVeh, ...prev]);
    return newVeh;
  };

  const updateVehicle = (id, updated) => {
    setRawVehicles(prev => prev.map(v => v.id === id ? { ...v, ...updated } : v));
  };

  const deleteVehicle = (id) => {
    setRawVehicles(prev => prev.filter(v => v.id !== id));
  };

  const addDriver = (driverData) => {
    const newDrv = {
      id: `DRV-${(rawDrivers.length + 1).toString().padStart(2, '0')}`,
      supervisorId: isSupervisor ? activeSupId : (driverData.supervisorId || supervisors[0]?.id || 'SUP-01'),
      status: 'On Duty',
      rating: 5.0,
      joiningDate: new Date().toISOString().split('T')[0],
      salaryMonthly: 22000,
      ...driverData
    };
    setRawDrivers(prev => [newDrv, ...prev]);
    return newDrv;
  };

  const updateDriver = (id, updated) => {
    setRawDrivers(prev => prev.map(d => d.id === id ? { ...d, ...updated } : d));
  };

  const deleteDriver = (id) => {
    setRawDrivers(prev => prev.filter(d => d.id !== id));
  };

  const addShift = (shiftData) => {
    const newShift = {
      id: `SH-${Date.now().toString().slice(-4)}`,
      supervisorId: isSupervisor ? activeSupId : (shiftData.supervisorId || supervisors[0]?.id || 'SUP-01'),
      status: 'Scheduled',
      kmRun: 0,
      ...shiftData
    };
    setRawShifts(prev => [newShift, ...prev]);
    return newShift;
  };

  const updateShift = (id, updated) => {
    setRawShifts(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
  };

  const deleteShift = (id) => {
    setRawShifts(prev => prev.filter(s => s.id !== id));
  };

  const saveAttendanceRecord = (record) => {
    setRawAttendance(prev => {
      const existsIndex = prev.findIndex(a => 
        (a.id === record.id) || (a.driverId === record.driverId && a.date === record.date)
      );
      const recordWithSup = {
        supervisorId: isSupervisor ? activeSupId : (record.supervisorId || supervisors[0]?.id || 'SUP-01'),
        ...record
      };

      if (existsIndex >= 0) {
        const copy = [...prev];
        copy[existsIndex] = { ...copy[existsIndex], ...recordWithSup };
        return copy;
      } else {
        const newRecord = {
          id: `ATT-${record.date.replace(/-/g, '')}-${Date.now().toString().slice(-3)}`,
          ...recordWithSup
        };
        return [newRecord, ...prev];
      }
    });
  };

  const deleteAttendanceRecord = (id) => {
    setRawAttendance(prev => prev.filter(a => a.id !== id));
  };

  const quickSettleAbsentPayment = (attendanceId, paymentAmount, vendorName = '', paymentType = 'Online / UPI') => {
    setRawAttendance(prev => prev.map(a => {
      if (a.id === attendanceId) {
        return {
          ...a,
          status: 'Absent',
          isAdhocReplacement: true,
          adhocDetails: {
            ...a.adhocDetails,
            vendorName: vendorName || a.adhocDetails?.vendorName || 'Outsourced Fleet Cab',
            costAmount: Number(paymentAmount) || 0,
            paymentType: paymentType,
            paymentStatus: 'Paid'
          }
        };
      }
      return a;
    }));
  };

  const resetDemoData = () => {
    setSupervisors(DEFAULT_SUPERVISORS);
    setRawCompanies(INITIAL_COMPANIES);
    setRawVehicles(INITIAL_VEHICLES);
    setRawDrivers(INITIAL_DRIVERS);
    setRawShifts(INITIAL_SHIFTS);
    setRawAttendance(INITIAL_ATTENDANCE);
  };

  const totalAdhocExpense = attendance
    .filter(a => a.isAdhocReplacement && a.adhocDetails?.costAmount)
    .reduce((acc, curr) => acc + Number(curr.adhocDetails.costAmount || 0), 0);

  return (
    <FleetContext.Provider value={{
      currentUser,
      login,
      logout,
      supervisors,
      addSupervisor,
      updateSupervisor,
      deleteSupervisor,
      adminSupervisorFilter,
      setAdminSupervisorFilter,
      companies,
      rawCompanies,
      addCompany,
      updateCompany,
      deleteCompany,
      vehicles,
      rawVehicles,
      addVehicle,
      updateVehicle,
      deleteVehicle,
      drivers,
      rawDrivers,
      addDriver,
      updateDriver,
      deleteDriver,
      shifts,
      rawShifts,
      addShift,
      updateShift,
      deleteShift,
      attendance,
      rawAttendance,
      saveAttendanceRecord,
      deleteAttendanceRecord,
      quickSettleAbsentPayment,
      resetDemoData,
      totalAdhocExpense
    }}>
      {children}
    </FleetContext.Provider>
  );
}

export function useFleet() {
  const context = useContext(FleetContext);
  if (!context) {
    throw new Error('useFleet must be used within a FleetProvider');
  }
  return context;
}

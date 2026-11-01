<<<<<<< HEAD
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
=======
```jsx
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

>>>>>>> 13a3d08f78a9edfb701b6404460c17239bff651e
import HomePage from './pages/HomePage';
import AppointmentsPage from './pages/AppointmentsPage';
import FindDoctorsPage from './pages/FindDoctorsPage';
import MedicalRecordsPage from './pages/MedicalRecordsPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import LoginPage from './pages/LoginPage';
<<<<<<< HEAD
import RoleNotice from './components/layout/RoleNotice';
import AdminApp from './pages/admin/AdminApp';
import DoctorApp from './pages/doctor/DoctorApp';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { isAuthenticated, booting, user } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [doctorSearch, setDoctorSearch] = useState('');

=======

import RoleNotice from './components/layout/RoleNotice';
import AdminApp from './pages/admin/AdminApp';
import DoctorApp from './pages/doctor/DoctorApp';

import { useAuth } from './context/AuthContext';

// Saathi AI chatbot
import SaathiChat from './components/features/saathi/SaathiChat';

export default function App() {
  const { isAuthenticated, booting, user } = useAuth();

  const [activeTab, setActiveTab] = useState('home');
  const [doctorSearch, setDoctorSearch] = useState('');

  // Show loading screen while authentication is checked
>>>>>>> 13a3d08f78a9edfb701b6404460c17239bff651e
  if (booting) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

<<<<<<< HEAD
  if (!isAuthenticated) return <LoginPage />;

  // Admins get the review console; doctor/ASHA/hospital/responder clients are
  // not part of this app yet.
  if (user.role === 'admin') return <AdminApp />;
  if (user.role === 'doctor') return <DoctorApp />;
  if (user.role !== 'patient') return <RoleNotice role={user.role} />;

=======
  // Show login page when the user is not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Preserve the admin dashboard
  if (user?.role === 'admin') {
    return <AdminApp />;
  }

  // Preserve the doctor dashboard
  if (user?.role === 'doctor') {
    return <DoctorApp />;
  }

  // Preserve access restrictions for other user roles
  if (user?.role !== 'patient') {
    return <RoleNotice role={user?.role} />;
  }

  // Render the selected patient dashboard page
>>>>>>> 13a3d08f78a9edfb701b6404460c17239bff651e
  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onNavigate={setActiveTab} />;
<<<<<<< HEAD
      case 'appointments':
        return <AppointmentsPage onNavigateDoctors={() => setActiveTab('doctors')} />;
      case 'doctors':
        return <FindDoctorsPage initialSearch={doctorSearch} />;
      case 'records':
        return <MedicalRecordsPage />;
      case 'profile':
        return <ProfileSettingsPage />;
=======

      case 'appointments':
        return (
          <AppointmentsPage
            onNavigateDoctors={() => setActiveTab('doctors')}
          />
        );

      case 'doctors':
        return <FindDoctorsPage initialSearch={doctorSearch} />;

      case 'records':
        return <MedicalRecordsPage />;

      case 'profile':
        return <ProfileSettingsPage />;

>>>>>>> 13a3d08f78a9edfb701b6404460c17239bff651e
      default:
        return <HomePage onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
<<<<<<< HEAD
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onNavigateProfile={() => setActiveTab('profile')}
          onGlobalSearch={(q) => {
            setDoctorSearch(q);
            if (q.trim()) setActiveTab('doctors');
          }}
        />
=======
      {/* Existing sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Existing header */}
        <Header
          onNavigateProfile={() => setActiveTab('profile')}
          onGlobalSearch={(query) => {
            setDoctorSearch(query);

            if (query.trim()) {
              setActiveTab('doctors');
            }
          }}
        />

        {/* Existing patient dashboard pages */}
>>>>>>> 13a3d08f78a9edfb701b6404460c17239bff651e
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto animate-fadeIn">
          {renderPage()}
        </main>
      </div>
<<<<<<< HEAD
    </div>
  );
}
=======

      {/* Saathi AI assistant */}
      <SaathiChat />
    </div>
  );
}
```
>>>>>>> 13a3d08f78a9edfb701b6404460c17239bff651e

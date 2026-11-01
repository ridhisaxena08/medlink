import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import AppointmentsPage from './pages/AppointmentsPage';
import FindDoctorsPage from './pages/FindDoctorsPage';
import MedicalRecordsPage from './pages/MedicalRecordsPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import LoginPage from './pages/LoginPage';
import RoleNotice from './components/layout/RoleNotice';
import AdminApp from './pages/admin/AdminApp';
import DoctorApp from './pages/doctor/DoctorApp';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { isAuthenticated, booting, user } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [doctorSearch, setDoctorSearch] = useState('');

  if (booting) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) return <LoginPage />;

  // Admins get the review console; doctor/ASHA/hospital/responder clients are
  // not part of this app yet.
  if (user.role === 'admin') return <AdminApp />;
  if (user.role === 'doctor') return <DoctorApp />;
  if (user.role !== 'patient') return <RoleNotice role={user.role} />;

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onNavigate={setActiveTab} />;
      case 'appointments':
        return <AppointmentsPage onNavigateDoctors={() => setActiveTab('doctors')} />;
      case 'doctors':
        return <FindDoctorsPage initialSearch={doctorSearch} />;
      case 'records':
        return <MedicalRecordsPage />;
      case 'profile':
        return <ProfileSettingsPage />;
      default:
        return <HomePage onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onNavigateProfile={() => setActiveTab('profile')}
          onGlobalSearch={(q) => {
            setDoctorSearch(q);
            if (q.trim()) setActiveTab('doctors');
          }}
        />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto animate-fadeIn">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

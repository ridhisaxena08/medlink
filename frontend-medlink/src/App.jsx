import React, { useState } from "react";
import { Loader2 } from "lucide-react";

import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";

import HomePage from "./pages/HomePage";
import AppointmentsPage from "./pages/AppointmentsPage";
import FindDoctorsPage from "./pages/FindDoctorsPage";
import MedicalRecordsPage from "./pages/MedicalRecordsPage";
import ProfileSettingsPage from "./pages/ProfileSettingsPage";
import LoginPage from "./pages/LoginPage";

import RoleNotice from "./components/layout/RoleNotice";
import AdminApp from "./pages/admin/AdminApp";
import DoctorApp from "./pages/doctor/DoctorApp";

import { useAuth } from "./context/AuthContext";

// Saathi AI chatbot
import SaathiChat from "./components/features/saathi/SaathiChat";

export default function App() {
  const { isAuthenticated, booting, user } = useAuth();

  const [activeTab, setActiveTab] = useState("home");
  const [doctorSearch, setDoctorSearch] = useState("");

  // Show loading screen while authentication is checked
  if (booting) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  // Show login page when user is not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Admin dashboard
  if (user?.role === "admin") {
    return <AdminApp />;
  }

  // Doctor dashboard
  if (user?.role === "doctor") {
    return <DoctorApp />;
  }

  // Restrict unsupported roles
  if (user?.role !== "patient") {
    return <RoleNotice role={user?.role} />;
  }

  // Render patient dashboard pages
  const renderPage = () => {
    switch (activeTab) {
      case "home":
        return <HomePage onNavigate={setActiveTab} />;

      case "appointments":
        return (
          <AppointmentsPage onNavigateDoctors={() => setActiveTab("doctors")} />
        );

      case "doctors":
        return <FindDoctorsPage initialSearch={doctorSearch} />;

      case "records":
        return <MedicalRecordsPage />;

      case "profile":
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
          onNavigateProfile={() => setActiveTab("profile")}
          onGlobalSearch={(query) => {
            setDoctorSearch(query);

            if (query.trim()) {
              setActiveTab("doctors");
            }
          }}
        />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto animate-fadeIn">
          {renderPage()}
        </main>
      </div>

      <SaathiChat />
    </div>
  );
}

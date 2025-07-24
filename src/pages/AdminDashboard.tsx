
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/AdminSidebar';
import CustomersSection from '@/components/CustomersSection';
import CalendarSection from '@/components/CalendarSection';
import EmbedSection from '@/components/EmbedSection';
import PaymentsSection from '@/components/PaymentsSection';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('customers');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is authenticated using the correct key
    const isAuthenticated = localStorage.getItem('fdr_admin_auth');
    if (!isAuthenticated) {
      navigate('/admin'); // Fix: redirect to correct route
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('fdr_admin_auth'); // Fix: use correct key
    localStorage.removeItem('fdr_admin_user');
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    navigate('/admin'); // Fix: redirect to correct route
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'customers':
        return <CustomersSection />;
      case 'calendar':
        return <CalendarSection />;
      case 'locations':
        return <div className="p-6">Location Manager - Coming Soon</div>;
      case 'payments':
        return <PaymentsSection />;
      case 'embed':
        return <EmbedSection />;
      default:
        return <CustomersSection />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;

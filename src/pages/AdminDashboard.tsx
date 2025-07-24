
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
    // Check if user is authenticated (you might want to add proper auth check here)
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin-login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    navigate('/admin-login');
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

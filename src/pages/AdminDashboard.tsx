import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/AdminSidebar';
import CustomersSection from '@/components/CustomersSection';
import CalendarSection from '@/components/CalendarSection';
import EmbedSection from '@/components/EmbedSection';
import PaymentsSection from '@/components/PaymentsSection';
import TransactionsSection from '@/components/TransactionsSection';
import SettingsSection from '@/components/SettingsSection';
import { useToast } from '@/hooks/use-toast';
import { adminAuth } from '@/utils/adminAuth';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('customers');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication with secure session management
    if (!adminAuth.isAuthenticated()) {
      toast({
        title: "Session Expired",
        description: "Please log in again",
        variant: "destructive"
      });
      navigate('/admin');
    }
  }, [navigate, toast]);

  const handleLogout = () => {
    adminAuth.logout();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    navigate('/admin');
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
      case 'transactions':
        return <TransactionsSection />;
      case 'settings':
        return <SettingsSection />;
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

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardView from '@/components/views/DashboardView';
import CardsView from '@/components/views/CardsView';
import TransfersView from '@/components/views/TransfersView';
import SavingsView from '@/components/views/SavingsView';
import SettingsView from '@/components/views/SettingsView';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'cards':
        return <CardsView />;
      case 'transfers':
        return <TransfersView />;
      case 'savings':
        return <SavingsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="ml-64 p-8">
        {renderView()}
      </main>
    </div>
  );
};

export default Dashboard;

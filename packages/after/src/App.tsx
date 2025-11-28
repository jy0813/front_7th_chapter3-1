import React from 'react';
import { ManagementPage } from './pages/ManagementPage';
import '@/tokens/index.css';
import { AppHeader } from '@/components/surfaces';

export const App: React.FC = () => {
  return (
    <div className="bg-background-subtle min-h-screen">
      <AppHeader
        logo="L"
        title="Hanghae Company"
        subtitle="Design System Migration Project"
        user={{ name: 'Demo User', email: 'demo@example.com', avatar: 'DU' }}
      />
      <main className="w-full px-8 py-4">
        <ManagementPage />
      </main>
    </div>
  );
};

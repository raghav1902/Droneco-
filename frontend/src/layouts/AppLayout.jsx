import React from 'react';
import Sidebar from './Sidebar';

const AppLayout = ({ role, activeTab, setActiveTab, children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar role={role} activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto bg-muted/10 p-8">
        <div className="max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;

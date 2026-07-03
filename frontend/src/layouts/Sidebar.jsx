import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, UserPlus, CreditCard, 
  Receipt, FileBarChart, Settings, ChevronLeft, 
  ChevronRight, LogOut, Wallet, ShieldCheck, BadgePercent
} from 'lucide-react';

const Sidebar = ({ role, activeTab, setActiveTab }) => {
  const [collapsed, setCollapsed] = useState(false);

  const adminMenu = [
    { title: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
    {
      group: 'CRM',
      items: [
        { title: 'Student Leads', icon: UserPlus, id: 'leads' }
      ]
    },
    {
      group: 'Admissions',
      items: [
        { title: 'Students', icon: Users, id: 'students' }
      ]
    },
    {
      group: 'Finance',
      items: [
        { title: 'Fee Dashboard', icon: Wallet, id: 'fee-dashboard' },
        { title: 'Fee Structure', icon: Receipt, id: 'fee-structure' },
        { title: 'Fee Rules', icon: ShieldCheck, id: 'fee-rules' },
        { title: 'Discounts', icon: BadgePercent, id: 'discounts' }
      ]
    },
    {
      group: 'Analytics',
      items: [
        { title: 'Reports', icon: FileBarChart, id: 'reports' }
      ]
    },
    {
      group: 'Administration',
      items: [
        { title: 'Settings', icon: Settings, id: 'settings' }
      ]
    }
  ];

  const receptionistMenu = [
    { title: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
    {
      group: 'CRM',
      items: [
        { title: 'Student Leads', icon: UserPlus, id: 'leads' }
      ]
    },
    {
      group: 'Admissions',
      items: [
        { title: 'Admission Wizard', icon: UserPlus, id: 'admission-wizard' },
        { title: 'Students', icon: Users, id: 'students' }
      ]
    },
    {
      group: 'Finance',
      items: [
        { title: 'Collect Fee', icon: CreditCard, id: 'collect-fee' },
        { title: 'Payment History', icon: Receipt, id: 'payment-history' },
        { title: 'Due List', icon: Wallet, id: 'due-list' }
      ]
    },
    {
      group: 'System',
      items: [
        { title: 'Settings', icon: Settings, id: 'settings' }
      ]
    }
  ];

  const menu = role === 'admin' ? adminMenu : receptionistMenu;

  return (
    <div 
      className={`relative flex flex-col h-screen bg-card border-r border-border transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}
    >
      <div className="flex items-center justify-between p-4 border-b border-border h-16">
        {!collapsed && (
          <div className="flex items-center gap-2 font-bold text-lg text-primary truncate">
            <div className="w-8 h-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold">
              IA
            </div>
            Institute Admin
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 mx-auto rounded bg-primary text-primary-foreground flex items-center justify-center font-bold">
            IA
          </div>
        )}
      </div>

      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-5 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors z-10"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className="flex-1 overflow-y-auto py-4 space-y-6">
        {menu.map((section, idx) => (
          <div key={idx} className="px-3">
            {section.group && !collapsed && (
              <h3 className="px-4 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {section.group}
              </h3>
            )}
            
            <ul className="space-y-1">
              {(section.items || [section]).map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      title={collapsed ? item.title : ''}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md transition-all duration-200 group
                        ${isActive 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                        }
                      `}
                    >
                      <item.icon 
                        size={18} 
                        className={`shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}
                      />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-border mt-auto">
        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors">
          <LogOut size={18} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

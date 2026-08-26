import React from 'react';
import { 
  Layers, 
  Wrench, 
  FolderKanban, 
  FileBox, 
  Package, 
  DollarSign,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: 'contracts', label: 'قراردادها', icon: FileBox },
    { id: 'installation', label: 'نصب و راه اندازی', icon: Layers },
    { id: 'service', label: 'سرویس و نگهداری', icon: Wrench },
    { id: 'cartable', label: 'کارتابل', icon: FolderKanban },
    { id: 'case', label: 'پرونده', icon: FileBox },
    { id: 'warehouse', label: 'انبار', icon: Package },
    { id: 'financial', label: 'مالی', icon: DollarSign },
  ];

  return (
    <aside aria-label="منوی اصلی" className="w-20 bg-slate-800 text-slate-300 flex flex-col items-center py-3 select-none shrink-0 border-l border-slate-700 shadow-lg z-20">
      <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-6 shadow-md shadow-amber-500/30">
        ن
      </div>

      <nav className="flex flex-col gap-1 w-full px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`group relative flex flex-col items-center justify-center py-2.5 px-1 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 font-medium' 
                  : 'hover:bg-slate-700/60 text-slate-400 hover:text-slate-100'
              }`}
              title={item.label}
            >
              <Icon className={`w-6 h-6 mb-1 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-300'}`} />
              <span className="text-[10px] text-center leading-tight tracking-tighter truncate max-w-[64px]">
                {item.label}
              </span>
              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-l" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-slate-700 w-full flex flex-col items-center">
        <button 
          onClick={() => setActiveSection('settings')}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition"
          title="تنظیمات سیستم"
        >
          <ChevronRight className="w-5 h-5 rotate-90" />
        </button>
      </div>
    </aside>
  );
};

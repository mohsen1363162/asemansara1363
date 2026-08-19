import React from 'react';
import { Headphones, MessageSquare, ShieldCheck, User } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 px-4 py-2 text-xs flex flex-wrap items-center justify-between border-t border-slate-800 select-none">
      {/* Right side: development info */}
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>توسعه و پشتیبانی توسط توانمند</span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-300 font-mono">نسخه 1.1.22</span>
      </div>

      {/* Middle: SMS balance */}
      <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
        <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
        <span>مانده پیامک: <strong className="text-amber-300 font-mono">۴,۶۶۷,۱۷۰ ریال</strong></span>
        <span className="text-slate-600">|</span>
        <span>شماره اشتراک: <strong className="text-slate-200">141</strong></span>
      </div>

      {/* Left side: user profile & support */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Headphones className="w-3.5 h-3.5 text-blue-400" />
          <span>پشتیبانی</span>
        </div>
        <div className="flex items-center gap-1.5 pl-2 border-r border-slate-700">
          <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[11px]">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="text-slate-200 font-medium">محسن امامی بربری خوش آمدید!</span>
        </div>
      </div>
    </footer>
  );
};

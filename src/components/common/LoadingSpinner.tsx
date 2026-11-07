import React from 'react';
import { GraduationCap } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 animate-bounce">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div className="absolute inset-0 rounded-2xl border-2 border-emerald-400 animate-ping opacity-25" />
      </div>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
        Loading GRANTLY Workspace...
      </p>
    </div>
  );
};

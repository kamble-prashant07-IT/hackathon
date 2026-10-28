import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  FileText,
  HelpCircle,
  Timer,
  BarChart3,
  Settings,
  X,
  Sparkles,
  Flame,
} from 'lucide-react';
import { NavSection } from '../types';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  studyStreakDays: number;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  currentSection,
  onSelectSection,
  studyStreakDays,
}) => {
  if (!isOpen) return null;

  const navItems = [
    { id: 'dashboard' as NavSection, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'planner' as NavSection, label: 'AI Study Planner', icon: CalendarDays },
    { id: 'notes' as NavSection, label: 'Smart Notes', icon: FileText },
    { id: 'quiz' as NavSection, label: 'Quiz Generator', icon: HelpCircle },
    { id: 'timer' as NavSection, label: 'Focus Timer', icon: Timer },
    { id: 'progress' as NavSection, label: 'My Progress', icon: BarChart3 },
    { id: 'settings' as NavSection, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-72 max-w-[80vw] bg-[#0d1322] border-r border-slate-800 h-full flex flex-col p-4 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-400 p-[1px]">
              <div className="w-full h-full bg-[#0c1220] rounded-[7px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <span className="font-bold text-white text-base">EduPilot AI</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Streak */}
        <div className="my-4 p-3 rounded-xl bg-violet-950/40 border border-violet-800/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400/20" />
            <span className="text-xs font-semibold text-white">{studyStreakDays} Day Streak</span>
          </div>
          <span className="text-[10px] font-semibold text-cyan-400">Top 5%</span>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectSection(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-violet-600/20 text-white border-l-2 border-cyan-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Profile */}
        <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
          <img
            src="/src/assets/images/student_avatar_alex_1793178717644.jpg"
            alt="Alex"
            className="w-9 h-9 rounded-xl object-cover border border-violet-500/40"
          />
          <div>
            <div className="text-sm font-semibold text-white">Alex Chen</div>
            <div className="text-xs text-slate-400">Year 3 · Engineering</div>
          </div>
        </div>
      </div>
    </div>
  );
};

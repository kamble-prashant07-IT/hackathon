import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  FileText,
  HelpCircle,
  Timer,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Flame,
  Sparkles,
  BookMarked,
} from 'lucide-react';
import { NavSection } from '../types';

interface SidebarProps {
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  studyStreakDays: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  isCollapsed,
  onToggleCollapse,
  studyStreakDays,
}) => {
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
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-[#0d1322] border-r border-slate-800/80 flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
        <div
          onClick={() => onSelectSection('dashboard')}
          className="flex items-center gap-3 cursor-pointer group overflow-hidden"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-[1px] shrink-0 shadow-lg shadow-indigo-600/20 group-hover:shadow-indigo-500/40 transition-shadow">
            <div className="w-full h-full bg-[#0c1220] rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          {!isCollapsed && (
            <div className="min-w-0 transition-opacity duration-200">
              <span className="font-extrabold text-white text-base tracking-tight block leading-tight">
                EduPilot <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">AI</span>
              </span>
              <span className="text-[11px] text-slate-400 tracking-normal block font-medium">
                Academic Copilot
              </span>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors hidden md:block"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Streak Badge */}
      {!isCollapsed && (
        <div className="px-4 py-3 mx-3 my-3 rounded-xl bg-gradient-to-r from-violet-950/40 to-indigo-950/40 border border-violet-800/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400/20" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white tabular-nums">{studyStreakDays} Day Streak</div>
              <div className="text-[10px] text-slate-400">Keep momentum alive</div>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md">
            Top 5%
          </span>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-violet-600/20 via-indigo-600/20 to-transparent text-white border-l-2 border-cyan-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-colors ${
                  isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
              {isActive && (
                <div className="absolute right-2.5 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Study Tip / Feature Highlight */}
      {!isCollapsed && (
        <div className="p-3 mx-3 mb-3 rounded-xl bg-[#11192e] border border-slate-800">
          <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-violet-300">
            <BookMarked className="w-3.5 h-3.5 text-cyan-400" />
            <span>Spaced Recall Tip</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Reviewing key definitions 24h after generation boosts retention by +40%.
          </p>
        </div>
      )}

      {/* Student Profile Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-[#0a0f1d]/60">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <img
              src="/src/assets/images/student_avatar_alex_1793178717644.jpg"
              alt="Alex"
              className="w-10 h-10 rounded-xl object-cover border border-violet-500/40 shadow-sm"
              onError={(e) => {
                // styled fallback container if image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0d1322] absolute -bottom-0.5 -right-0.5" />
          </div>

          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white truncate block">Alex Chen</span>
                <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded font-mono">Engr</span>
              </div>
              <span className="text-[11px] text-slate-400 truncate block">Year 3 · Engineering</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

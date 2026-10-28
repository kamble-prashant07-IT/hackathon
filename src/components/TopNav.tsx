import React from 'react';
import {
  Menu,
  Sparkles,
  Timer,
  Bell,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { NavSection } from '../types';

interface TopNavProps {
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  onOpenMobileMenu: () => void;
  onOpenAssistant: () => void;
  isTimerRunning: boolean;
  timerSecondsLeft: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentSection,
  onSelectSection,
  onOpenMobileMenu,
  onOpenAssistant,
  isTimerRunning,
  timerSecondsLeft,
}) => {
  const sectionLabels: Record<NavSection, { title: string; subtitle: string }> = {
    dashboard: { title: 'Academic Command Center', subtitle: 'Overview & Daily Cadence' },
    planner: { title: 'AI Study Planner', subtitle: 'Targeted Exam Roadmaps' },
    notes: { title: 'Smart Notes Synthesizer', subtitle: 'Feynman & Active Recall Deconstructions' },
    quiz: { title: 'AI Quiz & Recall Drills', subtitle: 'Adaptive Conceptual Verification' },
    timer: { title: 'Deep Focus Immersion', subtitle: 'Distraction-free Ultradian Cycles' },
    progress: { title: 'Academic Telemetry & Analytics', subtitle: 'Mastery Curves & Habit Consistency' },
    settings: { title: 'Workspace Settings', subtitle: 'Study Preferences & AI Configuration' },
  };

  const currentMeta = sectionLabels[currentSection];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0b101e]/80 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 md:hidden"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">EduPilot</span>
            <span className="text-slate-600 text-xs">/</span>
            <h1 className="text-sm md:text-base font-bold text-white tracking-tight">
              {currentMeta.title}
            </h1>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Timer pill (if active), Search/Trigger, AI Assistant CTA */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Active Focus Timer Status */}
        {isTimerRunning && (
          <button
            onClick={() => onSelectSection('timer')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-medium hover:bg-cyan-900/60 transition-colors animate-pulse"
            title="Focus timer is active — click to view"
          >
            <Timer className="w-3.5 h-3.5 text-cyan-400" />
            <span className="tabular-nums">{formatTime(timerSecondsLeft)}</span>
          </button>
        )}

        {/* Global AI Assistant Trigger */}
        <button
          onClick={onOpenAssistant}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
          <span className="hidden sm:inline">Ask EduPilot AI</span>
          <span className="sm:hidden">AI</span>
        </button>
      </div>
    </header>
  );
};

import React from 'react';
import {
  Sparkles,
  Flame,
  Clock,
  CheckCircle2,
  Circle,
  Calendar,
  ArrowRight,
  TrendingUp,
  Brain,
  Timer,
  FileText,
  HelpCircle,
  Plus,
  Target,
  BookOpen,
} from 'lucide-react';
import { TaskItem, DeadlineItem, UserStats, NavSection } from '../types';

interface DashboardViewProps {
  stats: UserStats;
  tasks: TaskItem[];
  deadlines: DeadlineItem[];
  onToggleTask: (id: string) => void;
  onNavigate: (section: NavSection) => void;
  onOpenAssistant: () => void;
  weeklyActivity: { day: string; focusHours: number; tasksCompleted: number }[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  tasks,
  deadlines,
  onToggleTask,
  onNavigate,
  onOpenAssistant,
  weeklyActivity,
}) => {
  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / (tasks.length || 1)) * 100);

  // Maximum hours for weekly bar scaling
  const maxWeeklyHours = Math.max(...weeklyActivity.map((w) => w.focusHours), 6);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* 1. Personalized Greeting & Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#12192e] via-[#151f38] to-[#11192d] border border-slate-800 p-6 md:p-8 shadow-xl">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wide uppercase">
              <Sparkles className="w-4 h-4" />
              <span>EduPilot AI · Academic Co-Pilot</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Good morning, Alex!
            </h2>
            <p className="text-slate-300 text-sm md:text-base max-w-xl leading-relaxed">
              Ready to make today count? You have <strong className="text-white font-semibold">{tasks.length - completedCount} priority tasks</strong> scheduled today and your midterm is in <strong className="text-violet-300 font-semibold">6 days</strong>.
            </p>
          </div>

          {/* Quick Metrics Cluster */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="bg-[#0b101e]/80 border border-slate-800 rounded-xl px-4 py-3 min-w-[120px]">
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium mb-1">
                <Flame className="w-4 h-4 fill-amber-400/20" />
                <span>Streak</span>
              </div>
              <div className="text-2xl font-bold text-white font-mono tabular-nums">
                {stats.studyStreakDays} <span className="text-xs font-sans text-slate-400 font-normal">days</span>
              </div>
            </div>

            <div className="bg-[#0b101e]/80 border border-slate-800 rounded-xl px-4 py-3 min-w-[130px]">
              <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-medium mb-1">
                <Clock className="w-4 h-4" />
                <span>Total Focus</span>
              </div>
              <div className="text-2xl font-bold text-white font-mono tabular-nums">
                {stats.totalFocusHours} <span className="text-xs font-sans text-slate-400 font-normal">hrs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Progress Indicator Bar */}
        <div className="relative z-10 mt-6 pt-5 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-2">
              <span className="text-slate-300 font-medium">Daily Task Completion</span>
              <span className="text-slate-500">·</span>
              <span className="text-cyan-400 font-mono font-medium">{completedCount} of {tasks.length} completed</span>
            </div>
            <span className="text-white font-mono font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-900/80 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Prominent AI Study Assistant Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#141b31] via-[#101728] to-[#0c1220] border border-violet-500/30 p-6 shadow-lg shadow-violet-950/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-[1px] shrink-0 shadow-lg shadow-indigo-600/30">
              <div className="w-full h-full bg-[#0d1322] rounded-[15px] flex items-center justify-center">
                <Brain className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-white tracking-tight">AI Study Companion</h3>
                <span className="text-[11px] font-semibold text-violet-300 bg-violet-950/80 border border-violet-700/50 px-2 py-0.5 rounded-full">
                  Real-Time Cognitive Assistant
                </span>
              </div>
              <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
                Stuck on <strong className="text-white">Maxwell's equations</strong> or need an active recall drill for engineering math and circuits?
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                <button
                  onClick={onOpenAssistant}
                  className="text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 px-2.5 py-1 rounded-lg border border-slate-700/60 transition-colors"
                >
                  "Explain Maxwell's equations"
                </button>
                <button
                  onClick={onOpenAssistant}
                  className="text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 px-2.5 py-1 rounded-lg border border-slate-700/60 transition-colors"
                >
                  "Laplace transform formula sheet"
                </button>
                <button
                  onClick={onOpenAssistant}
                  className="text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 px-2.5 py-1 rounded-lg border border-slate-700/60 transition-colors"
                >
                  "Feynman analogy for Op-Amps"
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenAssistant}
            className="w-full md:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>Consult Assistant</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

      {/* 3. Quick Action Buttons Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigate('timer')}
          className="p-4 rounded-xl bg-[#0f172a] hover:bg-[#131d36] border border-slate-800 hover:border-cyan-500/40 text-left transition-all duration-200 group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Timer className="w-5 h-5 text-cyan-400" />
          </div>
          <h4 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">Start Focus Session</h4>
          <p className="text-xs text-slate-400 mt-1">25m Pomodoro with ambient soundscape</p>
        </button>

        <button
          onClick={() => onNavigate('planner')}
          className="p-4 rounded-xl bg-[#0f172a] hover:bg-[#131d36] border border-slate-800 hover:border-violet-500/40 text-left transition-all duration-200 group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/30 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Calendar className="w-5 h-5 text-violet-400" />
          </div>
          <h4 className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">Generate Study Plan</h4>
          <p className="text-xs text-slate-400 mt-1">AI timetable tailored to exam dates</p>
        </button>

        <button
          onClick={() => onNavigate('quiz')}
          className="p-4 rounded-xl bg-[#0f172a] hover:bg-[#131d36] border border-slate-800 hover:border-emerald-500/40 text-left transition-all duration-200 group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <HelpCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <h4 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">Practice AI Quiz</h4>
          <p className="text-xs text-slate-400 mt-1">Multiple-choice recall with explanations</p>
        </button>

        <button
          onClick={() => onNavigate('notes')}
          className="p-4 rounded-xl bg-[#0f172a] hover:bg-[#131d36] border border-slate-800 hover:border-indigo-500/40 text-left transition-all duration-200 group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5 text-indigo-400" />
          </div>
          <h4 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">Synthesize Notes</h4>
          <p className="text-xs text-slate-400 mt-1">Extract key definitions & Feynman summaries</p>
        </button>
      </div>

      {/* 4. Split Section: Today's Schedule & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule (2 cols on desktop) */}
        <div className="lg:col-span-2 rounded-2xl bg-[#0f172a] border border-slate-800 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Today's Study Schedule</h3>
                <p className="text-xs text-slate-400 mt-0.5">Optimized for high-energy retention blocks</p>
              </div>
              <button
                onClick={() => onNavigate('planner')}
                className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>View Full Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(task.id)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                    task.completed
                      ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
                      : 'bg-[#131c31] border-slate-800 hover:border-slate-700 hover:bg-[#16223d]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      className="p-1 text-slate-400 hover:text-white shrink-0"
                      aria-label="Toggle task completion"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500 hover:text-cyan-400" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <h4
                        className={`text-sm font-semibold truncate ${
                          task.completed ? 'line-through text-slate-400' : 'text-white'
                        }`}
                      >
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="font-medium text-slate-300">{task.subject}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{task.time}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{task.durationMinutes}m</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                        task.priority === 'High'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : task.priority === 'Medium'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Click any task to toggle completion</span>
            <button
              onClick={() => onNavigate('planner')}
              className="text-violet-400 hover:text-violet-300 font-medium"
            >
              + Add Custom Block
            </button>
          </div>
        </div>

        {/* Upcoming Deadlines (1 col) */}
        <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Upcoming Deadlines</h3>
                <p className="text-xs text-slate-400 mt-0.5">Target exam & submission dates</p>
              </div>
              <Calendar className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-3.5">
              {deadlines.map((dl) => (
                <div
                  key={dl.id}
                  className="p-3.5 rounded-xl bg-[#131c31] border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-300">{dl.course}</span>
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                        dl.daysRemaining <= 7
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse'
                          : 'bg-indigo-950/60 text-cyan-300 border border-indigo-800/40'
                      }`}
                    >
                      {dl.daysRemaining} days left
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1.5 leading-snug">
                    {dl.title}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-slate-400 mt-2.5 pt-2 border-t border-slate-800/80">
                    <span>Due: {dl.dueDate}</span>
                    <span className="text-[11px] font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                      {dl.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <button
              onClick={() => onNavigate('planner')}
              className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Map Study Roadmaps</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Weekly Productivity Chart & Cognitive Insights */}
      <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base font-bold text-white tracking-tight">Weekly Focus Volume</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Tracked deep work hours across the past 7 days (Goal: 25.0 hrs)
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-t from-violet-600 to-cyan-400" />
              <span>Actual Hours</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-700" />
              <span>Target Pace</span>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-48 pt-6 pb-2 border-b border-slate-800">
          {weeklyActivity.map((dayData, idx) => {
            const heightPercent = Math.round((dayData.focusHours / maxWeeklyHours) * 100);
            const isToday = idx === 1; // Tuesday demo
            return (
              <div key={dayData.day} className="flex flex-col items-center gap-2 h-full justify-end group">
                {/* Tooltip value */}
                <div className="text-[11px] font-mono text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded shadow-sm">
                  {dayData.focusHours}h
                </div>

                <div className="w-full max-w-[38px] bg-slate-800/80 rounded-t-lg h-full flex items-end overflow-hidden p-0.5">
                  <div
                    className={`w-full rounded-t-md transition-all duration-500 ${
                      isToday
                        ? 'bg-gradient-to-t from-violet-600 via-indigo-500 to-cyan-400 shadow-lg shadow-cyan-500/20'
                        : 'bg-gradient-to-t from-violet-700/60 to-indigo-500/80 group-hover:from-violet-600 group-hover:to-cyan-400'
                    }`}
                    style={{ height: `${Math.max(8, heightPercent)}%` }}
                  />
                </div>

                <span
                  className={`text-xs font-medium ${
                    isToday ? 'text-cyan-400 font-bold' : 'text-slate-400'
                  }`}
                >
                  {dayData.day}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-semibold font-mono tabular-nums">+18% increase</span>
            <span>in focus efficiency compared to last week</span>
          </div>
          <button
            onClick={() => onNavigate('progress')}
            className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
          >
            View Detailed Analytics →
          </button>
        </div>
      </div>
    </div>
  );
};

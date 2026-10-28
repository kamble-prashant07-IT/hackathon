import React, { useState } from 'react';
import {
  CalendarDays,
  Sparkles,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  RefreshCw,
  Atom,
  Binary,
  Cpu,
  FlaskConical,
  Code2,
} from 'lucide-react';
import { StudyPlan } from '../types';
import { requestStudyPlan } from '../services/aiService';

interface PlannerViewProps {
  plans: StudyPlan[];
  onAddPlan: (plan: StudyPlan) => void;
  onUpdateSessionCompletion: (planId: string, sessionId: string, completed: boolean) => void;
  showToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

// Strictly engineering subjects as requested
export type EngineeringSubject =
  | 'Physics'
  | 'Math'
  | 'Chemistry'
  | 'Electronics'
  | 'Programming Language';

interface SubjectMeta {
  id: EngineeringSubject;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  activeColor: string;
  defaultDifficulties: string[];
}

const ENGINEERING_SUBJECTS: SubjectMeta[] = [
  {
    id: 'Physics',
    label: 'Physics',
    sublabel: 'Mechanics, Electromagnetism & Optics',
    icon: Atom,
    color: 'text-cyan-400 border-cyan-500/30',
    activeColor: 'bg-cyan-500/15 border-cyan-400 text-white shadow-lg shadow-cyan-500/20',
    defaultDifficulties: ['Maxwell’s Equations', 'Thermodynamic Cycles', 'Wave Interference', 'Lagrangian Mechanics'],
  },
  {
    id: 'Math',
    label: 'Math',
    sublabel: 'Calculus, Linear Algebra & ODEs',
    icon: Binary,
    color: 'text-violet-400 border-violet-500/30',
    activeColor: 'bg-violet-500/15 border-violet-400 text-white shadow-lg shadow-violet-500/20',
    defaultDifficulties: ['Eigenvalues & SVD', 'Laplace Transforms', 'Vector Calculus', 'Fourier Series'],
  },
  {
    id: 'Chemistry',
    label: 'Chemistry',
    sublabel: 'Thermodynamics & Materials',
    icon: FlaskConical,
    color: 'text-emerald-400 border-emerald-500/30',
    activeColor: 'bg-emerald-500/15 border-emerald-400 text-white shadow-lg shadow-emerald-500/20',
    defaultDifficulties: ['Chemical Thermodynamics', 'Nernst Equation', 'Galvanic Corrosion', 'Polymer Synthesis'],
  },
  {
    id: 'Electronics',
    label: 'Electronics',
    sublabel: 'Semiconductors, Op-Amps & Digital',
    icon: Cpu,
    color: 'text-amber-400 border-amber-500/30',
    activeColor: 'bg-amber-500/15 border-amber-400 text-white shadow-lg shadow-amber-500/20',
    defaultDifficulties: ['BJT & MOSFET Biasing', 'Op-Amp Filter Design', 'K-Map Logic Minimization', 'Diode Rectifiers'],
  },
  {
    id: 'Programming Language',
    label: 'Programming Language',
    sublabel: 'C++, Python, DSA & OOP',
    icon: Code2,
    color: 'text-indigo-400 border-indigo-500/30',
    activeColor: 'bg-indigo-500/15 border-indigo-400 text-white shadow-lg shadow-indigo-500/20',
    defaultDifficulties: ['Pointers & Dynamic Memory', 'Binary Search Trees & Trees', 'Virtual Tables & OOP', 'Dynamic Programming'],
  },
];

export const PlannerView: React.FC<PlannerViewProps> = ({
  plans,
  onAddPlan,
  onUpdateSessionCompletion,
  showToast,
}) => {
  // Option 1: Engineering Subject (Physics, Math, Chemistry, Electronics, Programming Language)
  const [selectedSubject, setSelectedSubject] = useState<EngineeringSubject>('Physics');

  // Option 2: Target Date
  const [targetDate, setTargetDate] = useState('2026-11-15');

  // Option 3: Daily Available Hours
  const [dailyHours, setDailyHours] = useState('3');

  // Option 4: Difficult Topics
  const [difficultTopics, setDifficultTopics] = useState(
    'Maxwell’s Equations, Boundary Value Problems, Thermodynamic Cycles'
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(plans[0]?.id || '');

  // Select subject handler
  const handleSelectSubject = (subj: EngineeringSubject) => {
    setSelectedSubject(subj);
    const meta = ENGINEERING_SUBJECTS.find((s) => s.id === subj);
    if (meta) {
      setDifficultTopics(meta.defaultDifficulties.slice(0, 2).join(', '));
    }
  };

  // Active plan
  const activePlan = plans.find((p) => p.id === selectedPlanId) || plans[0];

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const planData = await requestStudyPlan({
        subject: selectedSubject,
        examDate: targetDate,
        dailyHours: Number(dailyHours),
        difficultTopics,
      });

      if (planData) {
        const newPlan: StudyPlan = {
          id: `plan-${Date.now()}`,
          title: planData.title || `${selectedSubject} Mastery Sprint`,
          subject: selectedSubject,
          overview:
            planData.overview ||
            `Targeted engineering study roadmap for ${selectedSubject} calibrated for ${dailyHours}h/day.`,
          estimatedTotalHours: planData.estimatedTotalHours || Number(dailyHours) * 5,
          examDate: targetDate,
          sessions: (planData.sessions || []).map((s: any, idx: number) => ({
            id: s.id || `s-${Date.now()}-${idx}`,
            day: s.day || `Day ${idx + 1}`,
            date: s.date || `Session ${idx + 1}`,
            topic: s.topic || `${selectedSubject} Core Review`,
            focus: s.focus || 'Problem solving and active recall',
            durationMinutes: s.durationMinutes || 90,
            priority: s.priority || 'High',
            tasks: s.tasks || ['Review core formulas', 'Solve 4 benchmark problems'],
            learningTechnique: s.learningTechnique || 'Active Recall',
            completed: false,
          })),
          createdAt: new Date().toISOString(),
        };

        onAddPlan(newPlan);
        setSelectedPlanId(newPlan.id);
        showToast(
          'Study Plan Ready!',
          `Generated ${newPlan.sessions.length}-day schedule for ${selectedSubject}.`,
          'success'
        );
      }
    } catch {
      showToast('Error', 'Failed to generate study plan. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyPlanSummary = () => {
    if (!activePlan) return;
    const text = `# ${activePlan.title} (${activePlan.subject})
Target Date: ${activePlan.examDate || targetDate}
Daily Hours: ${dailyHours}h/day (~${activePlan.estimatedTotalHours} Total Hours)

Schedule:
${activePlan.sessions
  .map(
    (s) =>
      `• [${s.completed ? 'x' : ' '}] ${s.day} (${s.durationMinutes}m) - ${s.topic}\n  Focus: ${s.focus}\n  Tasks:\n${s.tasks.map((t) => `    - ${t}`).join('\n')}`
  )
  .join('\n\n')}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Copied to Clipboard', 'Study schedule copied.', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const currentMeta = ENGINEERING_SUBJECTS.find((s) => s.id === selectedSubject)!;
  const completedSessions = activePlan?.sessions.filter((s) => s.completed).length || 0;
  const totalSessions = activePlan?.sessions.length || 0;
  const planProgress = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wide uppercase">
            <CalendarDays className="w-4 h-4" />
            <span>AI Study Planner</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1">
            Engineering Study Planner
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mt-1 leading-relaxed">
            Simple and structured study roadmap generator designed specifically for engineering students.
          </p>
        </div>

        {plans.length > 1 && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-400">Saved Plans:</span>
            <select
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              className="bg-[#131c31] border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.subject} · {p.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Simple 4-Step Generator Panel */}
      <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-6 md:p-8 shadow-xl space-y-6">
        {/* OPTION 1: Engineering Subjects (Physics, Math, Chemistry, Electronics, Programming Language) */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-2.5">
            1. Select Engineering Subject
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {ENGINEERING_SUBJECTS.map((subj) => {
              const Icon = subj.icon;
              const isSelected = selectedSubject === subj.id;
              return (
                <button
                  key={subj.id}
                  type="button"
                  onClick={() => handleSelectSubject(subj.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? subj.activeColor
                      : 'bg-[#131c31] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{subj.label}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{subj.sublabel}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* OPTION 2 & 3: Target Date and Daily Available Hours */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-800/80">
          {/* OPTION 2: Target Date */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
              2. Target / Exam Date
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full bg-[#131c31] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40"
            />
            <p className="text-[11px] text-slate-400">Date of your exam, submission, or evaluation</p>
          </div>

          {/* OPTION 3: Daily Available Hours */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
                3. Daily Available Hours
              </label>
              <span className="text-xs font-mono font-bold text-white bg-cyan-950/70 border border-cyan-800/40 px-2 py-0.5 rounded">
                {dailyHours} Hours / Day
              </span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {['1', '2', '3', '4', '5', '6'].map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setDailyHours(h)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    dailyHours === h
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                      : 'bg-[#131c31] text-slate-400 hover:text-white border border-slate-700'
                  }`}
                >
                  {h}h
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400">Total dedicated study time per day</p>
          </div>
        </div>

        {/* OPTION 4: Difficult Topics */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
            4. Difficult Topics <span className="text-slate-400 normal-case font-normal">(Focus Areas)</span>
          </label>
          <input
            type="text"
            value={difficultTopics}
            onChange={(e) => setDifficultTopics(e.target.value)}
            placeholder="e.g. Thermodynamics, Laplace Transforms, Maxwell's Equations, Pointers..."
            className="w-full bg-[#131c31] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
          />

          {/* Quick Clickable Suggestions for the chosen subject */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
            <span className="text-[11px] text-slate-400 font-medium">Quick Suggestions:</span>
            {currentMeta.defaultDifficulties.map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => {
                  setDifficultTopics((prev) => {
                    const parts = prev.split(',').map((p) => p.trim()).filter(Boolean);
                    if (parts.includes(diff)) return prev;
                    return parts.length > 0 ? `${prev}, ${diff}` : diff;
                  });
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] border border-slate-700 transition-colors cursor-pointer"
              >
                + {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={handleGeneratePlan}
            disabled={isGenerating}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-200" />
                <span>Generating {selectedSubject} Plan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>Generate My Study Plan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Schedule Cards */}
      {activePlan && (
        <div className="space-y-6">
          {/* Plan Summary Bar */}
          <div className="rounded-2xl bg-gradient-to-r from-[#12192e] to-[#0f172a] border border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono mb-1">
                <span className="font-bold">{activePlan.subject}</span>
                <span aria-hidden="true">·</span>
                <span>Target Date: {activePlan.examDate || targetDate}</span>
                <span aria-hidden="true">·</span>
                <span>~{activePlan.estimatedTotalHours} Total Hours</span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">{activePlan.title}</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">{activePlan.overview}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={copyPlanSummary}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy Plan'}</span>
              </button>
            </div>
          </div>

          {/* Progress Strip */}
          <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Sprint Completion Progress</span>
            <div className="flex items-center gap-3">
              <div className="w-36 h-2 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-300"
                  style={{ width: `${planProgress}%` }}
                />
              </div>
              <span className="font-mono font-bold text-white">
                {completedSessions} / {totalSessions} ({planProgress}%)
              </span>
            </div>
          </div>

          {/* Sessions List */}
          <div className="space-y-3.5">
            {activePlan.sessions.map((session) => (
              <div
                key={session.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  session.completed
                    ? 'bg-[#0f172a]/60 border-slate-800/60 opacity-70'
                    : 'bg-[#0f172a] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <button
                      onClick={() =>
                        onUpdateSessionCompletion(activePlan.id, session.id, !session.completed)
                      }
                      className="mt-1 text-slate-500 hover:text-cyan-400 transition-colors shrink-0 cursor-pointer"
                      aria-label="Toggle session completion"
                    >
                      {session.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-400/20" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-500 hover:text-cyan-400" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 text-xs">
                        <span className="font-bold text-cyan-400 font-mono">{session.day}</span>
                        <span className="text-slate-600">·</span>
                        <span className="text-slate-400 font-mono">{session.durationMinutes} mins</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            session.priority === 'High'
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {session.priority}
                        </span>
                      </div>

                      <h4
                        className={`text-base font-bold ${
                          session.completed ? 'line-through text-slate-400' : 'text-white'
                        }`}
                      >
                        {session.topic}
                      </h4>
                      <p className="text-xs text-slate-300 mt-1">{session.focus}</p>
                    </div>
                  </div>

                  <div className="shrink-0 text-left md:text-right">
                    <span className="text-[11px] text-slate-400 block">Method</span>
                    <span className="text-xs font-semibold text-cyan-300 block">
                      {session.learningTechnique}
                    </span>
                  </div>
                </div>

                {/* Tactical Tasks List */}
                <div className="px-5 py-3 bg-[#0c1220]/70 border-t border-slate-800/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Study Tasks:
                  </span>
                  <ul className="space-y-1">
                    {session.tasks.map((task, tidx) => (
                      <li key={tidx} className="flex items-start gap-2 text-xs text-slate-300">
                        <span className="text-cyan-400 font-mono">0{tidx + 1}.</span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

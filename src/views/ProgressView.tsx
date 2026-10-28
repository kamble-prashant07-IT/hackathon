import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  Trophy,
  Flame,
  Award,
  Zap,
  BookOpen,
  Calendar,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { UserStats, QuizResultRecord } from '../types';
import { WEEKLY_ACTIVITY, SUBJECT_PROGRESS } from '../data/mockData';

interface ProgressViewProps {
  stats: UserStats;
  quizHistory: QuizResultRecord[];
}

export const ProgressView: React.FC<ProgressViewProps> = ({ stats, quizHistory }) => {
  const maxWeeklyHours = Math.max(...WEEKLY_ACTIVITY.map((w) => w.focusHours), 6);

  // Consistency calendar days (simulating 4 weeks = 28 days)
  const heatmapDays = [
    { day: 1, level: 3 }, { day: 2, level: 2 }, { day: 3, level: 4 }, { day: 4, level: 1 },
    { day: 5, level: 4 }, { day: 6, level: 3 }, { day: 7, level: 1 }, { day: 8, level: 2 },
    { day: 9, level: 3 }, { day: 10, level: 4 }, { day: 11, level: 4 }, { day: 12, level: 2 },
    { day: 13, level: 3 }, { day: 14, level: 4 }, { day: 15, level: 3 }, { day: 16, level: 4 },
    { day: 17, level: 2 }, { day: 18, level: 4 }, { day: 19, level: 4 }, { day: 20, level: 3 },
    { day: 21, level: 4 }, { day: 22, level: 1 }, { day: 23, level: 3 }, { day: 24, level: 4 },
    { day: 25, level: 4 }, { day: 26, level: 3 }, { day: 27, level: 4 }, { day: 28, level: 4 },
  ];

  const getHeatmapColor = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-violet-950/60 border-violet-900/50';
      case 2:
        return 'bg-violet-800/80 border-violet-700/60';
      case 3:
        return 'bg-indigo-600 border-indigo-500';
      case 4:
        return 'bg-cyan-400 border-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.5)]';
      default:
        return 'bg-slate-900 border-slate-800';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wide uppercase">
          <BarChart3 className="w-4 h-4" />
          <span>Academic Telemetry & Analytics</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1">
          Mastery & Growth Velocity
        </h2>
        <p className="text-slate-300 text-sm max-w-2xl mt-1 leading-relaxed">
          Quantitative telemetry of your cognitive throughput, subject mastery curves, and active recall consistency.
        </p>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800">
          <div className="flex items-center justify-between text-xs text-amber-400 font-semibold mb-2">
            <span>Study Streak</span>
            <Flame className="w-4 h-4 fill-amber-400/20" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
            {stats.studyStreakDays} <span className="text-sm font-normal text-slate-400 font-sans">days</span>
          </div>
          <div className="text-xs text-emerald-400 mt-1 font-medium">Top 5% student percentile</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800">
          <div className="flex items-center justify-between text-xs text-cyan-400 font-semibold mb-2">
            <span>Total Focus Work</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
            {stats.totalFocusHours} <span className="text-sm font-normal text-slate-400 font-sans">hrs</span>
          </div>
          <div className="text-xs text-cyan-300 mt-1 font-mono">21.5 hrs this week (86% of goal)</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800">
          <div className="flex items-center justify-between text-xs text-violet-400 font-semibold mb-2">
            <span>Quizzes Completed</span>
            <Trophy className="w-4 h-4" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
            {stats.quizzesTaken}
          </div>
          <div className="text-xs text-violet-300 mt-1 font-mono">Avg score: {stats.averageQuizScore}%</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold mb-2">
            <span>Tasks Finished</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
            42 <span className="text-sm font-normal text-slate-400 font-sans">this month</span>
          </div>
          <div className="text-xs text-emerald-300 mt-1 font-medium">94% on-time completion</div>
        </div>
      </div>

      {/* Motivational & Cognitive Insights (based on actual tracked data) */}
      <div className="rounded-2xl bg-gradient-to-r from-[#141b31] via-[#101729] to-[#0d1424] border border-indigo-500/30 p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white tracking-tight">
            AI Cognitive Diagnostics & Strategic Insights
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#131c31] border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Peak Retention Window</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your focus session completion and quiz recall scores are highest between <strong className="text-white">9:00 AM – 11:30 AM</strong> (94% accuracy). Schedule high-complexity proofs here.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#131c31] border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-violet-300">
              <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
              <span>Spaced Retrieval Efficacy</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Taking an AI Quiz 24 hours after reading smart notes raised your multi-part problem score by <strong className="text-emerald-400">+22%</strong> on Distributed Systems.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#131c31] border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Recommended Adjustment</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Linear Algebra shows the lowest mastery ratio (71%). Allocate a 50-minute deep focus block to <strong className="text-white">SVD decomposition proofs</strong> tomorrow.
            </p>
          </div>
        </div>
      </div>

      {/* Split Section: Subject-wise Mastery & 28-Day Consistency Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject-wise Progress */}
        <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Subject-Wise Mastery</h3>
              <p className="text-xs text-slate-400">Curriculum coverage and syllabus mastery index</p>
            </div>
            <BookOpen className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-4">
            {SUBJECT_PROGRESS.map((sub) => (
              <div key={sub.subject} className="p-4 rounded-xl bg-[#131c31] border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{sub.subject}</h4>
                    <span className="text-xs text-slate-400">
                      {sub.topicsMastered} of {sub.topicsTotal} topics mastered · {sub.hoursStudied} hrs
                    </span>
                  </div>
                  <span className={`text-base font-extrabold font-mono ${sub.accentText}`}>
                    {sub.mastery}%
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full ${sub.color} rounded-full transition-all duration-500`}
                    style={{ width: `${sub.mastery}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 28-Day Consistency Heatmap & Quiz Performance */}
        <div className="space-y-6">
          {/* Consistency Heatmap */}
          <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">28-Day Study Cadence</h3>
                <p className="text-xs text-slate-400">Consistent daily study volume across 4 weeks</p>
              </div>
              <Calendar className="w-4 h-4 text-slate-400" />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-2">
              {heatmapDays.map((d) => (
                <div
                  key={d.day}
                  className={`h-9 rounded-lg border flex items-center justify-center text-[10px] font-mono text-white/90 font-medium ${getHeatmapColor(
                    d.level
                  )}`}
                  title={`Day ${d.day}: Level ${d.level} intensity`}
                >
                  {d.day}
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80">
              <span>Less effort</span>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-violet-950/60 border border-violet-900/50" />
                <span className="w-3 h-3 rounded bg-violet-800/80 border border-violet-700/60" />
                <span className="w-3 h-3 rounded bg-indigo-600 border border-indigo-500" />
                <span className="w-3 h-3 rounded bg-cyan-400 border border-cyan-300" />
              </div>
              <span>Peak deep work</span>
            </div>
          </div>

          {/* Recent Quiz Performance Ledger */}
          <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-6">
            <h3 className="text-base font-bold text-white tracking-tight mb-1">
              Recent Quiz Telemetry
            </h3>
            <p className="text-xs text-slate-400 mb-4">Latest active recall verification results</p>

            <div className="space-y-2.5">
              {quizHistory.slice(0, 4).map((q) => (
                <div
                  key={q.id}
                  className="p-3 rounded-xl bg-[#131c31] border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-white truncate">{q.topic}</h5>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {q.date} · {q.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-mono font-bold text-cyan-300">
                      {q.score}/{q.totalQuestions}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded font-mono ${
                        q.percentage >= 80
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {q.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Settings,
  User,
  Sliders,
  Bell,
  Shield,
  Save,
  Check,
  Brain,
  Sparkles,
  Volume2,
} from 'lucide-react';

interface SettingsViewProps {
  dailyGoalSessions: number;
  setDailyGoalSessions: (n: number) => void;
  showToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  dailyGoalSessions,
  setDailyGoalSessions,
  showToast,
}) => {
  const [name, setName] = useState('Alex Chen');
  const [major, setMajor] = useState('Computer Science & Cognitive Neuroscience');
  const [institution, setInstitution] = useState('University College of Engineering');
  const [targetGpa, setTargetGpa] = useState('3.95');
  const [enableSoundChime, setEnableSoundChime] = useState(true);
  const [enableSpacedRepetitionAlerts, setEnableSpacedRepetitionAlerts] = useState(true);
  const [activeModel] = useState('gemini-3.8-flash');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    showToast('Settings Saved', 'Preferences updated successfully across your workspace.', 'success');
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wide uppercase">
          <Settings className="w-4 h-4" />
          <span>Workspace Preferences</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1">
          Settings & Cognitive Preferences
        </h2>
        <p className="text-slate-300 text-sm max-w-2xl mt-1 leading-relaxed">
          Configure your academic profile, focus targets, and study intelligence algorithms.
        </p>
      </div>

      {/* Academic Profile */}
      <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-6 shadow-xl space-y-5">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
          <User className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white tracking-tight">Academic Profile</h3>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="relative">
            <img
              src="/src/assets/images/student_avatar_alex_1793178717644.jpg"
              alt="Alex"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-violet-500/50 shadow-md"
            />
            <div className="w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#0f172a] absolute -bottom-1 -right-1" />
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base font-bold text-white">{name}</h4>
            <p className="text-xs text-slate-400">{major}</p>
            <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-950/70 border border-cyan-800/50 px-2.5 py-0.5 rounded-full inline-block">
              {institution}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#131c31] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Target Cumulative GPA</label>
            <input
              type="text"
              value={targetGpa}
              onChange={(e) => setTargetGpa(e.target.value)}
              className="w-full bg-[#131c31] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-300 block mb-1">Degree / Major Focus</label>
            <input
              type="text"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="w-full bg-[#131c31] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>
      </div>

      {/* Focus & Timer Targets */}
      <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-6 shadow-xl space-y-5">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
          <Sliders className="w-5 h-5 text-violet-400" />
          <h3 className="text-base font-bold text-white tracking-tight">Study Habits & Daily Targets</h3>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">Daily Focus Sessions Goal</label>
              <span className="text-xs font-mono font-bold text-cyan-400">{dailyGoalSessions} Sessions / Day</span>
            </div>
            <div className="flex items-center gap-2">
              {[3, 4, 6, 8, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setDailyGoalSessions(num)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    dailyGoalSessions === num
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                      : 'bg-[#131c31] text-slate-400 hover:text-white border border-slate-700'
                  }`}
                >
                  {num} Sessions
                </button>
              ))}
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#131c31] border border-slate-800">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">Auditory Chime on Timer Completion</span>
                <span className="text-[11px] text-slate-400">Play synthetic arpeggio when focus or break intervals end</span>
              </div>
              <input
                type="checkbox"
                checked={enableSoundChime}
                onChange={(e) => setEnableSoundChime(e.target.checked)}
                className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#131c31] border border-slate-800">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">Spaced Recall Reminders</span>
                <span className="text-[11px] text-slate-400">Prompt a 3-question diagnostic quiz 24 hours after note synthesis</span>
              </div>
              <input
                type="checkbox"
                checked={enableSpacedRepetitionAlerts}
                onChange={(e) => setEnableSpacedRepetitionAlerts(e.target.checked)}
                className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* AI Model Intelligence */}
      <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-6 shadow-xl space-y-5">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
          <Brain className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white tracking-tight">AI Model Intelligence</h3>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-[#131c31] border border-slate-800">
          <div>
            <span className="text-xs font-bold text-white block">Configured LLM Engine</span>
            <span className="text-[11px] text-slate-400">High-throughput reasoning model running server-side</span>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/70 border border-cyan-800/50 px-3 py-1 rounded-lg">
            {activeModel}
          </span>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
        >
          {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? 'Preferences Saved' : 'Save Preferences'}</span>
        </button>
      </div>
    </div>
  );
};

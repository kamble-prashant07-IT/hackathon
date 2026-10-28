import React, { useState, useEffect } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  Coffee,
  Brain,
  Headphones,
  Sliders,
  Target,
} from 'lucide-react';
import {
  playAmbientSound,
  stopAmbientSound,
  setAmbientVolume,
  playCompletionChime,
  SoundscapeType,
} from '../utils/audio';

interface FocusTimerViewProps {
  isTimerRunning: boolean;
  setIsTimerRunning: (running: boolean) => void;
  secondsLeft: number;
  setSecondsLeft: React.Dispatch<React.SetStateAction<number>>;
  completedSessions: number;
  setCompletedSessions: React.Dispatch<React.SetStateAction<number>>;
  dailyGoalSessions: number;
  showToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

type TimerMode = 'pomodoro-25' | 'deep-50' | 'short-break' | 'long-break';

const MODE_CONFIGS: Record<TimerMode, { label: string; duration: number; type: 'study' | 'break' }> = {
  'pomodoro-25': { label: '25m Standard Pomodoro', duration: 25 * 60, type: 'study' },
  'deep-50': { label: '50m Deep Ultradian', duration: 50 * 60, type: 'study' },
  'short-break': { label: '5m Short Break', duration: 5 * 60, type: 'break' },
  'long-break': { label: '15m Long Break', duration: 15 * 60, type: 'break' },
};

export const FocusTimerView: React.FC<FocusTimerViewProps> = ({
  isTimerRunning,
  setIsTimerRunning,
  secondsLeft,
  setSecondsLeft,
  completedSessions,
  setCompletedSessions,
  dailyGoalSessions,
  showToast,
}) => {
  const [activeMode, setActiveMode] = useState<TimerMode>('pomodoro-25');
  const [totalDuration, setTotalDuration] = useState(25 * 60);
  const [activeSubject, setActiveSubject] = useState('Machine Learning · Backprop Derivations');
  const [soundscape, setSoundscape] = useState<SoundscapeType>('none');
  const [volume, setVolume] = useState(0.4);

  // Switch timer mode
  const selectMode = (mode: TimerMode) => {
    setActiveMode(mode);
    setIsTimerRunning(false);
    stopAmbientSound();
    setSoundscape('none');
    const newDuration = MODE_CONFIGS[mode].duration;
    setTotalDuration(newDuration);
    setSecondsLeft(newDuration);
  };

  // Timer countdown effect handled here or in main App.tsx
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isTimerRunning && secondsLeft === 0) {
      setIsTimerRunning(false);
      stopAmbientSound();
      playCompletionChime();

      if (MODE_CONFIGS[activeMode].type === 'study') {
        setCompletedSessions((prev) => prev + 1);
        showToast('Session Completed!', 'Great job maintaining deep focus! Time for a break.', 'success');
      } else {
        showToast('Break Finished', 'Feeling refreshed? Ready for your next focus session.', 'info');
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, secondsLeft, activeMode]);

  // Handle ambient sound changes
  const handleSoundscapeChange = (type: SoundscapeType) => {
    setSoundscape(type);
    if (type === 'none') {
      stopAmbientSound();
    } else {
      playAmbientSound(type, volume);
      showToast('Soundscape Active', `Playing ${type.replace('-', ' ')}`, 'info');
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    setAmbientVolume(newVol);
  };

  const toggleTimer = () => {
    if (!isTimerRunning) {
      setIsTimerRunning(true);
      if (soundscape !== 'none') {
        playAmbientSound(soundscape, volume);
      }
    } else {
      setIsTimerRunning(false);
      stopAmbientSound();
    }
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    stopAmbientSound();
    setSecondsLeft(totalDuration);
  };

  // SVG circular math
  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = totalDuration > 0 ? (totalDuration - secondsLeft) / totalDuration : 0;
  const strokeDashoffset = circumference * (1 - progressRatio);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const isBreak = MODE_CONFIGS[activeMode].type === 'break';

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wide uppercase px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40">
          <Timer className="w-3.5 h-3.5" />
          <span>Distraction-Free Immersion</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Deep Focus Timer
        </h2>
        <p className="text-slate-300 text-sm max-w-lg mx-auto leading-relaxed">
          Calibrate your working memory with Pomodoro intervals and synthetic neuro-ambient soundscapes.
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center justify-center gap-2 p-1.5 bg-[#0f172a] rounded-2xl border border-slate-800 max-w-md mx-auto">
        <button
          onClick={() => selectMode('pomodoro-25')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeMode === 'pomodoro-25'
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          25m Focus
        </button>
        <button
          onClick={() => selectMode('deep-50')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeMode === 'deep-50'
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          50m Deep
        </button>
        <button
          onClick={() => selectMode('short-break')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeMode === 'short-break'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          5m Break
        </button>
        <button
          onClick={() => selectMode('long-break')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeMode === 'long-break'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          15m Break
        </button>
      </div>

      {/* Circular Timer Main Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#11192e] via-[#0d1424] to-[#0a0f1d] border border-slate-800 p-8 shadow-2xl flex flex-col items-center justify-center">
        {/* Soft background ambient glow */}
        <div
          className={`absolute w-72 h-72 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
            isTimerRunning
              ? isBreak
                ? 'bg-emerald-600/15'
                : 'bg-cyan-500/15'
              : 'bg-violet-600/10'
          }`}
        />

        {/* Current Active Task / Subject Pill */}
        <div className="mb-6 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#131c31] border border-slate-700/80 text-xs">
          {isBreak ? (
            <Coffee className="w-4 h-4 text-emerald-400" />
          ) : (
            <Brain className="w-4 h-4 text-cyan-400" />
          )}
          <span className="text-slate-300 font-medium">Session Task:</span>
          <span className="text-white font-semibold truncate max-w-[240px]">
            {isBreak ? 'Rest, Hydrate & Relax Eyes' : activeSubject}
          </span>
        </div>

        {/* Circular SVG Timer */}
        <div className="relative w-[320px] h-[320px] flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 320 320">
            {/* Background track ring */}
            <circle
              cx="160"
              cy="160"
              r={radius}
              className="text-slate-800/80"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Active animated progress ring */}
            <circle
              cx="160"
              cy="160"
              r={radius}
              stroke={isBreak ? '#10b981' : 'url(#timer-gradient)'}
              strokeWidth="12"
              strokeLinecap="round"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-linear"
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="timer-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="50%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Digital Display */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-6xl font-extrabold font-mono tracking-tight text-white tabular-nums">
              {formattedTime}
            </span>
            <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold mt-2">
              {isTimerRunning ? (isBreak ? 'Break Interval' : 'Deep Work Mode') : 'Paused'}
            </span>
            <span className="text-[11px] text-cyan-400 font-mono mt-1">
              {Math.round(progressRatio * 100)}% elapsed
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={resetTimer}
            className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            title="Reset session"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={toggleTimer}
            className={`px-8 py-4 rounded-2xl text-white font-bold text-base shadow-xl flex items-center gap-3 transition-all hover:scale-105 cursor-pointer ${
              isTimerRunning
                ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
                : 'bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 shadow-indigo-600/40'
            }`}
          >
            {isTimerRunning ? (
              <>
                <Pause className="w-5 h-5 fill-white" />
                <span>Pause Session</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white" />
                <span>Start Focus</span>
              </>
            )}
          </button>
        </div>

        {/* Daily Focus Goal Bar */}
        <div className="mt-8 w-full max-w-sm pt-6 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-300 font-medium">Daily Focus Goal</span>
            <span className="text-cyan-400 font-mono font-bold">
              {completedSessions} / {dailyGoalSessions} Sessions Completed
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.round((completedSessions / dailyGoalSessions) * 100))}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Synthetic Ambient Soundscapes Controls */}
      <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center">
              <Headphones className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Neuro-Ambient Soundscapes</h3>
              <p className="text-xs text-slate-400">Synthesized in-browser audio via Web Audio API (zero external lag)</p>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2 shrink-0">
            <Volume2 className="w-4 h-4 text-slate-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-24 accent-cyan-400 cursor-pointer"
            />
            <span className="text-xs font-mono text-slate-400 w-8 tabular-nums">
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>

        {/* Soundscape Options */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'none' as SoundscapeType, label: 'Silent Focus', desc: 'No background audio' },
            { id: 'white-noise' as SoundscapeType, label: 'Rain & Hum', desc: 'Filtered pink noise' },
            { id: 'theta-waves' as SoundscapeType, label: 'Theta 6Hz', desc: 'Deep memory encoding' },
            { id: 'binaural-focus' as SoundscapeType, label: '40Hz Gamma', desc: 'High mental throughput' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => handleSoundscapeChange(s.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                soundscape === s.id
                  ? 'bg-gradient-to-br from-violet-950/60 to-cyan-950/60 border-cyan-400 text-white shadow-md'
                  : 'bg-[#131c31] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold text-white">{s.label}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{s.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

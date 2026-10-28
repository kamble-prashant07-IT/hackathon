import React, { useState } from 'react';
import { NavSection, TaskItem, DeadlineItem, StudyPlan, SmartNotesResult, QuizData, QuizResultRecord, UserStats } from './types';
import {
  INITIAL_STATS,
  INITIAL_TASKS,
  INITIAL_DEADLINES,
  INITIAL_STUDY_PLANS,
  INITIAL_SMART_NOTES,
  INITIAL_QUIZZES,
  INITIAL_QUIZ_HISTORY,
  WEEKLY_ACTIVITY,
} from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { MobileDrawer } from './components/MobileDrawer';
import { AssistantModal } from './components/AssistantModal';
import { ToastContainer, ToastMessage } from './components/Toast';

import { DashboardView } from './views/DashboardView';
import { PlannerView } from './views/PlannerView';
import { NotesView } from './views/NotesView';
import { QuizView } from './views/QuizView';
import { FocusTimerView } from './views/FocusTimerView';
import { ProgressView } from './views/ProgressView';
import { SettingsView } from './views/SettingsView';

export default function App() {
  const [currentSection, setCurrentSection] = useState<NavSection>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Core dynamic user data
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [deadlines] = useState<DeadlineItem[]>(INITIAL_DEADLINES);
  const [plans, setPlans] = useState<StudyPlan[]>(INITIAL_STUDY_PLANS);
  const [notesList, setNotesList] = useState<SmartNotesResult[]>(INITIAL_SMART_NOTES);
  const [quizList, setQuizList] = useState<QuizData[]>(INITIAL_QUIZZES);
  const [quizHistory, setQuizHistory] = useState<QuizResultRecord[]>(INITIAL_QUIZ_HISTORY);

  // Global Focus Timer State (Runs persistently across tab changes)
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(25 * 60);
  const [completedSessions, setCompletedSessions] = useState(4);
  const [dailyGoalSessions, setDailyGoalSessions] = useState(6);

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (title: string, message?: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, title, message, type };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Task Toggle Handler
  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextState = !t.completed;
          if (nextState) {
            showToast('Task Completed', `"${t.title}" checked off!`, 'success');
            setStats((s) => ({
              ...s,
              completedTasksToday: s.completedTasksToday + 1,
            }));
          } else {
            setStats((s) => ({
              ...s,
              completedTasksToday: Math.max(0, s.completedTasksToday - 1),
            }));
          }
          return { ...t, completed: nextState };
        }
        return t;
      })
    );
  };

  // Study Plan Handlers
  const handleAddPlan = (newPlan: StudyPlan) => {
    setPlans((prev) => [newPlan, ...prev]);
  };

  const handleUpdateSessionCompletion = (planId: string, sessionId: string, completed: boolean) => {
    setPlans((prev) =>
      prev.map((p) => {
        if (p.id === planId) {
          return {
            ...p,
            sessions: p.sessions.map((s) => (s.id === sessionId ? { ...s, completed } : s)),
          };
        }
        return p;
      })
    );
    if (completed) {
      showToast('Session Completed!', 'Sprint progress updated.', 'success');
    }
  };

  // Smart Notes Handlers
  const handleAddNote = (newNote: SmartNotesResult) => {
    setNotesList((prev) => [newNote, ...prev]);
  };

  const handleImportToNotes = (content: string, title: string = 'Imported Notes') => {
    const importedNote: SmartNotesResult = {
      id: `note-${Date.now()}`,
      title,
      readingTimeMinutes: 2,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      executiveSummary: content.slice(0, 160) + '...',
      coreConcepts: [
        {
          name: 'AI Synthesis',
          explanation: content,
          significance: 'Captured from interactive assistant consultation session.',
        },
      ],
      keyDefinitions: [],
      revisionHighlights: ['Review this concept during evening revision block.'],
      feynmanAnalogy: 'Direct breakdown from EduPilot AI.',
    };
    setNotesList((prev) => [importedNote, ...prev]);
    setCurrentSection('notes');
    showToast('Imported to Notes', 'Saved assistant explanation to Smart Notes.', 'success');
  };

  // Quiz Handlers
  const handleAddQuiz = (newQuiz: QuizData) => {
    setQuizList((prev) => [newQuiz, ...prev]);
  };

  const handleRecordQuizResult = (record: QuizResultRecord) => {
    setQuizHistory((prev) => [record, ...prev]);
    setStats((s) => {
      const newCount = s.quizzesTaken + 1;
      const newAvg = Math.round((s.averageQuizScore * s.quizzesTaken + record.percentage) / newCount);
      return {
        ...s,
        quizzesTaken: newCount,
        averageQuizScore: newAvg,
      };
    });
  };

  return (
    <div className="min-h-screen bg-[#0b101e] text-slate-100 flex">
      {/* Desktop Left Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          currentSection={currentSection}
          onSelectSection={setCurrentSection}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          studyStreakDays={stats.studyStreakDays}
        />
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        currentSection={currentSection}
        onSelectSection={setCurrentSection}
        studyStreakDays={stats.studyStreakDays}
      />

      {/* Main Workspace Frame */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'
        }`}
      >
        {/* Top Header */}
        <TopNav
          currentSection={currentSection}
          onSelectSection={setCurrentSection}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenAssistant={() => setIsAssistantOpen(true)}
          isTimerRunning={isTimerRunning}
          timerSecondsLeft={timerSecondsLeft}
        />

        {/* View Content Port */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {currentSection === 'dashboard' && (
            <DashboardView
              stats={stats}
              tasks={tasks}
              deadlines={deadlines}
              onToggleTask={handleToggleTask}
              onNavigate={setCurrentSection}
              onOpenAssistant={() => setIsAssistantOpen(true)}
              weeklyActivity={WEEKLY_ACTIVITY}
            />
          )}

          {currentSection === 'planner' && (
            <PlannerView
              plans={plans}
              onAddPlan={handleAddPlan}
              onUpdateSessionCompletion={handleUpdateSessionCompletion}
              showToast={showToast}
            />
          )}

          {currentSection === 'notes' && (
            <NotesView
              notesList={notesList}
              onAddNote={handleAddNote}
              showToast={showToast}
            />
          )}

          {currentSection === 'quiz' && (
            <QuizView
              quizList={quizList}
              onAddQuiz={handleAddQuiz}
              onRecordQuizResult={handleRecordQuizResult}
              showToast={showToast}
            />
          )}

          {currentSection === 'timer' && (
            <FocusTimerView
              isTimerRunning={isTimerRunning}
              setIsTimerRunning={setIsTimerRunning}
              secondsLeft={timerSecondsLeft}
              setSecondsLeft={setTimerSecondsLeft}
              completedSessions={completedSessions}
              setCompletedSessions={setCompletedSessions}
              dailyGoalSessions={dailyGoalSessions}
              showToast={showToast}
            />
          )}

          {currentSection === 'progress' && (
            <ProgressView stats={stats} quizHistory={quizHistory} />
          )}

          {currentSection === 'settings' && (
            <SettingsView
              dailyGoalSessions={dailyGoalSessions}
              setDailyGoalSessions={setDailyGoalSessions}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Global AI Assistant Modal */}
      <AssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onImportToNotes={handleImportToNotes}
      />

      {/* Global Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

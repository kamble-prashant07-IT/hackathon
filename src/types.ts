export type NavSection =
  | 'dashboard'
  | 'planner'
  | 'notes'
  | 'quiz'
  | 'timer'
  | 'progress'
  | 'settings';

export interface TaskItem {
  id: string;
  title: string;
  subject: string;
  subjectColor: string;
  time: string;
  durationMinutes: number;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
}

export interface DeadlineItem {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  daysRemaining: number;
  type: 'Exam' | 'Assignment' | 'Project' | 'Paper';
  color: string;
}

export interface StudyPlanSession {
  id: string;
  day: string;
  date: string;
  topic: string;
  focus: string;
  durationMinutes: number;
  priority: 'High' | 'Medium' | 'Low';
  tasks: string[];
  learningTechnique: string;
  completed?: boolean;
}

export interface StudyPlan {
  id: string;
  title: string;
  subject: string;
  overview: string;
  estimatedTotalHours: number;
  examDate?: string;
  sessions: StudyPlanSession[];
  createdAt: string;
}

export interface SmartNoteConcept {
  name: string;
  explanation: string;
  significance: string;
}

export interface SmartNoteDefinition {
  term: string;
  definition: string;
}

export interface SmartNotesResult {
  id: string;
  title: string;
  readingTimeMinutes: number;
  executiveSummary: string;
  coreConcepts: SmartNoteConcept[];
  keyDefinitions: SmartNoteDefinition[];
  revisionHighlights: string[];
  feynmanAnalogy: string;
  createdAt: string;
  sourceSnippet?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizData {
  id: string;
  topic: string;
  difficulty: 'beginner' | 'medium' | 'advanced';
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuizResultRecord {
  id: string;
  topic: string;
  date: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  difficulty: string;
}

export interface UserStats {
  studyStreakDays: number;
  totalFocusHours: number;
  weeklyGoalHours: number;
  weeklyActualHours: number;
  completedTasksToday: number;
  totalTasksToday: number;
  quizzesTaken: number;
  averageQuizScore: number;
}

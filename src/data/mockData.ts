import {
  TaskItem,
  DeadlineItem,
  StudyPlan,
  SmartNotesResult,
  QuizData,
  QuizResultRecord,
  UserStats,
} from '../types';

export const INITIAL_STATS: UserStats = {
  studyStreakDays: 14,
  totalFocusHours: 48.5,
  weeklyGoalHours: 25,
  weeklyActualHours: 21.5,
  completedTasksToday: 3,
  totalTasksToday: 5,
  quizzesTaken: 18,
  averageQuizScore: 89,
};

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 't-1',
    title: 'Maxwell’s Equations & Wave Boundary Proof',
    subject: 'Physics',
    subjectColor: 'from-cyan-500 to-blue-600',
    time: '09:00 AM',
    durationMinutes: 60,
    completed: true,
    priority: 'High',
  },
  {
    id: 't-2',
    title: 'Eigenvalues & Matrix Diagonalization Problem Set',
    subject: 'Math',
    subjectColor: 'from-violet-500 to-indigo-600',
    time: '11:15 AM',
    durationMinutes: 45,
    completed: true,
    priority: 'High',
  },
  {
    id: 't-3',
    title: 'Electrochemical Cell EMF & Nernst Equation',
    subject: 'Chemistry',
    subjectColor: 'from-emerald-500 to-teal-600',
    time: '02:00 PM',
    durationMinutes: 30,
    completed: true,
    priority: 'Medium',
  },
  {
    id: 't-4',
    title: 'Op-Amp Inverting Filter & BJT Q-Point Biasing',
    subject: 'Electronics',
    subjectColor: 'from-amber-500 to-orange-600',
    time: '04:30 PM',
    durationMinutes: 90,
    completed: false,
    priority: 'High',
  },
  {
    id: 't-5',
    title: 'Dynamic Array Implementation & Pointer Memory',
    subject: 'Programming Language',
    subjectColor: 'from-fuchsia-500 to-pink-600',
    time: '07:30 PM',
    durationMinutes: 40,
    completed: false,
    priority: 'Medium',
  },
];

export const INITIAL_DEADLINES: DeadlineItem[] = [
  {
    id: 'd-1',
    title: 'Midterm Examination: Electromagnetism & Optics',
    course: 'ENGR 201 · Engineering Physics',
    dueDate: 'Nov 3, 2026',
    daysRemaining: 6,
    type: 'Exam',
    color: 'border-cyan-500/40 text-cyan-300',
  },
  {
    id: 'd-2',
    title: 'Laplace Transforms & Vector Calculus Problem Set',
    course: 'MATH 302 · Engineering Mathematics',
    dueDate: 'Nov 7, 2026',
    daysRemaining: 10,
    type: 'Assignment',
    color: 'border-violet-500/40 text-violet-300',
  },
  {
    id: 'd-3',
    title: 'Analog Amplifier & Digital Counter Design Lab',
    course: 'EE 210 · Electronics & Circuits',
    dueDate: 'Nov 12, 2026',
    daysRemaining: 15,
    type: 'Project',
    color: 'border-amber-500/40 text-amber-300',
  },
];

export const INITIAL_STUDY_PLANS: StudyPlan[] = [
  {
    id: 'plan-1',
    title: 'Engineering Physics Mastery Sprint',
    subject: 'Physics',
    overview: 'Targeted engineering physics roadmap focusing on mechanics, Maxwell’s equations, wave optics, and thermodynamic cycles.',
    estimatedTotalHours: 15,
    examDate: '2026-11-03',
    createdAt: '2026-10-26',
    sessions: [
      {
        id: 's-101',
        day: 'Day 1',
        date: 'Oct 29',
        topic: 'Mechanics & Conservation Laws',
        focus: 'Equations of motion, Lagrangian mechanics, and energy conservation equations',
        durationMinutes: 120,
        priority: 'High',
        completed: true,
        tasks: [
          'Derive equations of motion for coupled oscillators',
          'Solve 5 past exam numerical problems on work-energy theorems',
          'Summarize formula cheat sheet for rotational dynamics'
        ],
        learningTechnique: 'Active Mathematical Recall',
      },
      {
        id: 's-102',
        day: 'Day 2',
        date: 'Oct 30',
        topic: 'Electromagnetism & Maxwell’s Equations',
        focus: 'Gauss, Faraday, and Ampere laws in differential and integral forms',
        durationMinutes: 120,
        priority: 'High',
        completed: false,
        tasks: [
          'Diagram electric and magnetic field boundary conditions',
          'Solve 4 multi-step boundary value problems',
          'Active recall drill on vector calculus identities'
        ],
        learningTechnique: 'Boundary Value Derivation',
      },
      {
        id: 's-103',
        day: 'Day 3',
        date: 'Oct 31',
        topic: 'Wave Optics & Interference',
        focus: 'Diffraction gratings, polarization states, and coherent wavefronts',
        durationMinutes: 90,
        priority: 'Medium',
        completed: false,
        tasks: [
          'Derive intensity distribution for double-slit interference',
          'Practice 6 numerical calculation problems on wave phase shifts',
          'Feynman technique review of wave-particle duality'
        ],
        learningTechnique: 'Feynman Technique',
      },
      {
        id: 's-104',
        day: 'Day 4',
        date: 'Nov 01',
        topic: 'Thermodynamics & Heat Engines',
        focus: 'Carnot cycles, entropy calculations, and Maxwell-Boltzmann distributions',
        durationMinutes: 120,
        priority: 'High',
        completed: false,
        tasks: [
          'Calculate cycle thermal efficiency across P-V and T-S diagrams',
          'Work through 5 heat engine exam questions under timed conditions',
          'Review error log on entropy sign conventions'
        ],
        learningTechnique: 'Timed Problem Sets',
      },
      {
        id: 's-105',
        day: 'Day 5',
        date: 'Nov 02',
        topic: 'Engineering Physics Mock Exam',
        focus: 'Comprehensive timed problem set simulation and final formula audit',
        durationMinutes: 90,
        priority: 'High',
        completed: false,
        tasks: [
          'Complete 90-minute past paper under strict exam conditions',
          'Audit calculation errors and unit conversions',
          'Consolidate 1-page emergency formula sheet'
        ],
        learningTechnique: 'Full Simulation & Error Auditing',
      },
    ],
  },
];

export const INITIAL_SMART_NOTES: SmartNotesResult[] = [
  {
    id: 'note-1',
    title: 'Transformer Architecture & Self-Attention Mechanics',
    readingTimeMinutes: 4,
    createdAt: '2026-10-27',
    executiveSummary: 'The Transformer abandons recurrence in favor of self-attention, allowing O(1) path lengths between distant sequence tokens and full training parallelization across GPU clusters.',
    coreConcepts: [
      {
        name: 'Scaled Dot-Product Attention',
        explanation: 'Computes compatibility scores between Query and Key vectors, scaled by the square root of key dimensionality to maintain variance and prevent softmax gradients from collapsing.',
        significance: 'Forms the computational core of modern Large Language Models and Vision Transformers.'
      },
      {
        name: 'Multi-Head Projection',
        explanation: 'Projects Queries, Keys, and Values into multiple lower-dimensional subspaces simultaneously, letting the network attend to information from different representation aspects at different positions.',
        significance: 'Prevents single-focus averaging and enriches relational nuance.'
      },
      {
        name: 'Positional Encoding',
        explanation: 'Because attention is permutation-invariant, sinusoidal or learned vector embeddings are injected into input embeddings to provide spatial order and sequence distance information.',
        significance: 'Crucial for preserving word order semantics in languages.'
      }
    ],
    keyDefinitions: [
      {
        term: 'Permutation Invariance',
        definition: 'A mathematical property of functions whose output remains unchanged regardless of the ordering of its input elements.'
      },
      {
        term: 'Softmax Temperature Scaling',
        definition: 'Dividing logit dot products by sqrt(d_k) to prevent extremely large values that push softmax into regions with vanishing gradients.'
      },
      {
        term: 'Cross-Attention',
        definition: 'An attention layer where Queries originate from the decoder while Keys and Values come from the encoder output.'
      }
    ],
    revisionHighlights: [
      'Self-attention computational complexity is O(N^2 * d) with sequence length N, explaining why long contexts require specialized attention approximations.',
      'Unlike RNNs which require sequential unrolling through time, Transformers process all tokens in parallel during training.',
      'Residual connections around sub-layers allow gradients to propagate directly through hundreds of layers without attenuation.'
    ],
    feynmanAnalogy: 'Imagine a lively research seminar where every participant (token) has a badge stating their questions (Queries) and expertise (Keys). When someone speaks, everyone matches their questions to the best answers (Attention Weights) and passes relevant notes (Values) across the room instantly, rather than whispering one-by-one down a long telephone line.'
  }
];

export const INITIAL_QUIZZES: QuizData[] = [
  {
    id: 'quiz-1',
    topic: 'Neural Network Optimization & Backpropagation',
    difficulty: 'medium',
    createdAt: '2026-10-26',
    questions: [
      {
        id: 1,
        question: 'Why is the square root of the key dimension (sqrt(d_k)) used to scale dot-product attention in Transformers?',
        options: [
          'To increase computational throughput on TPU cores',
          'To prevent dot products from growing excessively large, which pushes softmax into near-zero gradient regions',
          'To normalize the output vector length to unit magnitude',
          'To enable negative attention scores across distant tokens'
        ],
        correctIndex: 1,
        explanation: 'For large values of d_k, dot products grow large in magnitude, which pushes the softmax function into regions where gradients are infinitesimally small. Scaling by 1/sqrt(d_k) counteracts this effect.'
      },
      {
        id: 2,
        question: 'What fundamental limitation of standard Gradient Descent does Momentum optimization address?',
        options: [
          'High memory consumption on large batch sizes',
          'Oscillations in high-curvature valleys and sluggish progress along flat plateaus',
          'Inability to calculate analytical gradients for non-convex loss functions',
          'Overfitting on training data with small sample sizes'
        ],
        correctIndex: 1,
        explanation: 'Momentum accumulates velocity along directions of consistent descent while dampening high-frequency oscillations across ravines, helping escape shallow local saddles.'
      },
      {
        id: 3,
        question: 'During backpropagation through a Rectified Linear Unit (ReLU) activation, what is the gradient when the input x < 0?',
        options: [
          '1.0',
          'Exactly 0.0 (leading to potential "dying ReLU" neurons)',
          'x * exp(x)',
          '-1.0'
        ],
        correctIndex: 1,
        explanation: 'The derivative of ReLU(x) for x < 0 is strictly 0. If a large gradient updates weights such that a neuron never activates (x < 0 for all data), its gradient remains permanently zero.'
      },
      {
        id: 4,
        question: 'What is the primary difference between L1 (Lasso) and L2 (Ridge) weight regularization in neural networks?',
        options: [
          'L1 induces exact sparsity by driving less important weights to absolute zero, whereas L2 penalizes large weights smoothly',
          'L2 can only be applied to convolutional layers, not fully connected layers',
          'L1 increases model parameters while L2 reduces them',
          'L2 regularization causes gradients to explode on small learning rates'
        ],
        correctIndex: 0,
        explanation: 'Because L1 penalty has a constant derivative (+1 or -1) towards zero, it drives weights completely to zero, performing intrinsic feature selection. L2 penalty scales with weight magnitude, shrinking weights asymptotically.'
      },
      {
        id: 5,
        question: 'Why does Batch Normalization use running statistics (moving averages) during inference instead of mini-batch statistics?',
        options: [
          'To reduce RAM usage on inference servers',
          'Because inference may process a single sample (batch size = 1), making mini-batch variance undefined and predictions non-deterministic',
          'Because running statistics prevent floating point overflow in 8-bit quantized models',
          'Because test data is assumed to have different labels from training data'
        ],
        correctIndex: 1,
        explanation: 'At test time, the model must output deterministic predictions for any arbitrary batch size (even a single prompt). Using accumulated dataset mean and variance ensures stable, reproducible inference.'
      }
    ]
  }
];

export const INITIAL_QUIZ_HISTORY: QuizResultRecord[] = [
  {
    id: 'qr-1',
    topic: 'Neural Network Optimization',
    date: 'Oct 26, 2026',
    score: 5,
    totalQuestions: 5,
    percentage: 100,
    difficulty: 'Medium',
  },
  {
    id: 'qr-2',
    topic: 'Distributed Consensus & Raft',
    date: 'Oct 24, 2026',
    score: 4,
    totalQuestions: 5,
    percentage: 80,
    difficulty: 'Hard',
  },
  {
    id: 'qr-3',
    topic: 'Cellular Neuroscience & LTP',
    date: 'Oct 21, 2026',
    score: 5,
    totalQuestions: 5,
    percentage: 100,
    difficulty: 'Medium',
  },
  {
    id: 'qr-4',
    topic: 'Linear Algebra SVD & Eigendecomposition',
    date: 'Oct 19, 2026',
    score: 4,
    totalQuestions: 5,
    percentage: 80,
    difficulty: 'Hard',
  },
  {
    id: 'qr-5',
    topic: 'Python Concurrency & Asyncio',
    date: 'Oct 16, 2026',
    score: 5,
    totalQuestions: 5,
    percentage: 100,
    difficulty: 'Easy',
  },
];

export const WEEKLY_ACTIVITY = [
  { day: 'Mon', focusHours: 4.5, tasksCompleted: 4, quizScore: 92 },
  { day: 'Tue', focusHours: 3.2, tasksCompleted: 3, quizScore: 88 },
  { day: 'Wed', focusHours: 5.0, tasksCompleted: 5, quizScore: 95 },
  { day: 'Thu', focusHours: 2.8, tasksCompleted: 2, quizScore: 84 },
  { day: 'Fri', focusHours: 4.0, tasksCompleted: 4, quizScore: 90 },
  { day: 'Sat', focusHours: 1.5, tasksCompleted: 1, quizScore: 80 },
  { day: 'Sun', focusHours: 0.5, tasksCompleted: 1, quizScore: 85 },
];

export const SUBJECT_PROGRESS = [
  {
    subject: 'Physics',
    mastery: 88,
    hoursStudied: 16.5,
    topicsTotal: 15,
    topicsMastered: 13,
    color: 'bg-cyan-500',
    accentText: 'text-cyan-400',
    borderColor: 'border-cyan-500/30',
  },
  {
    subject: 'Math',
    mastery: 82,
    hoursStudied: 14.0,
    topicsTotal: 14,
    topicsMastered: 11,
    color: 'bg-violet-500',
    accentText: 'text-violet-400',
    borderColor: 'border-violet-500/30',
  },
  {
    subject: 'Chemistry',
    mastery: 79,
    hoursStudied: 8.5,
    topicsTotal: 12,
    topicsMastered: 9,
    color: 'bg-emerald-500',
    accentText: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
  },
  {
    subject: 'Electronics',
    mastery: 75,
    hoursStudied: 6.5,
    topicsTotal: 10,
    topicsMastered: 7,
    color: 'bg-amber-500',
    accentText: 'text-amber-400',
    borderColor: 'border-amber-500/30',
  },
  {
    subject: 'Programming Language',
    mastery: 91,
    hoursStudied: 12.0,
    topicsTotal: 12,
    topicsMastered: 11,
    color: 'bg-indigo-500',
    accentText: 'text-indigo-400',
    borderColor: 'border-indigo-500/30',
  },
];

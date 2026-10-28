import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Award,
  RefreshCw,
  BookOpen,
  Check,
  ChevronRight,
} from 'lucide-react';
import { QuizData, QuizQuestion, QuizResultRecord } from '../types';
import { requestQuiz } from '../services/aiService';

interface QuizViewProps {
  quizList: QuizData[];
  onAddQuiz: (quiz: QuizData) => void;
  onRecordQuizResult: (record: QuizResultRecord) => void;
  showToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

const PRESET_TOPICS = [
  'Neural Network Optimization & Backpropagation',
  'Distributed Consensus & Raft Protocol',
  'Cellular Respiration & Krebs Cycle',
  'Linear Algebra Eigenvalues & SVD',
  'Operating Systems Virtual Memory & Paging',
];

export const QuizView: React.FC<QuizViewProps> = ({
  quizList,
  onAddQuiz,
  onRecordQuizResult,
  showToast,
}) => {
  const [topic, setTopic] = useState('Neural Network Optimization & Backpropagation');
  const [difficulty, setDifficulty] = useState<'beginner' | 'medium' | 'advanced'>('medium');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [studyContext, setStudyContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Active quiz session state
  const [currentQuiz, setCurrentQuiz] = useState<QuizData | null>(quizList[0] || null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [revealedQuestions, setRevealedQuestions] = useState<Record<number, boolean>>({});
  const [quizFinished, setQuizFinished] = useState(false);

  const activeQuestion: QuizQuestion | undefined = currentQuiz?.questions[currentQuestionIdx];

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) {
      showToast('Topic Required', 'Please enter a quiz topic.', 'error');
      return;
    }

    setIsGenerating(true);
    try {
      const quizData = await requestQuiz({
        topic,
        difficulty,
        questionCount,
        studyContent: studyContext,
      });

      if (quizData) {
        const newQuiz: QuizData = {
          id: `quiz-${Date.now()}`,
          topic: quizData.topic || topic,
          difficulty: quizData.difficulty || difficulty,
          questions: quizData.questions || [],
          createdAt: new Date().toISOString(),
        };

        onAddQuiz(newQuiz);
        setCurrentQuiz(newQuiz);
        setCurrentQuestionIdx(0);
        setSelectedAnswers({});
        setRevealedQuestions({});
        setQuizFinished(false);
        showToast('Quiz Ready!', `Generated ${newQuiz.questions.length} questions for ${topic}.`, 'success');
      }
    } catch {
      showToast('Error', 'Failed to generate quiz. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    if (!activeQuestion || revealedQuestions[currentQuestionIdx]) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIdx]: optionIndex,
    }));
  };

  const handleCheckAnswer = () => {
    if (selectedAnswers[currentQuestionIdx] === undefined) {
      showToast('Select an Answer', 'Please choose an option to verify your answer.', 'info');
      return;
    }

    setRevealedQuestions((prev) => ({
      ...prev,
      [currentQuestionIdx]: true,
    }));

    const isCorrect = selectedAnswers[currentQuestionIdx] === activeQuestion?.correctIndex;
    if (isCorrect) {
      showToast('Correct!', 'Solid conceptual recall.', 'success');
    }
  };

  const handleNextQuestion = () => {
    if (!currentQuiz) return;
    if (currentQuestionIdx < currentQuiz.questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    if (!currentQuiz) return;
    let score = 0;
    currentQuiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score++;
      }
    });

    const percentage = Math.round((score / currentQuiz.questions.length) * 100);

    const record: QuizResultRecord = {
      id: `qr-${Date.now()}`,
      topic: currentQuiz.topic,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      score,
      totalQuestions: currentQuiz.questions.length,
      percentage,
      difficulty: currentQuiz.difficulty,
    };

    onRecordQuizResult(record);
    setQuizFinished(true);

    if (percentage >= 80) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#06b6d4', '#10b981'],
      });
      showToast('Quiz Completed!', `Mastery score: ${percentage}%!`, 'success');
    } else {
      showToast('Quiz Finished', `Score: ${score}/${currentQuiz.questions.length}. Review the explanations below.`, 'info');
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setRevealedQuestions({});
    setQuizFinished(false);
  };

  // Calculate final score
  const totalQuestions = currentQuiz?.questions.length || 0;
  const correctCount = currentQuiz?.questions.reduce((acc, q, idx) => {
    return selectedAnswers[idx] === q.correctIndex ? acc + 1 : acc;
  }, 0) || 0;
  const finalPercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wide uppercase">
            <HelpCircle className="w-4 h-4" />
            <span>AI Quiz & Active Retrieval</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1">
            Adaptive Knowledge Verification
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl mt-1 leading-relaxed">
            Test retention with AI-generated multiple choice questions. Receive immediate cognitive explanations that anchor memory pathways.
          </p>
        </div>

        {/* Existing Quizzes */}
        {quizList.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-400 font-medium">Load Quiz:</span>
            <select
              value={currentQuiz?.id || ''}
              onChange={(e) => {
                const found = quizList.find((q) => q.id === e.target.value);
                if (found) {
                  setCurrentQuiz(found);
                  setCurrentQuestionIdx(0);
                  setSelectedAnswers({});
                  setRevealedQuestions({});
                  setQuizFinished(false);
                }
              }}
              className="bg-[#131c31] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 max-w-[220px] truncate"
            >
              {quizList.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.topic}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Generator Configuration Card */}
      <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Create Custom AI Quiz</h3>
              <p className="text-xs text-slate-400">Generate targeted multiple-choice questions on any subject</p>
            </div>
          </div>
          <span className="text-xs text-violet-400 font-mono hidden sm:block">Gemini 3.8 Flash</span>
        </div>

        {/* Topic Input */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Quiz Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Distributed Consensus, Cellular Respiration, Linear Algebra SVD..."
              className="w-full bg-[#131c31] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
            />
            {/* Quick Topic Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-2 no-scrollbar text-xs">
              <span className="text-[11px] text-slate-400 shrink-0 font-medium">Presets:</span>
              {PRESET_TOPICS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setTopic(p)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] border border-slate-700/80 transition-colors"
                >
                  {p.split('&')[0]?.trim()}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Difficulty */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Difficulty Level</label>
              <div className="grid grid-cols-3 gap-2">
                {(['beginner', 'medium', 'advanced'] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                      difficulty === d
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                        : 'bg-[#131c31] text-slate-400 hover:text-white border border-slate-700'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Number of Questions</label>
              <div className="grid grid-cols-3 gap-2">
                {[3, 5, 8].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setQuestionCount(c)}
                    className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                      questionCount === c
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                        : 'bg-[#131c31] text-slate-400 hover:text-white border border-slate-700'
                    }`}
                  >
                    {c} Questions
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={handleGenerateQuiz}
            disabled={isGenerating || !topic.trim()}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-200" />
                <span>Crafting Quiz Questions...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>Generate Interactive Quiz</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interactive Quiz Player */}
      {currentQuiz && !quizFinished && activeQuestion && (
        <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-6 md:p-8 shadow-2xl">
          {/* Progress Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-mono font-bold text-cyan-400">
                Question {currentQuestionIdx + 1} of {currentQuiz.questions.length}
              </span>
              <h4 className="text-xs text-slate-400 mt-0.5">{currentQuiz.topic}</h4>
            </div>

            <span className="text-xs font-semibold capitalize text-violet-300 bg-violet-950/80 border border-violet-800/40 px-2.5 py-1 rounded-md">
              {currentQuiz.difficulty}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-300"
              style={{
                width: `${((currentQuestionIdx + 1) / currentQuiz.questions.length) * 100}%`,
              }}
            />
          </div>

          {/* Question Text */}
          <h3 className="text-lg md:text-xl font-bold text-white mb-6 leading-relaxed">
            {activeQuestion.question}
          </h3>

          {/* Multiple Choice Options */}
          <div className="space-y-3 mb-6">
            {activeQuestion.options.map((option, oIdx) => {
              const isSelected = selectedAnswers[currentQuestionIdx] === oIdx;
              const isRevealed = revealedQuestions[currentQuestionIdx];
              const isCorrect = oIdx === activeQuestion.correctIndex;

              let optionStyle = 'bg-[#131c31] border-slate-700/80 text-slate-200 hover:border-slate-500 hover:bg-[#18233d]';

              if (isSelected && !isRevealed) {
                optionStyle = 'bg-indigo-900/40 border-cyan-400 text-white shadow-md ring-1 ring-cyan-400/50';
              } else if (isRevealed) {
                if (isCorrect) {
                  optionStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-100 ring-1 ring-emerald-500/40';
                } else if (isSelected && !isCorrect) {
                  optionStyle = 'bg-red-950/60 border-red-500 text-red-100 ring-1 ring-red-500/40';
                } else {
                  optionStyle = 'bg-[#131c31]/60 border-slate-800 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={oIdx}
                  type="button"
                  disabled={isRevealed}
                  onClick={() => handleSelectOption(oIdx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start justify-between gap-3 cursor-pointer disabled:cursor-default ${optionStyle}`}
                >
                  <span className="text-sm leading-relaxed">{option}</span>
                  {isRevealed && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  {isRevealed && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Cognitive Explanation Panel (after answer check) */}
          {revealedQuestions[currentQuestionIdx] && (
            <div className="p-4 rounded-xl bg-[#131c31] border border-indigo-500/30 mb-6 animate-in fade-in">
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block mb-1">
                Cognitive Explanation:
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {activeQuestion.explanation}
              </p>
            </div>
          )}

          {/* Controls Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => {
                if (currentQuestionIdx > 0) {
                  setCurrentQuestionIdx((prev) => prev - 1);
                }
              }}
              disabled={currentQuestionIdx === 0}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            {!revealedQuestions[currentQuestionIdx] ? (
              <button
                onClick={handleCheckAnswer}
                disabled={selectedAnswers[currentQuestionIdx] === undefined}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
              >
                Check Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>{currentQuestionIdx < currentQuiz.questions.length - 1 ? 'Next Question' : 'View Results'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quiz Completion Summary Screen */}
      {quizFinished && (
        <div className="rounded-2xl bg-gradient-to-br from-[#12192e] to-[#0f172a] border border-slate-800 p-8 text-center max-w-xl mx-auto shadow-2xl animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-[1px] mx-auto mb-4 shadow-xl shadow-amber-500/20">
            <div className="w-full h-full bg-[#0d1322] rounded-[15px] flex items-center justify-center">
              <Trophy className="w-8 h-8 text-amber-400" />
            </div>
          </div>

          <h3 className="text-2xl font-extrabold text-white tracking-tight">Quiz Complete!</h3>
          <p className="text-sm text-slate-300 mt-1">Topic: {currentQuiz?.topic}</p>

          {/* Score Badge */}
          <div className="my-6 p-6 rounded-2xl bg-[#131c31] border border-slate-800 max-w-xs mx-auto">
            <div className="text-4xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
              {correctCount} / {totalQuestions}
            </div>
            <div className="text-sm font-semibold text-slate-300 mt-1 font-mono">
              {finalPercentage}% Accuracy
            </div>
            <div className="text-xs text-emerald-400 mt-2 font-medium">
              {finalPercentage >= 80 ? 'Mastery Level Achieved! 🔥' : 'Good effort! Review missed questions.'}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={restartQuiz}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>
            <button
              onClick={() => {
                setQuizFinished(false);
                setCurrentQuestionIdx(0);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Review Explanations</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

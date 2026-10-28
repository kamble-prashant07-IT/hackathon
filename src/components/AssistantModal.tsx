import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Bot, User, Copy, Check, BookOpen } from 'lucide-react';
import { requestAssistantReply } from '../services/aiService';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface AssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportToNotes?: (content: string, title?: string) => void;
}

const SUGGESTIONS = [
  'Deconstruct Gradient Descent with a real-world analogy',
  'How should I structure a 3-day exam review sprint?',
  'Explain the difference between L1 and L2 regularization',
  'What is the Feynman technique and how do I apply it?',
];

export const AssistantModal: React.FC<AssistantModalProps> = ({
  isOpen,
  onClose,
  onImportToNotes,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: "Hello Alex! I'm your EduPilot AI study companion. Ask me to break down tricky formulas, explain complex theories, test your recall, or optimize your study schedule.",
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const botReply = await requestAssistantReply(query);

      const botMsg: Message = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const fallbackMsg: Message = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: `Here is a structured cognitive breakdown for "${query}":\n\n• Core Axiom: Identify what fundamental constraint or theorem governs this system.\n• Mental Model: Test whether you can explain it to a high-school student in under 60 seconds.\n• Verification: Solve 1 standard problem immediately to anchor retrieval pathways.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl h-[620px] max-h-[90vh] bg-[#0d1424] border border-indigo-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-[#0f172a]/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base tracking-tight">EduPilot AI Assistant</h3>
                <span className="text-[11px] font-medium text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded-full">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-slate-400">Context-aware cognitive tutor & study advisor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${
                m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-violet-900/60 border border-violet-700/50 text-violet-300'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[82%] rounded-2xl p-4 text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                    : 'bg-[#131b2e] border border-slate-800 text-slate-200'
                }`}
              >
                <div className="whitespace-pre-line text-sm">{m.text}</div>

                <div
                  className={`mt-2 pt-2 flex items-center justify-between text-[11px] ${
                    m.sender === 'user' ? 'text-indigo-200' : 'text-slate-400 border-t border-slate-800/60'
                  }`}
                >
                  <span>{m.timestamp}</span>
                  {m.sender === 'assistant' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(m.id, m.text)}
                        className="hover:text-cyan-400 flex items-center gap-1 transition-colors"
                        title="Copy text"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                      {onImportToNotes && (
                        <button
                          onClick={() => {
                            onImportToNotes(m.text, 'AI Assistant Explanation');
                            onClose();
                          }}
                          className="hover:text-cyan-400 flex items-center gap-1 transition-colors ml-2"
                          title="Import into Smart Notes"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>To Notes</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-900/60 border border-violet-700/50 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
              </div>
              <div className="bg-[#131b2e] border border-slate-800 rounded-2xl p-4 flex items-center gap-2 text-slate-300 text-sm">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-slate-400 ml-1">EduPilot AI is synthesizing...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        <div className="px-6 py-2 border-t border-slate-800/80 bg-[#0c1220]/60 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          <span className="text-slate-400 shrink-0 font-medium text-[11px]">Prompt suggestions:</span>
          {SUGGESTIONS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(s)}
              disabled={isLoading}
              className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 transition-colors text-xs"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-[#0f172a]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything (e.g. explain the Krebs cycle, verify my proof, test my recall)..."
              disabled={isLoading}
              className="flex-1 bg-[#131c31] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-medium text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all shrink-0 cursor-pointer disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  Download,
  BookOpen,
  Lightbulb,
  Key,
  Layers,
  ArrowRight,
  RefreshCw,
  Clock,
  Quote,
} from 'lucide-react';
import { SmartNotesResult } from '../types';
import { requestSmartNotes } from '../services/aiService';

interface NotesViewProps {
  notesList: SmartNotesResult[];
  onAddNote: (note: SmartNotesResult) => void;
  showToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

const SAMPLE_TEXTS = [
  {
    title: 'Transformer Architecture & Self-Attention',
    content: `The Transformer is a deep learning architecture that relies entirely on self-attention mechanisms to compute representations of its input and output without using sequence-aligned RNNs or convolution.
In traditional Recurrent Neural Networks, computation is strictly sequential along the time dimension: each hidden state h_t depends on h_{t-1}. This sequential bottleneck prohibits GPU parallelization across long sequences and causes vanishing gradients over long distances.
The Transformer solves this by processing all tokens simultaneously. Each token projects into three vectors: Query (Q), Key (K), and Value (V). Scaled Dot-Product Attention calculates compatibility scores by taking the dot product of Q with all Keys, dividing by the square root of key dimension sqrt(d_k), and applying softmax to obtain attention weights. These weights scale the Value vectors.
Multi-Head Attention expands this capability by projecting Q, K, and V into multiple different representation subspaces, allowing the model to jointly attend to information from different positions and linguistic features. Positional encodings (using sine and cosine frequencies) are added to input embeddings to preserve token order.`
  },
  {
    title: 'Cellular Respiration & Krebs Cycle',
    content: `Cellular respiration is a series of chemical reactions that break down glucose to produce ATP, the cellular energy currency. The process occurs in three main stages: Glycolysis, the Citric Acid (Krebs) Cycle, and Oxidative Phosphorylation.
Glycolysis takes place in the cytoplasm, breaking one 6-carbon glucose molecule into two 3-carbon pyruvate molecules, yielding a net gain of 2 ATP and 2 NADH. Under aerobic conditions, pyruvate enters the mitochondrial matrix and is converted into Acetyl-CoA by pyruvate dehydrogenase.
Acetyl-CoA enters the Citric Acid Cycle by combining with oxaloacetate (4 carbons) to form citrate (6 carbons). Through a series of oxidation-reduction reactions, two carbons are released as CO2, and energy is harvested in high-energy electron carriers: 3 NADH, 1 FADH2, and 1 GTP (ATP equivalent) per cycle turn.
Finally, in Oxidative Phosphorylation on the inner mitochondrial membrane, electrons from NADH and FADH2 pass through the Electron Transport Chain (Complexes I-IV). This creates an electrochemical proton gradient across the inner membrane. Protons flow back into the matrix via ATP Synthase (chemiosmosis), producing approximately 26 to 28 ATP molecules.`
  },
  {
    title: 'Keynesian Economics & Fiscal Multiplier',
    content: `Keynesian economics, formulated by John Maynard Keynes during the Great Depression, posits that aggregate demand—measured as consumer spending, business investment, government spending, and net exports—drives total economic output and employment.
In classical economics, prices and wages were assumed to adjust instantaneously to clear markets. Keynes observed that wages and prices are sticky in the short run. During recessions, decreased private spending creates an underemployment equilibrium because businesses reduce production rather than immediately lowering wages.
To stimulate economic activity, governments should use expansionary fiscal policy through deficit spending on public infrastructure or direct transfers.
The effectiveness of this spending is amplified by the Fiscal Multiplier. When the government spends $1, recipients spend a portion determined by their Marginal Propensity to Consume (MPC). The multiplier formula is 1 / (1 - MPC). For instance, if MPC is 0.8, the multiplier is 5, meaning $1 of initial government expenditure generates $5 of total economic activity.`
  }
];

export const NotesView: React.FC<NotesViewProps> = ({
  notesList,
  onAddNote,
  showToast,
}) => {
  const [activeNoteId, setActiveNoteId] = useState<string>(notesList[0]?.id || '');
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialContent, setMaterialContent] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeNote = notesList.find((n) => n.id === activeNoteId) || notesList[0];

  const handleSynthesize = async () => {
    if (!materialContent.trim()) {
      showToast('Text Required', 'Please paste study material or choose a preset excerpt.', 'error');
      return;
    }

    setIsSynthesizing(true);
    try {
      const notesData = await requestSmartNotes({
        title: materialTitle.trim() || 'Synthesized Study Notes',
        content: materialContent,
      });

      if (notesData) {
        const newNote: SmartNotesResult = {
          id: `note-${Date.now()}`,
          title: notesData.title || materialTitle || 'Synthesized Study Notes',
          readingTimeMinutes: notesData.readingTimeMinutes || 3,
          executiveSummary: notesData.executiveSummary || 'Core principles synthesized from input text.',
          coreConcepts: notesData.coreConcepts || [],
          keyDefinitions: notesData.keyDefinitions || [],
          revisionHighlights: notesData.revisionHighlights || [],
          feynmanAnalogy: notesData.feynmanAnalogy || 'An intuitive everyday metaphor.',
          createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          sourceSnippet: materialContent.slice(0, 180) + '...',
        };

        onAddNote(newNote);
        setActiveNoteId(newNote.id);
        showToast('Smart Notes Generated!', 'Extracted summary, concepts, definitions, and analogies.', 'success');
        // Clear form
        setMaterialTitle('');
        setMaterialContent('');
      }
    } catch {
      showToast('Error', 'Failed to generate notes. Please try again.', 'error');
    } finally {
      setIsSynthesizing(false);
    }
  };

  const loadSample = (sample: typeof SAMPLE_TEXTS[0]) => {
    setMaterialTitle(sample.title);
    setMaterialContent(sample.content);
    showToast('Preset Loaded', `Populated "${sample.title}"`, 'info');
  };

  const copyNotesMarkdown = () => {
    if (!activeNote) return;
    const md = `# ${activeNote.title}
Reading Time: ~${activeNote.readingTimeMinutes} mins · Generated with EduPilot AI

## Executive Summary
${activeNote.executiveSummary}

## Intuitive Feynman Analogy
"${activeNote.feynmanAnalogy}"

## Core Concepts
${activeNote.coreConcepts.map((c) => `### ${c.name}\n${c.explanation}\n*Significance: ${c.significance}*`).join('\n\n')}

## Key Definitions
${activeNote.keyDefinitions.map((d) => `• **${d.term}**: ${d.definition}`).join('\n')}

## High-Yield Revision Highlights
${activeNote.revisionHighlights.map((h) => `• ${h}`).join('\n')}
`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    showToast('Copied to Clipboard', 'Full smart notes in clean Markdown format.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMarkdownFile = () => {
    if (!activeNote) return;
    const md = `# ${activeNote.title}\n\n${activeNote.executiveSummary}\n\n## Core Concepts\n` +
      activeNote.coreConcepts.map((c) => `- **${c.name}**: ${c.explanation}`).join('\n');
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeNote.title.toLowerCase().replace(/\s+/g, '-')}-notes.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded', 'Saved markdown file to your device.', 'info');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wide uppercase">
            <FileText className="w-4 h-4" />
            <span>Smart Notes Synthesizer</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1">
            Cognitive Study Workspaces
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl mt-1 leading-relaxed">
            Paste lecture slides, textbook excerpts, or research papers. EduPilot AI extracts executive summaries, core concepts, crisp definitions, and Feynman analogies.
          </p>
        </div>

        {/* Existing Notes Switcher */}
        {notesList.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-400 font-medium">Saved Notes:</span>
            <select
              value={activeNoteId}
              onChange={(e) => setActiveNoteId(e.target.value)}
              className="bg-[#131c31] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 max-w-[220px] truncate"
            >
              {notesList.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Input / Ingestion Workspace */}
      <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Paste Study Material</h3>
              <p className="text-xs text-slate-400">Synthesize raw reading into structured revision memory blocks</p>
            </div>
          </div>

          <div className="text-xs text-violet-400 font-mono hidden sm:block">
            Gemini 3.8 Flash
          </div>
        </div>

        {/* Sample preset buttons */}
        <div className="mb-4 flex items-center gap-2 overflow-x-auto text-xs pb-1 no-scrollbar">
          <span className="text-[11px] text-slate-400 shrink-0 font-medium">Quick Presets:</span>
          {SAMPLE_TEXTS.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => loadSample(s)}
              className="whitespace-nowrap px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/80 transition-colors text-xs cursor-pointer"
            >
              {s.title.split('&')[0]?.trim()}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Note Title / Topic Name
            </label>
            <input
              type="text"
              value={materialTitle}
              onChange={(e) => setMaterialTitle(e.target.value)}
              placeholder="e.g. Transformer Architecture & Self-Attention Mechanics..."
              className="w-full bg-[#131c31] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Study Material or Lecture Excerpt <span className="text-slate-400 font-normal">(Text, PDF notes, paper abstract)</span>
            </label>
            <textarea
              rows={5}
              value={materialContent}
              onChange={(e) => setMaterialContent(e.target.value)}
              placeholder="Paste your textbook passage, lecture transcript, or study notes here..."
              className="w-full bg-[#131c31] border border-slate-700 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 leading-relaxed font-sans"
            />
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            {materialContent.split(/\s+/).filter(Boolean).length} words entered
          </div>

          <button
            onClick={handleSynthesize}
            disabled={isSynthesizing || !materialContent.trim()}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSynthesizing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-200" />
                <span>Synthesizing Smart Notes...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>Generate Smart Notes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Synthesized Notes Output */}
      {activeNote && (
        <div className="space-y-6">
          {/* Executive Summary Card */}
          <div className="rounded-2xl bg-gradient-to-br from-[#12192e] to-[#0f172a] border border-slate-800 p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono mb-1">
                  <span>Reading: ~{activeNote.readingTimeMinutes} min</span>
                  <span aria-hidden="true">·</span>
                  <span>Synthesized: {activeNote.createdAt}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  {activeNote.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={copyNotesMarkdown}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Copy full notes markdown"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={downloadMarkdownFile}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Download .md file"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="p-4 rounded-xl bg-[#131c31] border border-slate-800">
              <span className="text-xs font-bold text-violet-300 uppercase tracking-wider block mb-1">
                Executive Synthesis:
              </span>
              <p className="text-sm text-slate-200 leading-relaxed">
                {activeNote.executiveSummary}
              </p>
            </div>

            {/* Intuitive Feynman Analogy */}
            {activeNote.feynmanAnalogy && (
              <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-violet-950/40 to-indigo-950/40 border border-violet-800/40 flex items-start gap-3">
                <Quote className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block mb-1">
                    Feynman Intuition Analogy:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
                    "{activeNote.feynmanAnalogy}"
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Core Concepts & Definitions Split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Core Concepts */}
            <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <h4 className="text-base font-bold text-white tracking-tight">Core Concepts</h4>
              </div>

              <div className="space-y-3.5">
                {activeNote.coreConcepts.map((concept, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#131c31] border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-bold text-white">{concept.name}</h5>
                      <span className="text-[10px] font-mono font-semibold text-violet-400 bg-violet-950/80 px-2 py-0.5 rounded">
                        Concept 0{idx + 1}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {concept.explanation}
                    </p>
                    <div className="pt-2 border-t border-slate-800/80 text-[11px] text-cyan-300">
                      <strong>Significance:</strong> {concept.significance}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Definitions */}
            <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-violet-400" />
                <h4 className="text-base font-bold text-white tracking-tight">Key Definitions</h4>
              </div>

              <div className="space-y-3">
                {activeNote.keyDefinitions.map((def, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#131c31] border border-slate-800 flex items-start justify-between gap-3 group"
                  >
                    <div>
                      <span className="text-xs font-bold text-cyan-300 block mb-0.5">
                        {def.term}
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {def.definition}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${def.term}: ${def.definition}`);
                        showToast('Copied', `Copied "${def.term}" definition`, 'info');
                      }}
                      className="text-slate-500 hover:text-white p-1 rounded transition-colors shrink-0"
                      title="Copy definition"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Revision Highlights */}
          <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <h4 className="text-base font-bold text-white tracking-tight">
                High-Yield Revision Highlights
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeNote.revisionHighlights.map((hl, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#131c31] border border-slate-800 flex items-start gap-3"
                >
                  <span className="w-5 h-5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">{hl}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

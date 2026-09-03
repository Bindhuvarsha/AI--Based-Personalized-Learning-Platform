import React, { useState, useEffect } from 'react';
import { codingApi } from '../services/api';
import { CodingExerciseItem, CodeRunResult } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import {
  Code, Play, Terminal, CheckCircle2, AlertTriangle, ShieldCheck,
  Zap, Clock, Cpu, FileDiff, Sparkles, BookOpen
} from 'lucide-react';

export const CodingTutorPage: React.FC = () => {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [exercises, setExercises] = useState<CodingExerciseItem[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<CodingExerciseItem | null>(null);
  const [sourceCode, setSourceCode] = useState('');
  const [language, setLanguage] = useState('JAVA');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<CodeRunResult | null>(null);

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      setLoading(true);
      const res = await codingApi.getExercises();
      setExercises(res.data);
      if (res.data.length > 0) {
        selectExercise(res.data[0]);
      }
    } catch (err) {
      showToast('Failed to load coding exercises', 'error');
    } finally {
      setLoading(false);
    }
  };

  const selectExercise = (ex: CodingExerciseItem) => {
    setSelectedExercise(ex);
    setSourceCode(ex.starterCode);
    setLanguage(ex.language);
    setResult(null);
  };

  const handleRunAndReview = async () => {
    if (!sourceCode.trim()) {
      showToast('Please provide source code to execute.', 'warning');
      return;
    }

    setRunning(true);
    try {
      const res = await codingApi.runCode(selectedExercise?.id || null, sourceCode, language);
      setResult(res.data);
      showToast('Code executed and analyzed by AI Tutor!', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Execution failed', 'error');
    } finally {
      setRunning(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Initializing AI Coding Sandbox..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-brand-950 text-white rounded-2xl p-6 shadow-xl space-y-2">
        <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
          <Code className="w-3.5 h-3.5 text-brand-300" />
          <span>Interactive Sandboxed Code Tutor</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">AI Coding Tutor & Reviewer</h1>
        <p className="text-xs sm:text-sm text-blue-100/80 max-w-2xl">
          Solve programming challenges with automated unit testing, static code smell checks, security vulnerability screening, and Big-O asymptotic analysis.
        </p>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Problem & Exercise List */}
        <div className="lg:col-span-4 space-y-6">
          {/* Exercises Picker */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Challenges Catalog</h3>
            <div className="space-y-2">
              {exercises.map((ex) => (
                <div
                  key={ex.id}
                  onClick={() => selectExercise(ex)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedExercise?.id === ex.id
                      ? 'border-brand-500 bg-brand-50/50 ring-2 ring-brand-400'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-100 text-brand-800">
                      {ex.language}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">{ex.difficulty}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1">{ex.title}</h4>
                </div>
              ))}
            </div>
          </div>

          {/* Problem Description */}
          {selectedExercise && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Problem Statement</h3>
              <h4 className="text-sm font-bold text-slate-900">{selectedExercise.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                {selectedExercise.description}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Code Editor & AI Review / Output */}
        <div className="lg:col-span-8 space-y-6">
          {/* Editor Header Bar */}
          <div className="bg-slate-900 rounded-t-2xl px-5 py-3 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <span className="text-xs font-mono text-slate-300 font-semibold pl-2">
                Solution.{language === 'JAVA' ? 'java' : language === 'PYTHON' ? 'py' : 'ts'}
              </span>
            </div>

            <button
              onClick={handleRunAndReview}
              disabled={running}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold flex items-center transition-colors shadow-md shadow-emerald-600/30"
            >
              <Play className="w-3.5 h-3.5 mr-1.5 fill-white" />
              {running ? 'Executing & Reviewing...' : 'Run & Review'}
            </button>
          </div>

          {/* Code Textarea */}
          <div className="bg-slate-950 p-4 -mt-6 border border-slate-800">
            <textarea
              rows={12}
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              className="w-full bg-transparent font-mono text-xs text-emerald-400 focus:outline-none resize-none leading-relaxed"
              spellCheck={false}
            />
          </div>

          {/* Execution & Review Results */}
          {result && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 animate-fadeIn">
              {/* Output Metrics Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">Sandbox Test Results</h3>
                </div>
                <div className="flex items-center space-x-4 text-xs font-mono text-slate-500">
                  <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {result.executionTimeMs}ms</span>
                  <span className="flex items-center"><Cpu className="w-3.5 h-3.5 mr-1" /> {Math.round(result.memoryKb / 1024)}MB</span>
                </div>
              </div>

              {/* Stdout Console */}
              <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs space-y-1">
                <span className="text-slate-500 uppercase text-[10px] font-bold block mb-1">Standard Output:</span>
                <p className="whitespace-pre-line text-slate-300">{result.stdout}</p>
              </div>

              {/* Asymptotic Complexity & Security */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-brand-50 border border-brand-200 rounded-xl space-y-1">
                  <span className="text-xs font-bold text-brand-900 flex items-center">
                    <Zap className="w-3.5 h-3.5 mr-1 text-brand-600" /> Time Complexity:
                  </span>
                  <p className="text-xs text-brand-950 font-mono">{result.timeComplexity}</p>
                  <p className="text-[11px] text-brand-800 font-mono">{result.spaceComplexity}</p>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                  <span className="text-xs font-bold text-emerald-900 flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Security Assessment:
                  </span>
                  <p className="text-xs text-emerald-950">{result.securityConcerns[0] || 'Safe'}</p>
                </div>
              </div>

              {/* AI Code Smells & Suggestions */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">AI Tutor Code Recommendations</h4>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700">
                  <p className="leading-relaxed">{result.suggestions}</p>
                </div>
              </div>

              {/* Code Improvement Diff */}
              {result.correctedCodeDiff && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center">
                    <FileDiff className="w-3.5 h-3.5 mr-1.5 text-brand-600" /> Proposed Optimization Diff
                  </span>
                  <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto">
                    <pre className="whitespace-pre">{result.correctedCodeDiff}</pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

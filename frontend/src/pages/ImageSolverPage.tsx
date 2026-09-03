import React, { useState, useEffect } from 'react';
import { visionApi } from '../services/api';
import { ImageSolveResponse, ImageHistoryItem } from '../types';
import { useToast } from '../context/ToastContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  Camera, UploadCloud, Image as ImageIcon, CheckCircle, AlertTriangle,
  FileQuestion, Sparkles, BookOpen, Clock, ChevronRight
} from 'lucide-react';

export const ImageSolverPage: React.FC = () => {
  const { showToast } = useToast();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [solving, setSolving] = useState(false);
  const [solution, setSolution] = useState<ImageSolveResponse | null>(null);
  const [history, setHistory] = useState<ImageHistoryItem[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await visionApi.getHistory();
      setHistory(res.data);
    } catch (err) {
      console.warn("Could not load image solver history", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please upload a valid image file (PNG, JPG, WEBP).', 'error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('Image size exceeds 10MB maximum limit.', 'error');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSolve = async () => {
    if (!selectedFile) {
      showToast('Please select an image first.', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setSolving(true);
    try {
      const res = await visionApi.solveImage(formData);
      setSolution(res.data);
      showToast('Problem successfully extracted and solved!', 'success');
      loadHistory();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to solve image problem', 'error');
    } finally {
      setSolving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-brand-950 text-white rounded-2xl p-6 shadow-xl space-y-2">
        <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
          <Camera className="w-3.5 h-3.5 text-brand-300" />
          <span>Multimodal OCR & Vision Reasoning</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Image-Based Question Solver</h1>
        <p className="text-xs sm:text-sm text-blue-100/80 max-w-2xl">
          Upload or capture a photo of a textbook problem, diagram, mathematical formula, or coding snippet for instant OCR extraction and step-by-step reasoning.
        </p>
      </div>

      {/* Upload Zone & Action */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-6 flex flex-col items-center justify-center text-center hover:border-brand-500 transition-colors">
          {previewUrl ? (
            <div className="space-y-4 w-full">
              <img src={previewUrl} alt="Problem Preview" className="max-h-64 mx-auto rounded-xl shadow-md object-contain border border-slate-200" />
              <div className="flex justify-center space-x-3">
                <label className="cursor-pointer px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors">
                  Change Photo
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
                <button
                  onClick={handleSolve}
                  disabled={solving}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  {solving ? 'Extracting & Solving...' : 'Solve Problem'}
                </button>
              </div>
            </div>
          ) : (
            <label className="cursor-pointer flex flex-col items-center justify-center py-8 w-full">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
                <UploadCloud className="w-8 h-8" />
              </div>
              <span className="text-sm font-bold text-slate-800">Upload Question Photo</span>
              <span className="text-xs text-slate-400 mt-1">Supports PNG, JPG, WEBP (Max 10MB)</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          )}
        </div>

        {/* Instructions / Disclaimer */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center">
              <Sparkles className="w-4 h-4 text-brand-600 mr-2" /> What Can It Solve?
            </h3>
            <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4">
              <li><strong>Mathematics & Algebra:</strong> Step-by-step discriminant calculations, quadratic formulas, and calculus derivations.</li>
              <li><strong>Programming Problems:</strong> Algorithmic logic analysis, Big-O complexity estimation, and error diagnosis.</li>
              <li><strong>Diagrams & Data Models:</strong> Relational entity relationships and architecture diagrams.</li>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start space-x-2 text-[11px] text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Review Advisory:</strong> AI-generated derivations are estimates. Students should verify intermediate steps before submission in exams or graded assessments.
            </span>
          </div>
        </div>
      </div>

      {solving && <LoadingSpinner text="Running OCR text extraction and generating step-by-step solution..." />}

      {/* Solution Display */}
      {solution && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900">Extracted Problem & Solution</h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
              Confidence: {Math.round(solution.ocrConfidence * 100)}% OCR • {Math.round(solution.solutionConfidence * 100)}% Reasoning
            </span>
          </div>

          {/* OCR Extracted Text */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Extracted Question Text:</span>
            <p className="text-xs text-slate-800 font-mono mt-1 whitespace-pre-line leading-relaxed">
              {solution.extractedText}
            </p>
          </div>

          {/* Step-by-step Solution */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Step-by-Step Derivations</span>
            <div className="prose prose-sm max-w-none text-slate-700 bg-white p-4 rounded-xl border border-slate-200 whitespace-pre-line leading-relaxed">
              {solution.stepByStepExplanation}
            </div>
          </div>

          {/* Final Answer Highlight */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4">
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Final Answer</span>
            <p className="text-base font-extrabold text-emerald-800 mt-0.5">{solution.finalAnswer}</p>
          </div>

          {/* Related Concepts */}
          {solution.relatedTopics && solution.relatedTopics.length > 0 && (
            <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-500 flex items-center">
                <BookOpen className="w-3.5 h-3.5 mr-1" /> Related Topics:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {solution.relatedTopics.map((top, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-brand-50 border border-brand-200 text-brand-700 text-xs rounded-md font-medium">
                    {top}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-900">Recent Solved Questions</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {history.map((item) => (
              <div key={item.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all">
                <p className="text-xs font-bold text-slate-800 truncate">{item.originalFilename}</p>
                <p className="text-[11px] text-slate-500 mt-0.5 truncate">{item.extractedSnippet}</p>
                <p className="text-[11px] font-semibold text-emerald-700 mt-1 truncate">Ans: {item.finalAnswerSnippet}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

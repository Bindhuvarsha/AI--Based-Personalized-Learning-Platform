import React, { useState } from 'react';
import { resumeApi } from '../services/api';
import { ResumeUploadData, SkillGapAnalysisData } from '../types';
import { useToast } from '../context/ToastContext';
import {
  FileText, UploadCloud, CheckCircle2, AlertCircle, XCircle,
  Briefcase, Trash2, ArrowRight, ShieldCheck, Sparkles, BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ResumeAnalyzerPage: React.FC = () => {
  const { showToast } = useToast();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadData, setUploadData] = useState<ResumeUploadData | null>(null);
  const [targetRole, setTargetRole] = useState('Senior Backend Java Engineer');
  const [analyzing, setAnalyzing] = useState(false);
  const [gapAnalysis, setGapAnalysis] = useState<SkillGapAnalysisData | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadAndExtract = async () => {
    if (!selectedFile) {
      showToast('Please select a resume file first.', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setUploading(true);
    setGapAnalysis(null);
    try {
      const res = await resumeApi.upload(formData);
      setUploadData(res.data);
      showToast('Resume uploaded and skills successfully extracted!', 'success');
    } catch (err: any) {
      showToast('Failed to extract resume skills', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleRunGapAnalysis = async () => {
    if (!uploadData) return;

    setAnalyzing(true);
    try {
      const res = await resumeApi.analyze(uploadData.documentId, targetRole);
      setGapAnalysis(res.data);
      showToast('Skill gap analysis complete!', 'success');
    } catch (err: any) {
      showToast('Failed to run skill gap analysis', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!uploadData) return;
    try {
      await resumeApi.deleteResume(uploadData.documentId);
      showToast('Resume and extracted data permanently removed.', 'info');
      setUploadData(null);
      setGapAnalysis(null);
      setSelectedFile(null);
    } catch (err) {
      showToast('Failed to delete resume', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-brand-950 text-white rounded-2xl p-6 shadow-xl space-y-2">
        <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
          <FileText className="w-3.5 h-3.5 text-brand-300" />
          <span>Resume NLP & Target Role Matching</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Resume Skill-Gap Analyzer</h1>
        <p className="text-xs sm:text-sm text-blue-100/80 max-w-2xl">
          Upload your resume to extract validated skills, evaluate requirements for your target engineering job, and receive targeted study assignments.
        </p>
      </div>

      {/* Upload & Extraction View */}
      {!uploadData ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center space-y-4 hover:border-brand-500 transition-colors">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900">Upload Your Resume (PDF, DOCX, TXT)</h2>
            <p className="text-xs text-slate-500">Skills and project achievements will be parsed automatically</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <label className="cursor-pointer px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors">
              {selectedFile ? selectedFile.name : 'Choose Resume File'}
              <input type="file" accept=".pdf,.docx,.txt" onChange={handleFileChange} className="hidden" />
            </label>

            {selectedFile && (
              <button
                onClick={handleUploadAndExtract}
                disabled={uploading}
                className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-500/20 transition-all flex items-center"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                {uploading ? 'Extracting Skills...' : 'Extract Resume Skills'}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Human Validation & Target Selection */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-brand-600" />
              <h3 className="text-sm font-bold text-slate-900">{uploadData.filename}</h3>
              <span className="text-xs text-slate-400 font-mono">({uploadData.extractedSkillsCount} skills found)</span>
            </div>

            <button
              onClick={handleDeleteResume}
              className="text-xs font-semibold text-rose-600 hover:underline flex items-center"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete from System
            </button>
          </div>

          {/* Extracted Skills Tags */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Extracted & Human-Verified Skills
            </span>
            <div className="flex flex-wrap gap-2">
              {uploadData.extractedSkills.map((s) => (
                <span
                  key={s.id}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-brand-50 border border-brand-200 text-brand-800 flex items-center"
                >
                  <CheckCircle2 className="w-3 h-3 text-brand-600 mr-1" />
                  {s.skillName}
                  <span className="text-[10px] text-brand-500 ml-1.5 opacity-70">({s.category})</span>
                </span>
              ))}
            </div>
          </div>

          {/* Target Role Selector & Analyze Trigger */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 w-full sm:w-auto">
              <label className="text-xs font-bold text-slate-800">Target Career Benchmark</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full sm:w-80 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <button
              onClick={handleRunGapAnalysis}
              disabled={analyzing}
              className="w-full sm:w-auto px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-500/20 transition-all flex items-center justify-center flex-shrink-0"
            >
              <Briefcase className="w-3.5 h-3.5 mr-1.5" />
              {analyzing ? 'Analyzing Target Match...' : 'Run Skill-Gap Analysis'}
            </button>
          </div>
        </div>
      )}

      {/* Gap Analysis Results */}
      {gapAnalysis && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gap Analysis For</span>
              <h3 className="text-lg font-bold text-slate-900">{gapAnalysis.jobTitle}</h3>
            </div>
            <div className="px-4 py-2 bg-brand-50 border border-brand-200 rounded-xl text-center">
              <span className="text-2xl font-extrabold text-brand-700">{gapAnalysis.matchPercentage}%</span>
              <p className="text-[10px] text-brand-600 font-bold uppercase">Role Match</p>
            </div>
          </div>

          {/* Three Column Skills Breakdown: Matched, Partial, Missing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Matched */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
              <div className="flex items-center space-x-1.5 text-emerald-800 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Matched Skills ({gapAnalysis.matchedSkills.length})</span>
              </div>
              <div className="space-y-1.5">
                {gapAnalysis.matchedSkills.map((item, i) => (
                  <div key={i} className="text-xs bg-white p-2 rounded-lg border border-emerald-100">
                    <p className="font-bold text-emerald-950">{item.skill}</p>
                    <p className="text-[11px] text-slate-500">{item.evidenceOrAction}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Partial */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
              <div className="flex items-center space-x-1.5 text-amber-800 font-bold text-xs">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Partial Alignment ({gapAnalysis.partialSkills.length})</span>
              </div>
              <div className="space-y-1.5">
                {gapAnalysis.partialSkills.map((item, i) => (
                  <div key={i} className="text-xs bg-white p-2 rounded-lg border border-amber-100">
                    <p className="font-bold text-amber-950">{item.skill}</p>
                    <p className="text-[11px] text-slate-500">{item.evidenceOrAction}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing */}
            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2">
              <div className="flex items-center space-x-1.5 text-rose-800 font-bold text-xs">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Missing Requirements ({gapAnalysis.missingSkills.length})</span>
              </div>
              <div className="space-y-1.5">
                {gapAnalysis.missingSkills.map((item, i) => (
                  <div key={i} className="text-xs bg-white p-2 rounded-lg border border-rose-100">
                    <p className="font-bold text-rose-950">{item.skill}</p>
                    <p className="text-[11px] text-slate-500">{item.evidenceOrAction}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actionable Recommendations to bridge gap */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Prescribed Learning Bridge
            </h4>
            <div className="space-y-2">
              {gapAnalysis.recommendations.map((rec, i) => (
                <div key={i} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900">{rec.title}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                        {rec.category}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-1 leading-relaxed">{rec.recommendationText}</p>
                  </div>
                  <Link
                    to="/knowledge-graph"
                    className="text-brand-600 font-bold hover:underline flex items-center flex-shrink-0 mt-1"
                  >
                    Study Node <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

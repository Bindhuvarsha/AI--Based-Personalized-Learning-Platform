import React, { useState, useEffect } from 'react';
import { careerApi } from '../services/api';
import { CareerPathItem, CareerRoadmapDetails } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import {
  Compass, Briefcase, Award, CheckCircle2, Circle,
  ExternalLink, Layers, ArrowRight, Sparkles, FolderGit2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const CareerRoadmapPage: React.FC = () => {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [paths, setPaths] = useState<CareerPathItem[]>([]);
  const [selectedPathId, setSelectedPathId] = useState<number>(1);
  const [roadmap, setRoadmap] = useState<CareerRoadmapDetails | null>(null);

  useEffect(() => {
    loadPaths();
  }, []);

  useEffect(() => {
    if (selectedPathId) {
      loadRoadmap(selectedPathId);
    }
  }, [selectedPathId]);

  const loadPaths = async () => {
    try {
      setLoading(true);
      const res = await careerApi.listPaths();
      setPaths(res.data);
      if (res.data.length > 0) {
        setSelectedPathId(res.data[0].id);
      }
    } catch (err: any) {
      showToast('Failed to load career paths', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadRoadmap = async (pathId: number) => {
    try {
      const res = await careerApi.getRoadmap(pathId);
      setRoadmap(res.data);
    } catch (err: any) {
      showToast('Failed to generate career roadmap', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Mapping student progress against industry career benchmarks..." />;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-brand-950 text-white rounded-2xl p-6 shadow-xl space-y-2">
        <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
          <Compass className="w-3.5 h-3.5 text-brand-300" />
          <span>Industry Career Readiness Mapping</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">AI Career Roadmap Generator</h1>
        <p className="text-xs sm:text-sm text-blue-100/80 max-w-2xl">
          Track your qualification percentage for real-world software engineering roles. Bridge skill gaps with tailored milestone projects.
        </p>
      </div>

      {/* Path Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {paths.map((p) => (
          <div
            key={p.id}
            onClick={() => setSelectedPathId(p.id)}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
              selectedPathId === p.id
                ? 'border-brand-500 bg-brand-50/40 ring-2 ring-brand-400'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-100 text-brand-800">
                {p.industryDemand} Demand
              </span>
              <span className="text-xs font-mono text-slate-500">{p.averageSalaryRange}</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-2">{p.title}</h3>
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{p.description}</p>
          </div>
        ))}
      </div>

      {/* Career Readiness Hero Card */}
      {roadmap && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Target Trajectory</span>
            <h2 className="text-xl font-bold text-slate-900">{roadmap.careerTitle}</h2>
            <p className="text-xs text-slate-500 max-w-lg">{roadmap.careerDescription}</p>
          </div>

          <div className="flex items-center space-x-6 text-center">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <span className="text-3xl font-extrabold text-emerald-700">{roadmap.readinessScore}%</span>
              <p className="text-[10px] text-emerald-600 font-bold uppercase mt-0.5">Readiness Score</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-3xl font-extrabold text-slate-900">{roadmap.estimatedWeeks}w</span>
              <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Est. to Target</p>
            </div>
          </div>
        </div>
      )}

      {/* Milestones Checkpoint Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Milestone Checklist</h3>
        <div className="space-y-3">
          {roadmap?.items.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                item.isCompleted
                  ? 'border-emerald-200 bg-emerald-50/30'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                {item.isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100 flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 flex-shrink-0" />
                )}
                <div>
                  <h4 className={`text-xs font-bold ${item.isCompleted ? 'text-slate-800' : 'text-slate-900'}`}>
                    {item.title}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">{item.category}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  item.isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {item.isCompleted ? 'Mastered' : 'Pending Milestone'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Capstone Projects */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FolderGit2 className="w-5 h-5 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900">Recommended Portfolio Capstones</h3>
          </div>
          <span className="text-xs font-semibold text-slate-400">Industry Hiring Benchmarks</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {roadmap?.portfolioProjects.map((proj) => (
            <div key={proj.id} className="p-4 rounded-xl border border-slate-200 space-y-3 bg-slate-50/50 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-100 text-brand-800">
                    {proj.difficulty}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{proj.title}</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">{proj.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-mono text-[10px]">{proj.skillsCovered}</span>
                {proj.starterRepoUrl && (
                  <a
                    href={proj.starterRepoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-brand-600 hover:text-brand-700 flex items-center"
                  >
                    Starter Code <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

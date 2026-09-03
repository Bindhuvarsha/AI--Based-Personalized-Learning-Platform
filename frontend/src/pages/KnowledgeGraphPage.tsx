import React, { useState, useEffect } from 'react';
import { graphApi } from '../services/api';
import { KnowledgeGraphResponse, GraphNode, GraphEdge } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';
import {
  GitBranch, CheckCircle2, AlertCircle, Lock, Sparkles,
  ChevronRight, ArrowRight, BookOpen, Layers, Info
} from 'lucide-react';

export const KnowledgeGraphPage: React.FC = () => {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [graphData, setGraphData] = useState<KnowledgeGraphResponse | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  useEffect(() => {
    loadGraph();
  }, []);

  const loadGraph = async () => {
    try {
      setLoading(true);
      const res = await graphApi.getGraph();
      setGraphData(res.data);
      if (res.data.nodes.length > 0) {
        setSelectedNode(res.data.nodes[0]);
      }
    } catch (err: any) {
      showToast('Failed to load Knowledge Graph', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Constructing prerequisite dependency graph..." />;
  }

  const getNodeColor = (status: string) => {
    switch (status) {
      case 'MASTERED':
        return 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-emerald-400';
      case 'DEVELOPING':
        return 'bg-amber-50 border-amber-500 text-amber-900 ring-amber-400';
      case 'WEAK':
        return 'bg-rose-50 border-rose-500 text-rose-900 ring-rose-400';
      case 'RECOMMENDED':
        return 'bg-brand-50 border-brand-500 text-brand-900 ring-brand-400';
      case 'LOCKED':
      default:
        return 'bg-slate-50 border-slate-300 text-slate-500 ring-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-brand-950 rounded-2xl text-white p-6 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
            <GitBranch className="w-3.5 h-3.5 text-brand-300" />
            <span>Prerequisite DAG Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Interactive Knowledge Graph</h1>
          <p className="text-xs sm:text-sm text-blue-100/80 max-w-xl">
            Explore concepts and prerequisite relations. Complete foundational topics to unlock advanced specializations.
          </p>
        </div>

        {/* Counter Pills */}
        <div className="flex flex-wrap gap-2.5">
          <div className="px-3 py-2 bg-emerald-500/20 border border-emerald-400/30 rounded-xl text-center">
            <span className="text-base font-extrabold text-emerald-300">{graphData?.masteredCount || 0}</span>
            <p className="text-[10px] text-emerald-100/70 font-semibold uppercase">Mastered</p>
          </div>
          <div className="px-3 py-2 bg-amber-500/20 border border-amber-400/30 rounded-xl text-center">
            <span className="text-base font-extrabold text-amber-300">{graphData?.developingCount || 0}</span>
            <p className="text-[10px] text-amber-100/70 font-semibold uppercase">Developing</p>
          </div>
          <div className="px-3 py-2 bg-rose-500/20 border border-rose-400/30 rounded-xl text-center">
            <span className="text-base font-extrabold text-rose-300">{graphData?.weakCount || 0}</span>
            <p className="text-[10px] text-rose-100/70 font-semibold uppercase">Gaps</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Canvas and Node Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Graph Canvas */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center">
              <Layers className="w-4 h-4 mr-2 text-brand-600" /> Concept Hierarchy Map
            </h3>
            <div className="flex items-center space-x-3 text-[11px] text-slate-500">
              <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1" /> Mastered</span>
              <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-brand-500 mr-1" /> Next Up</span>
              <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-slate-300 mr-1" /> Locked</span>
            </div>
          </div>

          {/* Node Grid Visualization */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {graphData?.nodes.map((node) => (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${getNodeColor(node.status)} ${
                  selectedNode?.id === node.id ? 'ring-2 ring-offset-2' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">{node.category}</span>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-white/70">
                    {node.masteryScore}%
                  </span>
                </div>
                <h4 className="text-sm font-bold mt-1.5 leading-snug">{node.name}</h4>
                <div className="flex items-center justify-between text-[11px] mt-3 pt-2 border-t border-black/5 opacity-80">
                  <span>Est. {node.estimatedHours}h</span>
                  <span className="font-semibold uppercase text-[10px]">{node.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Prerequisite Flow Summary */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Prerequisite Pathways:</span>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-slate-800">Java 21 Fundamentals</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold text-slate-800">Data Structures</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold text-slate-800">Spring Boot 3</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold text-brand-600">Spring Security & JWT</span>
            </div>
          </div>
        </div>

        {/* Selected Node Inspector */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          {selectedNode ? (
            <>
              <div className="space-y-1 border-b border-slate-100 pb-3">
                <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider">{selectedNode.category}</span>
                <h3 className="text-lg font-bold text-slate-900">{selectedNode.name}</h3>
                <span className="text-xs text-slate-400 font-mono">Code: {selectedNode.code}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-base font-extrabold text-slate-900">{selectedNode.difficulty}</span>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase">Difficulty</p>
                </div>
                <div className="p-3 bg-brand-50 rounded-xl border border-brand-200">
                  <span className="text-base font-extrabold text-brand-700">{selectedNode.masteryScore}%</span>
                  <p className="text-[10px] text-brand-600 font-semibold uppercase">Your Mastery</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Learning Trajectory</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Mastering this concept solidifies your architectural foundation for enterprise backend engineering.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <Link
                  to="/quiz/adaptive"
                  className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-brand-500/20 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  Launch Adaptive Quiz for Concept
                </Link>
                <Link
                  to="/tutor"
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                  Ask AI Tutor About Concept
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Select any concept node in the graph map to inspect details and prerequisites.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

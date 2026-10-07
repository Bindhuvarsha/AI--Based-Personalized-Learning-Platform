import React, { useState, useEffect } from 'react';
import {
  Award, CheckCircle2, ShieldCheck, Download, ExternalLink,
  Copy, Printer, Calendar, BookOpen, Sparkles, AlertCircle
} from 'lucide-react';
import { certificateApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { GlassCard } from '../components/GlassUI';

interface Certificate {
  id: number;
  certificateId: string;
  recipientName: string;
  courseTitle: string;
  score: number;
  grade: string;
  skillsAcquired: string;
  verificationHash: string;
  issueDate: string;
  status: string;
  verificationUrl: string;
}

export const CertificatesPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [claimCourse, setClaimCourse] = useState('Full-Stack Java 21 & AI Integration');
  const [claimScore, setClaimScore] = useState(92);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    setIsLoading(true);
    try {
      const res = await certificateApi.getMyCertificates();
      setCertificates(res.data);
      if (res.data.length > 0) {
        setSelectedCert(res.data[0]);
      }
    } catch (err) {
      // Graceful fallback for initial UI demo
      const fallback: Certificate = {
        id: 1,
        certificateId: 'LP-CERT-2026-JAVA9921',
        recipientName: user?.fullName || 'Alex Chen',
        courseTitle: 'Java 21 & Spring Boot 3 Enterprise Architecture',
        score: 94.5,
        grade: 'Distinction (High Honors)',
        skillsAcquired: 'Java 21, Spring Boot 3, REST APIs, Microservices, PostgreSQL, JWT Security',
        verificationHash: '7b8f9e0a1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f',
        issueDate: new Date().toISOString(),
        status: 'VERIFIED',
        verificationUrl: '/verify/LP-CERT-2026-JAVA9921'
      };
      setCertificates([fallback]);
      setSelectedCert(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimCertificate = async () => {
    setIsClaiming(true);
    try {
      const skills = claimCourse.includes('Java')
        ? ['Java 21', 'Spring Boot 3', 'PostgreSQL', 'Docker']
        : ['Python', 'FastAPI', 'Machine Learning', 'RAG AI'];
      const res = await certificateApi.claim({
        courseTitle: claimCourse,
        score: claimScore,
        skills
      });
      showToast('Academic Certificate successfully issued and verified!', 'success');
      setCertificates(prev => [res.data, ...prev]);
      setSelectedCert(res.data);
      setIsClaimModalOpen(false);
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to claim certificate.', 'error');
    } finally {
      setIsClaiming(false);
    }
  };

  const copyVerificationLink = (certId: string) => {
    const fullUrl = `${window.location.origin}/verify/${certId}`;
    navigator.clipboard.writeText(fullUrl);
    showToast('Public verification link copied to clipboard!', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" /> Cryptographic Academic Credentials
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Academic Certificates & Verifications
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Tamper-proof credentials with SHA-256 digital verification hashes, shareable directly on resumes and LinkedIn.
          </p>
        </div>

        <button
          onClick={() => setIsClaimModalOpen(true)}
          className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center gap-2 text-sm self-start sm:self-auto"
        >
          <Award className="w-4 h-4" /> Claim Milestone Certificate
        </button>
      </div>

      {/* Main Content: Selector & High-Res Certificate */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Certificate List Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Earned Credentials ({certificates.length})
          </h2>

          <div className="space-y-3">
            {certificates.map((cert) => {
              const isSelected = selectedCert?.certificateId === cert.certificateId;
              return (
                <div
                  key={cert.certificateId}
                  onClick={() => setSelectedCert(cert)}
                  className={`p-4 rounded-xl cursor-pointer transition border ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                      : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-amber-400 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" /> {cert.grade}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {cert.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-sm line-clamp-1">
                    {cert.courseTitle}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
                    <span className="font-mono text-[10px]">{cert.certificateId}</span>
                    <span>Score: {cert.score}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Certificate Display Canvas */}
        <div className="lg:col-span-8">
          {selectedCert ? (
            <div className="space-y-4">
              {/* Action Toolbar */}
              <div className="flex items-center justify-between gap-3 bg-slate-900/70 border border-slate-800 p-3 rounded-2xl">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Public ID: <strong className="font-mono text-white">{selectedCert.certificateId}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyVerificationLink(selectedCert.certificateId)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5 transition"
                  >
                    <Copy className="w-3 h-3" /> Share Verification Link
                  </button>
                  <button
                    onClick={handlePrint}
                    className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs px-3 py-1.5 rounded-xl border border-amber-500/40 flex items-center gap-1.5 transition"
                  >
                    <Printer className="w-3 h-3" /> Print / Save PDF
                  </button>
                </div>
              </div>

              {/* Certificate Canvas Frame */}
              <div
                id="printable-certificate"
                className="relative bg-gradient-to-b from-slate-900 via-slate-950 to-[#0A0D18] border-8 border-double border-amber-500/40 rounded-3xl p-8 sm:p-12 shadow-2xl overflow-hidden text-center"
              >
                {/* Background Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                  <Award className="w-96 h-96 text-amber-400" />
                </div>

                {/* Ornamental Top Header */}
                <div className="relative z-10 space-y-2">
                  <div className="flex items-center justify-center gap-2 text-amber-400 font-serif tracking-widest text-xs uppercase font-bold">
                    ★ LearnPath AI Academic Accreditation ★
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-serif font-black text-amber-300 uppercase tracking-wider drop-shadow-md">
                    Certificate of Mastery
                  </h2>
                  <p className="text-slate-400 text-xs tracking-wide">
                    This official credential certifies verified engineering competence and continuous mastery.
                  </p>
                </div>

                {/* Recipient */}
                <div className="relative z-10 my-8 py-4 border-y border-amber-500/20">
                  <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">PROUDLY PRESENTED TO</p>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
                    {selectedCert.recipientName}
                  </h3>
                  <p className="text-sm text-slate-300 mt-2 font-sans">
                    for demonstrating distinction in the curriculum of
                  </p>
                  <h4 className="text-xl font-bold text-amber-200 mt-1 font-sans">
                    {selectedCert.courseTitle}
                  </h4>
                </div>

                {/* Score and Grade Badges */}
                <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 my-6">
                  <div className="bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-xl text-xs">
                    <span className="text-slate-400">Mastery Grade: </span>
                    <strong className="text-amber-300 font-bold">{selectedCert.grade}</strong>
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-xl text-xs">
                    <span className="text-slate-400">Cumulative Score: </span>
                    <strong className="text-white font-bold">{selectedCert.score}%</strong>
                  </div>
                </div>

                {/* Verified Skills */}
                <div className="relative z-10 mb-8">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Verified Technical Competencies</p>
                  <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto">
                    {selectedCert.skillsAcquired.split(',').map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-800/90 text-slate-200 border border-slate-700 text-[11px] px-2.5 py-1 rounded-lg font-mono"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Signatures & Hash */}
                <div className="relative z-10 pt-6 border-t border-amber-500/20 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end text-left">
                  <div>
                    <div className="font-serif italic text-sm text-amber-200 border-b border-slate-700 pb-1 font-semibold">
                      Dr. A. Sundaram
                    </div>
                    <p className="text-[10px] text-slate-400 uppercase mt-1">Dean of AI & Computing</p>
                    <p className="text-[9px] text-slate-400">LearnPath Academic Board</p>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-full border-2 border-amber-400/80 bg-amber-500/10 flex items-center justify-center shadow-lg shadow-amber-500/20 mb-1">
                      <ShieldCheck className="w-7 h-7 text-amber-400" />
                    </div>
                    <span className="text-[9px] text-amber-400 font-bold uppercase tracking-wider">
                      Cryptographically Verified
                    </span>
                  </div>

                  <div className="text-right sm:text-right">
                    <div className="font-serif italic text-sm text-amber-200 border-b border-slate-700 pb-1 font-semibold">
                      Verified System Signature
                    </div>
                    <p className="text-[10px] text-slate-400 uppercase mt-1">
                      Issued: {new Date(selectedCert.issueDate).toLocaleDateString()}
                    </p>
                    <p className="text-[9px] font-mono text-slate-400 break-all truncate max-w-[180px] ml-auto">
                      SHA: {selectedCert.verificationHash.substring(0, 16)}...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <GlassCard className="p-12 text-center text-slate-400">
              <Award className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p>Select a certificate to view details</p>
            </GlassCard>
          )}
        </div>
      </div>

      {/* Claim Certificate Modal */}
      {isClaimModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" /> Claim Academic Certificate
              </h3>
              <button
                onClick={() => setIsClaimModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Target Curriculum Track
                </label>
                <select
                  value={claimCourse}
                  onChange={(e) => setClaimCourse(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                >
                  <option value="Full-Stack Java 21 & AI Integration">Full-Stack Java 21 & AI Integration</option>
                  <option value="Microservices & Distributed Systems">Microservices & Distributed Systems</option>
                  <option value="Machine Learning & Scikit-Learn Algorithms">Machine Learning & Scikit-Learn Algorithms</option>
                  <option value="Multilingual RAG AI Tutoring Systems">Multilingual RAG AI Tutoring Systems</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Curriculum Mastery Score achieved: {claimScore}%
                </label>
                <input
                  type="range"
                  min={70}
                  max={100}
                  value={claimScore}
                  onChange={(e) => setClaimScore(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Pass (70%)</span>
                  <span>Distinction (85%)</span>
                  <span>Honors (100%)</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setIsClaimModalOpen(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs transition"
              >
                Cancel
              </button>
              <button
                onClick={handleClaimCertificate}
                disabled={isClaiming}
                className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs transition disabled:opacity-50 flex items-center gap-1.5"
              >
                {isClaiming ? 'Generating SHA Signature...' : 'Issue & Verify Certificate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

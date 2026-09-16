import React, { useState, useRef, useEffect } from 'react';
import { voiceApi } from '../services/api';
import { VoiceProcessResponse, VoiceSessionDetails } from '../types';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  Mic, MicOff, Volume2, Play, Pause, RotateCcw,
  Sparkles, BookOpen, AlertCircle, Radio, Clock
} from 'lucide-react';

export const VoiceTutorPage: React.FC = () => {
  const { showToast } = useToast();
  const { language, t } = useLanguage();

  const [sessionId, setSessionId] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState<VoiceProcessResponse | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [textInput, setTextInput] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    initSession();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
    };
  }, []);

  const initSession = async (): Promise<number | null> => {
    try {
      const res = await voiceApi.createSession("Voice Study Session - " + new Date().toLocaleDateString());
      setSessionId(res.data);
      return res.data;
    } catch (err) {
      console.warn("Backend session creation deferred:", err);
      return null;
    }
  };

  const getOrCreateSessionId = async (): Promise<number> => {
    if (sessionId) return sessionId;
    const newId = await initSession();
    if (newId) return newId;
    return 1;
  };

  const startRecording = async () => {
    try {
      setPermissionDenied(false);
      setLiveTranscript('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => handleRecordingComplete();

      // Launch Web Speech Recognition for accurate real-time speech-to-text
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recog = new SpeechRecognition();
          recog.continuous = true;
          recog.interimResults = true;
          if (language === 'KANNADA') recog.lang = 'kn-IN';
          else if (language === 'HINDI') recog.lang = 'hi-IN';
          else recog.lang = 'en-US';

          recog.onresult = (event: any) => {
            let current = '';
            for (let i = 0; i < event.results.length; i++) {
              current += event.results[i][0].transcript;
            }
            if (current) {
              setLiveTranscript(current);
            }
          };
          recog.onerror = (e: any) => console.warn("SpeechRecog error:", e);
          recog.start();
          recognitionRef.current = recog;
        } catch (e) {
          console.warn("SpeechRecog init error:", e);
        }
      }

      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn("Microphone access issue:", err);
      setPermissionDenied(true);
      showToast('Microphone access was denied or is unavailable. Fallback speech simulation will be used.', 'warning');
      simulateVoiceQuery();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
  };

  const handleRecordingComplete = async () => {
    const activeSessionId = await getOrCreateSessionId();
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
    const formData = new FormData();
    formData.append('sessionId', activeSessionId.toString());
    formData.append('file', audioBlob, 'student-query.wav');
    formData.append('language', language);
    if (liveTranscript && liveTranscript.trim()) {
      formData.append('transcript', liveTranscript.trim());
    }

    setProcessing(true);
    try {
      const res = await voiceApi.processAudio(activeSessionId, formData);
      setLastResponse(res.data);
      speakFallback(res.data.aiResponseText);
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to process voice query', 'error');
    } finally {
      setProcessing(false);
    }
  };

  // Direct typed question to hear speech synthesis
  const handleTextSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!textInput.trim() || processing) return;

    const query = textInput.trim();
    setTextInput('');
    const activeSessionId = await getOrCreateSessionId();

    const formData = new FormData();
    formData.append('sessionId', activeSessionId.toString());
    formData.append('file', new Blob([query], { type: 'text/plain' }), 'text-query.wav');
    formData.append('language', language);
    formData.append('transcript', query);

    setProcessing(true);
    try {
      const res = await voiceApi.processAudio(activeSessionId, formData);
      setLastResponse(res.data);
      speakFallback(res.data.aiResponseText);
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to get voice tutor response', 'error');
    } finally {
      setProcessing(false);
    }
  };

  // Fallback simulation when microphone is not physically accessible
  const simulateVoiceQuery = async () => {
    const activeSessionId = await getOrCreateSessionId();
    setProcessing(true);
    const formData = new FormData();
    formData.append('sessionId', activeSessionId.toString());
    formData.append('file', new Blob(["sample"], { type: 'text/plain' }), 'sample-query.wav');
    formData.append('language', language);

    try {
      const res = await voiceApi.processAudio(activeSessionId, formData);
      setLastResponse(res.data);
      speakFallback(res.data.aiResponseText);
    } catch (err: any) {
      showToast('Speech simulation failed', 'error');
    } finally {
      setProcessing(false);
    }
  };

  // Local Web SpeechSynthesis API fallback for zero-cost audio playback
  const speakFallback = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Strip markdown syntax symbols for clean speech audio
      const cleanText = text.replace(/[*_`#]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      if (language === 'KANNADA') utterance.lang = 'kn-IN';
      else if (language === 'HINDI') utterance.lang = 'hi-IN';
      else utterance.lang = 'en-US';

      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleSpeechPlayback = () => {
    if (!lastResponse) return;
    if (isPlayingAudio) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      speakFallback(lastResponse.aiResponseText);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>Interactive Spoken AI Tutor • {language}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{t('voice.title')}</h1>
          <p className="text-xs sm:text-sm text-blue-100/80 max-w-xl">{t('voice.subtitle')}</p>
        </div>
        <div className="flex items-center space-x-2 text-xs bg-white/10 px-3 py-2 rounded-xl backdrop-blur-md">
          <Clock className="w-4 h-4 text-brand-300" />
          <span>Session #{sessionId || 1}</span>
        </div>
      </div>

      {permissionDenied && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-center space-x-3 text-xs text-amber-800">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            Browser microphone permission was unavailable. We have enabled deterministic speech simulation mode with browser speech synthesis.
          </span>
        </div>
      )}

      {/* Main Microphone Interaction Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center space-y-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            {isRecording && (
              <div className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping" />
            )}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={processing}
              className={`w-28 h-28 rounded-full flex items-center justify-center shadow-2xl transition-all transform active:scale-95 ${
                isRecording
                  ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-500/30'
                  : 'bg-brand-600 text-white hover:bg-brand-700 shadow-brand-500/30'
              }`}
            >
              {isRecording ? (
                <MicOff className="w-12 h-12 animate-pulse" />
              ) : (
                <Mic className="w-12 h-12" />
              )}
            </button>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900">
              {isRecording ? `Listening... (${recordingSeconds}s)` : 'Click to Speak Question'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isRecording ? 'Click the microphone again when done to synthesize response' : 'Ask about concepts, algorithm complexities, or code syntax'}
            </p>

            {isRecording && liveTranscript && (
              <div className="mt-3 p-3 bg-brand-50 border border-brand-200 rounded-xl text-xs text-brand-900 animate-pulse text-center max-w-md mx-auto">
                <span className="font-bold">Detected Speech: </span>"{liveTranscript}"
              </div>
            )}
          </div>

          {!isRecording && (
            <div className="space-y-3 pt-2 w-full max-w-lg mx-auto">
              <form onSubmit={handleTextSubmit} className="flex items-center gap-2 w-full">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Or type any question to hear the Voice Tutor explain..."
                  className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white text-slate-900"
                />
                <button
                  type="submit"
                  disabled={!textInput.trim() || processing}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
                >
                  Ask Tutor
                </button>
              </form>
              <button
                type="button"
                onClick={simulateVoiceQuery}
                disabled={processing}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 underline"
              >
                Or click here to simulate sample voice query
              </button>
            </div>
          )}
        </div>

        {processing && (
          <div className="p-4 bg-slate-50 rounded-xl">
            <LoadingSpinner text="Transcribing audio and synthesizing spoken explanation..." />
          </div>
        )}
      </div>

      {/* Response Card */}
      {lastResponse && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Volume2 className="w-5 h-5 text-brand-600" />
              <h3 className="text-base font-bold text-slate-900">{t('voice.aiAnswer')}</h3>
            </div>
            <button
              onClick={toggleSpeechPlayback}
              className="inline-flex items-center px-3.5 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold transition-colors"
            >
              {isPlayingAudio ? (
                <>
                  <Pause className="w-3.5 h-3.5 mr-1.5" /> Pause Spoken Audio
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 mr-1.5" /> Play Spoken Audio
                </>
              )}
            </button>
          </div>

          {/* User Transcript */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/70 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              {t('voice.transcript')}:
            </span>
            <p className="text-sm font-semibold text-slate-800 italic">
              "{lastResponse.userTranscript}"
            </p>
          </div>

          {/* AI Response Text */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Tutor Explanation:
            </span>
            <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">
              {lastResponse.aiResponseText}
            </p>
          </div>

          {/* Sources */}
          {lastResponse.sources && lastResponse.sources.length > 0 && (
            <div className="pt-3 border-t border-slate-100 space-y-1.5">
              <span className="text-[11px] font-bold text-indigo-700 flex items-center">
                <BookOpen className="w-3.5 h-3.5 mr-1.5" /> Grounded In Study Materials:
              </span>
              <div className="flex flex-wrap gap-2">
                {lastResponse.sources.map((s, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-50 border border-indigo-200 text-indigo-800">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

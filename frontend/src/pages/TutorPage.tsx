import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { TutorChatResponse, SourceCitation } from '../types';
import { Bot, User, Send, Upload, Trash2, Sparkles, FileText, Globe } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: SourceCitation[];
  timestamp: Date;
}

export const TutorPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "Hello! I'm your AI Study Tutor. Upload your study notes or textbooks (PDF, TXT, MD) and ask me anything. I will provide answers grounded directly in your materials with source citations.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [language, setLanguage] = useState<'ENGLISH' | 'HINDI' | 'KANNADA'>('ENGLISH');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    // Fetch previously indexed documents
    api.get('/tutor/documents')
      .then(resp => {
        if (Array.isArray(resp.data)) {
          setUploadedFiles(resp.data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('file', files[i]);
      try {
        const resp = await api.post('/tutor/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (resp.data?.documentTitle) {
          setUploadedFiles(prev => [...new Set([...prev, resp.data.documentTitle])]);
          successCount++;
        }
      } catch (err: any) {
        showToast(`Failed to upload ${files[i].name}`, 'error');
      }
    }

    if (successCount > 0) {
      showToast(`Indexed ${successCount} document(s) for RAG tutor.`, 'success');
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userPrompt = input.trim();
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userPrompt,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const resp = await api.post('/tutor/chat', {
        message: userPrompt,
        language: language,
      });
      const chatData: TutorChatResponse = resp.data;
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: chatData.response,
        sources: chatData.sources,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an issue processing your query. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '0',
        role: 'assistant',
        content: "Chat cleared. Feel free to ask more questions about your uploaded documents!",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">RAG AI Study Tutor</h1>
            <p className="text-xs text-slate-500">Grounded answers from your notes with citations</p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* Language Selector */}
          <div className="flex items-center space-x-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-xs">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={language}
              onChange={e => setLanguage(e.target.value as any)}
              className="bg-transparent font-medium text-slate-700 outline-none cursor-pointer"
            >
              <option value="ENGLISH">English</option>
              <option value="HINDI">Hindi (हिंदी)</option>
              <option value="KANNADA">Kannada (ಕನ್ನಡ)</option>
            </select>
          </div>

          {uploadedFiles.length > 0 && (
            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1.5 rounded-xl font-semibold">
              {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''} indexed
            </span>
          )}

          <button
            onClick={clearChat}
            className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'order-1' : ''}`}>
              <div className={`flex items-start space-x-2.5 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user' ? 'bg-brand-600 text-white' : 'bg-violet-100 text-violet-600'
                  }`}
                >
                  {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs ${
                    msg.role === 'user'
                      ? 'bg-brand-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {/* Sources / Citations */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Source Citations:</span>
                      </p>
                      {msg.sources.map((src, i) => (
                        <div key={i} className="text-xs bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                          <div className="flex items-center justify-between font-semibold text-slate-700 mb-0.5">
                            <span>{src.documentTitle}</span>
                            {src.pageNumber && <span className="text-[10px] text-slate-400">p. {src.pageNumber}</span>}
                          </div>
                          <p className="text-slate-500 line-clamp-2 text-[11px]">{src.excerpt}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <p className={`text-[10px] text-slate-400 mt-1 ${msg.role === 'user' ? 'text-right' : 'text-left ml-9'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-xs">
              <div className="flex space-x-1.5 items-center">
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="pt-3 border-t border-slate-200">
        <div className="flex items-end space-x-2.5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            accept=".pdf,.txt,.md"
            multiple
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="p-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-brand-600 transition-all flex-shrink-0 disabled:opacity-50"
            title="Upload PDF, TXT or MD files"
          >
            <Upload className="w-5 h-5" />
          </button>

          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none resize-none pr-12 transition-all"
              placeholder="Ask a question about your study materials..."
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="absolute right-2 bottom-2 p-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-40 transition-all shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

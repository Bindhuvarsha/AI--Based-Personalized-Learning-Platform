import React, { useState, useEffect } from 'react';
import { studyGroupApi } from '../services/api';
import { StudyGroupItem, GroupChatMessage } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import {
  Users, MessageSquare, Plus, Check, LogOut, Send,
  Globe, Shield, BookOpen, Compass
} from 'lucide-react';

export const StudyGroupsPage: React.FC = () => {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<StudyGroupItem[]>([]);
  const [activeGroup, setActiveGroup] = useState<StudyGroupItem | null>(null);
  const [messages, setMessages] = useState<GroupChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Group Form
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [topicFocus, setTopicFocus] = useState('Backend Java Microservices');
  const [targetCareer, setTargetCareer] = useState('Backend Software Engineer');
  const [languagePref, setLanguagePref] = useState('ENGLISH');
  const [maxMembers, setMaxMembers] = useState(8);

  useEffect(() => {
    loadGroups();
  }, []);

  useEffect(() => {
    if (activeGroup) {
      loadMessages(activeGroup.id);
    }
  }, [activeGroup]);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const res = await studyGroupApi.list();
      setGroups(res.data);
      if (res.data.length > 0) {
        setActiveGroup(res.data[0]);
      }
    } catch (err: any) {
      showToast('Failed to load study groups', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (groupId: number) => {
    try {
      const res = await studyGroupApi.getMessages(groupId);
      setMessages(res.data);
    } catch (err) {
      console.warn("Could not load group messages", err);
    }
  };

  const handleJoin = async (group: StudyGroupItem) => {
    try {
      await studyGroupApi.join(group.id);
      showToast(`Joined ${group.name}!`, 'success');
      loadGroups();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to join group', 'error');
    }
  };

  const handleLeave = async (group: StudyGroupItem) => {
    try {
      await studyGroupApi.leave(group.id);
      showToast(`Left ${group.name}`, 'info');
      loadGroups();
    } catch (err: any) {
      showToast('Failed to leave group', 'error');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGroup || !newMessage.trim()) return;

    const text = newMessage.trim();
    setNewMessage('');
    try {
      const res = await studyGroupApi.postMessage(activeGroup.id, text);
      setMessages(prev => [...prev, res.data]);
    } catch (err: any) {
      showToast('Failed to send message', 'error');
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await studyGroupApi.create({
        name: groupName,
        description,
        topicFocus,
        targetCareer,
        language: languagePref,
        maxMembers
      });
      showToast('Study group created successfully!', 'success');
      setShowCreateModal(false);
      loadGroups();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to create study group', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Connecting to peer study groups..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-brand-950 text-white rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
            <Users className="w-3.5 h-3.5 text-brand-300" />
            <span>Peer Collaborative Learning</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">AI Cohort Study Groups</h1>
          <p className="text-xs sm:text-sm text-blue-100/80 max-w-xl">
            Collaborate with peers pursuing identical career tracks. Share insights, solve exercises together, and stay motivated.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center flex-shrink-0"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Create Study Group
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Groups List */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Available Circles</h2>
            <span className="text-xs text-slate-400">{groups.length} Groups</span>
          </div>

          <div className="space-y-2.5">
            {groups.map((g) => (
              <div
                key={g.id}
                onClick={() => setActiveGroup(g)}
                className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                  activeGroup?.id === g.id
                    ? 'border-brand-500 bg-brand-50/40 ring-2 ring-brand-400'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xs font-bold text-slate-900">{g.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {g.memberCount} / {g.maxMembers} Members
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{g.description}</p>
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
                  <span className="font-semibold text-brand-700">{g.targetCareer}</span>
                  {g.isJoined ? (
                    <span className="text-emerald-600 font-bold flex items-center">
                      <Check className="w-3 h-3 mr-1" /> Joined
                    </span>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJoin(g);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold text-[10px] transition-colors"
                    >
                      Join
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Group Chat Thread & Info */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[600px]">
          {activeGroup ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{activeGroup.name}</h3>
                  <p className="text-[11px] text-slate-500">Focus: {activeGroup.topicFocus}</p>
                </div>
                {activeGroup.isJoined && !activeGroup.isOwner && (
                  <button
                    onClick={() => handleLeave(activeGroup)}
                    className="text-xs font-semibold text-rose-600 hover:underline flex items-center"
                  >
                    <LogOut className="w-3.5 h-3.5 mr-1" /> Leave Circle
                  </button>
                )}
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 text-xs">
                    No messages yet. Introduce yourself and share your daily goal!
                  </div>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex flex-col ${m.isCurrentUser ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-slate-400 mb-0.5 px-1">{m.senderName}</span>
                      <div
                        className={`p-3 rounded-xl max-w-[80%] text-xs leading-relaxed ${
                          m.isCurrentUser
                            ? 'bg-brand-600 text-white rounded-tr-none'
                            : 'bg-slate-100 text-slate-800 rounded-tl-none'
                        }`}
                      >
                        {m.content}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Chat Input */}
              {activeGroup.isJoined ? (
                <form onSubmit={handleSendMessage} className="p-3 bg-slate-50 border-t border-slate-100 flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Discuss study challenges, ask for tips..."
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs transition-colors flex items-center"
                  >
                    <Send className="w-3.5 h-3.5 mr-1" /> Send
                  </button>
                </form>
              ) : (
                <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                  <button
                    onClick={() => handleJoin(activeGroup)}
                    className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs transition-colors"
                  >
                    Join this Study Group to Participate in Chat
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 text-slate-400 text-xs">
              Select a study group from the list.
            </div>
          )}
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Create New Cohort Group</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Group Title</label>
                <input
                  type="text"
                  required
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g. 2026 Spring Cloud Architecture Sprint"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Career</label>
                <input
                  type="text"
                  required
                  value={targetCareer}
                  onChange={(e) => setTargetCareer(e.target.value)}
                  placeholder="e.g. Backend Java Engineer"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Topic Focus</label>
                <input
                  type="text"
                  required
                  value={topicFocus}
                  onChange={(e) => setTopicFocus(e.target.value)}
                  placeholder="e.g. Microservices & Distributed Caching"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Group study norms, daily check-in cadence..."
                  className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md shadow-brand-500/20"
                >
                  Create Circle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

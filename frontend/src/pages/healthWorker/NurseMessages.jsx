import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { healthWorkerApi } from '../../api/healthWorkerApi';
import { messageApi } from '../../api/messageApi';
import MessageBox from '../../components/MessageBox/MessageBox';
import UserAvatar from '../../components/UserAvatar/UserAvatar';
import Loading from '../../components/Loading/Loading';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { KidneyIcon, RuralVillageEmblem } from '../../components/KidneyVisuals/KidneyVisuals';
import { MessageSquare, Users, Search, RefreshCw, AlertTriangle } from 'lucide-react';

const NurseMessages = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialUserId = searchParams.get('userId');

  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await healthWorkerApi.getAssignedMembers();
      const memberList = res.data || [];
      setMembers(memberList);

      if (memberList.length > 0) {
        const target = initialUserId
          ? memberList.find((m) => String(m.user.id) === String(initialUserId))
          : memberList[0];
        const selected = target ? target.user : memberList[0].user;
        setSelectedMember(selected);
        fetchConversation(selected.id);
      }
    } catch (err) {
      setError('Unable to load community members list.');
    } finally {
      setLoading(false);
    }
  };

  const fetchConversation = async (userId) => {
    if (!userId) return;
    try {
      const res = await messageApi.getConversation(userId);
      setMessages(res.data || []);
      messageApi.markConversationAsRead(userId).catch(() => {});
    } catch (err) {
      console.error('Failed to load conversation:', err);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [initialUserId]);

  const handleSelectMember = (member) => {
    setSelectedMember(member);
    fetchConversation(member.id);
  };

  const handleSendMessage = async (text, lang = 'TE') => {
    if (!selectedMember || !text) return;
    setIsSending(true);

    try {
      const res = await messageApi.sendMessage({
        userId: selectedMember.id,
        receiverId: selectedMember.id,
        message: text,
        language: lang,
      });
      setMessages((prev) => [...prev, res.data]);
    } catch (err) {
      alert('Unable to send message.');
    } finally {
      setIsSending(false);
    }
  };

  const filteredMembers = members.filter((m) =>
    m.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.user?.villageCommunity?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-teal-700" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Community Care Messaging
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                Bilingual Telugu / English
              </span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Coordinate care, diet, and renal health checkups with assigned community members.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (selectedMember) fetchConversation(selectedMember.id);
          }}
          className="p-2 text-slate-400 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-colors self-end sm:self-center"
          title="Refresh conversation"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <Loading message="Loading messages and conversations..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Member Selection Sidebar */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 space-y-3 h-[620px] flex flex-col">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search member or village..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-700"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-1">
              {filteredMembers.length === 0 ? (
                <div className="p-4 text-center text-slate-400 text-xs">No members found.</div>
              ) : (
                filteredMembers.map((item) => {
                  const u = item.user;
                  const isSelected = selectedMember?.id === u.id;
                  const isPriority = item.latestPrediction?.priorityReview;

                  return (
                    <button
                      key={u.id}
                      onClick={() => handleSelectMember(u)}
                      className={`w-full text-left p-2.5 rounded-2xl transition-all flex items-center space-x-3 ${
                        isSelected
                          ? 'bg-teal-50 text-teal-900 border border-teal-200 shadow-2xs font-bold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <UserAvatar
                        user={u}
                        role="ROLE_USER"
                        size="sm"
                        className={isPriority ? 'ring-2 ring-amber-300' : ''}
                      />

                      <div className="flex-1 truncate">
                        <div className="flex items-center justify-between">
                          <span className="text-xs truncate font-bold text-slate-900">{u.fullName}</span>
                          {isPriority && (
                            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" title="Priority Review" />
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 block truncate">
                          {u.villageCommunity}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Window with Photo Support */}
          <div className="md:col-span-2">
            {selectedMember ? (
              <MessageBox
                messages={messages}
                onSendMessage={handleSendMessage}
                recipientName={selectedMember.fullName}
                recipientRole="Community Member"
                recipientPhoto={selectedMember.profilePhoto}
                recipientUser={selectedMember}
                currentUser={user}
                isHealthWorker={true}
                isSending={isSending}
              />
            ) : (
              <div className="h-[620px] bg-white rounded-3xl border border-slate-200/90 shadow-sm flex items-center justify-center text-slate-400 text-xs">
                Select a community member to start messaging.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NurseMessages;

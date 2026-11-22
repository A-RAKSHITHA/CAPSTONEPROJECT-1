import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { messageApi } from '../../api/messageApi';
import MessageBox from '../../components/MessageBox/MessageBox';
import Loading from '../../components/Loading/Loading';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { KidneyIcon, RuralVillageEmblem } from '../../components/KidneyVisuals/KidneyVisuals';
import { MessageSquare, Stethoscope, RefreshCw } from 'lucide-react';

const UserMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  const fetchMessages = async (quiet = false) => {
    if (!user?.id) return;
    try {
      if (!quiet) setLoading(true);
      setError('');
      const res = await messageApi.getConversation(user.id);
      setMessages(res.data || []);
      // Mark as read
      messageApi.markConversationAsRead(user.id).catch(() => {});
    } catch (err) {
      if (!quiet) setError('Unable to load messages.');
    } finally {
      if (!quiet) setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(() => {
      fetchMessages(true);
    }, 8000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const handleSendMessage = async (text, lang = 'TE') => {
    if (!user?.id || !text) return;
    setIsSending(true);

    try {
      const payload = {
        userId: user.id,
        senderId: user.id,
        message: text,
        language: lang,
      };

      const res = await messageApi.sendMessage(payload);
      setMessages((prev) => [...prev, res.data]);
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Unable to send message. Please check your connection.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-teal-700" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Health Worker Chat
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                Telugu / English
              </span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Direct bilingual communication with Sister Sunitha Rao (Village ANM).
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchMessages(false)}
          className="p-2 text-slate-400 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-colors self-end sm:self-center"
          title="Refresh conversation"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={() => fetchMessages(false)} />}

      {loading ? (
        <Loading message="Loading messages..." />
      ) : (
        <MessageBox
          messages={messages}
          onSendMessage={handleSendMessage}
          recipientName={user?.assignedNurseName || 'Sister Sunitha Rao (ANM)'}
          recipientRole="Health Worker / ANM"
          recipientPhoto={user?.assignedNurse?.profilePhoto}
          recipientUser={user?.assignedNurse}
          currentUser={user}
          isHealthWorker={false}
          isSending={isSending}
        />
      )}
    </div>
  );
};

export default UserMessages;

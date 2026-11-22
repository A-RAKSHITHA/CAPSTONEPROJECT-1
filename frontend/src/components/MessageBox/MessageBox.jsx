import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Globe, Clock, Check, CheckCheck, Sparkles, Volume2 } from 'lucide-react';
import { useVoiceToText } from '../../hooks/useVoiceToText';
import UserAvatar from '../UserAvatar/UserAvatar';

const MessageBox = ({
  messages = [],
  onSendMessage,
  recipientName = 'Health Worker',
  recipientRole = 'Health Worker',
  recipientPhoto = null,
  recipientUser = null,
  currentUser = null,
  isHealthWorker = false,
  isSending = false,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('te-IN'); // te-IN or en-IN
  const messagesEndRef = useRef(null);

  // Voice to text integration
  const handleTranscript = (transcript) => {
    // Append to existing text in editable input box
    setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
  };

  const { isListening, error: micError, toggleListening, isSupported } = useVoiceToText(handleTranscript);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(inputText.trim(), selectedLanguage.startsWith('te') ? 'TE' : 'EN');
    setInputText('');
  };

  // Quick Action Templates for Health Worker (Section 27)
  const quickTemplates = [
    {
      label: 'Request Health Update',
      text: 'Please update your latest health information when convenient.',
      teluguText: 'దయచేసి వీలైనప్పుడు మీ తాజా ఆరోగ్య వివరాలను అప్డేట్ చేయండి.',
    },
    {
      label: 'Hydration & Low Salt',
      text: 'Please drink plenty of clean water and minimize dietary salt for kidney health.',
      teluguText: 'దయచేసి కిడ్నీ ఆరోగ్యం కోసం తగినంత శుభ్రమైన నీరు త్రాగండి మరియు ఉప్పు తగ్గించండి.',
    },
    {
      label: 'Follow-up Reminder',
      text: 'Reminder: Your scheduled health follow-up is coming up.',
      teluguText: 'గుర్తుంచుకోండి: మీ ఆరోగ్య ఫాలో-అప్ సమీపిస్తోంది.',
    },
    {
      label: 'Ask for BP & Glucose',
      text: 'Please measure and update your latest blood pressure and glucose readings.',
      teluguText: 'దయచేసి మీ తాజా రక్తపోటు మరియు షుగర్ వివరాలను కొలిచి నమోదు చేయండి.',
    },
  ];

  const handleQuickTemplate = (tpl) => {
    const textToInsert = selectedLanguage.startsWith('te') ? tpl.teluguText : tpl.text;
    setInputText(textToInsert);
  };

  return (
    <div className="flex flex-col h-[620px] bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Conversation Header with Recipient Photo */}
      <div className="px-5 py-3.5 border-b border-slate-200/80 bg-slate-50/80 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <UserAvatar
            user={recipientUser}
            photo={recipientPhoto}
            name={recipientName}
            role={recipientRole === 'Health Worker' ? 'ROLE_NURSE' : 'ROLE_USER'}
            size="md"
            showRoleBadge
          />
          <div>
            <h4 className="font-bold text-slate-900 text-sm">{recipientName}</h4>
            <span className="text-xs text-slate-500 font-medium">{recipientRole} • Active Support</span>
          </div>
        </div>

        {/* Language selector toggle */}
        <div className="flex items-center space-x-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs shadow-2xs">
          <Globe className="w-3.5 h-3.5 text-teal-700" />
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-transparent border-none text-slate-700 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="te-IN">Telugu (తెలుగు)</option>
            <option value="en-IN">English (EN)</option>
          </select>
        </div>
      </div>

      {/* Messages Scroll Area with Photo Avatars */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/30">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs text-center px-4">
            <p className="font-bold text-slate-700 text-sm mb-1">No messages yet</p>
            <p className="max-w-xs">
              Communicate directly in English or Telugu. You can type or tap the microphone to dictate your message safely.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = isHealthWorker
              ? msg.sender?.role === 'ROLE_NURSE'
              : msg.sender?.role !== 'ROLE_NURSE';

            const senderPhoto = isMe
              ? currentUser?.profilePhoto
              : (recipientPhoto || msg.sender?.profilePhoto);

            return (
              <div
                key={msg.id}
                className={`flex items-end space-x-2 ${isMe ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}
              >
                {/* Small Avatar on Message */}
                <UserAvatar
                  user={msg.sender}
                  photo={senderPhoto}
                  size="xs"
                  className="mb-1 shrink-0"
                />

                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[80%] sm:max-w-[70%]`}>
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isMe
                        ? 'bg-teal-800 text-white rounded-br-none shadow-sm'
                        : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-none shadow-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                  </div>
                  <div className="flex items-center space-x-1.5 mt-1 px-1 text-[10px] text-slate-400">
                    <span>{new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {msg.language && (
                      <span className="font-bold uppercase text-slate-400">({msg.language})</span>
                    )}
                    {isMe && (
                      <span>
                        {msg.readStatus ? (
                          <CheckCheck className="w-3 h-3 text-teal-600 inline" />
                        ) : (
                          <Check className="w-3 h-3 text-slate-400 inline" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Health Worker Quick Action Templates */}
      {isHealthWorker && (
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center space-x-2 overflow-x-auto text-xs">
          <span className="text-slate-400 font-bold flex items-center space-x-1 flex-shrink-0 text-[11px]">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Templates:</span>
          </span>
          {quickTemplates.map((t, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickTemplate(t)}
              className="px-2.5 py-1 bg-white hover:bg-teal-50 border border-slate-200 text-slate-600 hover:text-teal-900 rounded-lg whitespace-nowrap text-[11px] font-medium transition-colors"
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Input Form with Microphone Dictation */}
      <div className="p-3 bg-white border-t border-slate-200">
        {micError && (
          <div className="mb-2 px-3 py-1 bg-rose-50 text-rose-700 text-xs rounded-lg">
            {micError}
          </div>
        )}
        <form onSubmit={handleSend} className="flex items-center space-x-2">
          {/* Microphone button */}
          <button
            type="button"
            onClick={toggleListening}
            disabled={!isSupported}
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center shrink-0 ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse shadow-md'
                : 'bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-800'
            }`}
            title={
              !isSupported
                ? 'Voice-to-text not supported in this browser'
                : isListening
                ? 'Listening... Click to stop'
                : `Click to dictate in ${selectedLanguage.startsWith('te') ? 'Telugu' : 'English'}`
            }
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Editable Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isListening
                ? 'Listening... Speak now (dictated text appears here)...'
                : selectedLanguage.startsWith('te')
                ? 'తెలుగులో సందేశం టైప్ చేయండి లేదా మైక్ వాడండి...'
                : 'Type message in English or use microphone...'
            }
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-700"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="p-2.5 bg-teal-800 hover:bg-teal-900 disabled:bg-slate-200 text-white rounded-xl font-bold shadow-xs transition-colors shrink-0 flex items-center justify-center"
            title="Send Message"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageBox;

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { healthWorkerApi } from '../../api/healthWorkerApi';
import { followupApi } from '../../api/followupApi';
import { messageApi } from '../../api/messageApi';
import PredictionCard from '../../components/PredictionCard/PredictionCard';
import MessageBox from '../../components/MessageBox/MessageBox';
import Loading from '../../components/Loading/Loading';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import UserAvatar from '../../components/UserAvatar/UserAvatar';
import { KidneyIcon, RuralVillageEmblem } from '../../components/KidneyVisuals/KidneyVisuals';
import {
  User,
  HeartPulse,
  Apple,
  CalendarCheck,
  MessageSquare,
  History,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';

const MemberDetail = () => {
  const { id } = useParams();
  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('assessment');

  // Follow-up form state
  const [fuStatus, setFuStatus] = useState('Contacted');
  const [fuPriority, setFuPriority] = useState('High');
  const [fuRemarks, setFuRemarks] = useState('');
  const [fuActionTaken, setFuActionTaken] = useState('');
  const [fuNextDate, setFuNextDate] = useState('');
  const [isSavingFu, setIsSavingFu] = useState(false);
  const [fuSuccess, setFuSuccess] = useState('');

  // Messages state
  const [messages, setMessages] = useState([]);
  const [isSendingMsg, setIsSendingMsg] = useState(false);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await healthWorkerApi.getMemberDetails(id);
      setMemberData(res.data);

      // Fetch messages for this member context
      const msgRes = await messageApi.getConversation(id);
      setMessages(msgRes.data || []);
    } catch (err) {
      setError('Unable to load community member details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetails();
  }, [id]);

  const handleSaveFollowUp = async (e) => {
    e.preventDefault();
    setIsSavingFu(true);
    setFuSuccess('');

    try {
      await followupApi.createFollowUp({
        userId: id,
        status: fuStatus,
        priority: fuPriority,
        remarks: fuRemarks,
        actionTaken: fuActionTaken,
        nextFollowupDate: fuNextDate || null,
        predictionId: memberData?.latestAssessment?.id || null,
      });

      setFuSuccess('Follow-up record saved successfully and update shared with community member.');
      setFuRemarks('');
      setFuActionTaken('');
      fetchDetails();
    } catch (err) {
      alert('Unable to save follow-up record.');
    } finally {
      setIsSavingFu(false);
    }
  };

  const handleSendMessage = async (text) => {
    setIsSendingMsg(true);
    try {
      const res = await messageApi.sendMessage({
        userId: id,
        message: text,
      });
      setMessages((prev) => [...prev, res.data]);
    } catch (err) {
      alert('Failed to send message.');
    } finally {
      setIsSendingMsg(false);
    }
  };

  if (loading) {
    return <Loading message="Loading community member record and clinical history..." />;
  }

  if (error || !memberData) {
    return <ErrorMessage message={error || 'Member not found'} onRetry={fetchDetails} />;
  }

  const member = memberData.member;
  const latestAssessment = memberData.latestAssessment;
  const latestLifestyle = memberData.latestLifestyle;
  const healthRecords = memberData.healthRecords || [];
  const followUps = memberData.followUps || [];
  const isPriority = latestAssessment?.priorityReview;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/nurse/priority-list"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Priority Reviews</span>
        </Link>
      </div>

      {/* Member Header (Section 21) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-4">
          <UserAvatar
            user={member}
            role="ROLE_USER"
            size="2xl"
            className={isPriority ? 'ring-4 ring-amber-300 shadow-md' : 'ring-2 ring-emerald-200'}
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-slate-900">{member.fullName}</h1>
              {isPriority && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Priority Review</span>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{member.villageCommunity}, {member.district}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{member.phoneNumber}</span>
              </span>
              <span>•</span>
              <span>{member.age || '—'} yrs ({member.gender || '—'})</span>
            </div>
          </div>
        </div>

        <div className="text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <span className="text-slate-400 block mb-0.5">Assigned Health Worker</span>
          <span className="font-semibold text-slate-800">{member.assignedNurse?.fullName || 'Assigned to You'}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-2 sm:space-x-6 overflow-x-auto text-sm font-semibold">
        <button
          onClick={() => setActiveTab('assessment')}
          className={`pb-3 border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === 'assessment'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <HeartPulse className="w-4 h-4" />
          <span>Latest Assessment & Clinical Vitals</span>
        </button>

        <button
          onClick={() => setActiveTab('followup')}
          className={`pb-3 border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === 'followup'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Record Follow-up ({followUps.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`pb-3 border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === 'messages'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Telugu / English Chat ({messages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('lifestyle')}
          className={`pb-3 border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === 'lifestyle'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Apple className="w-4 h-4" />
          <span>Lifestyle Records</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === 'history'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Health History</span>
        </button>
      </div>

      {/* TAB: Assessment & Vitals */}
      {activeTab === 'assessment' && (
        <div className="space-y-6">
          {latestAssessment ? (
            <PredictionCard assessment={latestAssessment} showFollowUpLink={false} />
          ) : (
            <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center text-slate-400 text-sm">
              No health assessments recorded for this community member yet.
            </div>
          )}

          {/* Latest Clinical Readings */}
          {healthRecords.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 text-base">Latest Clinical Biomarkers</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Blood Pressure</span>
                  <span className="font-bold text-slate-800 text-sm">{healthRecords[0].bp} mm/Hg</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Serum Creatinine</span>
                  <span className="font-bold text-slate-800 text-sm">{healthRecords[0].sc} mg/dL</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Blood Glucose</span>
                  <span className="font-bold text-slate-800 text-sm">{healthRecords[0].bgr} mg/dL</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Blood Urea</span>
                  <span className="font-bold text-slate-800 text-sm">{healthRecords[0].bu} mg/dL</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Hemoglobin</span>
                  <span className="font-bold text-slate-800 text-sm">{healthRecords[0].hemo} g/dL</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Albumin Level</span>
                  <span className="font-bold text-slate-800 text-sm">{healthRecords[0].al}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Hypertension</span>
                  <span className="font-bold text-slate-800 text-sm uppercase">{healthRecords[0].htn}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Diabetes</span>
                  <span className="font-bold text-slate-800 text-sm uppercase">{healthRecords[0].dm}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: Record Follow-Up (Section 29) */}
      {activeTab === 'followup' && (
        <div className="space-y-6">
          {fuSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{fuSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSaveFollowUp} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3">
              Record Health Worker Review & Action
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Status
                </label>
                <select
                  value={fuStatus}
                  onChange={(e) => setFuStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                >
                  <option value="Contacted">Contacted</option>
                  <option value="Follow-up Completed">Follow-up Completed</option>
                  <option value="Needs Further Review">Needs Further Review</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Priority
                </label>
                <select
                  value={fuPriority}
                  onChange={(e) => setFuPriority(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                >
                  <option value="High">High Priority</option>
                  <option value="Moderate">Moderate Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Health Worker Remarks
                </label>
                <textarea
                  rows="3"
                  value={fuRemarks}
                  onChange={(e) => setFuRemarks(e.target.value)}
                  placeholder="Notes from consultation, physical visit, or symptom observation..."
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Action Taken / Advice Given
                </label>
                <textarea
                  rows="2"
                  value={fuActionTaken}
                  onChange={(e) => setFuActionTaken(e.target.value)}
                  placeholder="Guidance provided, lifestyle advice, or referral to primary health centre..."
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Next Follow-up Date
                </label>
                <input
                  type="date"
                  value={fuNextDate}
                  onChange={(e) => setFuNextDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                disabled={isSavingFu}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all"
              >
                {isSavingFu ? 'Saving Follow-up...' : 'Save Follow-up'}
              </button>
            </div>
          </form>

          {/* Follow-up History */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-base">Previous Follow-up Records</h3>
            {followUps.length === 0 ? (
              <p className="text-slate-400 text-xs">No previous follow-up records.</p>
            ) : (
              <div className="space-y-3">
                {followUps.map((fu) => (
                  <div key={fu.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800">
                        {new Date(fu.followupDate).toLocaleDateString()} • {fu.status}
                      </span>
                      {fu.nextFollowupDate && (
                        <span className="text-emerald-700 font-semibold">
                          Next: {new Date(fu.nextFollowupDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {fu.remarks && <p className="text-slate-700">Remarks: {fu.remarks}</p>}
                    {fu.actionTaken && <p className="text-slate-600">Action: {fu.actionTaken}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: Messages */}
      {activeTab === 'messages' && (
        <div>
          <MessageBox
            messages={messages}
            onSendMessage={handleSendMessage}
            recipientName={member.fullName}
            recipientRole="Community Member"
            isHealthWorker={true}
            isSending={isSendingMsg}
          />
        </div>
      )}

      {/* TAB: Lifestyle */}
      {activeTab === 'lifestyle' && (
        <div className="space-y-4">
          {latestLifestyle ? (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3 text-xs">
              <h3 className="font-bold text-slate-800 text-base">Latest Lifestyle Record</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[11px]">Food Habits</span>
                  <span className="font-bold text-slate-800 text-sm">{latestLifestyle.foodHabits}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[11px]">Water Intake</span>
                  <span className="font-bold text-slate-800 text-sm">{latestLifestyle.waterIntake}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[11px]">Physical Activity</span>
                  <span className="font-bold text-slate-800 text-sm">{latestLifestyle.physicalActivity}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[11px]">Exercise Frequency</span>
                  <span className="font-bold text-slate-800 text-sm">{latestLifestyle.exerciseFrequency}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[11px]">Sleep Duration</span>
                  <span className="font-bold text-slate-800 text-sm">{latestLifestyle.sleepDuration}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[11px]">Smoking / Alcohol</span>
                  <span className="font-bold text-slate-800 text-sm">{latestLifestyle.smokingStatus} / {latestLifestyle.alcoholConsumption}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center text-slate-400 text-sm">
              No lifestyle records logged by this member yet.
            </div>
          )}
        </div>
      )}

      {/* TAB: Health History */}
      {activeTab === 'history' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-base">Complete Assessment & Record History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">BP</th>
                  <th className="py-3 px-4">Creatinine</th>
                  <th className="py-3 px-4">Glucose</th>
                  <th className="py-3 px-4">Hemoglobin</th>
                  <th className="py-3 px-4">Urea</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {healthRecords.map((r) => (
                  <tr key={r.id}>
                    <td className="py-3 px-4 font-semibold text-slate-800">{new Date(r.recordedAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4">{r.bp} mm/Hg</td>
                    <td className="py-3 px-4">{r.sc} mg/dL</td>
                    <td className="py-3 px-4">{r.bgr} mg/dL</td>
                    <td className="py-3 px-4">{r.hemo} g/dL</td>
                    <td className="py-3 px-4">{r.bu} mg/dL</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberDetail;

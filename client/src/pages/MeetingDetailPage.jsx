import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FaArrowLeft, FaLock, FaLockOpen, FaCheck, FaXmark, FaClock,
  FaTriangleExclamation, FaCircleCheck
} from 'react-icons/fa6';
import { useMeetingDetail, useSaveAttendance, usePayFine, useCloseMeeting } from '../hooks/useMeeting';
import { useUserStats } from '../hooks/useUser';
import ConfirmModal from '../components/ConfirmModal';
import Spinner from '../components/Spinner';

const STATUS_OPTIONS = ['present', 'absent', 'late'];

const statusStyle = {
  present: 'bg-emerald-50 border-emerald-200 text-vicoba-forest',
  absent: 'bg-red-50 border-red-200 text-vicoba-earth',
  late: 'bg-amber-50 border-amber-200 text-vicoba-gold',
};

const MeetingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: user } = useUserStats();
  const { data, isLoading, isError } = useMeetingDetail(id);
  const saveAttendanceMutation = useSaveAttendance(id);
  const payFineMutation = usePayFine(id);
  const closeMeetingMutation = useCloseMeeting(id);

  const [attendanceMap, setAttendanceMap] = useState({});
  const [syncedFrom, setSyncedFrom] = useState(null);
  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false);

  const isLeader = ['admin', 'secretary', 'treasurer'].includes(user?.role);
  const isOpen = data?.meeting?.status === 'open';

  // Seed the editable attendance map whenever fresh meeting data arrives.
  // Done during render (React's recommended alternative to setting state inside
  // an effect) so there's no extra render pass or cascading-render warning.
  // The `data !== syncedFrom` guard makes this run once per new data object and
  // preserves in-progress local edits, which don't change the `data` reference.
  if (data && data !== syncedFrom) {
    setSyncedFrom(data);
    if (data?.attendance?.length > 0) {
      const map = {};
      data.attendance.forEach(a => { map[String(a.member._id)] = a.status; });
      setAttendanceMap(map);
    } else if (data?.members?.length > 0) {
      const map = {};
      data.members.forEach(m => { map[String(m._id)] = 'present'; });
      setAttendanceMap(map);
    }
  }

  const toggleStatus = (memberId) => {
    if (!isLeader || !isOpen) return;
    setAttendanceMap(prev => {
      const current = prev[memberId] || 'present';
      const idx = STATUS_OPTIONS.indexOf(current);
      const next = STATUS_OPTIONS[(idx + 1) % STATUS_OPTIONS.length];
      return { ...prev, [memberId]: next };
    });
  };

  const handleSaveAttendance = () => {
    const records = Object.entries(attendanceMap).map(([memberId, status]) => ({ memberId, status }));
    saveAttendanceMutation.mutate(records);
  };

  if (isLoading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-vicoba-forest border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (isError || !data) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <p className="text-gray-400 font-medium">Mkutano haukupatikana.</p>
      <button onClick={() => navigate('/dashboard/meetings')} className="text-vicoba-forest font-bold text-sm underline">
        {t('back_to_meetings')}
      </button>
    </div>
  );

  const { meeting, attendance, members } = data;
  const savedMap = {};
  attendance?.forEach(a => { savedMap[String(a.member._id)] = a; });

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/dashboard/meetings')}
          className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-vicoba-dark dark:hover:text-gray-100 hover:border-vicoba-forest transition-colors bg-white dark:bg-gray-900"
        >
          <FaArrowLeft size={14} />
        </button>
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-vicoba-dark dark:text-gray-100 tracking-tight">{meeting.title}</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-0.5">
            {new Date(meeting.date).toLocaleDateString('sw-TZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
            meeting.status === 'closed'
              ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400'
              : 'bg-emerald-50 border-emerald-200 text-vicoba-forest'
          }`}>
            {meeting.status === 'closed' ? <span className="flex items-center gap-1"><FaLock size={10} /> {t('meeting_closed')}</span> : <span className="flex items-center gap-1"><FaLockOpen size={10} /> {t('meeting_open')}</span>}
          </span>
        </div>
      </div>

      {isLeader && isOpen && members?.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-md shadow-vicoba-forest/5 overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-vicoba-dark dark:text-gray-100">{t('mark_attendance')}</h3>
            <span className="text-xs text-gray-400 font-medium">Bonyeza kubadilisha hali</span>
          </div>

          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {members.map(member => {
              const status = attendanceMap[String(member._id)] || 'present';
              return (
                <div key={member._id} className="flex items-center justify-between px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xs font-bold text-vicoba-forest">
                      {member.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-vicoba-dark dark:text-gray-100">{member.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{member.role === 'admin' ? 'Mwenyekiti' : member.role === 'secretary' ? 'Katibu' : member.role === 'treasurer' ? 'Muweka Hazina' : 'Mwanachama'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleStatus(String(member._id))}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${statusStyle[status]}`}
                  >
                    {status === 'present' ? t('present') : status === 'absent' ? t('absent_label') : t('late_label')}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex gap-3">
            <button
              onClick={handleSaveAttendance}
              disabled={saveAttendanceMutation.isPending}
              className="flex-1 bg-vicoba-forest hover:bg-emerald-900 text-white py-3 rounded-xl font-bold text-sm transition-colors shadow-md shadow-vicoba-forest/15 disabled:opacity-60 active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {saveAttendanceMutation.isPending ? <><Spinner /> {t('saving_attendance')}</> : t('save_attendance')}
            </button>
            <button
              onClick={() => setCloseConfirmOpen(true)}
              className="px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-bold text-sm hover:text-vicoba-earth hover:border-red-200 transition-colors"
            >
              {t('close_meeting')}
            </button>
          </div>
        </div>
      )}

      {attendance?.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-md shadow-vicoba-forest/5 overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50">
            <h3 className="text-sm font-extrabold text-vicoba-dark dark:text-gray-100">{t('attendance')}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left">
              <thead className="bg-gray-50 dark:bg-gray-950 text-xs font-bold text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="p-4">{t('name')}</th>
                  <th className="p-4">{t('status')}</th>
                  <th className="p-4">{t('fine_amount')}</th>
                  <th className="p-4 text-right">Faini</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {attendance.map(record => (
                  <tr key={record._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="p-4">
                      <p className="text-sm font-bold text-vicoba-dark dark:text-gray-100">{record.member?.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{record.member?.phone}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusStyle[record.status] || ''}`}>
                        {record.status === 'present' ? t('present') : record.status === 'absent' ? t('absent_label') : t('late_label')}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-bold text-vicoba-dark dark:text-gray-100">
                      {record.fineAmount > 0 ? `TZS ${record.fineAmount.toLocaleString()}` : '—'}
                    </td>
                    <td className="p-4 text-right">
                      {record.fineAmount > 0 ? (
                        record.finePaid ? (
                          <span className="flex items-center justify-end gap-1 text-xs font-bold text-vicoba-forest">
                            <FaCircleCheck size={12} /> {t('fine_paid_label')}
                          </span>
                        ) : (
                          isLeader ? (
                            <button
                              onClick={() => payFineMutation.mutate(record._id)}
                              disabled={payFineMutation.isPending}
                              className="px-3 py-1.5 bg-emerald-50 hover:bg-vicoba-forest hover:text-white border border-emerald-200 text-vicoba-forest rounded-xl text-xs font-bold transition-all disabled:opacity-60"
                            >
                              {payFineMutation.isPending ? '...' : t('pay_fine')}
                            </button>
                          ) : (
                            <span className="text-xs font-bold text-vicoba-earth flex items-center justify-end gap-1">
                              <FaTriangleExclamation size={12} /> {t('fine_unpaid')}
                            </span>
                          )
                        )
                      ) : (
                        <span className="text-gray-300 dark:text-gray-700 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {meeting.status === 'closed' && isLeader && (
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 flex items-center gap-3">
          <FaLock className="text-gray-400" />
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t('meeting_closed')} — mahudhurio hayawezi kubadilishwa tena.</p>
        </div>
      )}

      <ConfirmModal
        isOpen={closeConfirmOpen}
        title={t('close_meeting')}
        message="Je, una uhakika unataka kufunga mkutano huu? Baada ya kufunga, mahudhurio hayawezi kubadilishwa tena."
        onConfirm={() => { closeMeetingMutation.mutate(); setCloseConfirmOpen(false); }}
        onCancel={() => setCloseConfirmOpen(false)}
        isLoading={closeMeetingMutation.isPending}
      />
    </div>
  );
};

export default MeetingDetailPage;

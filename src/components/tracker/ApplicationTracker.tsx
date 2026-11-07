import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ApplicationStatus, TrackedApplication } from '../../types/scholarship';
import { 
  Columns3, 
  List, 
  Plus, 
  Trash2, 
  Edit3, 
  Sparkles, 
  Save, 
  X
} from 'lucide-react';
import { formatDeadlineNotice, formatDatePretty } from '../../utils/formatters';
import { sanitizeInput } from '../../utils/security';

const STAGES: { id: ApplicationStatus; label: string; color: string; border: string; bg: string }[] = [
  { id: 'Interested', label: 'Interested', color: 'text-slate-700', border: 'border-slate-300', bg: 'bg-slate-100' },
  { id: 'Preparing', label: 'Preparing', color: 'text-blue-700', border: 'border-blue-300', bg: 'bg-blue-50' },
  { id: 'Applied', label: 'Applied', color: 'text-indigo-700', border: 'border-indigo-300', bg: 'bg-indigo-50' },
  { id: 'Under Review', label: 'Under Review', color: 'text-amber-700', border: 'border-amber-300', bg: 'bg-amber-50' },
  { id: 'Shortlisted', label: 'Shortlisted', color: 'text-purple-700', border: 'border-purple-300', bg: 'bg-purple-50' },
  { id: 'Approved', label: 'Approved 🎉', color: 'text-emerald-700', border: 'border-emerald-400', bg: 'bg-emerald-50' },
  { id: 'Rejected', label: 'Rejected', color: 'text-rose-700', border: 'border-rose-300', bg: 'bg-rose-50' }
];

export const ApplicationTracker: React.FC = () => {
  const { 
    trackedApplications, 
    updateTrackedStatus, 
    updateTrackedNotes, 
    removeFromTracker, 
    viewScholarshipDetails,
    setCurrentView 
  } = useApp();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [editingItem, setEditingItem] = useState<TrackedApplication | null>(null);
  const [notesText, setNotesText] = useState('');
  const [refNumText, setRefNumText] = useState('');

  const openEditModal = (app: TrackedApplication) => {
    setEditingItem(app);
    setNotesText(app.notes || '');
    setRefNumText(app.applicationReferenceNumber || '');
  };

  const handleSaveNotes = () => {
    if (editingItem) {
      updateTrackedNotes(
        editingItem.id, 
        sanitizeInput(notesText), 
        sanitizeInput(refNumText)
      );
      setEditingItem(null);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Interactive Kanban Pipeline</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Application Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your scholarship application milestones from initial interest to final award disbursement.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                viewMode === 'kanban' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Columns3 className="w-4 h-4" />
              <span className="hidden sm:inline">Kanban Board</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                viewMode === 'list' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List View</span>
            </button>
          </div>

          <button
            onClick={() => setCurrentView('scholarships')}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Scholarship</span>
          </button>
        </div>
      </div>

      {/* Tracker Content */}
      {trackedApplications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-3">
            <Columns3 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No applications tracked yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            Browse discovered scholarships and click "Add to Tracker" to organize deadlines and required documents.
          </p>
          <button
            onClick={() => setCurrentView('scholarships')}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
          >
            Explore Scholarships
          </button>
        </div>
      ) : viewMode === 'kanban' ? (
        /* Kanban Board View */
        <div className="overflow-x-auto pb-6">
          <div className="flex gap-4 min-w-[1400px]">
            {STAGES.map(stage => {
              const stageApps = trackedApplications.filter(t => t.status === stage.id);
              return (
                <div
                  key={stage.id}
                  className="w-72 shrink-0 bg-slate-100/80 rounded-2xl p-3 border border-slate-200/80 flex flex-col max-h-[800px]"
                >
                  {/* Stage Header */}
                  <div className="flex items-center justify-between px-2 py-1.5 mb-2">
                    <span className={`text-xs font-extrabold ${stage.color}`}>
                      {stage.label}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 shadow-2xs">
                      {stageApps.length}
                    </span>
                  </div>

                  {/* Stage Cards Column */}
                  <div className="space-y-3 overflow-y-auto pr-1 flex-1">
                    {stageApps.length === 0 ? (
                      <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-[11px] text-slate-400">
                        No applications in this stage
                      </div>
                    ) : (
                      stageApps.map(app => {
                        const notice = formatDeadlineNotice(app.deadline);
                        return (
                          <div
                            key={app.id}
                            className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-md transition-all space-y-3"
                          >
                            <div>
                              <div className="flex items-start justify-between gap-1">
                                <span className="text-[10px] text-slate-400 font-medium truncate">
                                  {app.organization}
                                </span>
                                <button
                                  onClick={() => removeFromTracker(app.id)}
                                  className="text-slate-300 hover:text-rose-500 transition-colors p-0.5"
                                  title="Remove from tracker"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <h4 
                                onClick={() => viewScholarshipDetails(app.scholarshipId)}
                                className="text-xs font-bold text-slate-900 mt-0.5 hover:text-emerald-700 cursor-pointer line-clamp-2"
                              >
                                {app.scholarshipName}
                              </h4>

                              <p className="text-xs font-extrabold text-emerald-700 mt-1">
                                {app.amountDisplay}
                              </p>
                            </div>

                            {/* Reference Number */}
                            {app.applicationReferenceNumber && (
                              <div className="p-1.5 bg-slate-50 rounded-lg text-[10px] font-mono text-slate-600 border border-slate-100">
                                Ref: <strong>{app.applicationReferenceNumber}</strong>
                              </div>
                            )}

                            {/* Deadline info */}
                            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                              <span className="text-slate-400">Deadline:</span>
                              <span className={`font-semibold ${notice.isUrgent ? 'text-amber-700' : 'text-slate-700'}`}>
                                {notice.text}
                              </span>
                            </div>

                            {/* Notes snippet */}
                            {app.notes && (
                              <p className="text-[11px] text-slate-500 italic line-clamp-2 bg-slate-50 p-2 rounded-lg">
                                "{app.notes}"
                              </p>
                            )}

                            {/* Change Stage dropdown & Edit Notes */}
                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                              <select
                                value={app.status}
                                onChange={e => updateTrackedStatus(app.id, e.target.value as ApplicationStatus)}
                                className="text-[11px] bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              >
                                {STAGES.map(s => (
                                  <option key={s.id} value={s.id}>{s.label}</option>
                                ))}
                              </select>

                              <button
                                onClick={() => openEditModal(app)}
                                className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                                title="Edit notes & reference number"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="divide-y divide-slate-100">
            {trackedApplications.map(app => {
              const notice = formatDeadlineNotice(app.deadline);
              return (
                <div key={app.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-medium">{app.organization}</span>
                      {app.applicationReferenceNumber && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-600">
                          Ref: {app.applicationReferenceNumber}
                        </span>
                      )}
                    </div>
                    <h4 
                      onClick={() => viewScholarshipDetails(app.scholarshipId)}
                      className="text-sm font-bold text-slate-900 hover:text-emerald-700 cursor-pointer"
                    >
                      {app.scholarshipName}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Grant: <strong className="text-emerald-700">{app.amountDisplay}</strong> • Deadline: {formatDatePretty(app.deadline)} ({notice.text})
                    </p>
                    {app.notes && (
                      <p className="text-xs text-slate-500 italic mt-1">"{app.notes}"</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <select
                      value={app.status}
                      onChange={e => updateTrackedStatus(app.id, e.target.value as ApplicationStatus)}
                      className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800"
                    >
                      {STAGES.map(s => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </select>

                    <button
                      onClick={() => openEditModal(app)}
                      className="p-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs"
                      title="Edit Notes"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => removeFromTracker(app.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Edit Notes & Reference Modal */}
      {editingItem && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-notes-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 id="edit-notes-modal-title" className="text-sm font-bold text-slate-900">Application Notes & Reference</h3>
              <button
                onClick={() => setEditingItem(null)}
                aria-label="Close notes dialog"
                className="text-slate-400 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-800">{editingItem.scholarshipName}</p>
              <p className="text-[11px] text-slate-400">{editingItem.organization}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Portal Application Reference ID
              </label>
              <input
                type="text"
                value={refNumText}
                onChange={e => setRefNumText(e.target.value)}
                placeholder="e.g. NSP-2026-98124 or RF-UG-5542"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Personal Progress Notes & Reminders
              </label>
              <textarea
                value={notesText}
                onChange={e => setNotesText(e.target.value)}
                rows={4}
                placeholder="e.g. Sent college bonafide certificate request to Dean's office on Monday. Verification due next week."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotes}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Updates</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

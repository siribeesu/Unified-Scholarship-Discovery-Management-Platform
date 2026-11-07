import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CalendarDays, 
  Clock, 
  Sparkles
} from 'lucide-react';
import { formatDeadlineNotice, formatDatePretty } from '../../utils/formatters';

export const DeadlineCalendar: React.FC = () => {
  const { 
    scholarships, 
    trackedApplications, 
    viewScholarshipDetails 
  } = useApp();

  const [filterType, setFilterType] = useState<'all' | 'tracked' | 'urgent'>('all');
  const [selectedMonth, setSelectedMonth] = useState<number>(10); // 10 = Nov (0-indexed)
  const year = 2026;

  // Filter scholarships
  const filteredScholarships = scholarships.filter(sch => {
    const notice = formatDeadlineNotice(sch.deadline);
    if (filterType === 'tracked') {
      return trackedApplications.some(t => t.scholarshipId === sch.id);
    }
    if (filterType === 'urgent') {
      return notice.days >= 0 && notice.days <= 14;
    }
    return true;
  });

  // Closing within 7 days critical banner
  const closingWithin7Days = scholarships.filter(sch => {
    const notice = formatDeadlineNotice(sch.deadline);
    return notice.days >= 0 && notice.days <= 7;
  });

  // Calendar dates for November 2026 (Nov 1 is Sunday, 30 days) or December 2026 (31 days)
  const daysInMonth = selectedMonth === 10 ? 30 : 31;
  const monthName = selectedMonth === 10 ? 'November 2026' : 'December 2026';

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `${year}-${String(selectedMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    const closingOnDay = filteredScholarships.filter(s => s.deadline === dateStr);
    return { dayNum, dateStr, closingOnDay };
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Application Timeline & Deadlines</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Deadline Management Calendar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track key application closure dates and avoid missing life-changing funding opportunities.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Deadlines ({scholarships.length})
          </button>
          <button
            onClick={() => setFilterType('tracked')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'tracked'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Tracked Only ({trackedApplications.length})
          </button>
          <button
            onClick={() => setFilterType('urgent')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'urgent'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Closing Soon
          </button>
        </div>
      </div>

      {/* High-priority closing within 7 days banner */}
      {closingWithin7Days.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500 text-slate-950 font-medium shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-950 text-amber-400 rounded-xl">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-sm block">
                Closing Within 7 Days: {closingWithin7Days.length} Opportunities Expiring!
              </span>
              <span className="text-xs text-amber-950">
                {closingWithin7Days.map(s => `${s.name} (${s.deadline})`).join(' • ')}
              </span>
            </div>
          </div>
          <button
            onClick={() => viewScholarshipDetails(closingWithin7Days[0].id)}
            className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
          >
            Apply Before Cutoff
          </button>
        </div>
      )}

      {/* Calendar Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
        {/* Month Selector */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">{monthName}</h3>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSelectedMonth(10)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                selectedMonth === 10 ? 'bg-emerald-100 text-emerald-900' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              November 2026
            </button>
            <button
              onClick={() => setSelectedMonth(11)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                selectedMonth === 11 ? 'bg-emerald-100 text-emerald-900' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              December 2026
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase tracking-wider text-slate-400 py-1">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Calendar Days Grid */}
        <div className="grid grid-cols-7 gap-2 text-xs">
          {daysArray.map(({ dayNum, dateStr, closingOnDay }) => {
            const hasDeadlines = closingOnDay.length > 0;
            const isToday = dateStr === '2026-11-07';

            return (
              <div
                key={dayNum}
                className={`min-h-[90px] p-2 rounded-xl border flex flex-col justify-between transition-all ${
                  isToday 
                    ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500' 
                    : hasDeadlines
                    ? 'border-amber-200 bg-amber-50/30 hover:border-amber-400'
                    : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-extrabold ${isToday ? 'text-emerald-700' : 'text-slate-700'}`}>
                    {dayNum}
                  </span>
                  {isToday && (
                    <span className="text-[9px] font-bold px-1 rounded bg-emerald-600 text-white">
                      Today
                    </span>
                  )}
                </div>

                {hasDeadlines ? (
                  <div className="space-y-1 my-1">
                    {closingOnDay.map(sch => (
                      <div
                        key={sch.id}
                        onClick={() => viewScholarshipDetails(sch.id)}
                        className="p-1 rounded bg-white border border-amber-200 text-[10px] font-bold text-slate-800 hover:text-emerald-700 cursor-pointer shadow-2xs truncate"
                        title={sch.name}
                      >
                        {sch.name}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div />
                )}

                <div className="text-[10px] text-slate-400">
                  {closingOnDay.length > 0 && `${closingOnDay.length} due`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Upcoming Chronological Deadlines</h3>
        <div className="divide-y divide-slate-100">
          {filteredScholarships
            .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
            .map(sch => {
              const notice = formatDeadlineNotice(sch.deadline);
              return (
                <div
                  key={sch.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded-lg transition-colors"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-900 hover:text-emerald-700 cursor-pointer block" onClick={() => viewScholarshipDetails(sch.id)}>
                      {sch.name}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{sch.organization} • {sch.amountDisplay}</span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-xs font-bold ${notice.isUrgent ? 'text-amber-700' : 'text-slate-600'}`}>
                      {formatDatePretty(sch.deadline)} ({notice.text})
                    </span>
                    <button
                      onClick={() => viewScholarshipDetails(sch.id)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

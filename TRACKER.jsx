import React, { useState, useEffect, useRef } from ‘react’;
import { Check, ChevronLeft, ChevronRight, Save, Download, Calendar, Trash2 } from ‘lucide-react’;

export default function WorkoutTracker30Day() {
const [currentDate, setCurrentDate] = useState(new Date());
const [trackedWorkouts, setTrackedWorkouts] = useState({});
const [selectedDate, setSelectedDate] = useState(new Date());
const [viewMode, setViewMode] = useState(‘detail’);
const [checkedSets, setCheckedSets] = useState({});
const [showReminder, setShowReminder] = useState(false);
const [reminderDismissed, setReminderDismissed] = useState(false);
const [lastSaved, setLastSaved] = useState(null);
const [isSaving, setIsSaving] = useState(false);
const [showClearConfirm, setShowClearConfirm] = useState(false);
const saveTimeoutRef = useRef(null);

const workoutPlan = [
{
day: ‘MONDAY’,
focus: ‘PUSH (Chest Focus)’,
exercises: [
{ name: ‘Incline Barbell Press’, sets: 4, reps: ‘8–10’, muscle: ‘Chest’, rest: ‘90s’ },
{ name: ‘Flat Machine Press or Smith Press’, sets: 3, reps: ‘10–12’, muscle: ‘Chest’, rest: ‘75s’ },
{ name: ‘Cable Chest Fly (Mid or High-to-Low)’, sets: 3, reps: ‘12–15’, muscle: ‘Chest’, rest: ‘60s’ },
{ name: ‘Seated DB Shoulder Press’, sets: 4, reps: ‘8–10’, muscle: ‘Shoulders’, rest: ‘90s’ },
{ name: ‘Lateral Raises (strict form)’, sets: 3, reps: ‘15–20’, muscle: ‘Shoulders’, rest: ‘60s’ },
{ name: ‘Rope Pushdowns’, sets: 3, reps: ‘12–15’, muscle: ‘Triceps’, rest: ‘60s’ },
{ name: ‘Overhead DB Tricep Extension’, sets: 2.5, reps: ‘10–12’, muscle: ‘Triceps’, rest: ‘60s’ },
{ name: ‘Decline Bench Leg Raises’, sets: 3, reps: ‘15–20’, muscle: ‘Core’, rest: ‘75s’ },
]
},
{
day: ‘TUESDAY’,
focus: ‘PULL (Back Focus)’,
exercises: [
{ name: ‘Weighted Pull-Ups or Lat Pulldown’, sets: 4, reps: ‘8–10’, muscle: ‘Back’, rest: ‘90s’ },
{ name: ‘Chest Supported Row / Machine Row’, sets: 3, reps: ‘10–12’, muscle: ‘Back’, rest: ‘75s’ },
{ name: ‘Close-Grip Seated Cable Row’, sets: 3, reps: ‘10–12’, muscle: ‘Back’, rest: ‘75s’ },
{ name: ‘DB Shrugs’, sets: 3, reps: ‘12–15’, muscle: ‘Traps’, rest: ‘60s’ },
{ name: ‘Rear Delt Cable Fly / Reverse Pec Deck’, sets: 3, reps: ‘15’, muscle: ‘Rear Delts’, rest: ‘60s’ },
{ name: ‘EZ Bar Curl’, sets: 3, reps: ‘10–12’, muscle: ‘Biceps’, rest: ‘75s’ },
{ name: ‘Alternating DB Curl (slow negative)’, sets: 3, reps: ‘12’, muscle: ‘Biceps’, rest: ‘75s’ },
]
},
{
day: ‘WEDNESDAY’,
focus: ‘LEGS (Quad Focus)’,
exercises: [
{ name: ‘Barbell Back Squat’, sets: 4, reps: ‘8–10’, muscle: ‘Quads’, rest: ‘120s’ },
{ name: ‘Leg Press (feet low)’, sets: 4, reps: ‘12–15’, muscle: ‘Quads’, rest: ‘90s’ },
{ name: ‘Walking Lunges’, sets: 2, reps: ‘20 steps’, muscle: ‘Quads’, rest: ‘90s’ },
{ name: ‘Leg Extensions (pause at top)’, sets: 4, reps: ‘12–15’, muscle: ‘Quads’, rest: ‘60s’ },
{ name: ‘Standing Calf Raises’, sets: 4, reps: ‘15–20’, muscle: ‘Calves’, rest: ‘60s’ },
{ name: ‘Seated Calf Raises’, sets: 3, reps: ‘15’, muscle: ‘Calves’, rest: ‘60s’ },
{ name: ‘Hanging Leg Raises’, sets: 3, reps: ‘15–20’, muscle: ‘Core’, rest: ‘75s’ },
{ name: ‘Plank’, sets: 2, reps: ‘45–60 sec’, muscle: ‘Core’, rest: ‘60s’ },
]
},
{
day: ‘THURSDAY’,
focus: ‘PUSH (Shoulder Focus)’,
exercises: [
{ name: ‘Incline Smith Press’, sets: 3, reps: ‘10’, muscle: ‘Chest’, rest: ‘90s’ },
{ name: ‘Chest Dips’, sets: 3, reps: ‘10–12’, muscle: ‘Chest’, rest: ‘90s’ },
{ name: ‘Standing Overhead Barbell Press’, sets: 4, reps: ‘8’, muscle: ‘Shoulders’, rest: ‘120s’ },
{ name: ‘Single Arm Cable Lateral Raise’, sets: 2.5, reps: ‘15’, muscle: ‘Shoulders’, rest: ‘60s’ },
{ name: ‘Reverse Pec Deck’, sets: 3, reps: ‘15–20’, muscle: ‘Shoulders’, rest: ‘60s’ },
{ name: ‘Skull Crushers (EZ Bar)’, sets: 3, reps: ‘10–12’, muscle: ‘Triceps’, rest: ‘75s’ },
{ name: ‘Cable Overhead Extension’, sets: 2, reps: ‘12–15’, muscle: ‘Triceps’, rest: ‘60s’ },
]
},
{
day: ‘FRIDAY’,
focus: ‘PULL (Back + Arms)’,
exercises: [
{ name: ‘Deadlift’, sets: 2.5, reps: ‘5–6’, muscle: ‘Back’, rest: ‘150s’ },
{ name: ‘Wide Grip Lat Pulldown’, sets: 4, reps: ‘10–12’, muscle: ‘Back’, rest: ‘90s’ },
{ name: ‘Chest Supported DB Row’, sets: 3, reps: ‘12’, muscle: ‘Back’, rest: ‘75s’ },
{ name: ‘Cable Pullover’, sets: 3, reps: ‘15’, muscle: ‘Back’, rest: ‘60s’ },
{ name: ‘Barbell Shrugs’, sets: 3, reps: ‘12’, muscle: ‘Traps’, rest: ‘90s’ },
{ name: ‘Rear Delt Cable Crossover’, sets: 3, reps: ‘20’, muscle: ‘Rear Delts’, rest: ‘60s’ },
{ name: ‘Preacher Curl’, sets: 3, reps: ‘12’, muscle: ‘Biceps’, rest: ‘75s’ },
{ name: ‘Hammer Curl’, sets: 2.5, reps: ‘12–15’, muscle: ‘Biceps’, rest: ‘75s’ },
{ name: ‘Weighted Decline Sit-ups’, sets: 3, reps: ‘15–20’, muscle: ‘Core’, rest: ‘75s’ },
]
},
{
day: ‘SATURDAY’,
focus: ‘LEGS (Hamstrings & Glutes)’,
exercises: [
{ name: ‘Romanian Deadlift’, sets: 3, reps: ‘8–10’, muscle: ‘Hamstrings’, rest: ‘120s’ },
{ name: ‘Lying Hamstring Curl’, sets: 4, reps: ‘12–15’, muscle: ‘Hamstrings’, rest: ‘90s’ },
{ name: ‘DB Step-ups (glute focused)’, sets: 3, reps: ‘10–12 each leg’, muscle: ‘Glutes’, rest: ‘90s’ },
{ name: ‘Glute Kickbacks’, sets: 3, reps: ‘15’, muscle: ‘Glutes’, rest: ‘60s’ },
{ name: ‘Standing Calf Raises’, sets: 2, reps: ‘15’, muscle: ‘Calves’, rest: ‘60s’ },
{ name: ‘Incline Treadmill Walk’, sets: 1, reps: ‘20–25 min’, muscle: ‘Cardio’, rest: ‘N/A’ },
]
},
{
day: ‘SUNDAY’,
focus: ‘RECOVERY DAY’,
exercises: [
{ name: ‘❌ No lifting • No intense cardio’, sets: 0, reps: ‘’, muscle: ‘’, rest: ‘’ },
{ name: ‘✅ Sleep’, sets: 0, reps: ‘7–9 hrs’, muscle: ‘Recovery’, rest: ‘’ },
{ name: ‘✅ High protein meals’, sets: 0, reps: ‘’, muscle: ‘Recovery’, rest: ‘’ },
{ name: ‘✅ Hydration + electrolytes’, sets: 0, reps: ‘’, muscle: ‘Recovery’, rest: ‘’ },
{ name: ‘✅ Mobility/stretching’, sets: 0, reps: ‘’, muscle: ‘Recovery’, rest: ‘’ },
{ name: ‘✅ Sauna or massage (optional)’, sets: 0, reps: ‘’, muscle: ‘Recovery’, rest: ‘’ },
{ name: ‘✅ 20–30 min light walk (optional)’, sets: 0, reps: ‘’, muscle: ‘Recovery’, rest: ‘’ },
]
},
];

// Helper functions
const formatDateKey = (date) => date.toISOString().split(‘T’)[0];
const getDayOfWeek = (date) => date.getDay();

// Load saved data on mount
useEffect(() => {
const saved = localStorage.getItem(‘workout-30day’);
if (saved) {
try {
const data = JSON.parse(saved);
setTrackedWorkouts(data.workouts || {});
setCheckedSets(data.sets || {});
setLastSaved(new Date(data.lastSaved) || new Date());
} catch (e) {
console.log(‘Could not load saved data’);
}
}
}, []);

// Auto-save function
const autoSave = (workouts, sets) => {
setIsSaving(true);
const data = {
workouts,
sets,
lastSaved: new Date().toISOString()
};
localStorage.setItem(‘workout-30day’, JSON.stringify(data));
setLastSaved(new Date());
setIsSaving(false);
};

// Auto-save whenever data changes (debounced)
useEffect(() => {
if (saveTimeoutRef.current) {
clearTimeout(saveTimeoutRef.current);
}

```
saveTimeoutRef.current = setTimeout(() => {
  autoSave(trackedWorkouts, checkedSets);
}, 500); // Save 500ms after user stops making changes

return () => {
  if (saveTimeoutRef.current) {
    clearTimeout(saveTimeoutRef.current);
  }
};
```

}, [trackedWorkouts, checkedSets]);

// Daily reminder notification
useEffect(() => {
const checkReminder = () => {
const now = new Date();
const today = formatDateKey(now);
const lastReminderDate = localStorage.getItem(‘last-reminder-date’);

```
  if (
    lastReminderDate !== today &&
    now.getHours() < 12 &&
    !trackedWorkouts[today]?.complete &&
    !reminderDismissed
  ) {
    setShowReminder(true);
    localStorage.setItem('last-reminder-date', today);
    
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Time for your workout! 💪', {
        body: `Don't forget to mark today's ${getWorkoutForDate(now).day} workout before 12 PM!`,
        icon: '💪'
      });
    }
  }
  
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
};

checkReminder();
const interval = setInterval(checkReminder, 60000);
return () => clearInterval(interval);
```

}, [trackedWorkouts, reminderDismissed]);

const getWorkoutForDate = (date) => {
const jsDay = getDayOfWeek(date);
const planIndex = jsDay === 0 ? 6 : jsDay - 1;
return workoutPlan[planIndex];
};

const toggleWorkoutComplete = (date) => {
const key = formatDateKey(date);
setTrackedWorkouts(prev => ({
…prev,
[key]: prev[key] ? { …prev[key], complete: !prev[key].complete } : { complete: true, date: key }
}));
};

const getDaysInMonth = () => {
const year = currentDate.getFullYear();
const month = currentDate.getMonth();
const firstDay = new Date(year, month, 1);
const lastDay = new Date(year, month + 1, 0);
const daysArray = [];

```
for (let i = 0; i < firstDay.getDay(); i++) {
  daysArray.push(null);
}

for (let day = 1; day <= lastDay.getDate(); day++) {
  daysArray.push(new Date(year, month, day));
}

return daysArray;
```

};

const completedCount = Object.values(trackedWorkouts).filter(w => w.complete).length;
const totalWorkoutDays = 30;
const completionPercent = Math.round((completedCount / totalWorkoutDays) * 100);

const exportData = () => {
const data = { workouts: trackedWorkouts, sets: checkedSets };
const dataStr = JSON.stringify(data, null, 2);
const dataBlob = new Blob([dataStr], { type: ‘application/json’ });
const url = URL.createObjectURL(dataBlob);
const link = document.createElement(‘a’);
link.href = url;
link.download = `30day-tracker-${formatDateKey(new Date())}.json`;
link.click();
};

const clearAllData = () => {
localStorage.removeItem(‘workout-30day’);
setTrackedWorkouts({});
setCheckedSets({});
setLastSaved(null);
setShowClearConfirm(false);
};

const days = getDaysInMonth();
const selectedWorkout = selectedDate ? getWorkoutForDate(selectedDate) : null;
const selectedDateKey = selectedDate ? formatDateKey(selectedDate) : ‘’;
const isSelectedComplete = selectedDateKey ? trackedWorkouts[selectedDateKey]?.complete : false;

const formatLastSaved = (date) => {
if (!date) return ‘Never’;
const now = new Date();
const diff = now - date;
const minutes = Math.floor(diff / 60000);
const hours = Math.floor(diff / 3600000);

```
if (minutes < 1) return 'Just now';
if (minutes < 60) return `${minutes}m ago`;
if (hours < 24) return `${hours}h ago`;
return date.toLocaleDateString();
```

};

return (
<div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-6">
<div className="fixed inset-0 overflow-hidden pointer-events-none">
<div className="absolute top-20 left-10 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>
<div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
</div>

```
  {/* Daily Reminder Popup */}
  {showReminder && (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-bounce">
        <div className="text-center">
          <div className="text-5xl mb-4">💪</div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Time to Workout!</h2>
          <p className="text-slate-800 font-semibold mb-2">Today is <span className="text-white">{selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}</span></p>
          <p className="text-slate-800 text-lg font-bold mb-6">{getWorkoutForDate(selectedDate).focus}</p>
          <p className="text-sm text-slate-700 mb-6 font-semibold">⏰ Mark your workout before 12 PM!</p>
          
          <div className="flex gap-3">
            <button
              onClick={() => setReminderDismissed(true)}
              className="flex-1 px-4 py-3 bg-white/30 hover:bg-white/50 text-slate-900 rounded-lg font-bold transition-all"
            >
              Remind Later
            </button>
            <button
              onClick={() => {
                setShowReminder(false);
                setReminderDismissed(true);
              }}
              className="flex-1 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold transition-all"
            >
              Got It! 🎯
            </button>
          </div>
        </div>
      </div>
    </div>
  )}

  {/* Clear Data Confirmation */}
  {showClearConfirm && (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-red-500/30">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-black text-white mb-4">Clear All Data?</h2>
          <p className="text-slate-300 mb-6">This will permanently delete all your workout progress. This cannot be undone!</p>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowClearConfirm(false)}
              className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition-all"
            >
              Cancel
            </button>
            <button
              onClick={clearAllData}
              className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-all"
            >
              Delete All
            </button>
          </div>
        </div>
      </div>
    </div>
  )}

  <div className="relative max-w-7xl mx-auto">
    {/* Header */}
    <div className="mb-6">
      <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
        30-DAY WORKOUT TRACKER
      </h1>
      <div className="flex flex-col md:flex-row md:items-center gap-2">
        <p className="text-yellow-400/80 font-medium text-lg">Track 4 weeks of gains • No login required</p>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${isSaving ? 'bg-blue-500/30 text-blue-300' : 'bg-green-500/30 text-green-300'}`}>
            {isSaving ? '💾 Saving...' : `✓ Auto-saved ${formatLastSaved(lastSaved)}`}
          </span>
        </div>
      </div>
    </div>

    {/* Stats Dashboard */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
        <p className="text-slate-400 text-xs uppercase font-semibold mb-1">Completed</p>
        <p className="text-2xl font-black text-yellow-400">{completedCount}</p>
      </div>
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
        <p className="text-slate-400 text-xs uppercase font-semibold mb-1">Total Days</p>
        <p className="text-2xl font-black text-white">{totalWorkoutDays}</p>
      </div>
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
        <p className="text-slate-400 text-xs uppercase font-semibold mb-1">Progress</p>
        <p className="text-2xl font-black text-yellow-400">{completionPercent}%</p>
      </div>
      <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/5 backdrop-blur-sm rounded-lg p-4 border border-yellow-400/20">
        <div className="w-full bg-slate-700/50 rounded h-2 mb-2">
          <div
            className="bg-gradient-to-r from-yellow-400 to-orange-400 h-full rounded transition-all"
            style={{ width: `${completionPercent}%` }}
          ></div>
        </div>
        <p className="text-yellow-400 text-xs font-bold">On track</p>
      </div>
    </div>

    {/* Mode Toggle */}
    <div className="flex gap-2 mb-6">
      <button
        onClick={() => setViewMode('calendar')}
        className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
          viewMode === 'calendar'
            ? 'bg-yellow-400 text-slate-900'
            : 'bg-slate-700/50 text-white border border-slate-600/50'
        }`}
      >
        <Calendar className="w-4 h-4" />
        Calendar
      </button>
      {selectedDate && (
        <button
          onClick={() => setViewMode('detail')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            viewMode === 'detail'
              ? 'bg-yellow-400 text-slate-900'
              : 'bg-slate-700/50 text-white border border-slate-600/50'
          }`}
        >
          Workout Details
        </button>
      )}
    </div>

    {/* Calendar View */}
    {viewMode === 'calendar' && (
      <>
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6 bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="p-2 hover:bg-yellow-500/20 rounded-lg transition-all text-yellow-400"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-black text-white text-center flex-1">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="p-2 hover:bg-yellow-500/20 rounded-lg transition-all text-yellow-400"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 mb-6">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
              <div key={day} className="text-center text-xs font-bold text-slate-400 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((date, idx) => {
              if (!date) {
                return <div key={`empty-${idx}`} className="aspect-square"></div>;
              }

              const dateKey = formatDateKey(date);
              const isTracked = trackedWorkouts[dateKey];
              const dayWorkout = getWorkoutForDate(date);
              const isSelected = selectedDate && formatDateKey(selectedDate) === dateKey;

              return (
                <button
                  key={dateKey}
                  onClick={() => {
                    setSelectedDate(date);
                    setViewMode('detail');
                  }}
                  className={`aspect-square rounded-lg font-bold text-sm transition-all flex flex-col items-center justify-center relative ${
                    isSelected
                      ? 'bg-yellow-400 text-slate-900 ring-2 ring-yellow-300'
                      : isTracked?.complete
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg'
                      : 'bg-slate-700/50 text-white hover:bg-slate-600 border border-slate-600/50'
                  }`}
                >
                  <span className="text-lg">{date.getDate()}</span>
                  {isTracked?.complete && (
                    <Check className="w-3 h-3 absolute bottom-1 right-1" />
                  )}
                  <span className="text-xs opacity-70 mt-0.5 truncate px-1 w-full text-center">
                    {dayWorkout.day.slice(0, 3)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
          <button
            onClick={exportData}
            className="flex items-center justify-center gap-2 px-3 md:px-6 py-2 md:py-3 bg-slate-700/50 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all border border-slate-600/50 text-sm md:text-base"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
            <span className="sm:hidden">Export</span>
          </button>
          <button
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center justify-center gap-2 px-3 md:px-6 py-2 md:py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg font-semibold transition-all border border-red-500/30 text-sm md:text-base"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear Data</span>
            <span className="sm:hidden">Clear</span>
          </button>
        </div>
      </>
    )}

    {/* Detail View */}
    {viewMode === 'detail' && selectedDate && selectedWorkout && (
      <>
        {/* Workout Header */}
        <div className="mb-6 bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-slate-700/50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl md:text-3xl font-black text-white mb-1 truncate">{selectedWorkout.day}</h2>
              <p className="text-yellow-400/70 font-semibold text-sm md:text-base">{selectedWorkout.focus}</p>
              <p className="text-slate-400 text-xs md:text-sm mt-2">{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
            <button
              onClick={() => toggleWorkoutComplete(selectedDate)}
              className={`flex items-center justify-center gap-2 px-4 md:px-6 py-3 rounded-lg font-bold transition-all text-sm md:text-base whitespace-nowrap flex-shrink-0 ${
                isSelectedComplete
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-700/50 text-white border border-slate-600/50 hover:border-green-400/50'
              }`}
            >
              <Check className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">{isSelectedComplete ? 'Completed' : 'Mark Complete'}</span>
              <span className="sm:hidden">{isSelectedComplete ? '✓' : 'Done'}</span>
            </button>
          </div>
        </div>

        {/* Exercise Cards */}
        <div className="space-y-2 mb-6">
          {selectedWorkout.exercises.map((exercise, idx) => (
            <div
              key={idx}
              className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 p-4 hover:border-yellow-400/30 transition-all"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                {/* Exercise Name */}
                <div className="md:col-span-4">
                  <h3 className="font-bold text-white text-sm md:text-base leading-tight">{exercise.name}</h3>
                </div>

                {/* Info Badges */}
                <div className="md:col-span-5 flex flex-wrap gap-2">
                  <div className="bg-slate-700/50 rounded px-2 py-1">
                    <p className="text-xs text-slate-400 font-semibold">SETS</p>
                    <p className="text-sm font-bold text-yellow-400">{exercise.sets}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded px-2 py-1">
                    <p className="text-xs text-slate-400 font-semibold">REPS</p>
                    <p className="text-sm font-bold text-yellow-400">{exercise.reps}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded px-2 py-1">
                    <p className="text-xs text-slate-400 font-semibold">MUSCLE</p>
                    <p className="text-sm font-bold text-yellow-400">{exercise.muscle}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded px-2 py-1">
                    <p className="text-xs text-slate-400 font-semibold">REST</p>
                    <p className="text-sm font-bold text-yellow-400">{exercise.rest}</p>
                  </div>
                </div>

                {/* Checkboxes - Larger */}
                {exercise.sets > 0 && (
                  <div className="md:col-span-3 flex gap-2 flex-wrap justify-end">
                    {Array.from({ length: Math.ceil(exercise.sets) }).map((_, setIdx) => {
                      const key = `${selectedDateKey}-${idx}-${setIdx}`;
                      const isChecked = checkedSets[key] || false;

                      return (
                        <button
                          key={setIdx}
                          onClick={() => {
                            setCheckedSets(prev => ({
                              ...prev,
                              [key]: !prev[key]
                            }));
                          }}
                          className={`w-10 h-10 rounded-lg text-sm font-bold transition-all shadow-md ${
                            isChecked
                              ? 'bg-yellow-400 text-slate-900 shadow-lg shadow-yellow-400/50 scale-105'
                              : 'bg-slate-700/50 text-white border-2 border-slate-600/50 hover:border-yellow-400/50 hover:bg-slate-600'
                          }`}
                        >
                          {setIdx + 1}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
          <button
            onClick={() => setViewMode('calendar')}
            className="flex items-center justify-center gap-2 px-3 md:px-6 py-2 md:py-3 bg-slate-700/50 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all border border-slate-600/50 text-sm md:text-base"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Calendar</span>
            <span className="sm:hidden">Back</span>
          </button>
          <button
            onClick={exportData}
            className="flex items-center justify-center gap-2 px-3 md:px-6 py-2 md:py-3 bg-slate-700/50 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all border border-slate-600/50 text-sm md:text-base"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </>
    )}
  </div>
</div>
```

);
}

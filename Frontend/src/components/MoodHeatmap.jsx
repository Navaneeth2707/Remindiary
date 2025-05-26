import React, { useEffect, useState } from 'react';

const moodMap = {
  1: 'bg-red-300',
  2: 'bg-orange-300',
  3: 'bg-yellow-300',
  4: 'bg-green-300',
  5: 'bg-emerald-400',
};

// Helper function to generate random mood
const getRandomMood = () => {
  return Math.floor(Math.random() * 5) + 1; // Random number between 1 and 5
};

const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

export default function MoodHeatmap() {
  const [moodData, setMoodData] = useState({});
  const [loading, setLoading] = useState(false);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = getDaysInMonth(year, month);

  useEffect(() => {
    const generateDummyMoods = () => {
      const moodMapByDay = {};

      // Generate random mood data for all past days in the month (1 to current day)
      for (let day = 1; day <= daysInMonth; day++) {
        moodMapByDay[day] = getRandomMood(); // Random mood for each day
      }

      setMoodData(moodMapByDay);
      setLoading(false);
    };

    setLoading(true);
    generateDummyMoods(); // Generate dummy data on initial render
  }, [year, month, daysInMonth]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Mood Heatmap</h2>

      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <div className="grid grid-cols-7 gap-1 text-center">
          {/* Weekday Headers - FIXED: use index in key */}
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div className="font-bold text-sm text-gray-600" key={`${d}-${i}`}>
              {d}
            </div>
          ))}

          {/* Empty cells for the first day of the month if it's not Sunday */}
          {[...Array(new Date(year, month, 1).getDay())].map((_, idx) => (
            <div key={`empty-${idx}`} className="w-10 h-10"></div>
          ))}

          {/* Render mood blocks for each day */}
          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            const mood = moodData[day];

            const currentDate = new Date(year, month, day);
            const isPastOrToday = currentDate <= today;

            const bgClass = isPastOrToday
              ? mood
                ? moodMap[mood]
                : 'bg-gray-200'
              : 'bg-gray-100';

            return (
              <div
                key={`day-${day}`}
                className={`w-10 h-10 flex items-center justify-center text-xs font-bold rounded ${bgClass}`}
                title={`Day ${day}${mood ? `: Mood ${mood}` : ''}`}
              >
                {day}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { CalendarDays, NotebookPen, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api'; // Assuming you have an api service for making requests

export default function MyDiary() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const [diaryEntries, setDiaryEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiaries = async () => {
      setLoading(true);
      try {
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        
        // Send token with API request
        const res = await api.get(`/diary-by-date?date=${selectedDate}`, {
          headers: {
            'Authorization': `${token}`, // Include token as Bearer token in the Authorization header
          },
        });

        const json = res.data;
        if (json.success) {
          setDiaryEntries(Array.isArray(json.data) ? json.data : [json.data]);
        } else {
          setDiaryEntries([]);
        }
      } catch (error) {
        
        setDiaryEntries([]);
      }
      setLoading(false);
    };

    fetchDiaries();
  }, [selectedDate]);

  return (
    <div className="min-h-screen px-4 sm:px-8 md:px-16 py-10 bg-gradient-to-br from-indigo-50 via-white to-purple-100 text-gray-800 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-10 flex items-center space-x-4">
          <CalendarDays className="text-purple-600" size={30} />
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">
            My Diary Entries
          </h2>
        </div>

        {/* Date Picker */}
        <div className="mb-10">
          <label className="block mb-2 font-semibold text-lg text-gray-700">Select a Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-5 py-3 rounded-xl shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-gray-800"
          />
        </div>

        {/* Entries or Loading */}
        {loading ? (
          <div className="text-center text-gray-400 text-lg animate-pulse">Loading diary entries...</div>
        ) : (
          <AnimatePresence>
            {diaryEntries.length > 0 ? (
              <div className="grid sm:grid-cols-1 gap-6">
                {diaryEntries.map((entry, idx) => (
                  <motion.div
                    key={entry._id || idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl p-6 hover:scale-[1.01] transition-transform"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <NotebookPen className="text-purple-600" />
                      <h3 className="text-xl font-semibold text-gray-700">Diary Entry</h3>
                    </div>

                    <p className="text-gray-700 whitespace-pre-line leading-relaxed mb-2">
                      {entry.content}
                    </p>

                    <p className="text-sm text-gray-500">
                      🗓️ Date: {new Date(entry.date || selectedDate).toLocaleDateString()}
                    </p>
                    {entry.mood && (
                      <p className="text-sm text-gray-500 mt-1">😊 Mood: {entry.mood}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                key="nodiary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-3 text-gray-500 text-lg mt-10"
              >
                <AlertCircle className="text-red-400" />
                <span>No diary entry found for <strong>{selectedDate}</strong></span>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
}
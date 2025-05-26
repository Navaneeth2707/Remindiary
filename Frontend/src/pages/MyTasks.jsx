import React, { useEffect, useState } from 'react';
import { CalendarDays, BellRing, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

export default function MyTasks() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReminders = async () => {
      setLoading(true);
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');
        
        // Send token with the API request
        const res = await api.get(`/by-date?date=${selectedDate}`, {
          headers: {
            'Authorization': `${token}`, // Include the token in the Authorization header
          },
        });

       
        const json = res.data;
        if (json.success) {
          const onlyReminders = json.data.filter(entry => entry.type === 'reminder');
          setReminders(onlyReminders);
        } else {
          setReminders([]);
        }
      } catch (error) {
        console.error('Error fetching reminders:', error);
        setReminders([]);
      }
      setLoading(false);
    };

    fetchReminders();
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
            My Reminder
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

        {/* Reminders or Loading */}
        {loading ? (
          <div className="text-center text-gray-400 text-lg animate-pulse">Loading reminders...</div>
        ) : (
          <AnimatePresence>
            {reminders.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {reminders.map((reminder, idx) => (
                  <motion.div
                    key={reminder._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white/60 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl p-5 hover:scale-[1.02] transition-transform cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <BellRing className="text-purple-600" />
                      <h3 className="text-lg font-semibold text-gray-700">Reminder</h3>
                    </div>

                    <p className="text-gray-600 italic mb-1">"{reminder.summary}"</p>
                    <p className="text-sm text-gray-500">
                      📅 Scheduled on:{' '}
                      {new Date(reminder.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                key="noreminders"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-3 text-gray-500 text-lg mt-10"
              >
                <AlertCircle className="text-red-400" />
                <span>No reminders found for <strong>{selectedDate}</strong></span>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
}

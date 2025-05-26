import { useEffect, useState } from 'react';
import api from '../services/api'; // Assuming you have an api service for making requests

export default function SmartReminder() {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');
        
        // Send the token with the API request
        const res = await api.get(`/`, {
          headers: {
            'Authorization': `${token}`, // Send token as Bearer token in Authorization header
          },
        });

        const json = res.data;
        //console.log('JSON:', json);
        
        if (json.success) {
          const onlyReminders = json.data.filter(entry => entry.type === 'task');
          setReminders(onlyReminders);
        } else {
          console.error('Failed to fetch reminders');
        }
      } catch (error) {
        console.error('Error fetching reminders:', error);
      }
    };

    fetchReminders();
  }, []);

  return (
    <div className="bg-orange-50 rounded-xl p-4 shadow">
      <h3 className="text-lg font-semibold mb-2">Smart Tasks</h3>

      {reminders.length > 0 ? (
        reminders.map(reminder => (
          <div key={reminder._id} className="bg-orange-100 rounded-lg p-2 mb-2">
            <strong>Task:</strong> {reminder.summary || reminder.content}
          </div>
        ))
      ) : (
        <div className="text-gray-500">No reminders for today.</div>
      )}
    </div>
  );
}

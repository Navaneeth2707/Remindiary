import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Assuming you have an api service for making requests

export default function SmartReminder() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate(); // React Router navigation

  useEffect(() => {
    const fetchTasks = async () => {
      const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
      
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');
        
        // Send the token with the API request
        const res = await api.get(`/by-date?date=${today}`, {
          headers: {
            'Authorization': `${token}`, // Send the token as a Bearer token
          },
        });

        const json = res.data; // Assuming the response is in JSON format

        if (json.success) {
          const onlyTasks = json.data.filter(entry => entry.type === 'reminder');
          setTasks(onlyTasks);
        } else {
          console.error('Failed to fetch tasks:', json.error);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  // Handle click and navigate
  const handleClick = () => {
    navigate('/tasks');
  };

  return (
    <div
      onClick={handleClick}
      className="bg-orange-50 rounded-xl p-4 shadow cursor-pointer hover:bg-orange-100 transition"
    >
      <h3 className="text-lg font-semibold mb-2">Smart Reminders</h3>

      {tasks.length > 0 ? (
        tasks.map(task => (
          <div key={task._id} className="bg-orange-100 rounded-lg p-2 mb-2">
            <strong>Reminder:</strong>{' '}
            {task.tasks?.length ? task.tasks.join(', ') : task.summary || 'No details'}
          </div>
        ))
      ) : (
        <div className="text-gray-500">No tasks for today.</div>
      )}
    </div>
  );
}

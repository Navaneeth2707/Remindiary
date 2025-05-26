// Import statements should be at the top
import { useState } from 'react';  // Importing React hooks
import api from '../services/api';  // Importing the API service
import DOMPurify from 'dompurify'; // Importing DOMPurify for sanitization

export default function ChatBot() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to handle form submission and send data to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem('token');

      // Include the token in the request headers
      const res = await api.post('/', 
        { input },
        {
          headers: {
            Authorization: `${token}`,  // Add the token to Authorization header
          }
        }
      );

      const json = res.data;

      //console.log('Response:', json);
      if (json) {
        setResponse(json.data);
        setInput('');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setResponse({ summary: 'Failed to process input.' });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setResponse({ summary: 'Server error. Try again later.' });
    } finally {
      setLoading(false);
    }
  };

  // Function to format the date and time in a readable format
  const formatDateTime = (isoDate) => {
    if (!isoDate) return 'Not scheduled'; // If no scheduled date, return 'Not scheduled'
    const date = new Date(isoDate);
    return date.toLocaleString(undefined, {
      weekday: 'short', // Show short weekday
      year: 'numeric', // Show the full year
      month: 'short', // Show short month name
      day: 'numeric', // Show the numeric day of the month
      hour: '2-digit', // Show hour in 2-digit format
      minute: '2-digit', // Show minute in 2-digit format
    });
  };

  return (
    <div>
      <p className="text-lg font-medium mb-4">Hello: How can I assist you today?</p>
      <form onSubmit={handleSubmit}>
        <input
          className="w-full p-2 rounded-lg border border-gray-300 mb-2"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)} // Update input state as the user types
        />
        <button
          type="submit"
          className="mt-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          disabled={loading} // Disable button while loading
        >
          {loading ? 'Sending...' : 'Send'} {/* Show 'Sending...' when the request is being processed */}
        </button>
      </form>

      {response && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg space-y-2">
          <p><strong>Summary:</strong> {DOMPurify.sanitize(response.summary)}</p> {/* Show the summary from the response */}
          <p><strong>Type:</strong> {DOMPurify.sanitize(response.type)}</p> {/* Show the type from the response */}
          <p><strong>Scheduled For:</strong> {formatDateTime(response.scheduledFor)}</p> {/* Show the formatted scheduled date/time */}
        </div>
      )}
    </div>
  );
}

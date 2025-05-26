import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot } from 'lucide-react';
import DOMPurify from 'dompurify'; // Sanitize inputs if ever displayed (optional)

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Optionally sanitize inputs here (especially if reused/displayed later)
    setFormData((prev) => ({
      ...prev,
      [name]: DOMPurify.sanitize(value),
    }));
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        alert('Login successful!');
        navigate('/');
      } else {
        // Escape backend error messages safely (used in alert, not HTML)
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error logging in');
    }
  };

  // Navigate to signup page
  const handleSignupRedirect = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-sky-100 px-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-sky-100 p-8 w-full max-w-md relative">
        {/* Chatbot Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-sky-100 text-sky-600 p-3 rounded-full shadow-inner">
            <Bot size={32} />
          </div>
        </div>

        {/* Header */}
        <h2 className="text-xl text-center text-sky-600 font-bold relative mb-6">
          <span className="inline-block bg-sky-100 px-4 py-2 rounded-full shadow text-sky-700">
            Hello again! Let’s chat 💬
          </span>
        </h2>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            value={formData.email}
            required
            autoComplete="email"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 placeholder-gray-500"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            value={formData.password}
            required
            autoComplete="off"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 placeholder-gray-500"
          />
          <button
            type="submit"
            className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg shadow transition duration-200"
          >
            Login
          </button>
        </form>

        {/* Signup Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">New here?</p>
          <button
            onClick={handleSignupRedirect}
            className="mt-1 text-sky-600 hover:underline font-medium"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

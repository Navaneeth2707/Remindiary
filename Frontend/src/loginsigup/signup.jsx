import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import DOMPurify from 'dompurify'; // Optional input sanitization

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Sanitize input for security, especially useful if displayed later
    setFormData(prev => ({ ...prev, [name]: DOMPurify.sanitize(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        alert('Signup successful!');
        navigate('/');
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error signing up');
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-sky-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-sky-100 p-8 w-full max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-sky-100 text-sky-600 p-3 rounded-full shadow-inner">
            <UserPlus size={32} />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-xl text-center text-sky-700 font-bold mb-6">
          Join the Conversation 🤖
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Name"
            autoComplete="name"
            onChange={handleChange}
            value={formData.name}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 placeholder-gray-500"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            onChange={handleChange}
            value={formData.email}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 placeholder-gray-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="off"
            onChange={handleChange}
            value={formData.password}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 placeholder-gray-500"
          />
          <button
            type="submit"
            className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg shadow transition duration-200"
          >
            Create Account
          </button>
        </form>

        {/* Redirect */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">Already have an account?</p>
          <button
            onClick={handleLoginRedirect}
            className="mt-1 text-sky-600 hover:underline font-medium"
          >
            Login Here
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;

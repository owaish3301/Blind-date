import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { encryptPassword } from '../utils/encryption';

function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!validateForm()) {
      return;
    }

    try {
      const encryptedPassword = encryptPassword(formData.password);
      
      const response = await axios.post('/auth/signup', {
        name: formData.name,
        email: formData.email,
        password: encryptedPassword
      });

      localStorage.setItem('token', response.data.token);
      navigate('/home');
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center">Sign Up</h2>
        {submitError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {submitError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Name"
              className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : ''}`}
              onChange={(e) => {
                setFormData({...formData, name: e.target.value});
                setErrors({...errors, name: ''});
              }}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : ''}`}
              onChange={(e) => {
                setFormData({...formData, email: e.target.value});
                setErrors({...errors, email: ''});
              }}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className={`w-full p-2 border rounded ${errors.password ? 'border-red-500' : ''}`}
              onChange={(e) => {
                setFormData({...formData, password: e.target.value});
                setErrors({...errors, password: ''});
              }}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Sign Up
          </button>
        </form>
        <div className="text-center mt-4">
          <button
            onClick={() => navigate('/signin')}
            className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Already have an account? Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
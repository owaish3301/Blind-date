import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { encryptPassword } from '../utils/encryption';


function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      
      const response = await axios.post('/auth/signin', {
        email: formData.email,
        password: encryptedPassword
      });

      // Clear sensitive data immediately
      setFormData({ email: '', password: '' });
      
      localStorage.setItem('token', response.data.token);
      navigate('/home');
    } catch (error) {
      if (error.response?.status === 400) {
        setSubmitError('Invalid email or password');
      } else {
        setSubmitError('An error occurred. Please try again.');
      }
      console.error('Auth error:', error.message);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href =`${ import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-3 p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center">Sign In</h2>
        {submitError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {submitError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
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
            Sign In
          </button>
        </form>
        <div className="mt-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Sign in with Google
          </button>
        </div>
        <div className="text-center mt-4">
          <button
            onClick={() => navigate('/signup')}
            className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Create New Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
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
      localStorage.setItem("userId", response.data.userId);
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      backgroundColor: '#FFE4E1',
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff9eaa' fill-opacity='0.1'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    }}>
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg border-4 border-black shadow-[6px_6px_0_0_#000] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[10px_10px_0_0_#000] transition-all duration-200">
          <div className="text-center mb-8">
            <div className="heart-container">
              <div className="heart text-5xl">❤️</div>
            </div>
            <h1 className="text-3xl font-bold mt-4">Blind Date</h1>
            <p className="text-gray-600 mt-2">Scratch and see whom your destiny holds</p>
          </div>

          {submitError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className={`w-full p-3 border-2 border-black rounded bg-pink-50 ${errors.email ? 'border-red-500' : ''}`}
              onChange={(e) => {
                setFormData({...formData, email: e.target.value});
                setErrors({...errors, email: ''});
              }}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}

            <input
              type="password"
              placeholder="Password"
              className={`w-full p-3 border-2 border-black rounded bg-pink-50 ${errors.password ? 'border-red-500' : ''}`}
              autoComplete="off"
              onChange={(e) => {
                setFormData({...formData, password: e.target.value});
                setErrors({...errors, password: ''});
              }}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-pink-500 text-white font-bold rounded border-4 border-black shadow-[4px_4px_0_0_#000] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0_0_#000] transition-all duration-200"
            >
              Sign In
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/signup')}
              className="w-full py-3 bg-green-500 text-white font-bold rounded border-4 border-black shadow-[4px_4px_0_0_#000] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0_0_#000] transition-all duration-200"
            >
              Create New Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
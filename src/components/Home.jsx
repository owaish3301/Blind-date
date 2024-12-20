import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../utils/axios';

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    if (token) {
      localStorage.setItem('token', token);
      // Verify token immediately
      verifyToken(token);
      navigate('/home', { replace: true });
    } else {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        navigate('/signin');
      } else {
        verifyToken(storedToken);
      }
    }
  }, [location, navigate]);

  const verifyToken = async (token) => {
    try {
      const response = await axios.get('/auth/verify', {
        headers: { 'x-auth-token': token }
      });
      setUserData(response.data);
      if (!response.data.questionnaire?.questionnaireCompleted) {
        navigate('/questionnaire');
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('token');
      navigate('/signin');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {userData && (
        <div className="mb-4">
          <h2 className="text-xl">Welcome, {userData.name}</h2>
          <p>{userData.email}</p>
        </div>
      )}
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}

export default Home;
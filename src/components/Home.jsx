import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    if (token) {
      localStorage.setItem('token', token);
      navigate('/home', { replace: true });
    } else if (!localStorage.getItem('token')) {
      navigate('/signin');
    }
    setIsLoading(false);
  }, [location, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
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
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Header({ username, remainingTime }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('questionnaireProgress');
    navigate('/signin');
  };

  return (
    <header className="bg-white border-b-4 border-black p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="heart text-3xl">❤️</div>
          <h1 className="text-2xl font-bold">Blind Date</h1>
        </div>

        {/* Timer and Info */}
        <div className="flex items-center space-x-4">
          <div className="text-pink-600 font-bold">
            <span className="mr-2">⏰</span>
            {remainingTime}
          </div>
          
          {/* Profile Menu */}
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-2 bg-pink-100 px-4 py-2 rounded-lg border-2 border-black hover:bg-pink-200 transition-all duration-200"
            >
              <span className="font-bold">{username}</span>
              <span>▼</span>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border-4 border-black shadow-[4px_4px_0_0_#000] overflow-hidden">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-pink-50 font-medium text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
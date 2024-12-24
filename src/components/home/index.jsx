import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import Header from './Header';
import CardGrid from './CardGrid';

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axios.get('/auth/verify');
        setUserData(response.data);
        if (!response.data.questionnaire?.questionnaireCompleted) {
          navigate('/questionnaire');
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Verification failed:', error);
        localStorage.removeItem('token');
        navigate('/signin');
      }
    };

    verifyUser();
  }, [navigate]);

  const handleScratch = async (code) => {
    try {
      // Here we'll add the API call to record the scratch
      console.log('Scratched code:', code);
      // Update UI to show the scratched card
      setCards(prevCards =>
        prevCards.map(card =>
          card.code === code ? { ...card, isScratched: true } : card
        )
      );
    } catch (error) {
      console.error('Failed to record scratch:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="heart text-6xl">❤️</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50">
      <Header 
        username={userData?.name} 
      />
      <main className="max-w-7xl mx-auto py-6">
        <CardGrid cards={cards} onScratch={handleScratch} />
      </main>
    </div>
  );
}

export default Home;
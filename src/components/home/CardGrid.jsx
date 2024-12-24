import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import ScratchCard from './ScratchCard';

function CardGrid() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  const fetchCards = async () => {
    try {
      const response = await axios.get('/cards/available');
      setCards(response.data);
    } catch (err) {
      console.error('Error loading cards:', err);
    }
  };

  useEffect(() => {
    // Fetch user data first to get gender
    const fetchUserAndCards = async () => {
      try {
        const userResponse = await axios.get('/auth/verify');
        setUserData(userResponse.data);
        await fetchCards();
        setLoading(false);
      } catch (err) {
        setError('Failed to load data');
        console.error('Error:', err);
        setLoading(false);
      }
    };

    fetchUserAndCards();
  }, []);

  const handleScratch = async (cardId) => {
    try {
      const response = await axios.post(`/cards/scratch/${cardId}`);
      
      // Update cards state with revealed code
      setCards(prevCards => 
        prevCards.map(card => 
          card._id === cardId 
            ? { 
                ...card, 
                isScratched: true,
                code: response.data.code,
                scratchedAt: new Date()
              }
            : card
        )
      );

      // Handle match if any
      if (response.data.matched && response.data.matchedUser) {
        console.log('🎉 Match found!', response.data.matchedUser);
      }

      return response.data;
    } catch (err) {
      if (err.response?.status === 400 && err.response.data?.code) {
        // If card was already scratched, return existing code
        return { code: err.response.data.code };
      }
      console.error('Scratch error:', err.response?.data?.message || 'Failed to scratch card');
      throw err;
    }
  };

  if (loading) return <div>Loading cards...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {cards.map((card) => (
        <ScratchCard
          key={card._id}
          id={card._id}
          code={card.code}
          isLocked={card.isLocked}
          canScratch={card.canScratch} // Make sure this is being passed
          isScratched={card.isScratched}
          scratchedAt={card.scratchedAt}
          onScratch={handleScratch}
          userGender={userData?.questionnaire?.gender}
        />
      ))}
    </div>
  );
}

export default CardGrid;
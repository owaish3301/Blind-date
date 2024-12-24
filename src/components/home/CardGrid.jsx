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
      
      // Handle match
      if (response.data.matched && response.data.matchedUser) {
        console.log('🎉 Match found!');
        console.log('Matched with:', {
          name: response.data.matchedUser.name,
          age: response.data.matchedUser.age,
          course: response.data.matchedUser.course,
          year: response.data.matchedUser.year,
          interests: response.data.matchedUser.interests
        });
      }

      // Update cards state
      setCards(prevCards => 
        prevCards.map(card => 
          card._id === cardId 
            ? { 
                ...card, 
                isScratched: true, 
                code: response.data.code,
                isLocked: false,
                canScratch: false
              }
            : card
        )
      );

      return response.data;
    } catch (err) {
      console.error('Error scratching card:', err);
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
          onScratch={handleScratch}
          userGender={userData?.questionnaire?.gender}
        />
      ))}
    </div>
  );
}

export default CardGrid;
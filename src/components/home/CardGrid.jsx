import { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { useSupabase } from "../../context/SupabaseContext";
import ScratchCard from "./ScratchCard";
import { useNotifications } from "../../context/NotificationContext";

function CardGrid() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const supabase = useSupabase();
  const { setNotifications } = useNotifications();

  const fetchCards = async () => {
    try {
      const response = await axios.get("/cards/available");
      setCards(response.data);
    } catch (err) {
      console.error("Error loading cards:", err);
    }
  };

  useEffect(() => {
    // Fetch user data first to get gender
    const fetchUserAndCards = async () => {
      try {
        const userResponse = await axios.get("/auth/verify");
        setUserData(userResponse.data);
        await fetchCards();
        setLoading(false);
      } catch (err) {
        setError("Failed to load data");
        console.error("Error:", err);
        setLoading(false);
      }
    };

    fetchUserAndCards();
  }, []);

  useEffect(() => {
    if (userData) {
      const channel = supabase
        .channel("card-updates")
        .on("broadcast", { event: "card-update" }, (event) => {
          const payload = event.payload;

          if (!payload || !payload.cardId || !payload.scratcherGender) {
            console.warn("Received invalid payload:", event);
            return;
          }

          // Only lock the card if the scratcher has the same gender as the current user
          if (payload.scratcherGender === userData.questionnaire.gender) {
            setCards((prevCards) => {
              return prevCards.map((card) => {
                const cardId = card._id?.toString();
                const payloadCardId = payload.cardId?.toString();

                if (cardId && payloadCardId && cardId === payloadCardId) {
                  return {
                    ...card,
                    isLocked: true,
                    isScratched: false,
                  };
                }
                return card;
              });
            });
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [supabase, userData]);

  const handleScratch = async (cardId) => {
    try {
      const response = await axios.post(`/cards/scratch/${cardId}`);

      if (response.data.alreadyScratched) {
        return { code: response.data.code };
      }

      // Update cards state with revealed code
      setCards((prevCards) =>
        prevCards.map((card) =>
          card._id === cardId
            ? {
                ...card,
                isScratched: true,
                code: response.data.code,
                scratchedAt: new Date(),
              }
            : card
        )
      );

      // Handle match if any
      if (response.data.matched && response.data.matchedUser) {
        try{
          const matchNotification = {
            type: "match",
            message: `You matched with ${response.data.matchedUser.name}!`,
            metadata: {
              matchedUser: response.data.matchedUser,
              code: response.data.code,
            },
          };
          const notifResponse = await axios.post("/notifications", matchNotification);
          setNotifications((prev) => [notifResponse.data, ...prev]);
        }
        catch(err){
          console.error("Failed to create match notification:", err);
        }
      }
      return response.data;
    } catch (err) {
      console.error("Scratch error:", err);
      throw err;
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="heart text-4xl animate-heartbeat">❤️</div>
      </div>
    );

  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {cards.map((card) => (
        <ScratchCard
          key={card._id}
          id={card._id}
          code={card.code}
          isLocked={card.isLocked}
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
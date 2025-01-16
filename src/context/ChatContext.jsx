import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "../utils/supabase";
import axios from "../utils/axios";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [chats, setChats] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({
    1: 2, // Initial dummy data
    2: 0,
  });
  const [lastMessages, setLastMessages] = useState({
    1: { message: "Hello!", timestamp: "10:00 AM" },
    2: { message: "Hi there!", timestamp: "10:01 AM" },
  });

  const [chatUsers, setChatUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChatUsers();
  }, []);

  const fetchChatUsers = async () => {
    try {
      setLoading(true);
      const currentUserId = localStorage.getItem("userId");
      console.log(currentUserId);
      
      //fetch the user's chat relationships
      const { data: chatRelations, error } = await supabase
        .from("chat_relationships")
        .select("*")
        .or(`user1_id.eq.${currentUserId},user2_id.eq.${currentUserId}`);

      console.log("Query result:", { data: chatRelations, error }); // Debug log

      if (error) throw error;

      // Get the other user's ID for each chat relationship
      const otherUserIds = chatRelations.map((chat) =>
        chat.user1_id === currentUserId ? chat.user2_id : chat.user1_id
      );

      // Fetch user details from your backend
      const userPromises = otherUserIds.map((userId) =>
        axios.get(`/auth/user/${userId}`)
      );

      const userResponses = await Promise.all(userPromises);
      const users = userResponses.map((response) => ({
        id: response.data._id,
        name: response.data.name,
        avatar: "https://via.placeholder.com/150", // add real avatars later
      }));

      setChatUsers(users);
    } catch (err) {
      console.error("Error fetching chat users:", err);
    } finally {
      setLoading(false);
    }
  };

  const selectUser = (user) => {
    setSelectedUser(user);
    // Mark messages as read when selecting user
    setUnreadCounts(prev => ({
      ...prev,
      [user.id]: 0
    }));
    
    if (!chats[user.id]) {
      setChats(prev => ({
        ...prev,
        [user.id]: []
      }));
    }
  };

  const deselectUser = () => {
    setSelectedUser(null);
  };

  const sendMessage = (message) => {
    if (!selectedUser) return;

    const timestamp = new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    const newMessage = {
      id: Date.now().toString(),
      userId: '1', // Current user ID
      receiverId: selectedUser.id,
      message,
      timestamp
    };

    // Update chats
    setChats(prev => ({
      ...prev,
      [selectedUser.id]: [...(prev[selectedUser.id] || []), newMessage]
    }));

    // Update last message
    setLastMessages(prev => ({
      ...prev,
      [selectedUser.id]: { message, timestamp }
    }));
  };

  const getCurrentUserChats = () => {
    return selectedUser ? chats[selectedUser.id] || [] : [];
  };

  return (
    <ChatContext.Provider value={{ 
      selectedUser,
      chatUsers,
      loading,
      selectUser, 
      deselectUser, 
      chats: getCurrentUserChats(), 
      sendMessage,
      unreadCounts,
      lastMessages
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
import { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [chats, setChats] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({
    '1': 2, // Initial dummy data
    '2': 0
  });
  const [lastMessages, setLastMessages] = useState({
    '1': { message: 'Hello!', timestamp: '10:00 AM' },
    '2': { message: 'Hi there!', timestamp: '10:01 AM' }
  });

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
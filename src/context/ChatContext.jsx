import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import axios from "../utils/axios";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [chats, setChats] = useState({});
  const [lastMessages, setLastMessages] = useState({});
  const [chatUsers, setChatUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const resetChatState = () => {
    setSelectedUser(null);
    setChats({});
    setLastMessages({});
    setChatUsers([]);
    setLoading(true);
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      resetChatState(); // Reset chat state beofre fetching new data
      fetchChatUsers();

      const channel = supabase
        .channel("chat-messages")
        .on("broadcast", { event: "new-message" }, ({ payload }) => {
          if (payload.receiverId === userId) {
            const newMessage = {
              id: payload.id,
              userId: "2",
              message: payload.content,
              timestamp: new Date(payload.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            };

            setChats((prev) => ({
              ...prev,
              [payload.senderId]: [
                ...(prev[payload.senderId] || []),
                newMessage,
              ],
            }));

            setLastMessages((prev) => ({
              ...prev,
              [payload.senderId]: {
                message: payload.content,
                timestamp: newMessage.timestamp,
              },
            }));
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
    else{
      resetChatState(); // Reset chat state when userid is empty
    }
  }, []);

  const fetchChatUsers = async () => {
    const currentUserId = localStorage.getItem("userId");
    if (!currentUserId) return;

    try {
      setLoading(true);
      const { data: chatRelations, error } = await supabase
        .from("chat_relationships")
        .select("*")
        .or(`user1_id.eq.${currentUserId},user2_id.eq.${currentUserId}`);

      if (error) throw error;

      const otherUserIds = chatRelations.map((chat) =>
        chat.user1_id === currentUserId ? chat.user2_id : chat.user1_id
      );

      const userPromises = otherUserIds.map((userId) =>
        axios.get(`/auth/user/${userId}`)
      );

      const userResponses = await Promise.all(userPromises);
      const users = userResponses.map((response) => ({
        id: response.data._id,
        name: response.data.name,
        avatar: "https://via.placeholder.com/150",
      }));

      setChatUsers(users);
    } catch (err) {
      console.error("Error fetching chat users:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    if (!userId) return;

    try {
      const currentUserId = localStorage.getItem("userId");
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${currentUserId},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${currentUserId})`
        )
        .order("created_at", { ascending: true });

      if (error) throw error;

      const formattedMessages = data.map((msg) => ({
        id: msg.id.toString(),
        userId: msg.sender_id === currentUserId ? "1" : "2",
        message: msg.content,
        timestamp: new Date(msg.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      setChats((prev) => ({
        ...prev,
        [userId]: formattedMessages,
      }));

      if (formattedMessages.length > 0) {
        const lastMsg = formattedMessages[formattedMessages.length - 1];
        setLastMessages((prev) => ({
          ...prev,
          [userId]: {
            message: lastMsg.message,
            timestamp: lastMsg.timestamp,
          },
        }));
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const selectUser = async (user) => {
    setSelectedUser(user);
    await fetchMessages(user.id);
  };

  const deselectUser = () => {
    setSelectedUser(null);
  };

  const sendMessage = async (message) => {
    if (!selectedUser) return;

    const currentUserId = localStorage.getItem("userId");
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newMessage = {
      id: Date.now().toString(),
      userId: "1",
      message,
      timestamp,
    };

    try {
      const { data, error } = await supabase
        .from("messages")
        .insert([
          {
            sender_id: currentUserId,
            receiver_id: selectedUser.id,
            content: message,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setChats((prev) => ({
        ...prev,
        [selectedUser.id]: [...(prev[selectedUser.id] || []), newMessage],
      }));

      setLastMessages((prev) => ({
        ...prev,
        [selectedUser.id]: { message, timestamp },
      }));

      await supabase.channel("chat-messages").send({
        type: "broadcast",
        event: "new-message",
        payload: {
          id: data.id,
          senderId: currentUserId,
          receiverId: selectedUser.id,
          content: message,
          created_at: data.created_at,
        },
      });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const getCurrentUserChats = () => {
    return selectedUser ? chats[selectedUser.id] || [] : [];
  };

  return (
    <ChatContext.Provider
      value={{
        selectedUser,
        chatUsers,
        loading,
        selectUser,
        deselectUser,
        chats: getCurrentUserChats(),
        sendMessage,
        lastMessages,
        fetchChatUsers,
        resetChatState
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
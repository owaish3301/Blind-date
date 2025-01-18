import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useSupabase } from "./SupabaseContext";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = useSupabase();

  const fetchNotifications = async () => {
    if(!localStorage.getItem('userId')) return;
    console.log('fetching notifications');
    try {
      const response = await axios.get("/notifications");
      setNotifications(response.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const setupNotificationSubscription = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    // Subscribe to real-time updates
    const channel = supabase
      .channel("notification-updates")
      .on("broadcast", { event: "notification" }, ({ payload }) => {
        if (payload.userId === userId) {
          setNotifications((prev) => {
            // Avoid duplicate notifications
            const exists = prev.some(
              (n) => n._id === payload.notification._id
            );
            if (exists) return prev;
            return [payload.notification, ...prev];
          });
        }
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }

  useEffect(() => {
    fetchNotifications();
    const cleanup = setupNotificationSubscription();
    return cleanup;
  }, []);
  
  const markAllAsRead = async () => {
    try {
      await axios.put("/notifications/mark-all-read");
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
    } catch (err) {
      console.error("Error marking notifications as read:", err);
    }
  };

  const markAsRead = async (notificationId) => {
    if (!notificationId) {
      console.error("No notification ID provided");
      return;
    }

    try {
      const response = await axios.put(`/notifications/${notificationId}/read`);

      if (response.data) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === notificationId ? { ...notif, read: true } : notif
          )
        );
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
      throw err;
    }
  };

  const addNotification = (newNotification) => {
    setNotifications((prev) => [newNotification, ...prev]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        loading,
        markAllAsRead,
        markAsRead,
        addNotification,
        fetchNotifications,
        setNotifications,
        setupNotificationSubscription
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
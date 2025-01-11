import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BellIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNotifications } from "../../context/NotificationContext";

function Header({ username }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const notificationRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { notifications, loading, markAllAsRead, markAsRead } = useNotifications();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("questionnaireProgress");
    navigate("/signin");
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
  };
  const handleNotificationClick = (id) => {
    markAsRead(id);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "match":
        return "❤️";
      case "card":
        return "🎲";
      case "system":
        return "⚙️";
      default:
        return "📬";
    }
  };

  const NotificationContent = () => (
    <>
      {isMobile ? (
        // Mobile header
        <div className="p-3 border-b-2 border-black grid grid-cols-3 items-center bg-pink-50">
          <button
            onClick={() => setIsNotificationOpen(false)}
            className="p-1 hover:bg-pink-100 rounded-full justify-self-start"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <h3 className="font-bold text-left">Notifications</h3>
          <button
            onClick={handleMarkAllRead}
            className="text-sm text-pink-600 hover:text-pink-700 justify-self-end"
          >
            Mark all as read
          </button>
        </div>
      ) : (
        // Desktop header
        <div className="p-3 border-b-2 border-black flex items-center justify-between bg-pink-50">
          <h3 className="font-bold pl-2">Notifications</h3>
          <button
            onClick={handleMarkAllRead}
            className="text-sm text-pink-600 hover:text-pink-700"
          >
            Mark all as read
          </button>
        </div>
      )}

      <div className="overflow-y-auto max-h-[60vh]">
        {loading ? (
          <div className="p-4 text-center text-gray-500">
            Loading...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No notifications yet
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              onClick={() => handleNotificationClick(notification._id)}
              className={`p-3 border-b border-gray-200 hover:bg-pink-50 transition-colors cursor-pointer ${
                !notification.read ? "bg-pink-50" : ""
              }`}
            >
              <div className="flex items-start space-x-3">
                <span className="text-xl">
                  {getNotificationIcon(notification.type)}
                </span>
                <div className="flex-1">
                  <p className="text-sm">{notification.message}</p>
                  {notification.metadata && notification.type === 'match' && (
                    <div className="mt-2 text-xs text-gray-600">
                      <p>Match details available</p>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );

  return (
    <header className="bg-white border-b-4 border-black p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="heart text-3xl">❤️</div>
          <h1 className="text-2xl font-bold">Blind Date</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notification Bell */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2 hover:bg-pink-50 rounded-full transition-colors"
            >
              <BellIcon className="h-6 w-6" />
              {notifications.some((n) => !n.read) && (
                <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              )}
            </button>

            {/* Mobile Notification Page */}
            {isMobile && isNotificationOpen && (
              <div className="fixed inset-0 bg-white z-50">
                <NotificationContent />
              </div>
            )}

            {/* Desktop Notification Panel */}
            {!isMobile && isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg border-4 border-black shadow-[4px_4px_0_0_#000] overflow-hidden max-h-[80vh] z-50">
                <NotificationContent />
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative" ref={menuRef}>
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
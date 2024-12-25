import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const baseUrl = process.env.NODE_ENV === "production"
      ? "https://blind-date-backend.vercel.app"
      : "http://localhost:5000";

    const newSocket = io(baseUrl, {
      path: "/socket.io/",
      transports: ["polling"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      autoConnect: true,
      auth: {
        token: localStorage.getItem("token")
      }
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}</SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);

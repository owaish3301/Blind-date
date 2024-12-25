import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('https://blind-date-backend.vercel.app', {
      withCredentials: true,
      transports: ['polling'],
      path: '/socket.io/',
      secure: true,
      rejectUnauthorized: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      extraHeaders: {
        'x-auth-token': localStorage.getItem('token')
      },
      cors: {
        origin: 'https://blind-date-seven.vercel.app',
        methods: ['GET', 'POST', 'OPTIONS'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
      },
      pingTimeout: 60000,
      pingInterval: 25000,
      allowEIO3: true,
      cookie: {
        name: 'io',
        path: '/',
        httpOnly: true,
        sameSite: 'none',
        secure: true
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
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
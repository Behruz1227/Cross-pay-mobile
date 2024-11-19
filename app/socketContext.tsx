import { SocketStore } from '@/helpers/stores/socket/socketStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import React, { createContext, useContext, useRef, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const socketRef = useRef<Socket | null>(null);
  const [role, setRole] = useState("");
  const [connectionAttempts, setConnectionAttempts] = useState(0); // Ulanish urinishlari

    const {
      setSocketData,
      socketData,
      setSocketModalData,
      setNotificationSocket,
    } = SocketStore();

    useFocusEffect(
        useCallback(() => {
          const fetchRole = async () => {
            const storedRole = await AsyncStorage.getItem("role");
            setRole(storedRole ? storedRole : "");
          };
          fetchRole();
        }, [])
      );

    const connectSocket = () => {
        if (connectionAttempts < 5 && role !== "ROLE_SUPER_ADMIN") {
          if (socketRef.current) {
            socketRef?.current?.disconnect(); // Eskisini uzib tashlaymiz
          }
          socketRef.current = io("https://my.qrpay.uz", {
            transports: ["websocket"], // Faqat WebSocket transportini ishlatish
            secure: true,
          });
    
          socketRef?.current.on("connect", () => {
            console.log(
              "Connected to Socket.IO server ID: " + socketRef?.current?.id
            );
            setSocketData(socketRef.current);
          });
    
          socketRef.current.on("notification", (data) => {
            console.log("Notification data:", data);
            setNotificationSocket(data);
          });
    
          socketRef.current.on("callback-web-or-app", (data) => {
            console.log("calback data:", data);
            setSocketModalData(data);
          });
    
          socketRef.current.on("test", (data) => {
            console.log("Received data:", data);
            setSocketModalData(data);
          });
    
          socketRef.current.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
            setConnectionAttempts(prev => prev + 1); // Ulanish urinishini oshiramiz
            setTimeout(() => {
              console.log("Retrying to connect socket...");
              connectSocket(); // Qayta ulanish
            }, 5000);
          });
        }
      };
    
      useFocusEffect(
        useCallback(() => {
          // if (role === "ROLE_SUPER_ADMIN") {
          connectSocket(); // Ilk bor socketni ulaymiz
          // }
          return () => {
            if (socketRef.current) {
              socketRef.current.disconnect(); // Unmount qilinganda socketni uzamiz
            }
          };
        }, [])
      );
    
      useEffect(() => {
        if (connectionAttempts < 5 && role !== "ROLE_SUPER_ADMIN") {
          if (socketRef.current && !socketRef.current.connected) {
            connectSocket(); // Agar socket ulanmagan bo'lsa, qayta ulash
          }
        }
      }, [socketRef]); // Sahifa va o'lcham o'zgarsa qayta ulanish
    
      console.log("socketData", socketData);
      console.log("socketData id", socketData?.id);
      console.log("socketData connected", socketData?.connected);
      console.log("socket2", socketData);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
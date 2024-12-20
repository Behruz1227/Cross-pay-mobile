import { SocketStore } from '@/helpers/stores/socket/socketStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import React, { createContext, useContext, useRef, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const socketRef = useRef<Socket | null>(null);
  const [role, setRole] = useState("");
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [isStopped, setIsStopped] = useState(false); // Ulanish urinishlarini to'xtatish uchun flag

  const { setSocketData, setSocketModalData, setNotificationSocket, socketData } = SocketStore();

  useFocusEffect(
    useCallback(() => {
      const fetchRole = async () => {
        const storedRole = await AsyncStorage.getItem("role");
        setRole(storedRole || "");
      };
      fetchRole();
    }, [])
  );

  const connectSocket = useCallback(() => {
    if (isStopped || connectionAttempts >= 5) {
      // console.log("Stopping reconnection attempts.");
      return; // Limitga yetgan bo'lsa yoki to'xtatilgan bo'lsa, qaytadan ulanmaydi
    }

    if (role === "ROLE_SUPER_ADMIN") {
      // console.log("Super admin uchun socket ulanmaydi.");
      return;
    }

    if (socketRef.current) {
      socketRef.current.disconnect(); // Eskisini uzib tashlaymiz
    }

    socketRef.current = io("http://185.74.4.138:8082", {
      transports: ["websocket"],
      secure: true,
    });

    socketRef.current.on("connect", () => {
      // console.log("Connected to Socket.IO server ID: " + socketRef.current?.id);
      setSocketData(socketRef.current);
      setConnectionAttempts(0); // Muvaffaqiyatli ulanishda qayta urinishni 0 ga tushiramiz
      setIsStopped(false); // Ulash davom etishi mumkin
    });

    socketRef.current.on("notification", (data) => {
      // console.log("Notification data:", data);
      setNotificationSocket(data);
    });

    socketRef.current.on("callback-web-or-app", (data) => {
      // console.log("Callback data:", data);
      setSocketModalData(data);
    });

    socketRef.current.on("test", (data) => {
      // console.log("Received data:", data);
      setSocketModalData(data);
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setConnectionAttempts((prev) => prev + 1);

      if (connectionAttempts < 4) {
        // console.log(`Retrying to connect socket... Attempt: ${connectionAttempts + 1}`);
        setTimeout(connectSocket, 5000);
      } else {
        // console.log("Max connection attempts reached. No more retries.");
        setIsStopped(true); // To'xtash flagini yoqamiz
      }
    });
  }, [connectionAttempts, isStopped, role]);

  useFocusEffect(
    useCallback(() => {
      if (!isStopped) {
        connectSocket();
      }
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }, [connectSocket, isStopped])
  );

  useEffect(() => {
    if (connectionAttempts < 5 && role !== "ROLE_SUPER_ADMIN" && !isStopped) {
      if (socketRef.current && !socketRef.current.connected) {
        connectSocket();
      }
    }
  }, [connectionAttempts, connectSocket, isStopped]);

  // console.log("socketData", socketData);
  // console.log("socketData id", socketData?.id);
  // console.log("socketData connected", socketData?.connected);

  return <SocketContext.Provider value={socketRef.current}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  return useContext(SocketContext);
};

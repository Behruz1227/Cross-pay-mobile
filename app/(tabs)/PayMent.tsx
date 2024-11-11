import { Keyboard, StyleSheet, TouchableWithoutFeedback } from "react-native";
import CreateQr from "../(Seller)/createQr";
import { Platform } from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SocketStore } from "@/helpers/stores/socket/socketStore";
import { useFocusEffect } from "expo-router";

const socket = io("https://socket.qrpay.uz", {
  secure: true,
  transports: ["websocket", "polling"], // WebSocket va Pollingni qo'llash
});
export default function PaymentQr() {
  const { setSocketData, setSocketModalData, socketData } = SocketStore();
  const socketRef = useRef<Socket | null>(null);

  const connectSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect(); // Eskisini uzib tashlaymiz
    }
    socketRef.current = io("https://socket.qrpay.uz", {
      secure: true,
      transports: ['websocket', 'polling'],
    });

    socketRef.current.on('connect', () => {
      if (socketRef.current) { // null tekshiruvi qo'shildi
        console.log("Connected to Socket.IO server ID: " + socketRef.current.id);
        setSocketData(socketRef.current);
      }
      
    });

    socketRef.current.on('callback-web-or-app', (data) => {
      console.log("Received data:", data);
      setSocketModalData(data);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error("Socket connection error:", error);
      setTimeout(() => {
        console.log("Retrying to connect socket...");
        connectSocket(); // Qayta ulanish
      }, 5000);
    });

  };

  useEffect(() => {
    connectSocket(); // Ilk bor socketni ulaymiz

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect(); // Unmount qilinganda socketni uzamiz
      }
    };
  }, []);

  socketData?.on("connect", function () {
    // console.log("Connected to Socket.IO server ID: " + socketData?.id);
    setSocketData(socket);
  });

  socketData?.on("callback-web-or-app", function (data: any) {
    // console.log("data", data);
    setSocketModalData(data);
  });
  console.log(socketData);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {/* <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
        <Navbar /> */}
      <CreateQr />
      {/* </SafeAreaView> */}
    </TouchableWithoutFeedback>
  );
}



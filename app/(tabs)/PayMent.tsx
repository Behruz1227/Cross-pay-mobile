import { Keyboard, StyleSheet, TouchableWithoutFeedback } from "react-native";
import CreateQr from "../(Seller)/createQr";
import { Platform } from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SocketStore } from "@/helpers/stores/socket/socketStore";
import { useFocusEffect, usePathname } from "expo-router";

export default function PaymentQr() {
  // const { setSocketData, setSocketModalData, socketData } = SocketStore();
  // const socketRef = useRef<Socket | null>(null);
  // const pathname = usePathname()
  // const [connectionAttempts, setConnectionAttempts] = useState(0); // Ulanish urinishlari

  // const role = sessionStorage.getItem("role");
  // const connectSocket = () => {
  //   if (connectionAttempts < 5 && role !== "ROLE_SUPER_ADMIN") {
  //     if (socketRef.current) {
  //       socketRef?.current?.disconnect(); // Eskisini uzib tashlaymiz
  //     }
  //     socketRef.current = io("https://my.qrpay.uz", {
  //       transports: ["websocket"], // Faqat WebSocket transportini ishlatish
  //       secure: true,
  //     });

  //     socketRef?.current.on("connect", () => {
  //       // console.log(
  //       //   "Connected to Socket.IO server ID: " + socketRef?.current?.id
  //       // );
  //       setSocketData(socketRef.current);
  //     });

  //     socketRef.current.on("notification", (data) => {
  //       // console.log("Notification data:", data);
  //       // setNotificationSocket(data);
  //     });

  //     socketRef.current.on("callback-web-or-app", (data) => {
  //       // console.log("calback data:", data);
  //       setSocketModalData(data);
  //     });

  //     socketRef.current.on("test", (data) => {
  //       // console.log("Received data:", data);
  //       setSocketModalData(data);
  //     });

  //     socketRef.current.on("connect_error", (error) => {
  //       console.error("Socket connection error:", error);
  //       setConnectionAttempts((prev) => prev + 1); // Ulanish urinishini oshiramiz
  //       setTimeout(() => {
  //         // console.log("Retrying to connect socket...");
  //         connectSocket(); // Qayta ulanish
  //       }, 5000);
  //     });
  //   }
  // };

  // useEffect(() => {
  //   if (pathname.split("/")[2] === "dashboard") connectSocket(); // Ilk bor socketni ulaymiz
  //   return () => {
  //     if (socketRef.current) {
  //       socketRef.current.disconnect(); // Unmount qilinganda socketni uzamiz
  //     }
  //   };
  // }, [pathname]);

  // useEffect(() => {
  //   if (connectionAttempts < 5 && role !== "ROLE_SUPER_ADMIN") {
  //     if (socketRef.current && !socketRef.current.connected) {
  //       connectSocket(); // Agar socket ulanmagan bo'lsa, qayta ulash
  //     }
  //   }
  // }, [socketRef]);
  // console.log(socketData);

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



import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { QueryClient, QueryClientProvider } from "react-query";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Index from "./index";
import NotFoundScreen from "./+not-found";
import CreateQr from "./(Seller)/createQr";
import Login from "./(auth)/login";
import TransactionDeatail from "./(Seller)/(transactionsDetail)/transactionDetail";
import Notifications from "./(Seller)/notifications/notifications";
import TabLayout from "./(tabs)/_layout";
import Welcome from "./(welcome)/welcome";
import Profile from "./(Seller)/(profile)/profile";
import CheckCode from "./(auth)/checkCode";
import PrivacyTermsPage from "./(Seller)/(shartlar)/PrivacyTermsPage";
import InternetCheckModal from "./checkInternet";
import { SocketStore } from "@/helpers/stores/socket/socketStore";
import CallBackModal from "./callBackModal";
import { SocketProvider } from "./socketContext";
import { useGlobalRequest } from "@/helpers/apifunctions/univesalFunc";
import { set_socket } from "@/helpers/url";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const {
    setSocketModal,
    setSocketModalData,
    setTimer,
    socketModal,
    socketModalData,
    timer,
    socketData
  } = SocketStore();


  useEffect(() => {
    if (socketModalData) {
      setSocketModal(true);
      setTimer(10); // 10 senlik sanashni o'qishni bosqichga olish
    }
  }, [socketModalData]);


  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (socketModal && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1);
      }, 900);
    } else if (timer === 0) {
      setSocketModal(false);
      setTimer(0);
      setSocketModalData(null);
    }

    return () => clearInterval(interval);
  }, [socketModal, timer]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  const queryClient = new QueryClient();
  const Stack = createNativeStackNavigator();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SocketProvider>
        <QueryClientProvider client={queryClient}>
          <CallBackModal />
          <SocketHandler socketData={socketData} />

          <InternetCheckModal />
          <Stack.Navigator
            initialRouteName="index"
            screenOptions={{ animation: "none" }}
          >
            <Stack.Screen
              name="index"
              component={Index}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(tabs)"
              component={TabLayout}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="+not-found" component={NotFoundScreen} />
            <Stack.Screen component={CreateQr} name="(Seller)/(createQr)" />
            <Stack.Screen
              component={Login}
              name="(auth)/login"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              component={TransactionDeatail}
              name="(Seller)/(transactionsDetail)/transactionDetail"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              component={Notifications}
              name="(Seller)/notifications/notifications"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              component={Welcome}
              name="(welcome)/welcome"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              component={Profile}
              name="(Seller)/(profile)/profile"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              component={CheckCode}
              name="(auth)/checkCode"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              component={PrivacyTermsPage}
              name="(Seller)/(shartlar)/PrivacyTermsPage"
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </QueryClientProvider>
      </SocketProvider>
    </ThemeProvider>
  );
}

function SocketHandler({ socketData }: { socketData: any }) {
  // const { setSocketModal, setTimer, setSocketModalData } = SocketStore();
  const setSocket = useGlobalRequest(`${set_socket}${socketData?.id}`, "POST", {});

  useEffect(() => {
    if (socketData?.id) {
      setSocket.globalDataFunc();
    }
  }, [socketData?.id]);

  return null;
}

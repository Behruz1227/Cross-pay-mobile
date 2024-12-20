import { Tabs } from "expo-router";
import React, { useCallback, useState } from "react";
import { TouchableOpacity } from "react-native";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { AntDesign } from "@expo/vector-icons";
import {
  BottomTabBarButtonProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import Terminal from "./Terminal";
import PaymentQr from "./PayMent";
import HomeScreen from "./home";
import UserTerminal from "./UserTerminal";
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { langStore } from "@/helpers/stores/language/languageStore";
import { responsivePixel, responsiveSpacing } from "@/hooks/customWidth";
import { TouchableOpacityProps } from "react-native-gesture-handler";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [role, setRole] = useState<string>("");
  const { langData } = langStore();

  useFocusEffect(
    useCallback(() => {
      const fetchRole = async () => {
        const storedRole = await AsyncStorage.getItem("role");
        setRole(storedRole ? storedRole : "");
      };
      fetchRole();
    }, [])
  );

  const Tab = createBottomTabNavigator();

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].primary,
          tabBarInactiveTintColor: "gray",
          headerShown: false,
          tabBarStyle: {
            height: responsivePixel(60),
            backgroundColor: "#f8f9fa",
            borderTopWidth: 0,
            position: "absolute",
            bottom: responsivePixel(16),
            left: responsivePixel(16),
            right: responsivePixel(16),
            borderRadius: 30,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.15,
            shadowRadius: 20,
            paddingBottom: 10,
          },
        })}
      >
        {/* {role === "ROLE_SELLER" && ( */}
        <Tab.Screen
          name="home"
          component={HomeScreen}
          options={{
            title: langData?.MOBILE_PANEL_CONTROL || "Панель управления",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                size={responsivePixel(26)}
                name={focused ? "home" : "home-outline"}
                color={color}
              />
            ),
            tabBarButton: (props: any) => (
              <TouchableOpacity
                {...props}
                onPress={(e) => {
                  props.onPress?.(e); // Use optional chaining
                }}
              />
            ),
          }}
        />
        {/* )} */}

        <Tab.Screen
          name="PayMent"
          component={PaymentQr}
          options={{
            title: langData?.MOBILE_PAYMENT || "Оплата",
            tabBarIcon: ({ color, focused }) => (
              <AntDesign
                name="qrcode"
                size={responsivePixel(30)}
                color={color}
              />
            ),
            tabBarButton: (props: BottomTabBarButtonProps) => (
              <TouchableOpacity
                activeOpacity={0.8}
                {...(props as TouchableOpacityProps)}
                onPress={(e) => {
                  if (props.onPress) {
                    props.onPress(e);
                  }
                }}
              />
            ),
          }}
        />

        {role === "ROLE_SELLER" && (
          <Tab.Screen
            name="Terminal"
            component={Terminal}
            options={{
              title: langData?.MOBILE_TERMINAL || "Терминал",
              tabBarIcon: ({ color, focused }) => (
                <FontAwesome5
                  name="calculator"
                  size={responsivePixel(26)}
                  color={color}
                />
              ),
              tabBarButton: (props: BottomTabBarButtonProps) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  {...(props as TouchableOpacityProps)} // Type assertion to avoid prop conflicts
                  onPress={(e) => {
                    if (props.onPress) {
                      props.onPress(e);
                    }
                  }}
                />
              ),
            }}
          />
        )}

        {role === "ROLE_SELLER" && (
          <Tab.Screen
            name="Terminal users"
            component={UserTerminal}
            options={{
              title: langData?.MOBILE_USER_TERMINAL || "Пользователи терминала",
              tabBarIcon: ({ color, focused }) => (
                <FontAwesome5
                  name="users"
                  size={responsivePixel(25)}
                  color={color}
                />
              ),
              tabBarButton: (props: BottomTabBarButtonProps) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  {...(props as TouchableOpacityProps)} // Type assertion to avoid prop conflicts
                  onPress={(e) => {
                    if (props.onPress) {
                      props.onPress(e);
                    }
                  }}
                />
              ),
            }}
          />
        )}
      </Tab.Navigator>
    </>
  );
}

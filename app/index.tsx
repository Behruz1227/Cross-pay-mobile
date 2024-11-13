import React, { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Welcome from "./(welcome)/welcome";
import { useFocusEffect, useNavigation } from "expo-router";
import { RootStackParamList } from "@/types/root/root";
import { NavigationProp } from "@react-navigation/native";
import { Dimensions, StyleSheet } from "react-native";

type SettingsScreenNavigationProp = NavigationProp<RootStackParamList, "(tabs)">;

const { width, height } = Dimensions.get("window");

const Index = () => {
  const [role, setRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [deadlineCheck, setDeadlineCheck] = useState<boolean>(false);
  const navigation = useNavigation<SettingsScreenNavigationProp>();

  useFocusEffect(
    useCallback(() => {
      const getToken = async () => {
        const role = await AsyncStorage.getItem("role");
        const token = await AsyncStorage.getItem("token");
        const deadline = await AsyncStorage.getItem("deadline");

        const today = new Date();
        const formattedToday = today.toISOString().split("T")[0];

        if (deadline) {
          if (new Date(formattedToday) < new Date(deadline)) {
            setDeadlineCheck(true);
          } else {
            setDeadlineCheck(false);
            await AsyncStorage.multiRemove(["role", "token", "deadline"]);
          }
        } else {
          await AsyncStorage.setItem("deadline", "");
          setDeadlineCheck(false);
        }

        setRole(role);
        setToken(token);
      };

      getToken();
    }, [])
  );

  useEffect(() => {
    if (token && role && deadlineCheck) {
      navigation.navigate("(tabs)");
    }
  }, [token, role, deadlineCheck, navigation]);

  return token && role && deadlineCheck ? null : <Welcome />;
};

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: "#f8f9fa",
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 20,
    alignItems: "center",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 10,
  },
  flexRow: {
    flexDirection: "row",
  },
  flexColumn: {
    flexDirection: "column",
  },
  buttonWrapper: {
    flex: 1,
  },
  fullWidthHalf: {
    width: "48%",
  },
  marginVertical: {
    marginVertical: 6,
  },
  marginHorizontal: {
    marginHorizontal: 6,
  },
  title: {
    fontSize: 20,
    color: "#000",
    fontWeight: "700",
  },
  desc: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
});

export default Index;

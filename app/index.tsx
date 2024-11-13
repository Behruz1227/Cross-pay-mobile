import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Welcome from "./(welcome)/welcome";
import { useNavigation } from "expo-router";
import { RootStackParamList } from "@/types/root/root";
import { NavigationProp } from "@react-navigation/native";
// import { SocketStore } from "@/helpers/stores/socket/socketStore";
// import CenteredModal from "@/components/modal/modal-centered";
import { Dimensions, ScrollView, StyleSheet, Text } from "react-native";
// import { View } from "react-native";
// import Buttons from "@/components/buttons/button";
// import Modal from "react-native-modal";
// import { langStore } from "@/helpers/stores/language/languageStore";

type SettingsScreenNavigationProp = NavigationProp<
  RootStackParamList,
  "(tabs)"
>;

const { width, height } = Dimensions.get("window");

const Index = () => {
  const [role, setRole] = useState<string | null>("");
  const [token, setToken] = useState<string | null>("");
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  

  useEffect(() => {
    const getToken = async () => {
      // await AsyncStorage.removeItem('role');
      // await AsyncStorage.removeItem('token');
      const role = await AsyncStorage.getItem("role");
      const token = await AsyncStorage.getItem("token");
      const deadline = await AsyncStorage.getItem("deadline");
      const deadline3 = new Date();
        deadline3.setDate(deadline3.getDate() + 5);
        const formattedDeadline = deadline3.toISOString().split('T')[0];
      setRole(role);
      setToken(token);
    };

    getToken();
  }, []);

  

  if (token && role) {
    navigation.navigate("(tabs)");
  } else {
    return (
      <>
        <Welcome />

        
      </>
    );
  }
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

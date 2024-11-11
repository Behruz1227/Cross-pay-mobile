import React, { useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { RadioButton } from "react-native-paper";
import { Avatar } from "react-native-elements";
import { useGlobalRequest } from "@/helpers/apifunctions/univesalFunc";
import { words_get_data, words_get_language, words_post_language } from "@/helpers/url";
import { useFocusEffect } from "expo-router";
import { langStore } from "@/helpers/stores/language/languageStore";
import { Image } from "react-native-svg";

const ChangeLang = () => {
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const { langData, setLangData } = langStore();
  const getLang = useGlobalRequest(`${words_get_language}MOBILE`, "GET");
  const getLangData = useGlobalRequest(`${words_get_data}MOBILE`, "GET");
  const changeLang = useGlobalRequest(
    `${words_post_language}?lang=${
      selectedLang ? selectedLang.toLowerCase() : "ru"
    }&webOrMobile=MOBILE`,
    "POST",
    {}
  );

  useFocusEffect(
    useCallback(() => {
      // Fetch default language from AsyncStorage
      getLang.globalDataFunc();
    }, [])
  );

  useEffect(() => {
    if (getLang.response) {
      setSelectedLang(getLang.response);
    } else if (getLang.error) {
      setSelectedLang("ru");
      changeLang.globalDataFunc();
    }
  }, [getLang.response, getLang.error]);

  useEffect(() => {
    if (changeLang.response) {
      getLang.globalDataFunc();
      getLangData.globalDataFunc();
    } else if (changeLang.error) {
      Alert.alert("QR - Pay",changeLang.error);
    }
  }, [changeLang.response, changeLang.error]);

  useEffect(() => {
    if (getLangData.response) {
      setLangData(getLangData.response);
    } else if (getLangData.error) {
      setLangData(null);
    }
  }, [getLangData.response, getLangData.error]);

  const handleLangChange = async (lang: string) => {
    await setSelectedLang(lang);
    await changeLang.globalDataFunc();
  };

  return (
    <View style={styles.detailCard}>
      <View style={styles.detailRow}>
        <RadioButton
          value="uz"
          status={
            selectedLang?.toLowerCase() === "uz" ? "checked" : "unchecked"
          }
          onPress={() => handleLangChange("uz")}
        />
        <Avatar
          rounded
          size="small"
          source={require("./uzb.png")} // Replace with actual flag image path
        />
        <Text style={styles.title}>UZ </Text>
      </View>
      <View style={styles.detailRow}>
        <RadioButton
          value="ru"
          status={
            selectedLang?.toLowerCase() === "ru" ? "checked" : "unchecked"
          }
          onPress={() => handleLangChange("ru")}
        />
        <Avatar
          rounded
          size="small" 
          source={require("./rus.png")}
        />
        <Text style={styles.title}>RU </Text>
      </View>
    </View>
  );
};

export default ChangeLang;

const styles = StyleSheet.create({
  detailCard: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    color: "#000",
    fontWeight: "700",
  },
});

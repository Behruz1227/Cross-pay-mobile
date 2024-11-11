import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import CenteredModal from "@/components/modal/modal-centered";
import { Colors } from "@/constants/Colors";
import { Image } from "react-native-elements";
import { langStore } from "@/helpers/stores/language/languageStore";

const InternetCheckModal = () => {
  const [isConnected, setIsConnected] = useState(true);
  const { langData } = langStore(); 
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Aloqani dastlabki bor kuzatish
    useEffect(() => {
      const unsubscribe = NetInfo.addEventListener((state) => {
        if (!state.isConnected) {
          setModalVisible(true);
          setIsConnected(false);
        } else {
          setModalVisible(false);
          setIsConnected(true);
        }
      });

      return () => {
        unsubscribe();
      };
    }, []);

  // Tugma bosilganda internetni yana tekshirish funksiyasi
  const handleRetry = () => {
    setIsLoading(true);
    NetInfo.fetch().then((state) => {
      if (!state.isConnected) {
        setModalVisible(true); // Internet yo'q bo'lsa modalni ochiq qoldiramiz
        setIsConnected(false);
        setIsLoading(false);
      } else {
        setModalVisible(false); // Internet bo'lsa modalni yopamiz
        setIsConnected(true);
        setIsLoading(false);
      }
    });
  };

  return (
    <>
      <CenteredModal
        btnRedText={
          isLoading ? (
            <ActivityIndicator size="small" color={Colors.light.primary} />
          ) : (
            langData?.MOBILE_RETRY || "Повторить проверку"
          )
        }
        btnWhiteText=""
        isFullBtn={true}
        oneBtn={true}
        isModal={modalVisible}
        onConfirm={() => {
          handleRetry();
        }}
        toggleModal={() => {}}
      >
        <View style={{}}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginVertical: 10,
            }}
          >
            <Image
              source={require("@/assets/images/no-wifi.svg")}
              style={{ width: 100, height: 100 }}
            />
          </View>
          <Text style={styles.modalText}>
            {langData?.MOBILE_INTERNET_PROBLEMS || "У вас проблемы с интернетом"}
          </Text>
        </View>
      </CenteredModal>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
});

export default InternetCheckModal;

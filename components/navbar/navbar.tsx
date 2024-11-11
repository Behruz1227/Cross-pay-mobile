import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, Pressable, TouchableOpacity, TouchableWithoutFeedback, Modal, Linking } from "react-native";
import { Avatar } from "react-native-elements";
import Feather from "@expo/vector-icons/Feather";
import { RootStackParamList } from "@/types/root/root";
import { NavigationProp } from "@react-navigation/native";
import { useFocusEffect, useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGlobalRequest } from "@/helpers/apifunctions/univesalFunc";
import {
  get_mee,
  seller_notification_count,
  terminal_notification_count,
} from "@/helpers/url";
import { MaterialIcons } from "@expo/vector-icons";
import CenteredModal from "../modal/modal-centered";
import { langStore } from "@/helpers/stores/language/languageStore";
type SettingsScreenNavigationProp = NavigationProp<RootStackParamList, "(tabs)">;

const Navbar = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const [url, setUrl] = useState("");
  const {langData} = langStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  useFocusEffect(
    useCallback(() => {
      const fetchRole = async () => {
        const storedRole = await AsyncStorage.getItem("role");
        if (storedRole === "ROLE_SELLER") {
          setUrl(seller_notification_count);
        } else if (storedRole === "ROLE_TERMINAL") {
          setUrl(terminal_notification_count);
        }
      };
      fetchRole();
    }, [])
  );

  const getCount = useGlobalRequest(url, "GET");
  const getMee = useGlobalRequest(get_mee, "GET");

  useFocusEffect(
    useCallback(() => {
      if (url) {
        getCount.globalDataFunc();
      }
    }, [url])
  );
  useFocusEffect(
    useCallback(() => {
        getMee.globalDataFunc();
    }, [])
  );

  const handleOutsidePress = () => {
    if (showSupport) {
      setShowSupport(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View >

      <View style={styles.container}>
        <Pressable onPress={() => navigation.navigate("(Seller)/(profile)/profile")}>
          <View style={styles.greetingContainer}>
            <Avatar
              rounded
              size="medium"
              overlayContainerStyle={{ backgroundColor: "lightgray" }}
              icon={{ name: "user", type: "font-awesome", color: "white" }}
            />
            <View style={styles.textContainer}>
              <Text style={styles.greetingText}>{getMee?.response?.managerFio ? getMee?.response?.managerFio : "-- --"}</Text>
              <Text style={styles.subText}>{getMee?.response?.phone ? `+${getMee?.response?.phone.replace(/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')}` : "-- --- -- --"}</Text>
            </View>
          </View>
        </Pressable>

        <View style={{ flexDirection: "row", gap: 8, paddingRight: 10 }}>
          <View style={{ position: "relative" }}>
            <TouchableOpacity onPress={() => setShowSupport(!showSupport)}>
              <MaterialIcons name="support-agent" size={25} color="black" />
            </TouchableOpacity>

            {showSupport && (
              <Modal
                transparent={true}
                visible={showSupport}
                onRequestClose={() => setShowSupport(false)}
              >
                <TouchableWithoutFeedback onPress={() => setShowSupport(false)}>
                  <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback>
                      <View style={styles.supportPopover}>
                        <TouchableOpacity onPress={() => Linking.openURL('mailto:Info@qrpay.uz')}>
                          <Text style={styles.supportText}>{langData?.MOBILE_EMAIL || "Elektron pochta"}: Info@qrpay.uz</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => Linking.openURL('tel:+998773088888')}>
                          <Text style={styles.supportText}>{langData?.MOBILE_TELEPHONE || "Телефон"}: +998 77 308 88 88</Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            )}
          </View>

          <View style={{ position: "relative" }}>
            {getCount.response > 0 && (
              <View
                style={{
                  position: "absolute",
                  width: 10,
                  height: 10,
                  backgroundColor: "red",
                  borderRadius: 50,
                  right: 2,
                }}
              ></View>
            )}
            <Text>
              <Feather
                onPress={() => navigation.navigate("(Seller)/notifications/notifications")}
                name="bell"
                size={24}
                color="black"
              />
            </Text>
          </View>
          <Feather
            onPress={openModal}
            name="log-out"
            size={24}
            color="black"
          />
        </View>
      </View>
        <CenteredModal
          btnRedText={langData?.MOBILE_CLOSE || "Закрывать"}
          btnWhiteText={langData?.MOBILE_CONTINUE || "Продолжить"}
          isFullBtn={true}
          isModal={isModalVisible}
          onConfirm={async () => {
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("role");
            await navigation.navigate("(welcome)/welcome");
            closeModal();
          }}
          toggleModal={closeModal}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
            {langData?.MOBILE_CONFIRM_LOGOUT || "Вы действительно собираетесь выйти из системы?"}
            </Text>
          </View>
        </CenteredModal>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
  },
  greetingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: 10,
  },
  greetingText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subText: {
    fontSize: 14,
    color: "gray",
  },
  supportPopover: {
    position: "absolute",
    top: 60,  // Adjusted to move the popover lower
    right: 20, // Adjusted to move it away from the right edge
    width: 250,  // Adjust the width as needed
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  supportText: {
    fontSize: 14,
    color: "gray",
    marginBottom: 7,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end", // Align to the right but give space for the popover to move inwards
    paddingRight: 20,  // Extra padding from the right edge
  },
  modalContent: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#f8f9fa",
    padding: 15,
    gap: 10,
  },
  modalText: {
    fontSize: 18,
    color: "#000",
    textAlign: "center",
  },
});

export default Navbar;

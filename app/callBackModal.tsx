import Buttons from "@/components/buttons/button";
import { useGlobalRequest } from "@/helpers/apifunctions/univesalFunc";
import { langStore } from "@/helpers/stores/language/languageStore";
import { SocketStore } from "@/helpers/stores/socket/socketStore";
import { cancel_payment, confirm_payment } from "@/helpers/url";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Alert } from "react-native";
import { ReactNativeModal } from "react-native-modal";

const { height, width } = Dimensions.get("window");

const CallBackModal: React.FC = () => {
  const {
    setSocketModal,
    socketModal,
    socketModalData,
    timer,
  } = SocketStore();
  const { langData } = langStore();
  const paymentCancel = useGlobalRequest(
    `${cancel_payment}${socketModalData?.id}`,
    "POST",
    {}
  );

  const paymentConfirm = useGlobalRequest(
    `${confirm_payment}${socketModalData?.id}`,
    "POST",
    {}
  );

  useEffect(() => {
    if (paymentCancel?.response) {
      Alert.alert("QR - Pay", langData?.MOBILE_PAYMENT_CANCELLED || "Платеж отменен.");
    } else if (paymentCancel?.error) {
      Alert.alert("QR - Pay", paymentCancel?.error);
    }
  }, [paymentCancel.response, paymentCancel.error]);

  useEffect(() => {
    if (paymentConfirm?.response) {
      Alert.alert("QR - Pay", langData?.MOBILE_PAYMENT_CONFIRMED || "Платеж подтвержден.");
    } else if (paymentConfirm?.error) {
      Alert.alert("QR - Pay", paymentConfirm?.error);
    }
  }, [paymentConfirm.response, paymentConfirm.error]);

  return (
    <View>
        <ReactNativeModal
          isVisible={socketModal}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          backdropColor="black"
          coverScreen={true}
          deviceHeight={height}
          deviceWidth={width}
          hasBackdrop={true}
          hideModalContentWhileAnimating={true}
          useNativeDriver={true}
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <View
              style={{
                width: "90%",
                backgroundColor: "white",
                borderRadius: 10,
                padding: 20,
              }}
            >
              <View
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginVertical: 5
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  {langData?.MOBILE_COMPLATE_PAYMENT || "Завершить платеж"}
                </Text>
                <Text style={{ color: "red", fontSize: 20, fontWeight: "700" }}>
                  {/* Timer logic here */}
                  {timer}
                </Text>
              </View>
              <View style={{borderColor: "#000", width: "100%", height: 1, borderWidth: 0.5, marginBottom: 10}} ></View>
              <View style={{ display: "flex", gap: 10 }}>
                <View style={{ display: "flex", gap: 10 }}>
                  <Text style={{ fontSize: 18, fontWeight: "600" }}>
                    {langData?.MOBILE_COMPANY_NAME || "Название компании"}:
                  </Text>
                  <Text style={{ fontSize: 15 }}>
                    {socketModalData?.merchant || "---"}
                  </Text>
                </View>
                <View style={{ display: "flex", gap: 10 }}>
                  <Text style={{ fontSize: 18, fontWeight: "600"  }}>
                    {langData?.MOBILE_CLIENT || "Клиент"}:
                  </Text>
                  <Text style={{ fontSize: 15 }}>
                    {socketModalData?.client || "---"}
                  </Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
                  <Text style={{ fontSize: 18, fontWeight: "600"  }}>
                    {langData?.MOBILE_AMOUNT || "Количество"}:
                  </Text>
                  <Text style={{ fontSize: 15 }}>
                    {socketModalData?.amount || "0"}  {langData?.MOBILE_UZS_SUM || "УЗС"}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  // alignItems: "center",
                  justifyContent: "space-around",
                  marginTop: 20,
                  gap: 10,
                }}
              >
                <Buttons
                  backgroundColor={"#e8e8e8"}
                  title={
                    paymentCancel.loading
                      ? langData?.MOBILE_LOADING || "Загрузка..."
                      : langData?.MOBILE_PAYMENT_CANCEL || "Отмена платежа"
                  }
                  textColor={"red"}
                  onPress={() => {
                    paymentCancel.globalDataFunc()
                    setTimeout(() => {
                      setSocketModal(false);
                    }, 2000);
                  }}
                />
                <Buttons
                  backgroundColor={"#e8e8e8"}
                  title={
                    paymentConfirm.loading
                      ? langData?.MOBILE_LOADING || "Загрузка..."
                      : langData?.MOBILE_COMPLATE_PAYMENT || "Подтверждение платежа"
                  }
                  textColor={"green"}
                  onPress={() => {
                    paymentConfirm.globalDataFunc()
                    setTimeout(() => {
                      setSocketModal(false);
                    }, 2000);
                  }}
                />
              </View>
            </View>
          </View>
        </ReactNativeModal>
    </View>
  );
};

export default CallBackModal;

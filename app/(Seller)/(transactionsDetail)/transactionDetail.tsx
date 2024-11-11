// TransactionDetail.tsx
import React, { useEffect, useState } from "react";
import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";
import OrderStore from "@/helpers/stores/order/orderStore";
import { TouchableOpacity } from "react-native-gesture-handler";
import CenteredModal from "@/components/modal/modal-centered";
import { useGlobalRequest } from "@/helpers/apifunctions/univesalFunc";
import { cancel_payment, confirm_payment } from "@/helpers/url";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/types/root/root";
import NavigationMenu from "@/components/navigationMenu/NavigationMenu"; // Adjusted path
import { Ionicons } from "@expo/vector-icons"; // For optional improvements
import ErrorBoundary from "@/components/ErrorBoundary"; // Import the ErrorBoundary component
import { RenderQRCode } from "@/components/QRgenerate";
import Buttons from "@/components/buttons/button";
import { Button } from "react-native-elements";
import { useAuthStore } from "@/helpers/stores/auth/auth-store";
import { langStore } from "@/helpers/stores/language/languageStore";

type TransactionDetailNavigationProp = NavigationProp<
  RootStackParamList,
  "(Seller)/(transactionsDetail)/transactionDetail"
>;

const TransactionDetail = () => {
  const { paymentDetail } = OrderStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleConfirm, setIsModalVisibleConfirm] = useState(false);
  const {langData} = langStore()
  const navigation = useNavigation<TransactionDetailNavigationProp>();

  // Initialize useGlobalRequest without executing immediately
  const paymentCancel = useGlobalRequest(
    `${cancel_payment}?ext_id=${paymentDetail?.transaction?.ext_id}`,
    "POST",
    {}
  );

  const paymentConfirm = useGlobalRequest(
    `${confirm_payment}${paymentDetail?.transaction?.id}`,
    "POST",
    {}
  );



  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);
  const openModalConfirm = () => setIsModalVisibleConfirm(true);
  const closeModalConfirm = () => setIsModalVisibleConfirm(false);



  useEffect(() => {
    if (paymentCancel?.response) {
      Alert.alert("QR - Pay",langData?.SUCCESS || "Успех", langData?.MOBILE_PAYMENT_CANCELLED || "Платеж отменен.");
      navigation.goBack();
    } else if (paymentCancel?.error?.message) {
      Alert.alert("QR - Pay",langData?.ERROR || "Ошибка", paymentCancel?.error?.message || langData?.MOBILE_PAYMENT_CANCELLED_ERROR || "Ошибка отмены платежа");
    }
  }, [paymentCancel.error, paymentCancel.response]);

  useEffect(() => {
    if (paymentConfirm?.response) {
      Alert.alert("QR - Pay",langData?.SUCCESS || "Успех", langData?.MOBILE_PAYMENT_CONFIRMED || "Платеж подтвержден.");
      navigation.goBack();
    } else if (paymentConfirm?.error?.message) {
      Alert.alert("QR - Pay",langData?.ERROR || "Ошибка", paymentConfirm?.error?.message || langData?.MOBILE_PAYMENT_CONFIRMED_ERROR || "Ошибка подтверждения платежа");
    }
  }, [paymentConfirm.error, paymentConfirm.response]);


  // Ensure paymentDetail and transaction are defined
  if (!paymentDetail || !paymentDetail?.transaction) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.noDataText}>{langData?.MOBILE_PAYMENT_DETAILS_MISSING || ""}</Text>
      </SafeAreaView>
    );
  }

  const handleCancelPayment = () => {
    // Optionally, add confirmation before cancelling
    paymentCancel.globalDataFunc(); // Trigger the cancellation request
    closeModal();
  };
  const handleConfirmPayment = () => {
    // Optionally, add confirmation before cancelling
    paymentConfirm.globalDataFunc(); // Trigger the cancellation request
    closeModalConfirm();
  };

  return (
    <SafeAreaView style={styles.outerContainer}>
      <View style={styles.navigationContainer}>
        <NavigationMenu name={langData?.MOBILE_PAYMENT_CHECK || "Проверка оплаты"} />
      </View>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <ScrollView style={styles.container}>
        <View style={styles.detailCard}>
          <View style={{ width: "100%", gap: 10 }}>
            <Text style={styles.title}>{langData?.MOBILE_COMPANY_NAME || "Название компании"}:</Text>
            <Text style={styles.desc}>
              {paymentDetail?.transaction?.sellerName || "-"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.title}>{langData?.MOBILE_CURRENCY || "Валюта"}:</Text>
            <Text style={styles.desc}>
              {paymentDetail?.transaction?.currency || "-"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.title}>{langData?.MOBILE_RATE || "Курс"}:</Text>
            <Text style={styles.desc}>
              {paymentDetail?.transaction?.rate || "-"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.title}>{langData?.MOBILE_STATUS || "Статус"}:</Text>
            <Text style={styles.desc}>
              {paymentDetail?.transaction?.paymentStatus || "-"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.title}>{langData?.MOBILE_TERMINAL_NUMBER || "Номер терминала"}:</Text>
            <Text style={styles.desc}>
              {paymentDetail?.transaction?.posId
                ? `${paymentDetail?.transaction?.posId}`
                : "-"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.title}>{langData?.MOBILE_CHECK_AMOUNT || "Сумма чека"}:</Text>
            <Text style={styles.desc}>
              {(paymentDetail?.transaction?.amount || 0).toLocaleString(
                "uz-UZ",
                { minimumFractionDigits: 2, maximumFractionDigits: 2 }
              )}{" "}
              {paymentDetail?.transaction?.currency || "UZS"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.title}>{langData?.MOBILE_DATE || "Дата"}:</Text>
            <Text style={styles.desc}>
              {paymentDetail?.transaction?.dateCreate
                ? paymentDetail?.transaction?.dateCreate.substring(0, 16)
                : "-"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.title}>{langData?.MOBILE_VALID_TIME || "Срок действия"}:</Text>
            <Text style={styles.desc}>
              {paymentDetail?.transaction?.validtil
                ? paymentDetail?.transaction?.validtil.substring(0, 16)
                : "-"}
            </Text>
          </View>

          <View style={styles.qrContainer}>
            <View style={{ paddingVertical: 10 }}>
              <Text style={styles.qrTextTop}>
                {`${langData?.MOBILE_QR_AMOUNT || "QR-сумма"}: ${(
                  paymentDetail?.transaction?.amount || 0
                ).toLocaleString("uz-UZ", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} ${paymentDetail?.transaction?.currency || "UZS"}`}
              </Text>
            </View>
            {/* Wrap QRCode with ErrorBoundary */}
            <ErrorBoundary>
              <RenderQRCode url={paymentDetail?.transaction?.url} />
            </ErrorBoundary>
            <Text style={styles.qrText}>
              {langData?.MOBILE_SCAN_QR || "Чтобы продолжить, отсканируйте этот QR-код."}
            </Text>
          </View>

          {/* <Pressable onPress={openModal}>
            <View style={styles.cancelPayment}>
              <Text style={styles.cancelPaymentText}>
              Отмена платежа
              </Text>
            </View>
          </Pressable> */}

          {/* <View
            style={{
              width: Platform.OS === "ios" ? "110%" : "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <Button
              loading={paymentCancel.loading}
              buttonStyle={{ backgroundColor: "red", paddingHorizontal: 16, borderRadius: 10 }}
              title={langData?.MOBILE_PAYMENT_CANCEL || "Отмена платежа"}
              onPress={openModal}
              
            />
            <Button
              loading={paymentConfirm.loading}
              buttonStyle={{ backgroundColor: "green", paddingHorizontal: 25, borderRadius: 10 }}
              title={langData?.MOBILE_PAYMENT_CONFIRM || "Подтвердить"}
              onPress={openModalConfirm}
            />
          </View> */}
        </View>

        <CenteredModal
          btnRedText={langData?.MOBILE_CLOSE || "Закрыть"}
          btnWhiteText={langData?.MOBILE_CONTINUE || "Продолжить"}
          isFullBtn={true}
          isModal={isModalVisible}
          onConfirm={handleCancelPayment}
          toggleModal={closeModal}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              {langData?.MOBILE_PAYMENT_CANCEL_CONFIRM || "Вы действительно собираетесь отменить этот платеж?"}
            </Text>
          </View>
        </CenteredModal>

        <CenteredModal
          btnRedText={langData?.MOBILE_CLOSE || "Закрыть"}
          btnWhiteText={langData?.MOBILE_CONTINUE || "Продолжить"}
          isFullBtn={true}
          isModal={isModalVisibleConfirm}
          onConfirm={handleConfirmPayment}
          toggleModal={closeModalConfirm}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              {langData?.MOBILE_PAYMENT_CONFIRM_CONFIRM || "Вы действительно собираетесь подтвердить этот платеж?"}
            </Text>
          </View>
        </CenteredModal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TransactionDetail;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  navigationContainer: {
    paddingTop: Platform.OS === "android" ? 35 : 0,
    padding: 16,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  detailCard: {
    alignItems: "center",
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
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 7,
    marginBottom: 20,
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
  qrContainer: {
    alignItems: "center",
    marginTop: 20,
    paddingVertical: 30,
  },
  qrText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
  },
  qrTextTop: {
    marginTop: 10,
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
  },
  cancelPayment: {
    width: "100%",
    paddingVertical: 10,
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ccc",
    marginTop: 10,
  },
  cancelPaymentText: {
    color: "red",
    fontSize: 17,
    fontWeight: "600",
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
  noDataText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 50,
  },
});

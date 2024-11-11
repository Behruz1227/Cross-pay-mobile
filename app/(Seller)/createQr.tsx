import { Colors } from "@/constants/Colors";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  Alert,
} from "react-native";
import { useGlobalRequest } from "@/helpers/apifunctions/univesalFunc";
import { createPayment, UserTerminalListGet } from "@/helpers/url";
import ErrorBoundary from "@/components/ErrorBoundary";
import { RenderQRCode } from "@/components/QRgenerate";
import { useAuthStore } from "@/helpers/stores/auth/auth-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { langStore } from "@/helpers/stores/language/languageStore";
import { Menu } from "react-native-paper";
import { Button } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";
import Navbar from "@/components/navbar/navbar";
import PhoneInput, { getCountryByCca2 } from "react-native-international-phone-number";
import { SocketStore } from "@/helpers/stores/socket/socketStore";

const CreateQr = () => {
  const [amount, setAmount] = useState("");
  const [terminalId, setTerminalId] = useState(0);
  const { langData } = langStore();
  const [phone, setPhone] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [Messageamount, setMessageAmount] = useState("");
  const [alertShown, setAlertShown] = useState(false);
  const [qrValue, setQrValue] = useState<any>(null);
  const { setSocketData, setSocketModalData, socketData, } = SocketStore()

  // Error states
  const [amountError, setAmountError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [terminalIdError, setTerminalIdError] = useState("");

  const paymentCreate = useGlobalRequest(
    createPayment,
    "POST",
    {
      amount: amount,
      phone: `7${phone.replace(/[^0-9]/g, "")}`,
      terminalId: terminalId,
      socketId: socketData?.id
    },
    "DEFAULT"
  );
  const terminalList = useGlobalRequest(UserTerminalListGet, "GET");

  useFocusEffect(
    useCallback(() => {
      terminalList.globalDataFunc();
      const fetchPhoneNumber = async () => {
        const number = await AsyncStorage.getItem("phoneNumber");
        setPhoneNumber(number || "");
      };
      fetchPhoneNumber();
    }, [])
  );

  useEffect(() => {
    if (paymentCreate.response && !alertShown) {
      setMessageAmount(amount);
      setQrValue(paymentCreate?.response ? paymentCreate?.response?.url : null);
      setAlertShown(true);
    } else if (paymentCreate.error && !alertShown) {
      setMessageAmount("0");
      Alert.alert("QR - Pay",paymentCreate.error);
      setQrValue(null);
      setAlertShown(true);
    }
  }, [paymentCreate.response, paymentCreate.error]);

  useEffect(() => {
    setAlertShown(false);
  }, [amount]);

  // Validate fields on submit
  const handleValidation = () => {
    let valid = true;
    if (!amount) {
      setAmountError("Amount is required");
      valid = false;
    } else {
      setAmountError("");
    }
    if (!phone) {
      if (phoneNumber === "77 308 8888" && phoneNumber.replace(/ /g, "").length !== 9) { 
        setPhoneError("Enter a valid phone number");
        valid = false;
      } else if (phoneNumber.replace(/ /g, "").length === 10) {
        setPhoneError("Enter a valid phone number");
        valid = false;
      }
    } else {
      setPhoneError("");
    }
    if (terminalId === 0) {
      setTerminalIdError("Select a terminal");
      valid = false;
    } else {
      setTerminalIdError("");
    }
    return valid;
  };

  const handleSubmit = () => {
    if (handleValidation()) {
      if (phoneNumber !== "77 308 8888") {
        paymentCreate.globalDataFunc();
      } else {
        setQrValue("eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIrOTk4OTkzMzkzMzAwIiwiaWF0IjoxNzI5NTE5MDkwLCJleHAiOjE4MTU5MTkwOTB9.KPFsBeSXDMTBKi1f157OYOAIyY_MiZEVXtJLh3rKMVIIv4D5TsPqSvRVAP9cgcERjRSQTPiEUz1G2fQs4_jq2g");
        setMessageAmount(amount);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Navbar />
      <ScrollView
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{
          paddingHorizontal: 16,
          marginBottom: 10,
          paddingBottom: 40,
        }}
      >
        <View>
          <View style={{ padding: 10 }}>
            <Text style={styles.label}>
              {langData?.MOBILE_TERMINAL || "Терминал"}
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                mode="dropdown"
                dropdownIconColor={Colors.light.primary}
                dropdownIconRippleColor={Colors.light.primary}
                style={[styles.picker, Platform.OS === 'ios' ? {height: 150} : null]}
                itemStyle={Platform.OS === 'ios' ? {height: 150} : null}
                selectedValue={terminalId}
                onValueChange={(itemValue: any) => setTerminalId(itemValue)}
              >
                <Picker.Item
                  label={langData?.MOBILE_SELECT_TERMINAL || "Выберите терминал"}
                  value={0}
                />
                {terminalList?.response?.map((terminal: any) => (
                  <Picker.Item
                    key={terminal.id}
                    label={terminal.name}
                    value={terminal.id}
                  />
                ))}
              </Picker>
            </View>
            {terminalIdError ? <Text style={styles.errorText}>{terminalIdError}</Text> : null}

            <Text style={styles.label}>
              {langData?.MOBILE_ENTER_PHONE_NUMBER || "Введите номер телефона"}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <PhoneInput
              placeholder={langData?.MOBILE_PHONE_PLASEHOLDER || "Введите номер телефона"}
                selectedCountry={getCountryByCca2(phoneNumber === "77 308 8888" ? "UZ" : "RU")} 
                value={phone}
                onChangePhoneNumber={(text) => {
                  setPhone(text);
                }}
                onChangeSelectedCountry={(country) => {
                  // Handle country change if needed
                }}
              />
            </View>
            {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

            <Text style={styles.label}>
              {langData?.MOBILE_ENTER_AMOUNT || "Введите сумму"}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                style={[styles.amountInput, { flex: 1 }]}
                value={amount}
                onChangeText={(text) => setAmount(text.replace(/[^0-9]/g, ""))}
                keyboardType="numeric"
            />
              <Text style={{ marginLeft: 10, fontSize: 25 }}>
                {langData?.MOBILE_UZS || "сум"}
              </Text>
            </View>

            {amountError ? <Text style={styles.errorText}>{amountError}</Text> : null}

            {qrValue ? (
              <View style={styles.qrContainer}>
                <View style={{ paddingVertical: 10 }}>
                  <Text style={styles.qrTextTop}>
                    {`${langData?.MOBILE_QR_AMOUNT || "QR-сумма"}: ${Messageamount || "0"} ${"UZS"}`}
                  </Text>
                </View>
                <ErrorBoundary>
                  <RenderQRCode url={qrValue || null} />
                </ErrorBoundary>
                <Text style={styles.qrText}>
                  {langData?.MOBILE_SCAN_QR || "Отсканируйте этот QR-код, чтобы продолжить"}
                </Text>
              </View>
            ) : null}
          </View>
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSubmit}
          >
            <Text style={styles.sendButtonText}>
              {paymentCreate.loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                langData?.MOBILE_CREATE_PAYMENT || "Создать платеж"
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: Platform.OS === 'android' ? 35 : 0,
  },
  label: {
    fontSize: 16,
  },
  amountInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 20,
    marginTop: 8,
    height: 50,
  },
  sendButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 60,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 4,
  },
  qrContainer: {
    alignItems: "center",
    paddingVertical: 30,
  },
  qrText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
  },
  qrTextTop: {
    marginTop: 10,
    fontSize: 26,
    textAlign: "center",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    borderRadius: 10,
    marginVertical: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
    width: "100%",
  },
});

export default CreateQr;

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Alert,
  Keyboard,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  KeyboardAvoidingView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";
import { NavigationProp, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { useAuthStore } from "@/helpers/stores/auth/auth-store";
import { langStore } from "@/helpers/stores/language/languageStore";
import { useGlobalRequest } from "@/helpers/apifunctions/univesalFunc";
import { loginUrl, sendCodeUrl } from "@/helpers/url";
import { Colors } from "@/constants/Colors";
import NavigationMenu from "@/components/navigationMenu/NavigationMenu";
import { RootStackParamList } from "@/types/root/root";

type SettingsScreenNavigationProp = NavigationProp<
  RootStackParamList,
  "(auth)/login"
>;

const CheckCode = () => {
  const { phoneNumber } = useAuthStore();
  const navigation = useNavigation<SettingsScreenNavigationProp>();

  const [code, setCode] = useState<string[]>(Array(4).fill("")); // 4 ta bo'sh qiymat
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<TextInput[]>([]);
  const [response, setResponse] = useState<any>({});

  const checkCode = useGlobalRequest(loginUrl, "POST", {
    phone: "998" + phoneNumber.replace(/\s/g, ""),
    code: +code.join(""),
  });

  const sendCode = async () => {
    try {
      await axios.post(sendCodeUrl, { phone: `998${phoneNumber.replace(/\s/g, "")}` });
      Alert.alert(
        "QR - Pay",
        Platform.OS === "ios"
          ? "Код повторно отправлен. Проверьте SMS на своем устройстве."
          : "Код отправлен повторно. Подтверждение кода будет обработано автоматически."
      );
      setTimer(60);
    } catch {
      Alert.alert("QR - Pay", "Ошибка при отправке кода");
    }
  };

  const handleInputChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    } else if (!text && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendCode = () => {
    if (canResend) {
      setCanResend(false);
      sendCode();
    }
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  useFocusEffect(
    useCallback(() => {
      if (checkCode.response) {
        setResponse(checkCode.response);
      } else if (checkCode.error) {
        Alert.alert("QR - Pay", checkCode.error.message || "Ошибка проверки кода");
      }
    }, [checkCode.response, checkCode.error])
  );

  useEffect(() => {
    if (response?.token) {
      AsyncStorage.setItem("token", response.token);
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 5);
      AsyncStorage.setItem("deadline", deadline.toISOString().split("T")[0]);
      AsyncStorage.setItem("role", response.role);

      if (response.role === "ROLE_SUPER_ADMIN") {
        Alert.alert("QR - Pay", "Вы не можете войти в приложение");
      } else {
        navigation.navigate('(auth)/login');
      }
      setResponse({});
    }
  }, [response]);

  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      checkCode.globalDataFunc();
    }
  }, [code]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <View style={styles.navigationContainer}>
            <NavigationMenu name="" />
          </View>
          <View style={{ marginTop: 50 }}>
            <Text style={styles.title}>Подтверждение номера</Text>
            <Text style={[styles.title, { fontWeight: "500", marginTop: 30 }]}>
              +998 {phoneNumber}
            </Text>
            <Text style={styles.des}>
              {Platform.OS === "ios"
                ? "Введите код подтверждения, полученный по SMS."
                : "Код автоматически будет обработан."}
            </Text>
            <View style={styles.inputContainer}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  value={digit}
                  onChangeText={(text) => handleInputChange(text, index)}
                  maxLength={1}
                  keyboardType="numeric"
                  style={styles.input}
                  ref={(el) => {
                    if (el) {
                      inputRefs.current[index] = el;
                    }
                  }}
                />
              ))}
            </View>
            <View style={styles.resendContainer}>
              <TouchableOpacity
                onPress={handleResendCode}
                disabled={!canResend}
                style={[
                  styles.resendButton,
                  { backgroundColor: canResend ? Colors.dark.primary : "#ccc" },
                ]}
              >
                <Text style={{ color: "white" }}>Отправить код повторно</Text>
              </TouchableOpacity>
              {!canResend && (
                <Text style={styles.timerText}>Отправить повторно {timer} с</Text>
              )}
            </View>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default CheckCode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
  },
  navigationContainer: {
    paddingTop: Platform.OS === "android" ? 35 : 0,
    padding: 16,
  },
  title: {
    fontSize: 25,
    textAlign: "center",
  },
  des: {
    fontSize: 16.5,
    color: "#828282",
    textAlign: "center",
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    width: 65,
    height: 65,
    textAlign: "center",
    fontSize: 20,
    marginHorizontal: 5,
    borderRadius: 10,
    color: Colors.dark.primary,
  },
  resendContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  resendButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  timerText: {
    fontSize: 14,
    color: "#828282",
    marginTop: 5,
  },
});

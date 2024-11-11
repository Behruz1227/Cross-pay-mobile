import {
  Keyboard,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/helpers/stores/auth/auth-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "expo-router";
import { RootStackParamList } from "@/types/root/root";
import { NavigationProp } from "@react-navigation/native";
import { loginUrl, sendCodeUrl } from "@/helpers/url";
import { useGlobalRequest } from "@/helpers/apifunctions/univesalFunc";
import { Colors } from "@/constants/Colors";
import NavigationMenu from "@/components/navigationMenu/NavigationMenu";
import axios from "axios";
import { Alert } from "react-native";

type SettingsScreenNavigationProp = NavigationProp<
  RootStackParamList,
  "(auth)/checkCode"
>;

const CheckCode = () => {
  const { phoneNumber } = useAuthStore();
  const [code, setCode] = useState<string[]>(["", "", "", ""]);
  const [canResend, setCanResend] = useState(false); // Resend state
  const [timer, setTimer] = useState(120); // 2 minutes timer
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [response, setResponse] = useState<any>({});

  const userData = {
    phone: `998${phoneNumber.split(" ").join("")}`,
  };

  const checkCode = useGlobalRequest(loginUrl, "POST", {
    phone: "998" + phoneNumber.split(" ").join(""),
    code: +code.join(""),
  });

  const sendCode = async () => {
    if (phoneNumber) {
      await axios
        .post(`${sendCodeUrl}`, userData)
        .then((res) => {
          if (res.data.data) navigation.navigate("(auth)/checkCode");
          else if (res.data.error && res.data.error.message)
            Alert.alert("QR - Pay",res.data.error.message);
        })
        .catch((err) => {
          Alert.alert("QR - Pay","произошла ошибка");
        });
    }
  };

  

  const handleInputChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    if (text === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendCode = () => {
    if (canResend) {
      setCanResend(false);
      setTimer(120); // Reset timer
      // Kodni qayta yuborish uchun API chaqirig'i kiritiladi
      sendCode() 
    }
  };

  // Timer logic
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
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
        Alert.alert("QR - Pay",checkCode.error?.message);
      }
    }, [checkCode.response, checkCode.error])
  );
 
  
  useFocusEffect(
    useCallback(() => {
      if (response && response?.token) {
        AsyncStorage.setItem("token", response?.token ? response?.token : null);
        AsyncStorage.setItem("role", response?.role ? response?.role : null);
        if (response?.role === "ROLE_SUPER_ADMIN") {
          Alert.alert("QR - Pay","Вы не можете войти в приложение");
        } else {
          navigation.navigate("(tabs)");
        }
        setResponse({});
      }
    }, [response])
  );

  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      checkCode.globalDataFunc();
    }
  }, [code]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.navigationContainer}>
          <NavigationMenu name="" />
        </View>
        <View style={{ marginTop: 50 }}>
          {/* <Text style={styles.title}>Confirmation number</Text> */}
          <Text style={styles.title}>Подтверждение номера</Text>
          <Text style={[styles.title, { fontWeight: "500", marginTop: 30 }]}>
            +998 {phoneNumber}
          </Text>
          {/* <Text style={styles.des}>
            We will send you an SMS with a confirmation code.
          </Text> */}
          <Text style={styles.des}>
            Мы отправим вам SMS с кодом подтверждения.
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              marginTop: 40,
            }}
          >
            {code.map((digit, index) => (
              <TextInput
                key={index}
                value={digit}
                onChangeText={(text) => handleInputChange(text, index)}
                maxLength={1}
                keyboardType="numeric"
                style={styles.input}
                ref={(el) => (inputRefs.current[index] = el)} // Assigning refs
                returnKeyType="next"
              />
            ))}
          </View>

          {/* Resend Code Section */}
          <View style={{ marginTop: 30, alignItems: "center" }}>
            <TouchableOpacity
              onPress={handleResendCode}
              disabled={!canResend}
              style={[
                styles.resendButton,
                { backgroundColor: canResend ? Colors.dark.primary : "#ccc" },
              ]}
            >
              {/* <Text style={{ color: "white" }}>Resend code again</Text> */}
              <Text style={{ color: "white" }}>Отправить код повторно</Text>
            </TouchableOpacity>
            {!canResend && (
              // <Text style={styles.timerText}>Resend code again {timer} s</Text>
              <Text style={styles.timerText}>Отправить повторно {timer} с</Text>
            )}
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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

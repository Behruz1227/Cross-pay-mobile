import {
  BackHandler,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Buttons from "@/components/buttons/button";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/types/root/root";
import { useAuthStore } from "@/helpers/stores/auth/auth-store";
import { useFocusEffect } from "expo-router";
import { sendCodeUrl } from "@/helpers/url";
import { Colors } from "@/constants/Colors";
import axios from "axios";
import { CheckBox } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PhoneInput, { getCountryByCca2 } from "react-native-international-phone-number";
import { Alert } from "react-native";

type SettingsScreenNavigationProp = NavigationProp<
  RootStackParamList,
  "(auth)/login"
>;

const Login = () => {
  const { phoneNumber, setPhoneNumber } = useAuthStore();
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const [backPressCount, setBackPressCount] = useState(0);
  const [policy, setPolicy] = useState(false);
  
  const userData = {
    phone: `998${phoneNumber.replace(/ /g, "")}`,
  };
  // const loginUser = useGlobalRequest(`${sendCodeUrl}`, "POST", userData);
  const loginUser = async () => {
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

  const [isPhoneNumberComplete, setIsPhoneNumberComplete] = useState(false); // New state to track phone number completeness

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (backPressCount === 0) {
          setBackPressCount(backPressCount + 1);
          // Toast.show('Orqaga qaytish uchun yana bir marta bosing', Toast.SHORT);
          setTimeout(() => {
            setBackPressCount(0);
          }, 2000); // 2 soniya ichida ikkinchi marta bosilmasa, holatni qayta boshlaydi
          return true; // Orqaga qaytishni bloklaydi
        } else {
          BackHandler.exitApp(); // Ilovadan chiqish
          return false;
        }
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [backPressCount])
  );

  useEffect(() => {
    setIsPhoneNumberComplete(phoneNumber.replace(/ /g, "").length === 9);
  }, [phoneNumber]);

  function loginuser() {
    if (isPhoneNumberComplete) {
      loginUser();
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        {/* <NavigationMenu name='' /> */}
        <View style={{ marginTop: 50 }}>
          {/* <Text style={styles.title}>Enter your phone number</Text> */}
          <Text style={styles.title}>Ваш номер телефона</Text>
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
              marginTop: 20,
            }}
          >
            {/* <View style={styles.phoneCard}>
              <Text style={{ fontSize: 17, color: "gray" }}>+998</Text>
            </View>
            <View style={{ width: "69%" }}>
              <TextInput
                style={styles.phoneInput}
                placeholder="Номер телефона"
                value={phoneNumber}
                keyboardType="numeric"
                onChangeText={(text) => formatPhoneNumber(text)}
                maxLength={12}
                placeholderTextColor={"gray"}
              />
            </View> */}
            <PhoneInput
            placeholder="Введите номер телефона"
              onChangeSelectedCountry={(country) => {
                // Handle country change if needed
              }}
              onChangePhoneNumber={(text) => setPhoneNumber(text)}
              value={phoneNumber}
              selectedCountry={getCountryByCca2("UZ")}
            />  
          </View>
          <View style={styles.containerPrifacy}>
            <CheckBox
              checked={policy}
              onPress={() => setPolicy(!policy)}
              checkedColor="#000" // Checkbox ranglari
              containerStyle={styles.checkboxContainer}
            />
            <View>
                {/* <Text style={styles.text}>By logging in, you agree to our</Text> */}
                <Text style={styles.text}>Авторизуясь, вы соглашаетесь с </Text>
              <TouchableOpacity
              style={{ display: "flex", alignItems: "center"}}
                onPress={() => navigation.navigate("(Seller)/(shartlar)/PrivacyTermsPage")}
              >
                {/* <Text style={styles.link}>
                 Terms of use and Privacy Policy.
                </Text> */}
                <Text style={styles.link}>
                 Условиями использования и Политикой конфиденциальности.
                </Text>
              </TouchableOpacity>
              <Text>
                
              </Text>
            </View>
          </View>

        </View>
        {isPhoneNumberComplete && (
          <View
            style={{
              position: "absolute",
              width: "100%",
              bottom: 0,
              marginBottom: 25,
              alignSelf: "center",
            }}
          >
            <Buttons
            isDisebled={policy}
              title={"Войти"}
              onPress={() => loginuser()}
              //   loading={sendCode.loading || userFound.loading}
            />
          </View>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
    position: "relative",
  },
  title: {
    fontSize: 25,
    color: "#000",
    textAlign: "center",
  },
  des: {
    fontSize: 15,
    color: "#828282",
    textAlign: "center",
    marginTop: 10,
  },
  phoneCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    width: "29%",
    shadowColor: Colors.dark.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  phoneInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    paddingVertical: 15,
    paddingHorizontal: 15,
    color: "#000",
    fontSize: 17,
    shadowColor: Colors.dark.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 17,
    color: "#000",
  },
  checkboxContainer: {
    marginTop: -15,
  //   padding: 0,
  //   margin: 0,
  },
  text: {
    fontWeight: '400',
    fontSize: 14,
    color: '#000', // textColorDetails
    // display: "flex",
    // flexDirection: "column",
  },
  link: {
    color: '#007AFF', // textColorBrand
    fontWeight: '500',
  },

  containerPrifacy: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "flex-start",
    maxWidth: '100%',
    marginVertical: 20,
  },
});

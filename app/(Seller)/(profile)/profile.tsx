import React, { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons"; // For password visibility icon
import CenteredModal from "@/components/modal/modal-centered";
import NavigationMenu from "@/components/navigationMenu/NavigationMenu";
import { useGlobalRequest } from "@/helpers/apifunctions/univesalFunc";
import { get_mee, update_profile } from "@/helpers/url"; // Ensure you have an update_profile URL
import { Colors } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ChangeLang from "./changeLang";
import { langStore } from "@/helpers/stores/language/languageStore";
import { getCountryByCca2 } from "react-native-international-phone-number";
import PhoneInput from "react-native-international-phone-number";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

// Define the shape of the profile data
interface ProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  inn: string;
  filial_code: string;
  password: string;
}

// Define the shape of errors
interface ProfileErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  inn?: string;
  filial_code?: string;
  password?: string;
}

const Profile: React.FC = () => {
  const { langData } = langStore();
  const [modal, setModal] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);
  const [defaultPhone, setDefaultPhone] = useState<string>("");

  useFocusEffect(
    useCallback(() => {
      const getRole = async () => {
        const roleValue = await AsyncStorage.getItem("role");
        setRole(roleValue);
      };
      getRole();
    }, [])
  );

  const getMee = useGlobalRequest<ProfileData>(get_mee, "GET");

  const [formData, setFormData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    inn: "",
    filial_code: "",
    password: "12345",
  });

  const updateProfile = useGlobalRequest<any>(
    update_profile,
    "PUT",
    {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: `998${formData?.phone?.replace(/[^0-9]/g, "")}`,
      email: formData.email,
      inn: formData.inn || null,
      filial_code: formData.filial_code || null,
      password: formData.password,
    },
    "DEFAULT"
  ); // Adjust the type as per your API response

  const [errors, setErrors] = useState<ProfileErrors>({});
  const openModal = () => {
    setFormData({
      firstName: getMee?.response?.firstName || "",
      lastName: getMee?.response?.lastName || "",
      phone: getMee?.response?.phone?.substring(3) || "",
      email: getMee?.response?.email || "",
      inn: getMee?.response?.inn || "",
      filial_code: getMee?.response?.filial_code || "",
      password: "12345",
    });
    // console.log(getMee.response);

    setDefaultPhone(getMee?.response?.phone || "");
    setErrors({});
    setModal(true);
  };  

  const closeModal = () => setModal(false);

  // Fetch profile data when the screen is focused
  useFocusEffect(
    useCallback(() => {
      getMee.globalDataFunc();
    }, [])
  );

  useEffect(() => {
    if (updateProfile.response) {
      Alert.alert(
        langData?.SUCCESS || "Успех",
        langData?.PROFILE_UPDATED || "Профиль успешно обновлен."
      );
      closeModal();
      getMee.globalDataFunc(); // Refresh profile data
      AsyncStorage.setItem("token", updateProfile.response);
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 5);
      const formattedDeadline = deadline.toISOString().split("T")[0];
      AsyncStorage.setItem("deadline", formattedDeadline);
    } else if (updateProfile.error) {
      Alert.alert(
        langData?.ERROR || "Ошибка",
        langData?.PROFILE_UPDATE_ERROR ||
          "Произошла ошибка при обновлении профиля."
      );
    }
  }, [updateProfile.response, updateProfile.error]);

  const handleInputChange = (name: keyof ProfileData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // }
  };

  // Validate the formn
  const validate = (): boolean => {
    const newErrors: ProfileErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = langData?.NAME_REQUIRED || "Требуется имя";
    if (!formData.lastName.trim())
      newErrors.lastName = langData?.SURNAME_REQUIRED || "Требуется фамилия";
    if (!formData.phone.trim()) {
      newErrors.phone = langData?.PHONE_REQUIRED || "Требуется номер телефона";
    } else if (formData.phone.length !== 11) {
      newErrors.phone =
        langData?.PHONE_INVALID || "Номер телефона должен состоять из 9 цифр.";
    }
    if (!formData.email.trim()) {
      newErrors.email =
        langData?.EMAIL_REQUIRED || "Требуется электронная почта";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email =
        langData?.EMAIL_INVALID || "Неверный формат электронной почты";
    }
    if (role !== "ROLE_TERMINAL") {
      if (!formData.inn.trim())
        newErrors.inn = langData?.INN_REQUIRED || "ИНН обязателен";
      if (!formData.filial_code.trim())
        newErrors.filial_code =
          langData?.PARTNER_CODE_REQUIRED || "Требуется МФО";
    }
    // Password is optional; no validation unless you want to enforce certain rules
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validate()) {
      Alert.alert(
        langData?.ERROR || "Ошибка",
        langData?.PLEASE_FILL_ALL_FIELDS || "Пожалуйста, заполните все поля"
      );
      return;
    }

    await updateProfile.globalDataFunc();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.containerView}>
        <View style={styles.navigationContainer}>
          <NavigationMenu name={langData?.PROFILE || "Профиль"} />
        </View>
        <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.detailCard}>
            <View
              style={{
                // justifyContent: "space-between",

                width: "100%",
                // paddingVertical: 20,
                // position: "relative",
              }}
            >
              <View
                style={{
                  alignItems: "flex-end",
                  width: "100%",
                  position: "absolute",
                  right: 0,
                  // paddingVertical: 20,
                  // backgroundColor: "#000",
                  // position: "relative",
                }}
              >
                <Pressable  onPress={openModal}>
                  <MaterialIcons
                    style={{ color: Colors.dark.primary }}
                    name="edit-square"
                    size={30}
                  />
                </Pressable>
              </View>
            </View>
            <View style={styles.avatarContainer}>
              <Avatar
                rounded
                size="large"
                overlayContainerStyle={{ backgroundColor: "lightgray" }}
                icon={{ name: "user", type: "font-awesome", color: "white" }}
              />
            </View>

            {/* Profile Details */}
            <View style={styles.detailRow}>
              <Text style={styles.title}>
                {langData?.MOBILE_NAME || "Имя"}:
              </Text>
              <Text style={styles.desc}>
                {getMee?.response?.firstName || "--"}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.title}>
                {langData?.MOBILE_SURNAME || "Фамилия"}:
              </Text>
              <Text style={styles.desc}>
                {getMee?.response?.lastName || "--"}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.title}>
                {langData?.MOBILE_TELEPHONE || "Номер телефона"}:{" "}
              </Text>
              <Text style={styles.desc}>
                {getMee?.response?.phone
                  ? `+${getMee?.response?.phone?.replace(
                      /(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/,
                      "$1 $2 $3 $4 $5"
                    )}`
                  : "--"}
              </Text>
            </View>

            {role !== "ROLE_TERMINAL" && (
              <>
                <View style={styles.detailRow}>
                  <Text style={styles.title}>
                    {langData?.MOBILE_INN || "ИНН"}:{" "}
                  </Text>
                  <Text style={styles.desc}>
                    {getMee?.response?.inn || "--"}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.title}>
                    {langData?.MOBILE_MFO || "МФО"}:{" "}
                  </Text>
                  <Text style={styles.desc}>
                    {getMee?.response?.filial_code || "--"}
                  </Text>
                </View>
              </>
            )}
            <View style={styles.detailRow}>
              <Text style={styles.title}>
                {langData?.MOBILE_EMAIL || "Электронная почта"}:{" "}
              </Text>
              <Text style={styles.desc}>{getMee?.response?.email?.replace(/^(\w{2}).*?(\d{2}@.*)$/, '$1...$2') || "--"}</Text>
            </View>
          </View>
          <ChangeLang />

          {/* Edit Profile Modal */}
          <CenteredModal
            btnRedText={langData?.MOBILE_CANCEL || "Отмена"}
            btnWhiteText={
              updateProfile.loading
                ? langData?.MOBILE_LOADING || "Загрузка..."
                : langData?.MOBILE_SAVE || "Сохранять"
            }
            isFullBtn={true}
            isModal={modal}
            onConfirm={handleSubmit}
            toggleModal={closeModal}
            // disableWhiteButton={submitinng}
          >
            <ScrollView style={{ width: "100%" }}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  {langData?.MOBILE_EDIT_PROFILE || "Редактировать профиль"}
                </Text>
                <Text style={{ fontSize: 15, paddingVertical: 3 }}>
                  {langData?.MOBILE_NAME || "Имя"}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={langData?.MOBILE_NAME || "Имя"}
                  value={formData.firstName}
                  maxLength={40}
                  onChangeText={(text) => handleInputChange("firstName", text)}
                />
                {errors.firstName && (
                  <Text style={styles.errorText}>{errors.firstName}</Text>
                )}

                <Text style={{ fontSize: 15, paddingVertical: 3 }}>
                  {langData?.MOBILE_SURNAME || "Фамилия"}
                </Text>
                <TextInput
                  style={styles.input}
                  maxLength={40}
                  placeholder={langData?.MOBILE_SURNAME || "Фамилия"}
                  value={formData.lastName}
                  onChangeText={(text) => handleInputChange("lastName", text)}
                />
                {errors.lastName && (
                  <Text style={styles.errorText}>{errors.lastName}</Text>
                )}

                <Text style={{ fontSize: 15, paddingVertical: 3 }}>
                  {langData?.MOBILE_TELEPHONE || "Номер телефона"}
                </Text>

                <PhoneInput
                  placeholder={
                    langData?.MOBILE_PHONE_PLASEHOLDER ||
                    "Введите номер телефона"
                  }
                  onChangeSelectedCountry={(country) => {
                    // Handle country change if needed
                  }}
                  defaultValue={`+${defaultPhone}`}
                  selectedCountry={getCountryByCca2("UZ")}
                  value={formData.phone || ""}
                  onChangePhoneNumber={(text) =>
                    handleInputChange("phone", text)
                  }
                />
                {/* </View> */}

                {errors.phone && (
                  <Text style={styles.errorText}>{errors.phone}</Text>
                )}

                <Text style={{ fontSize: 15, paddingVertical: 3 }}>
                  {langData?.MOBILE_EMAIL || "Электронная почта"}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={langData?.MOBILE_EMAIL || "Электронная почта"}
                  keyboardType="email-address"
                  value={formData.email}
                  maxLength={50}
                  onChangeText={(text) => handleInputChange("email", text)}
                  autoCapitalize="none"
                />
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}

                {role !== "ROLE_TERMINAL" && (
                  <>
                    <Text style={{ fontSize: 15, paddingVertical: 3 }}>
                      {langData?.MOBILE_INN || "ИНН"}
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder={langData?.MOBILE_INN || "ИНН"}
                      value={formData.inn}
                      keyboardType="numeric"
                      maxLength={14}
                      onChangeText={(text) =>
                        handleInputChange("inn", text?.replace(/[^0-9]/g, ""))
                      }
                    />
                    {/* <Text style={{fontSize: 13}}>{langData?.VALIDATE_INN || "Пусть ИНН состоит только из цифр"}</Text> */}

                    {errors.inn && (
                      <Text style={styles.errorText}>{errors.inn}</Text>
                    )}

                    <Text style={{ fontSize: 15, paddingVertical: 3 }}>
                      {langData?.MOBILE_MFO || "МФО"}
                    </Text>
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      placeholder={langData?.MOBILE_MFO || "МФО"}
                      value={formData.filial_code}
                      maxLength={10}
                      onChangeText={(text) =>
                        handleInputChange(
                          "filial_code",
                          text?.replace(/[^0-9]/g, "")
                        )
                      }
                    />
                    {/* <Text style={{fontSize: 13}}>{langData?.VALIDATE_MFO || "Пусть МФО состоит только из цифр"}</Text> */}

                    {errors.filial_code && (
                      <Text style={styles.errorText}>{errors.filial_code}</Text>
                    )}
                  </>
                )}
              </View>
            </ScrollView>
          </CenteredModal>
        </ScrollView>
        {/* Loading Indicator */}
        {updateProfile.loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={Colors.light.primary} />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Profile;

// Styles
const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
  },
  navigationContainer: {
    paddingTop: 35,
  },
  scrollView: {
    paddingVertical: 20,
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
  avatarContainer: {
    // backgroundColor: "#000",
    justifyContent: "center",
    // paddingVertical: 20,
    position: "relative",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  editButtonText: {
    color: "red",
    fontSize: 17,
    fontWeight: "600",
  },
  detailRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 7,
    marginBottom: 5,
  },
  title: {
    fontSize: 17,
    color: "#000",
    fontWeight: "700",
  },
  desc: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.dark.primary,
  },
  modalContent: {
    // padding: 20,
    // backgroundColor: "#fff",
    borderRadius: 10,
    width: "100%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    // flex: 1,
    width: "100%",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingRight: 10,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    height: "100%",
    bottom: -5,
  },
  eyeIcon: {
    padding: 5,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    fontSize: 12,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
});

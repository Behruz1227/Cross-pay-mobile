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
import { FontAwesome } from "@expo/vector-icons"; // For password visibility icon
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

// Define the shape of the profile data
interface ProfileData {
  managerFio: string;
  phone: string;
  email: string;
  tin: string;
  bankBik: string;
  password: string;
}

// Define the shape of errors
interface ProfileErrors {
  managerFio?: string;
  phone?: string;
  email?: string;
  tin?: string;
  bankBik?: string;
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
    managerFio: "",
    phone: "",
    email: "",
    tin: "",
    bankBik: "",
    password: "12345",
  });


  const updateProfile = useGlobalRequest<any>(update_profile, "PUT", {
    managerFio: formData.managerFio,
    phone: `998${formData.phone.replace(/[^0-9]/g, "")}`,
    email: formData.email,
    tin: formData.tin,
    bankBik: formData.bankBik,
    password: formData.password || null,
  }); // Adjust the type as per your API response

  const [errors, setErrors] = useState<ProfileErrors>({});
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Open the modal and initialize form data

  const openModal = () => {
    setFormData({
      managerFio: getMee?.response?.managerFio || "",
      phone: getMee?.response?.phone?.substring(3) || "",
      email: getMee?.response?.email || "",
      tin: getMee?.response?.tin || "",
      bankBik: getMee?.response?.bankBik || "",
      password: "12345",
    });
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
      AsyncStorage.setItem("token", updateProfile.response);
    }
  }, [updateProfile.response]);

  // Handle input changes
  const handleInputChange = (name: keyof ProfileData, value: string) => {
    // if (name === "phone") {
    //     const formattedValue = formatPhoneNumber(value);
    //     setFormData((prev) => ({
    //         ...prev,
    //         [name]: formattedValue,
    //     }));
    // } else {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // }
  };

  // Validate the formn
  const validate = (): boolean => {
    const newErrors: ProfileErrors = {};
    if (!formData.managerFio.trim())
      newErrors.managerFio = langData?.NAME_REQUIRED || "Требуется имя";
    if (!formData.phone.trim()) {
      newErrors.phone = langData?.PHONE_REQUIRED || "Требуется номер телефона";
    } else if (!/^\d{9}$/.test(formData.phone)) {
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
      if (!formData.tin.trim())
        newErrors.tin = langData?.INN_REQUIRED || "ИНН обязателен";
      if (!formData.bankBik.trim())
        newErrors.bankBik = langData?.PARTNER_CODE_REQUIRED || "Требуется МФО";
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

    setSubmitting(true);

    try {
      await updateProfile.globalDataFunc();

      Alert.alert(
        langData?.SUCCESS || "Успех",
        langData?.PROFILE_UPDATED || "Профиль успешно обновлен."
      );
      closeModal();
      getMee.globalDataFunc(); // Refresh profile data
    } catch (error) {
      Alert.alert(
        langData?.ERROR || "Ошибка",
        langData?.PROFILE_UPDATE_ERROR ||
          "Произошла ошибка при обновлении профиля."
      );
    } finally {
      setSubmitting(false);
    }
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
            <View style={styles.avatarContainer}>
              <Avatar
                rounded
                size="xlarge"
                overlayContainerStyle={{ backgroundColor: "lightgray" }}
                icon={{ name: "user", type: "font-awesome", color: "white" }}
              />
            </View>
            <Pressable onPress={openModal}>
              <View style={styles.editButton}>
                <Text style={styles.editButtonText}>
                  {langData?.MOBILE_EDIT_PROFILE || "Редактировать профиль"}
                </Text>
              </View>
            </Pressable>
            {/* Profile Details */}
            <View style={styles.detailRow}>
              <Text style={styles.title}>
                {langData?.MOBILE_NAME || "Ф.И.О"}:{" "}
              </Text>
              <Text style={styles.desc}>
                {getMee?.response?.managerFio || "--"}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.title}>
                {langData?.MOBILE_TELEPHONE || "Номер телефона"}:{" "}
              </Text>
              <Text style={styles.desc}>
                {getMee?.response?.phone
                  ? `+${getMee?.response?.phone.replace(
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
                    {getMee?.response?.tin || "--"}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.title}>
                    {langData?.MOBILE_MFO || "МФО"}:{" "}
                  </Text>
                  <Text style={styles.desc}>
                    {getMee?.response?.bankBik || "--"}
                  </Text>
                </View>
              </>
            )}
            <View style={styles.detailRow}>
              <Text style={styles.title}>
                {langData?.MOBILE_EMAIL || "Электронная почта"}:{" "}
              </Text>
              <Text style={styles.desc}>{getMee?.response?.email || "--"}</Text>
            </View>
          </View>
          <ChangeLang />

          {/* Edit Profile Modal */}
          <CenteredModal
            btnRedText={langData?.MOBILE_CANCEL || "Отмена"}
            btnWhiteText={
              submitting
                ? langData?.MOBILE_LOADING || "Загрузка..."
                : langData?.MOBILE_SAVE || "Сохранять"
            }
            isFullBtn={true}
            isModal={modal}
            onConfirm={handleSubmit}
            toggleModal={closeModal}
            // disableWhiteButton={submitting}
          >
            <ScrollView style={{ width: "100%" }}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  {langData?.MOBILE_EDIT_PROFILE || "Редактировать профиль"}
                </Text>
                <Text style={{ fontSize: 15, paddingVertical: 3 }}>
                  {langData?.MOBILE_NAME || "Ф.И.О"}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={langData?.MOBILE_NAME || "Ф.И.О"}
                  value={formData.managerFio}
                  onChangeText={(text) => handleInputChange("managerFio", text)}
                />
                {errors.managerFio && (
                  <Text style={styles.errorText}>{errors.managerFio}</Text>
                )}

                <Text style={{ fontSize: 15, paddingVertical: 3 }}>
                  {langData?.MOBILE_TELEPHONE || "Номер телефона"}
                </Text>
                {/* <View style={[styles.passwordContainer, { paddingRight: 0 }]}>
                <View style={styles.eyeIcon}>
                  <Text style={{ fontSize: 17, paddingHorizontal: 5 }}>
                    +998
                  </Text>
                </View>
                <TextInput
                  style={[styles.input, styles.passwordInput, {fontSize: 17}]}
                  placeholder={langData?.MOBILE_TELEPHONE || "Номер телефона"}
                  keyboardType="numeric"
                  value={formatPhoneNumber(formData.phone)}
                  onChangeText={(text) => handleInputChange("phone", text)}
                  maxLength={12}
                /> */}
                <PhoneInput
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
                      value={formData.tin}
                      keyboardType="numeric"
                      maxLength={14}
                      onChangeText={(text) => handleInputChange("tin", text)}
                    />
                    {errors.tin && (
                      <Text style={styles.errorText}>{errors.tin}</Text>
                    )}

                    <Text style={{ fontSize: 15, paddingVertical: 3 }}>
                      {langData?.MOBILE_MFO || "МФО"}
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder={langData?.MOBILE_MFO || "МФО"}
                      value={formData.bankBik}
                      onChangeText={(text) =>
                        handleInputChange("bankBik", text)
                      }
                    />
                    {errors.bankBik && (
                      <Text style={styles.errorText}>{errors.bankBik}</Text>
                    )}
                  </>
                )}

                {/* <Text style={{ fontSize: 15, paddingVertical: 3 }}>
                  {langData?.MOBILE_PASSWORD || "Пароль"} (
                  {langData?.IF_PASSWORD_NOT_ENTERED ||
                    "Если пароль не введен, старый пароль будет сохранен"}
                  )
                </Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder={langData?.MOBILE_PASSWORD || "Пароль"}
                    secureTextEntry={!passwordVisible}
                    value={formData.password}
                    onChangeText={(text) => handleInputChange("password", text)}
                  />
                  <Pressable
                    onPress={() => setPasswordVisible(!passwordVisible)}
                    style={styles.eyeIcon}
                  >
                    <FontAwesome
                      name={passwordVisible ? "eye" : "eye-slash"}
                      size={24}
                      color="gray"
                    />
                  </Pressable>
                </View>
                {errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )} */}
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
    justifyContent: "center",
    paddingVertical: 20,
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

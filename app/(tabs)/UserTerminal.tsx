import CenteredModal from "@/components/modal/modal-centered";
import Navbar from "@/components/navbar/navbar";
import { Colors } from "@/constants/Colors";
import { useGlobalRequest } from "@/helpers/apifunctions/univesalFunc";
import {
  post_terminal,
  UserTerminaldelete,
  UserTerminalGet,
  UserTerminalListGet,
} from "@/helpers/url";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Platform,
  ScrollView,
  Pressable,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Install this package if not already
import { Ionicons, MaterialIcons } from "@expo/vector-icons"; // For password visibility toggle
import { langStore } from "@/helpers/stores/language/languageStore";
import { getCountryByCca2 } from "react-native-international-phone-number";
import PhoneInput from "react-native-international-phone-number";

interface UserTerminal {
  id: number;
  name: string;
  address: string;
  phone: string;
  // lastName: string;
  managerFio: string;
  email: string;
  terminalName: string | null;
  inn: string | null;
  filialCode: string | null;
}

interface UserTerminalResponse {
  object: UserTerminal[];
  totalElements: number;
  totalPage: number;
}

export default function UserTerminal() {
  const [page, setPage] = useState(0);
  const {langData} = langStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState<boolean>(
    false
  );
  const [TerminalId, setTerminalId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    terminalId: "",
    managerFio: "",
    phone: "",
    password: "12345",
  });
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const { response, loading, error, globalDataFunc } = useGlobalRequest<
    UserTerminalResponse
  >(`${UserTerminalGet}?page=${page}`, "GET");

  const terminalList = useGlobalRequest(
    UserTerminalListGet,
    "GET"
  );

  const terminalDelete = useGlobalRequest<UserTerminalResponse>(
    `${UserTerminaldelete}?userId=${TerminalId}`,
    "DELETE"
  );

  const editTerminal = useGlobalRequest(`${post_terminal}`, "POST", {
    terminalId: formData.terminalId,
    managerFio: formData.managerFio,
    phone: `998${formData.phone.replace(/[^0-9]/g, "")}`,
    password: formData.password,
  });


  useFocusEffect(
    useCallback(() => {
      globalDataFunc();
    }, [page])
  );

  useFocusEffect(
    useCallback(() => {
      globalDataFunc();
      terminalList.globalDataFunc();
    }, [])
  );

  
    useEffect(() => {
      if (editTerminal?.response) {
        Alert.alert("QR - Pay",langData?.MOBILE_USER_TERMINAL_ADDED_SUCCESSFULLY || "Пользователь терминала добавлен успешно!");
        globalDataFunc();
        terminalList.globalDataFunc();
      } else if (editTerminal?.error) {
        Alert.alert("QR - Pay",langData?.MOBILE_ERROR_ADDING_USER_TERMINAL || "Ошибка добавления пользователя терминала.");
      }
    }, [editTerminal?.response, editTerminal?.error])

    useEffect(() => {
      if (terminalDelete?.response) {
        Alert.alert("QR - Pay",langData?.MOBILE_USER_TERMINAL_DELETED_SUCCESSFULLY || "Пользователь терминала успешно удален");
        globalDataFunc();
        terminalList.globalDataFunc();
      } else if (terminalDelete?.error) {
        Alert.alert("QR - Pay",langData?.MOBILE_ERROR_DELETING_USER_TERMINAL || "Произошла ошибка при удалении пользователя терминала.");
      }
    }, [terminalDelete?.response, terminalDelete?.error])

  const validateForm = () => {
    const { terminalId, managerFio, phone, password } = formData;
    if (!terminalId || !managerFio || !phone || !password) {
      setErrorMessage(langData?.PLEASE_FILL_ALL_FIELDS || "Пожалуйста, заполните все обязательные поля.");
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const resetFormData = () => {
    setFormData({
      terminalId: "",
      managerFio: "",
      phone: "",
      password: "12345",
    });
    setErrorMessage(null);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      editTerminal.globalDataFunc();

      setModalVisible(false); // Close modal after submission
      // Optionally reset form
      resetFormData();
    }
  };

  const handleInputChange = (
    name: keyof typeof formData,
    value: string | number
  ) => {
    
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

  const formatPhoneNumber = (text: string) => {
    let cleaned = ("" + text).replace(/\D/g, "");

    if (cleaned.length > 12) {
        cleaned = cleaned.slice(0, 12);
    }
    const formattedNumber = cleaned.replace(
        /(\d{2})(\d{3})(\d{2})(\d{2})/,
        (match, p1, p2, p3, p4) => {
            return `${p1} ${p2} ${p3} ${p4}`.trim();
        }
    );

    return formattedNumber;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      </SafeAreaView>
    );
  }

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
          <View style={styles.header}>
            <Text style={styles.headerText}>
            {langData?.MOBILE_USER_TERMINAL || "Пользователи терминала"} (
              {response?.totalElements ? response?.totalElements : 0})
            </Text>
            <Text style={{fontSize: 17, fontWeight: "bold"}}>({((page) * 10)} - { ((page) * 10 +10)})</Text>
          </View>
          <Pressable
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <Text style={[styles.paginationButton]}>
            {langData?.MOBILE_CREATE_USER || "Создать пользователя"}
            </Text>
          </Pressable>
          {response && response.object.length > 0 ? (
            response.object.map((item: UserTerminal) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.row}>
                  <Text style={styles.boldText}>{langData?.MOBILE_TERMINAL_NAME || "Терминал Имя"}:</Text>
                  <Text style={styles.cardDetail}>{item?.terminalName || "-"}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.boldText}>{langData?.MOBILE_FULL_NAME || "Ф.И.О"}:</Text>
                  <Text style={styles.cardDetail}>{item?.managerFio || "-"}</Text>
                </View> 
                <View style={styles.row}>
                  <Text style={styles.boldText}>{langData?.MOBILE_TELEPHONE || "Телефон"}:</Text>
                  <Text style={styles.cardDetail}>
                    {item?.phone
                      ? `+${item.phone.replace(/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')}`
                      : "-"}
                  </Text>
                </View>
                <View style={styles.separator} />
                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Pressable
                    onPress={() => {
                      setTerminalId(item.id);
                      setDeleteModalVisible(true);
                    }}
                  >
                    <MaterialIcons
                      style={{ color: "red" }}
                      name="delete-forever"
                      size={30}
                      color="black"
                    />
                  </Pressable>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>{langData?.MOBILE_USER_TERMINAL_NOT_FOUND || "Пользовательские терминалы не найдены."}</Text>
          )}
        </View>
        {response && response.object.length > 0 && (
          <View style={styles.paginationContainer}>
            <Pressable
              onPress={() => {
                if (page > 0) setPage(page - 1);
              }}
              disabled={page === 0}
            >
              <Text
                style={[
                  styles.paginationButton,
                  page === 0 && styles.disabledButton,
                ]}
              >
                {langData?.MOBILE_LAST || "Последний"}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                if (page + 1 < response.totalPage) setPage(page + 1);
              }}
              disabled={page + 1 === response.totalPage}
            >
              <Text
                style={[
                  styles.paginationButton,
                  page + 1 === response.totalPage && styles.disabledButton,
                ]}
              >
                {langData?.MOBILE_PANEL_CONTROL_NEXT || "Следующий"}
              </Text>
            </Pressable>
          </View>
        )}
        <CenteredModal
          btnRedText={langData?.MOBILE_CLOSE || "Закрывать"}
          btnWhiteText={editTerminal?.loading ? <ActivityIndicator size="small" color={Colors.light.primary} /> : langData?.MOBILE_SAVE || "Сохранять"}
          isFullBtn
          isModal={isModalVisible}
          toggleModal={() => {
            setModalVisible(false);
            resetFormData();
          }}
          onConfirm={handleSubmit}
        >
          <ScrollView style={{ width: "100%" }}>
            <Text style={styles.modalTitle}>{langData?.MOBILE_ADD_USER || "Добавить пользователя"}</Text>

            {/* Terminal Selection */}
            <Text style={styles.label}>{langData?.MOBILE_TERMINAL || "Терминал"}</Text>
            <View style={styles.pickerContainer}>
              <Picker
                mode="dropdown"
                dropdownIconColor={Colors.light.primary}
                dropdownIconRippleColor={Colors.light.primary}
                style={[styles.picker, Platform.OS === 'ios' ? {height: 150} : null]}
                itemStyle={Platform.OS === 'ios' ? {height: 150} : null}
                selectedValue={formData.terminalId}
                onValueChange={(itemValue: any) =>
                  handleInputChange("terminalId", itemValue)
                }
              >
                <Picker.Item label={langData?.MOBILE_SELECT_TERMINAL || "Выберите терминал"} value={0} />
                {terminalList?.response?.map((terminal: any) => (
                  <Picker.Item
                    key={terminal.id}
                    label={terminal.name}
                    value={terminal.id}
                  />
                ))}
              </Picker>
            </View>

            {/* First Name */}
            <Text style={styles.label}>{langData?.MOBILE_FULL_NAME || "Ф.И.О"}</Text>
            <TextInput
              placeholder={langData?.MOBILE_FULL_NAME || "Ф.И.О"} 
              style={styles.input}
              value={formData.managerFio}
              onChangeText={(text) => handleInputChange("managerFio", text)}
            />

            <Text style={styles.label}>{langData?.MOBILE_TELEPHONE || "Телефон"}</Text>
              <PhoneInput
                selectedCountry={getCountryByCca2("UZ")} 
                value={formData.phone}
                onChangePhoneNumber={(text) => handleInputChange("phone", text)}
                onChangeSelectedCountry={(country) => {
                  // Handle country change if needed
                }}
              />
            {/* </View> */}

            {/* Password */}
            {/* <Text style={styles.label}>{langData?.MOBILE_PASSWORD || "Пароль"}</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder={langData?.MOBILE_PASSWORD || "Пароль"}
                style={styles.passwordInput}
                secureTextEntry={!passwordVisible}
                value={formData.password}
                onChangeText={(text) => handleInputChange("password", text)}
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <Ionicons
                  name={passwordVisible ? "eye" : "eye-off"}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
            </View> */}

            {errorMessage && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}
          </ScrollView>
        </CenteredModal>
        <CenteredModal
          btnRedText={langData?.MOBILE_CANCEL || "Закрывать"}
          btnWhiteText={langData?.MOBILE_CONTINUE || "Продолжить"}
          isFullBtn
          isModal={isDeleteModalVisible}
          toggleModal={() => {
            setDeleteModalVisible(false);
          }}
          onConfirm={() => {
            terminalDelete.globalDataFunc()
            setDeleteModalVisible(false)
          }}
        >
          <ScrollView style={{ width: "100%" }}>
            <Text style={styles.modalTitle}>{langData?.MOBILE_CONFIRM_DELETE_USER || "Вы уверены, что хотите удалить этого пользователя?"}</Text>
          </ScrollView>
        </CenteredModal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingVertical: Platform.OS === "android" ? 35 : 0,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginVertical: 10,
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
  modalTitle: {
    fontSize: 20,
    paddingVertical: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  label: {
    fontSize: 15,
    paddingVertical: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  cardDetail: {
    fontSize: 16,
    color: "#666",
  },
  boldText: {
    fontWeight: "bold",
    color: "#333",
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  noDataText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginVertical: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    marginBottom: 16,
    gap: 10,
  },
  headerText: {
    width: "50%",
    fontSize: 18,
    fontWeight: "bold",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  paginationButton: {
    fontSize: 18,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.light.primary,
    color: "white",
    borderRadius: 5,
    textAlign: "center",
  },
  disabledButton: {
    backgroundColor: "#d3d3d3", // Disabled color
    color: "#888", // Disabled text color
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
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  phonePrefix: {
    fontSize: 17,
    color: "#000",
    marginRight: 5,
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 17,
    color: "#000",
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
});

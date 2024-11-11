import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  Pressable,
  Alert,
} from "react-native";
import { useGlobalRequest } from "@/helpers/apifunctions/univesalFunc";
import { SellerEdit, SellerGet } from "@/helpers/url";
import CenteredModal from "@/components/modal/modal-centered";
import { useFocusEffect } from "expo-router";
import { Colors } from "@/constants/Colors";
import Navbar from "@/components/navbar/navbar";
import { langStore } from "@/helpers/stores/language/languageStore";

interface Terminal {
  id: number;
  name: string | null;
  account: string | null;
  filial_code: string | null;
  inn?: string | null;
  terminalSerialCode?: string;
  phones: string[];
  merchant: string;
  phone: string;
  status: string;
  posId: string | number;
}

const Terminal: React.FC = () => {
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    ism: "",
    hisob: "",
    filialKod: "",
    inn: "",
    terminalSeriyaKodu: "", // Not required for validation
  });
  const {langData} = langStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [TerminalId, setTerminalId] = useState<number | null>(null);
  const [page, setPage] = useState(0);


  const {
    loading: loadingTerminals,
    error: errorTerminals,
    response: terminalList,
    globalDataFunc: fetchTerminalList,
  } = useGlobalRequest<{ object: Terminal[] }>(
    `${SellerGet}?page=${page}`,
    "GET"
  );

  const editTerminal = useGlobalRequest(
    `${SellerEdit}${TerminalId ? TerminalId : 0}`,
    "PUT",
    {
      // account: formData.hisob,
      // filialCode: formData.filialKod,
      // inn: formData.inn,
      name: formData.ism,
      terminalSerialCode:
        formData.terminalSeriyaKodu === "" ? null : formData.terminalSeriyaKodu,

    }
  );

  useFocusEffect(
    useCallback(() => {
      fetchTerminalList();
    }, [])
  );

  useEffect(() => {
    if (editTerminal?.response) {
      Alert.alert("QR - Pay",langData?.MOBILE_TERMINAL_SUCCESSFULLY_EDITED || "Терминал успешно отредактирован!");
      setModalVisible(false);
      resetFormData();
      fetchTerminalList()
    } else if (editTerminal?.error) {
      Alert.alert("QR - Pay",editTerminal?.error);
    }
  }, [editTerminal.response, editTerminal.error]);

  const handleInputChange = (name: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { ism } = formData;
    if (!ism ) {
      setErrorMessage(langData?.PLEASE_FILL_ALL_FIELDS || "Пожалуйста, заполните все обязательные поля.");
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Handle form submission here

      editTerminal.globalDataFunc();

      // Add your update terminal logic here
    }
  };

  const toggleModal = (terminal: Terminal) => {
    setFormData({
      ism: terminal.name || "",
      hisob: terminal.account || "",
      filialKod: terminal.filial_code || "",
      inn: terminal.inn || "",
      terminalSeriyaKodu: terminal.terminalSerialCode || "",
    });
    setModalVisible(true);
  };

  const resetFormData = () => {
    setFormData({
      ism: "",
      hisob: "",
      filialKod: "",
      inn: "",
      terminalSeriyaKodu: "",
    });
    // setTerminalNewUsers([{ phone: "", password: "" }]);
  };
  useFocusEffect(
    useCallback(() => {
      fetchTerminalList();
    }, [page])
  );

  if (loadingTerminals) {
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, marginBottom: 10 }}
      >
        <View>
          <View style={styles.header}>
            <Text style={styles.headerText}>
            {langData?.MOBILE_TERMINALS || "Терминалы"}({terminalList?.totalElements})
            </Text>
            <Text style={styles.headerText}>({((page) * 10)} - { ((page) * 10 +10)})</Text>
          </View>
          {terminalList?.object?.length > 0 ? (
            terminalList?.object?.map((terminal: Terminal, index: number) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.9}
                style={styles.card}
                onPress={() => {
                  setTerminalId(terminal?.id);
                  toggleModal(terminal);
                }}
              >
                {/* <Text style={styles.cardTitle}>{terminal.account || "-"}</Text> */}
                <View style={styles.row}>
                  <Text style={styles.boldText}>{langData?.MOBILE_NAME || "Имя"}:</Text>
                  <Text style={styles.cardDetail}>{terminal.name || "-"}</Text>
                </View>
                {/* <View style={styles.row}>
                  <Text style={styles.boldText}>Счет:</Text>
                  <Text style={styles.cardDetail}>
                    {" "}
                    {terminal.account || "-"}
                  </Text>
                </View> */}
                {/* <View style={styles.row}>
                  <Text style={styles.boldText}>Партнерский код:</Text>
                  <Text style={styles.cardDetail}>
                    {" "}
                    {terminal.filial_code || "-"}
                  </Text>
                </View> */}
                <View style={styles.row}>
                  <Text style={styles.boldText}>{langData?.MOBILE_SERIAL_CODE || "Серийный код"}:</Text>
                  <Text style={styles.cardDetail}>
                    {" "}
                    {terminal?.terminalSerialCode || "-"}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.boldText}>{langData?.MOBILE_MERCHANT || "Мерчант"}:</Text>
                  <Text style={styles.cardDetail}>
                    {" "}
                    {terminal?.merchant || "-"}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.boldText}>{langData?.MOBILE_STATUS || "Статус"}:</Text>
                  <Text style={styles.cardDetail}>
                    {" "}
                    {terminal?.status || "-"}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.boldText}>{langData?.MOBILE_TERMINAL_NUMBER || "Номер терминала"}:</Text>
                  <Text style={styles.cardDetail}>
                    {" "}
                    {terminal?.posId || "-"}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.boldText}>{langData?.MOBILE_TELEPHONE || "Телефон"}:</Text>
                  <Text style={styles.cardDetail}>
                    {" "}
                    {terminal?.phone
                      ? `+${terminal.phone.replace(/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')}`
                      : "-"}
                  </Text>
                </View>
                {/* <View style={styles.row}>
                  <Text style={styles.boldText}>ИНН:</Text>
                  <Text style={styles.cardDetail}>{terminal.inn || "-"}</Text>
                </View> */}
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noDataText}>{langData?.MOBILE_TERMINAL_NOT_FOUND || "Терминал не найден."}</Text>
          )}

          {terminalList?.object?.length > 0 &&
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
                  if (page + 1 < terminalList?.totalPage) setPage(page + 1);
                }}
                disabled={page + 1 === terminalList?.totalPage}
              >
                <Text
                  style={[
                    styles.paginationButton,
                    page + 1 === terminalList?.totalPage && styles.disabledButton,
                  ]}
                >
                  {langData?.MOBILE_PANEL_CONTROL_NEXT || "Следующий"}
                </Text>
              </Pressable>
            </View>
          }
          <CenteredModal
            btnRedText={langData?.MOBILE_CLOSE || "Закрывать"}
            btnWhiteText={editTerminal.loading ? <ActivityIndicator size="small" color={Colors.light.primary} /> : langData?.MOBILE_CONTINUE || "Продолжить"}
            isFullBtn
            isModal={isModalVisible}
            toggleModal={() => {
              setModalVisible(false);
              resetFormData();
            }}
            onConfirm={handleSubmit}
          >
            <ScrollView style={{width: "100%"}}>
              <Text style={{fontSize: 20, paddingVertical: 3}}>{langData?.MOBILE_EDIT_TERMINAL || "Редактировать терминал"}</Text>
              {[
                { key: "ism", label: langData?.MOBILE_NAME || "Имя" },
                // { key: "hisob", label: langData?.MOBILE_ACCOUNT || "Счет" },
                // { key: "filialKod", label: langData?.MOBILE_FILIAL_CODE || "Код филиала" },
                // { key: "inn", label: langData?.MOBILE_INN || "Инн" },
                {
                  key: "terminalSeriyaKodu",
                  label: langData?.MOBILE_SERIAL_CODE || "Серийный код терминала (опционально)",
                }, // Optional
              ].map(({ key, label }) => (
                <>
                <Text style={{fontSize: 15, paddingVertical: 3}}>{label}</Text>
                <TextInput
                  key={key}
                  placeholder={label}
                  style={styles.input}
                  value={formData[key as keyof typeof formData]}
                  onChangeText={(text) =>
                    handleInputChange(key as keyof typeof formData, text)
                  }
                />
                </>
              ))}

              {errorMessage && (
                <Text style={styles.errorText}>{errorMessage}</Text>
              )}
            </ScrollView>
          </CenteredModal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingVertical: Platform.OS === "android" ? 35 : 0,
    // marginBottom: 12,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 24, marginBottom: 10 },
  card: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold" },

  cardDetail: {
    fontSize: 16,
    color: "#666",
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
  boldText: {
    fontWeight: "bold",
    color: "#333",
  },
  errorText: { color: "red", marginBottom: 10 },
  addPhoneSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  phoneRow: { alignItems: "center", marginBottom: 15 },
  phoneCode: { marginRight: 10 },
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
  passwordInput: {
    width: "100%",
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
  noDataText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginVertical: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 0,
    paddingHorizontal: 20,
    marginBottom: 60,
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
    backgroundColor: "#d3d3d3", // Disabled rang
    color: "#888", // Disabled matn rangi
  },
});

export default Terminal;

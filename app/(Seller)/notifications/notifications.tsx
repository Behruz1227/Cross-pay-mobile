import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useGlobalRequest } from "@/helpers/apifunctions/univesalFunc";
import {
  seller_notification,
  terminal_notification,
  isRead_notification,
  delete_notification,
} from "@/helpers/url";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import CenteredModal from "@/components/modal/modal-centered";
import { useFocusEffect } from "expo-router";
import NavigationMenu from "@/components/navigationMenu/NavigationMenu";
import { Colors } from "@/constants/Colors";
import { langStore } from "@/helpers/stores/language/languageStore";

const Notifications = () => {
  const [url, setUrl] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const { langData } = langStore();
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {}, []);
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(0);

  const { response, globalDataFunc, loading } = useGlobalRequest(
    `${url}?page=${page}`,
    "GET"
  );
  const isReadNotification = useGlobalRequest(
    isRead_notification,
    "POST",
    selectedIds.length > 0 ? { ids: selectedIds } : { ids: [] }
  );
  const deleteNotification = useGlobalRequest(
    delete_notification,
    "POST",
    selectedIds.length > 0 ? { ids: selectedIds } : { ids: [] }
  );

  useFocusEffect(
    useCallback(() => {
      const fetchRole = async () => {
        const storedRole = await AsyncStorage.getItem("role");
        setRole(storedRole);
        if (storedRole === "ROLE_SELLER") {
          setUrl(seller_notification);
        } else if (storedRole === "ROLE_TERMINAL") {
          setUrl(terminal_notification);
        }
      };
      fetchRole();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      if (url) {
        globalDataFunc();
      }
    }, [url])
  );

  useFocusEffect(
    useCallback(() => {
      globalDataFunc();
    }, [page])
  );

  useEffect(() => {
    if (isReadNotification.response) {
      globalDataFunc();
    } else if (isReadNotification.error) {
      Alert.alert("QR - Pay",
        isReadNotification?.error?.message ||
          langData?.MOBILE_ERROR ||
          "Произошла ошибка"
      );
    }
  }, [isReadNotification.response, isReadNotification.error]);

  useEffect(() => {
    if (deleteNotification.response) {
      setPage(0)
      Alert.alert("QR - Pay","Уведомления удалены.");
      globalDataFunc();
      setModalVisible(false);
    } else if (deleteNotification.error) {
      Alert.alert("QR - Pay",
        deleteNotification?.error?.message ||
          langData?.MOBILE_ERROR ||
          "Произошла ошибка"
      );
    }
  }, [deleteNotification.response, deleteNotification.error]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split("T")[0];
    const formattedTime = date.toTimeString().split(" ")[0].slice(0, 5);
    return `${formattedDate} ${formattedTime}`;
  };

  const sortedNotifications = response?.object?.sort(
    (a: { isRead: string }, b: { isRead: string }) =>
      a.isRead === b.isRead ? 0 : a.isRead ? 1 : -1
  );

  const handleSelectIsReadIds = async () => {
    if (response?.object) {
      // isRead false bo'lgan elementlarning id larini olish
      const ids = response?.object
        ? response?.object
            .filter((item: any) => !item.isRead) // isRead false bo'lganlarni filtrlash
            .map((item: any) => item.id)
        : []; // ularning id larini olish

      if (ids && ids.length > 0) {
        await setSelectedIds(ids);
        await isReadNotification.globalDataFunc();
      } else {
        Alert.alert("QR - Pay",
          langData?.MOBILE_NOTIFICATIONS_NOT_FOUND || "У вас нет уведомлений."
        );
      }
    }
  };

  const handleSelectAllIds = async () => {
    if (response?.object) {
      const ids = await response?.object.map((item: any) => item.id);

      if (ids && ids.length > 0) {
        await setSelectedIds(ids);
        await deleteNotification.globalDataFunc();
      } else {
        Alert.alert("QR - Pay",
          langData?.MOBILE_NOTIFICATIONS_NOT_FOUND || "У вас нет уведомлений."
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <NavigationMenu name={langData?.MOBILE_NOTIFICATIONS || "Уведомление"} />
      <View style={styles.header}>
        <View style={{ flexDirection: "row", justifyContent: "flex-start", gap: 5 }}>
          <Text style={styles.headerText}>
            {langData?.MOBILE_NOTIFICATIONS || "Уведомление"}
          </Text>
          <Text style={styles.headerText}>
            ({response?.totalElements ? response?.totalElements : 0})
          </Text>
        </View>
        {/* <View
          style={{ display: "flex", justifyContent: "flex-end" }}
        > */}
        <Text style={{ fontSize: 17, fontWeight: "bold" }}>
          ({page * 10} - {page * 10 + 10})
        </Text>
        {/* </View> */}
      </View>
      <ScrollView style={styles.CarsContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.light.primary} />
        ) : sortedNotifications && sortedNotifications.length > 0 ? (
          sortedNotifications?.map(
            (item: {
              id: number;
              title: string;
              createdAt: string;
              isRead: string;
              sellerName: string;
              merchant: string;
              amount: number;
            }) => (
              <View
                key={item.id}
                style={item.isRead ? styles.cards : styles.cards21}
              >
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                  }}
                >
                  <Text
                    style={[
                      item.isRead ? styles.greycolor : styles.Darkcolor,
                      { width: "80%" },
                    ]}
                  >
                    {item?.sellerName}
                  </Text>
                  {item.isRead ? (
                    <MaterialIcons name="done-all" size={24} color="#ccc" />
                  ) : (
                    <MaterialIcons
                      name="done"
                      size={24}
                      color={Colors.light.primary}
                    />
                  )}
                </View>
                <View style={{ width: "100%", marginVertical: 10 }}>
                  <View
                    style={{ width: "100%", flexDirection: "row", gap: 10 }}
                  >
                    <Text
                      style={[
                        item.isRead ? styles.greycolor : styles.Darkcolor,
                        { fontWeight: "bold" },
                      ]}
                    >
                      {langData?.MOBILE_MERCHANT || "Торговец"}:
                    </Text>
                    <Text
                      style={[
                        item.isRead ? styles.greycolor : styles.Darkcolor,
                        // { width: "80%" },
                      ]}
                    >
                      {item?.merchant || "-"}
                    </Text>
                  </View>
                  <View
                    style={{ width: "100%", flexDirection: "row", gap: 10 }}
                  >
                    <Text
                      style={[
                        item.isRead ? styles.greycolor : styles.Darkcolor,
                        { fontWeight: "bold" },
                      ]}
                    >
                      {langData?.MOBILE_AMOUNT || "Количество"}:
                    </Text>
                    <Text
                      style={[
                        item.isRead ? styles.greycolor : styles.Darkcolor,
                        // { width: "80%" },
                      ]}
                    >
                      {item?.amount || "-"} UZS
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    marginTop: 10,
                    width: "100%",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                  }}
                >
                  <Text
                    style={
                      item.isRead
                        ? { color: "#ccc", fontSize: 10 }
                        : styles.date
                    }
                  >
                    {formatDate(item.createdAt)}
                  </Text>
                </View>
              </View>
            )
          )
        ) : (
          <Text style={styles.noDataText}>
            {langData?.MOBILE_NOTIFICATIONS_NOT_FOUND ||
              "Уведомления не найдены."}
          </Text>
        )}
        {sortedNotifications && (
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
                {langData?.MOBILE_LAST || "Предыдущий"}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                if (page + 1 < response?.totalPage) setPage(page + 1);
              }}
              disabled={page + 1 === response?.totalPage}
            >
              <Text
                style={[
                  styles.paginationButton,
                  page + 1 === response?.totalPage && styles.disabledButton,
                ]}
              >
                {langData?.MOBILE_PANEL_CONTROL_NEXT || "Следующий"}
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleSelectIsReadIds()}
        >
          {isReadNotification.loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {langData?.MOBILE_MARK_ALL_AS_READ ||
                "Отметить все как прочитанное"}
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisible(true)}
        >
          {deleteNotification.loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {langData?.MOBILE_DELETE_ALL || "Удалить все"}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <CenteredModal
        btnRedText={langData?.MOBILE_CANCEL || "Отмена"}
        btnWhiteText={langData?.MOBILE_CONTINUE || "Продолжить"}
        isFullBtn={true}
        isModal={modalVisible}
        toggleModal={() => setModalVisible(!modalVisible)}
        onConfirm={() => handleSelectAllIds()}
      >
        <View style={{width: "100%", marginVertical :10}}>
          <Text style={{ fontSize: 20 }}>
            {langData?.MOBILE_CONFIRM_DELETE_ALL ||
              "Вы уверены, что хотите удалить все уведомления?"}
          </Text>
        </View>
      </CenteredModal>
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    paddingTop: 50,
  },
  noDataText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginVertical: 20,
  },
  title: {
    fontSize: 25,
    marginVertical: 30,
  },
  CarsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  cards: {
    backgroundColor: "#fff",
    padding: 20,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    borderRadius: 5,
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  cards21: {
    borderWidth: 1,
    borderColor: "#FF5A3A",
    backgroundColor: "#fff",
    padding: 20,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    borderRadius: 5,
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  greycolor: {
    color: "#ccc",
  },
  Darkcolor: {
    color: "#000",
  },
  date: {
    fontSize: 10,
    color: Colors.light.primary,
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  accordionContent: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  button: {
    backgroundColor: "#FF5A3A",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },

  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    // width: 130,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 100,
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

import {
  StyleSheet,
  Image,
  Platform,
  View,
  Text,
  Dimensions,
  StatusBar,
  BackHandler,
  ActivityIndicator,
  Pressable,
} from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import TransactionCard from "@/components/cards/tranzaktionCards";
import TransactionActionCard from "@/components/cards/tranzaktionActionCards";
import { FontAwesome5, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { FlatList } from "react-native";
import TransactionActionHeadCard from "@/components/cards/tranzaktionActionCardsHead";
import { useGlobalRequest } from "@/helpers/apifunctions/univesalFunc";
import { useCallback, useEffect, useState } from "react";
import {
  payment_get_seller,
  payment_get_terminal,
  staisticUrl,
  words_get_data,
} from "@/helpers/url";
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { langStore } from "@/helpers/stores/language/languageStore";

export default function HomeScreen() {
  const [url, setUrl] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(0);
  const [backPressCount, setBackPressCount] = useState(0);
  const { langData, setLangData } = langStore();
  const { response, globalDataFunc, loading } = useGlobalRequest(
    staisticUrl,
    "GET",
    "DEFAULT"
  );
  const transactionGet = useGlobalRequest(
    `${url}?page=${page}`,
    "GET",
    "DEFAULT"
  );
  const getLangData = useGlobalRequest(`${words_get_data}MOBILE`, "GET");

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (Platform.OS === "ios") {
          return true; // iOS uchun orqaga qaytishni bloklash
        }

        if (backPressCount === 0) {
          setBackPressCount(backPressCount + 1);
          // Toast.show('Orqaga qaytish uchun yana bir marta bosing', Toast.SHORT);
          setTimeout(() => {
            setBackPressCount(0);
          }, 2000); // 2 soniya ichida ikkinchi marta bosilmasa, holatni qayta boshlaydi
          return true; // Orqaga qaytishni bloklaydi
        } else {
          BackHandler.exitApp(); // Ilovadan chiqish
          return true;
        }
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      // iOS uchun qo'shimcha
      if (Platform.OS === "ios") {
        // Bu yerda iOS uchun orqaga qaytishni bloklash uchun qo'shimcha logika yozilishi mumkin
        // Masalan, navigation event listener qo'shish orqali
      }

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
        // iOS uchun qo'shilgan event listener'larni ham olib tashlash kerak
      };
    }, [backPressCount])
  );

  useFocusEffect(
    useCallback(() => {
      const fetchRole = async () => {
        const storedRole = await AsyncStorage.getItem("role");
        setRole(storedRole ? storedRole : "");
        if (storedRole === "ROLE_SELLER") {
          setUrl(payment_get_seller);
        } else if (storedRole === "ROLE_TERMINAL") {
          setUrl(payment_get_terminal);
        }
      };
      getLangData.globalDataFunc();
      fetchRole();
      globalDataFunc();
    }, [])
  );

  useEffect(() => {
    if (getLangData.response) {
      setLangData(getLangData.response);
    } else if (getLangData.error) {
      setLangData(null);
    }
  }, [getLangData.response, getLangData.error]);

  useFocusEffect(
    useCallback(() => {
      if (url) {
        transactionGet.globalDataFunc();
      }
    }, [url])
  );

  useFocusEffect(
    useCallback(() => {
      transactionGet.globalDataFunc();
    }, [page])
  );

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
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#f5f5f5" }}
      headerImage={
        <Image
          style={{ width: "100%", objectFit: "contain" }}
          source={require("./../../assets/images/main.jpg")}
        />
      }
    >
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <View style={{ marginBottom: 40 }}>
        {role === "ROLE_SELLER" && (
          <View style={{ flexDirection: "row", gap: 5 }}>
            <TransactionActionCard
              title={langData?.MOBILE_TERMINALS || "Терминалы"}
              desc={response && response.terminalCount}
              icon={
                <FontAwesome5
                  name="calculator"
                  size={26}
                  color={Colors.light.primary}
                />
              } // Pass the icon as a prop
              onPress={() => {}}
            />
            <TransactionActionCard
              title={langData?.MOBILE_COMPLETED_TRANSACTIONS || "Завершенные транзакции"}
              desc={
                response &&
                response?.completedCount &&
                response?.completedCount
              }
              icon={
                <FontAwesome6
                  name="money-bill-transfer"
                  size={26}
                  color={Colors.light.primary}
                />
              } // Another icon
              onPress={() => {}}
            />
          </View>
        )}
        {role === "ROLE_SELLER" && (
          <View style={{ flexDirection: "row", gap: 5 }}>
            <TransactionActionCard
              title={langData?.MOBILE_CANCELLED_TRANSACTIONS || "Отмененные транзакции"}
              desc={response && response.cancelCount}
              icon={
                <MaterialIcons
                  name="money-off"
                  size={36}
                  color={Colors.light.primary}
                />
              } // Another icon
              onPress={() => {}}
            />
            <TransactionActionCard
              title={langData?.MOBILE_WAITING_TRANSACTIONS || "Ожидающие транзакции"}
              desc={response && response?.waitCount}
              icon={
                <MaterialIcons
                  name="money-off"
                  size={36}
                  color={Colors.light.primary}
                />
              } // Another icon
              onPress={() => {}}
            />
          </View>
        )}
        {role === "ROLE_SELLER" && (
          <View style={{ flexDirection: "row", gap: 5, flexWrap: "wrap" }}>
            <TransactionActionHeadCard
              title={langData?.MOBILE_TERMINAL_USERS || "Количество пользователей терминала"}
              desc={
                `${response && response?.userCount
                  ? response?.userCount
                  : 0}`
              }
              icon={
                <FontAwesome5
                  name="users"
                  size={36}
                  color={Colors.light.primary}
                />
              } // Another icon
              onPress={() => {}}
            />
            <TransactionActionHeadCard
              title={langData?.MOBILE_CONFIRMED_PAYMENTS || "Подтвержденные платежи"}
              desc={
                `${response && response?.balanceCompleted
                  ? response?.balanceCompleted.toFixed(2)
                  : 0} UZS`
              }
              icon={
                <FontAwesome5
                  name="money-bill"
                  size={36}
                  color={Colors.light.primary}
                />
              } // Another icon
              onPress={() => {}}
            />
            <TransactionActionHeadCard
              title={langData?.MOBILE_WAITING_PAYMENTS || "Ожидающие платежи"}
              desc={
                `${response && response?.balanceWait ? response?.balanceWait.toFixed(2) : 0} UZS`
              }
              icon={
                <FontAwesome5
                  name="money-bill"
                  size={36}
                  color={Colors.light.primary}
                />
              } // Another icon
              onPress={() => {}}
            />
            <TransactionActionHeadCard
              title={langData?.MOBILE_CANCELLED_PAYMENTS || "Отмененные платежи"}
              desc={
                `${response && response?.balanceCancel
                  ? response?.balanceCancel.toFixed(2)
                  : 0} UZS`
              }
              icon={
                <FontAwesome5
                  name="money-bill"
                  size={36}
                  color={Colors.light.primary}
                />
              } // Another icon
              onPress={() => {}}
            />
          </View>
        )}
        <View style={styles.header}>
          <Text style={styles.headerText}>
            {langData?.MOBILE_PAYMENTS || "Платежи"}({transactionGet?.response?.totalElements})
          </Text>
          <Text style={styles.headerText}>({((page) * 10)} - { ((page) * 10 +10)})</Text>
          {/* <Text style={styles.headerText}>{langData?.MOBILE_CURRENT || "Текущий"}({page + 1})</Text> */}
        </View>

        {transactionGet?.response?.object.length > 0 ? (
          <FlatList
            data={transactionGet?.response?.object}
            // keyExtractor={(item) => item.id} // Use a unique key for each item
            renderItem={({ item }) => <TransactionCard transaction={item} />}
          />
        ) : (
          <Text style={styles.noDataText}>{langData?.MOBILE_PAYMENT_NOT_FOUND || "Платеж не найден."}</Text>
        )}
        {transactionGet?.response?.object.length > 0 && (
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
                if (page + 1 < transactionGet?.response?.totalPage)
                  setPage(page + 1);
              }}
              disabled={page === transactionGet?.response?.totalPage}
            >
              <Text
                style={[
                  styles.paginationButton,
                  page === transactionGet?.response?.totalPage &&
                    styles.disabledButton,
                ]}
              >
                {langData?.MOBILE_PANEL_CONTROL_NEXT || "Следующий"}
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingVertical: Platform.OS === "android" ? 35 : 0,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerImage: {
    color: Colors.dark.primary,
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  seeAll: {
    fontSize: 14,
    color: Colors.dark.primary,
  },
  noDataText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginVertical: 20,
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
    backgroundColor: "#d3d3d3", // Disabled rang
    color: "#888", // Disabled matn rangi
  },
});

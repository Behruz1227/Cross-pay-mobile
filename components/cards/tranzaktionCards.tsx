// TransactionCard.js
import OrderStore from "@/helpers/stores/order/orderStore";
import { RootStackParamList } from "@/types/root/root";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

type SettingsScreenNavigationProp = NavigationProp<
    RootStackParamList,
    "(Seller)/(transactionsDetail)/transactionDetail"
>;

export interface TransactionCardProps {
    transaction: {
        add: any,
        at: any,
        chequeAmount: number,
        chequeCurrency: number,
        cheque_created_at: string,
        ext_id: number,
        local_qrc_id: string,
        locked: boolean,
        merchant_id: string,
        partner: string,
        pay_status: any,
        pay_trx_id: any,
        paymentStatus: string,
        purpose: string | null,
        qrAmount: number,
        qrCurrency: number,
        qrc_id: string,
        rate: number,
        redirect_url: string | null,
        snd_pam: any,
        snd_phone_masked: any,
        status: string,
        trx_id: any,
        trx_time: string | null,
        updated_at: string | null,
        url: string | null,
        sellerName: string | null,
        currency: string | null,
        amount: number
    }
}

const TransactionCard = ({ transaction }: TransactionCardProps) => {
  if (!transaction) return null; // If no transaction data, return null
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  
  const {setPaymentDetail} = OrderStore()

  return (
    <TouchableOpacity activeOpacity={.7} onPress={() => {
        setPaymentDetail({transaction})
        navigation.navigate("(Seller)/(transactionsDetail)/transactionDetail")
    }}>
      <View style={styles.card}>
        <View style={styles.textContainer}>
          <View>
            <Text style={styles.title}>{transaction?.sellerName || "-"}</Text>
            <Text style={styles.date}>{transaction?.cheque_created_at}</Text>
          </View>
          <Text style={{ color: transaction?.amount <= 0 ? "red" : "green" }}>
            {(transaction?.amount || 0).toLocaleString('uz-UZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {transaction?.currency || "UZS"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
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
  textContainer: {
    marginLeft: 10, // Space between icon and text
    flexDirection: "column",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "95%",
    paddingRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  date: {
    fontSize: 12,
    color: "gray",
  },
});

export default TransactionCard;

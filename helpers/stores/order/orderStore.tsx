import { TransactionCardProps } from "@/components/cards/tranzaktionCards";
import {create} from "zustand";

interface OrderData {
    OrderData: any,
    setOrderData: (val: any) => void;
    paymentDetail: any,
    setPaymentDetail:  (val: TransactionCardProps) => void;
}

const OrderStore = create<OrderData>((set) => ({
    OrderData: null,
    setOrderData: (val) => set({OrderData: val}),
    paymentDetail: null,
    setPaymentDetail: (val) => set({paymentDetail: val})
}));

export default OrderStore;

import { create } from "zustand";

interface SocketStoreState {
    socketData: any;
    setSocketData: (data: any) => void;
    socketModalData: any;
    setSocketModalData: (data: any) => void;
    socketModal: boolean;
    setSocketModal: (val: boolean) => void;
    socketLoading: boolean;
    setSocketLoading: (val: boolean) => void;
    timer: number;
    setTimer: (val: number) => void;
    setNotificationSocket: (val: boolean) => void;
    notificationSocket: boolean;
}

export const SocketStore = create<SocketStoreState>((set) => ({
    socketData: null,
    setSocketData: (data) => set({ socketData: data }),
    socketModalData: null,
    setSocketModalData: (data) => set({ socketModalData: data }),
    socketModal: false,
    setSocketModal: (val) => set({ socketModal: val }),
    socketLoading: false,
    setSocketLoading: (val) => set({ socketLoading: val }),
    timer: 10,
    setTimer: (val) => set({ timer: val }),
    setNotificationSocket: (val) => set({ notificationSocket: val }),
    notificationSocket: false
}))
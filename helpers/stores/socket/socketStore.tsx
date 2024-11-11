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
    timer: 60,
    setTimer: (val) => set({ timer: val }),
    
}))
import { create } from "zustand";
import { AuthStoreTypes } from "@/types/auth/auth";

export const useAuthStore = create<AuthStoreTypes>((set) => ({
    role: '',
    setRole: (val: string) => set({ role: val }),
    firstName: '',
    setFirstName: (val: string) => set({ firstName: val }),
    lastName: '',
    setLastName: (val: string) => set({ lastName: val }),
    phoneNumber: '',
    setPhoneNumber: (val: string) => set({ phoneNumber: val }),
    status: null,
    setStatus: (val: boolean | null) => set({ status: val }),
    isLoginModal: false,
    setIsLoginModal: (val: boolean) => set({ isLoginModal: val }),
    password: '',
    setPassword: (val: string) => set({ password: val }),
}));
export interface AuthStoreTypes {
    role: string;
    setRole: (val: string) => void;
    firstName: string;
    setFirstName: (val: string) => void;
    lastName: string;
    setLastName: (val: string) => void;
    phoneNumber: string | null;
    setPhoneNumber: (val: string | null) => void;
    status: boolean | null;
    setStatus: (val: boolean | null) => void;
    isLoginModal: boolean;
    setIsLoginModal: (val: boolean) => void;
    password: string;
    setPassword: (val: string) => void;
}
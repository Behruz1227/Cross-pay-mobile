import AsyncStorage from "@react-native-async-storage/async-storage";

export const getConfig = async () => {
    try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
            return {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
};
export const getConfigImg = async () => {
    try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
            return {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            };
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
};
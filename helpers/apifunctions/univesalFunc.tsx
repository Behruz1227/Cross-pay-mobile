import axios from "axios";
import { getConfig, getConfigImg } from "../token";
import { useMutation } from "react-query";
import { langStore } from "../stores/language/languageStore";

export interface UseGlobalResponse<T> {
  loading: boolean;
  error: any;
  response: T | any;
  globalDataFunc: () => Promise<void>;
  isAlert?: boolean;
}

export function useGlobalRequest<T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  data?: T,
  configType: "DEFAULT" | "IMAGE" = "DEFAULT",
  isAlert = false
): UseGlobalResponse<T> {
  const { langData } = langStore();
  const mutation = useMutation({
    mutationFn: async () => {
      try {
        const config =
          configType === "DEFAULT" ? await getConfig() : await getConfigImg();
        let res;
        // console.log('url', url);
        // console.log('config', config);
        // console.log('data', data);
        switch (method) {
          case "GET":
            res = await axios.get(url, config || {});
            break;
          case "POST":
            res = await axios.post(url, data || {}, config || {});
            break;
          case "PUT":
            res = await axios.put(url, data || {}, config || {});
            break;
          case "DELETE":
            res = await axios.delete(url, config || {});
            break;
          default:
            throw new Error("Invalid method");
        }

        // Check for errors in the response
        if (res.data.error) {
          throw new Error(res.data.error.message);
        }

        // Return response data if exists
        return res.data.data;
      } catch (error: any) {
        console.error("Request failed:", error);

        if (isAlert) alert(langData.ERROR_MOBILE || "Произошла ошибка");
        if (error?.message) throw error?.message; // Pass error to React Query's error handling
      }
    },
  });

  return {
    loading: mutation.isLoading,
    error: mutation.error ? mutation.error : undefined,
    response: mutation.data,
    globalDataFunc: mutation.mutateAsync,
  };
}

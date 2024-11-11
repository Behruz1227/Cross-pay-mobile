import { create } from "zustand";
import { ILanguage } from "@/types/language/language";

export const langStore = create<ILanguage>((set) => ({
  langData: null,
  setLangData: (val) => set({ langData: val }),
}));

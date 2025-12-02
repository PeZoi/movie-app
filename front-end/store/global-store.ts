import { CategoryType } from "@/types/category-type";
import { CountryType } from "@/types/country-type";
import { create } from "zustand";

interface GlobalState {
  categoryList: CategoryType[];
  countryList: CountryType[];
  getNameCategoryBySlug: (slug: string) => string | null;
  setCategoryList: (categoryList: CategoryType[]) => void;
  getNameCountryBySlug: (slug: string) => string | null;
  setCountryList: (countryList: CountryType[]) => void;
}

export const useGlobalStore = create<GlobalState>((set, get) => ({
  categoryList: [],
  countryList: [],
  getNameCategoryBySlug: (slug: string) => {
    return get().categoryList?.find((category: CategoryType) => category.slug === slug)?.name || null;
  },
  setCategoryList: (categoryList: CategoryType[]) => set({ categoryList }),
  getNameCountryBySlug: (slug: string) => {
    return get().countryList?.find((country: CountryType) => country.slug === slug)?.name || null;
  },
  setCountryList: (countryList: CountryType[]) => set({ countryList }),
}));
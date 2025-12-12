import http from "@/lib/http";
import { CountryType } from "@/types/country-type";
import { ResponseType } from "@/types/response-type";

export const countryService = {
  getAllCountries: () => http.get<ResponseType<CountryType[]>>('/api/v1/country', { cache: 'force-cache' })
}
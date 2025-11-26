import http from "@/lib/http";
import { CollectionType } from "@/types/collection-type";
import { ResponseType } from "@/types/response-type";

export const homeAPI = {
  getCollectionList: async (page: number = 1, limit: number = 5) => http.get<ResponseType<CollectionType[]>>(`/api/v1/collection/list?page=${page}&limit=${limit}`)
}
import http from '@/lib/http';
import { ActorType } from '@/types/actor-type';
import { ResponseType } from '@/types/response-type';

export const actorService = {
  getActorById: async (id: string) => http.get<ResponseType<ActorType[]>>(`/api/v1/actor/${id}`),
};


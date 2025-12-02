/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_URL } from "@/constants/env"
import { normalizePath } from "@/lib/utils"
import { LoginResType, UserAuthResponseType } from "@/types/auth-type"
import { redirect } from "next/navigation"

type CustomOptions = Omit<RequestInit, 'method'> & {
  baseUrl?: string | undefined
}

const ENTITY_ERROR_STATUS = 422
const UNAUTHORIZED_ERROR_STATUS = 401

type EntityErrorPayload = {
  message: string,
  errors: {
    message: string,
    field: string
  }[]
}

export class HttpError extends Error {
  status: number
  payload: {
    message: string,
    [key: string]: any
  }
  constructor({ status, payload }: { status: number, payload: any }) {
    super()
    this.status = status
    this.payload = payload
  }
}

export class EntityError extends HttpError {
  status = ENTITY_ERROR_STATUS
  payload: EntityErrorPayload
  constructor({ status, payload }: { status: typeof ENTITY_ERROR_STATUS, payload: EntityErrorPayload }) {
    super({ status, payload })
    this.status = status
    this.payload = payload
  }
}

class SessionToken {
  private token = ''
  get value() {
    return this.token
  }
  set value(token: string) {
    // Nếu gọi method này ở server thì sẽ bị lỗi
    if (typeof window === 'undefined') throw new Error('Cannot set token on server side')
    this.token = token
  }
}

export const clientSessionToken = new SessionToken()

const request = async <Response>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, options?: CustomOptions | undefined) => {
  const body = options?.body ? (options.body instanceof FormData ? options.body : JSON.stringify(options.body)) : undefined
  const baseHeaders: Record<string, string> = body instanceof FormData ? {} : { 'Content-Type': 'application/json' }

  // Chỉ thêm Authorization từ clientSessionToken nếu đang ở client-side và không có Authorization trong options.headers
  if (typeof window !== 'undefined' && clientSessionToken.value) {
    const hasAuth = options?.headers && 'Authorization' in options.headers
    if (!hasAuth) {
      baseHeaders.Authorization = `Bearer ${clientSessionToken.value}`
    }
  }

  // Nếu không truyền baseUrl (hoặc baseUrl = undefined) thì lấy từ envConfig.NEXT_PUBLIC_API_ENDPOINT
  // Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì đồng nghĩa với việc chúng ta gọi API đến Next.js Server
  const baseUrl = options?.baseUrl === undefined ? API_URL : options.baseUrl

  const fullUrl = url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`

  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers
    },
    body,
    method
  }

  // Chỉ thêm credentials: 'include' khi ở client-side
  if (typeof window !== 'undefined') {
    fetchOptions.credentials = 'include'
  }

  const res = await fetch(fullUrl, fetchOptions)

  const payload: Response = await res.json()
  const data = {
    status: res.status,
    payload
  }

  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(data as { status: typeof ENTITY_ERROR_STATUS, payload: EntityErrorPayload })
    } else if (res.status === UNAUTHORIZED_ERROR_STATUS) {
      // Logout ở client-side
      if (typeof window !== 'undefined') {
        await fetch('/api/auth/logout', {
          headers: { ...baseHeaders },
          method: 'POST',
          body: JSON.stringify({ force: true })
        })
        clientSessionToken.value = ''
        // location.href = '/login'
      } else {
        const sessionToken = (options?.headers as any)?.Authorization?.split('Bearer ')[1]
        redirect(`/logout?sessionToken=${sessionToken}`)
      }
    } else {
      throw new HttpError(data)
    }
  }

  // Chỉ set token nếu đang ở client-side
  if (typeof window !== 'undefined') {
    if (['auth/login', 'auth/register'].some(item => item === normalizePath(url))) {
      // Hỗ trợ cả format mới (ResponseType với data.access_token) và format cũ (access_token trực tiếp)
      const responsePayload = payload as UserAuthResponseType | LoginResType | any
      const accessToken =
        responsePayload?.data?.access_token || // Format mới: ResponseType với data.access_token
        responsePayload?.access_token ||        // Format cũ: access_token trực tiếp
        ''

      if (accessToken) {
        clientSessionToken.value = accessToken
      }
    } else if ('auth/logout' === normalizePath(url)) {
      clientSessionToken.value = ''
    }
  }

  return payload
}

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) {
    return request<Response>('GET', url, options)
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) {
    return request<Response>('POST', url, { ...options, body })
  },
  put<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) {
    return request<Response>('PUT', url, { ...options, body })
  },
  delete<Response>(
    url: string,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) {
    return request<Response>('DELETE', url, { ...options })
  }
}

export default http
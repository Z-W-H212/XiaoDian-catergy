import { createApi } from '@dian/app-utils'
import { message } from 'antd'
import { env } from '@/env'

const token = localStorage.getItem('token')

const onerror = (error: Error) => {
  message.error(error.msg)
}

const createRequestApi = (baseURL: string) => {
  return createApi({
    baseURL,
    headers: {
      Authorization: `Bearer ${token}`,
      'dian-referer-uri': location.pathname,
      'app-code': 'diana_admin',
    },
    onerror,
    validateStatus (status: number) {
      if (status === 401) {
        window.location.href = '/login'
        return false
      }
      return status >= 200 && status < 300
    },
  })
}

export const z = createRequestApi(env.z)
export const AUTH = createRequestApi(env.AUTH_HOST)
export const dcapi = createRequestApi(env.dcapi)

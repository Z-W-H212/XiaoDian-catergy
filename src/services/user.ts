import { dcapi } from '@/utils/request'

export const useInfo = (function () {
  let userInfo: any
  return async () => {
    if (userInfo) {
      return await new Promise(resolve => resolve(userInfo))
    }
    userInfo = await dcapi.get('/diana/user/v1/getUserProps')
    return userInfo
  }
}())

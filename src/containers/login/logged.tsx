import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { useToken } from '@/services/user'
import { clientId, scope, responseType, grantType, redirectUri } from './static'

export default function Login () {
  const location = useLocation()
  const { code } = useMemo(() => queryString.parse(location.search), [location.search])
  const { data, error } = useToken(code, {
    code,
    client_id: clientId,
    scope,
    response_type: responseType,
    redirect_uri: redirectUri,
    grant_type: grantType,
  })

  useEffect(() => {
    if (data) {
      if (data.access_token) {
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('username', data.username)
        window.location.href = '/'
      } else {
        throw new Error('获取不到token！')
      }
    }
  }, [data])

  if (!code || error) {
    return (
      <div>登录异常，请联系管理员！</div>
    )
  }
  return <div>登陆成功！正在跳转...</div>
}

export function UnLogin () {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  window.location.href = '/'
}

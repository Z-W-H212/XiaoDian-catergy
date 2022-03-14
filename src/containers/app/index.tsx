import { GlobalLayout } from '@dian/ui'
import { useEffect, useState } from 'react'
import { privateRoutes } from '@/router/routes'
import { Route } from '@/router/utils'
import { useInfo } from '@/services/user'

const typeNameLabels = ['系统端', '系统', '菜单']
const transformResourceTree = (routes: Route[], length: number): any[] => {
  return routes.map((item) => {
    const { title, path, resCode, type, children } = item

    let _type = type
    if (!_type) {
      _type = length === 1 ? '1' : '2'
    }
    const node = {
      resCode,
      resName: title,
      type: _type,
      basename: path,
      level: length + 1,
      typeName: typeNameLabels[Number(_type)],
      children: children && transformResourceTree(children, length + 1),
    }
    if (_type === '1') {
      node.level = 2
    }
    return node
  })
}

const resourceTree = [
  {
    resCode: 'athena',
    resName: 'athena',
    type: '0',
    typeName: '系统端',
    level: 1,
    children: transformResourceTree(privateRoutes, 1),
  },
]

interface AppProps {
  children?: React.ReactChild
  routesConfig: any[]
}

const App: React.FC<AppProps> = (props: AppProps) => {
  const { routesConfig } = props
  const [user, setUser] = useState({ name: '', nickName: '', roleName_zh: '' })
  // 如需获取登录本人的信息，执行此hooks
  useEffect(() => {
    useInfo().then((res) => {
      const userInfo = {
        name: res.userInfo.name,
        nickName: res.userInfo.nickName,
        roleName_zh: '',
      }
      setUser(userInfo)
    })
  }, [])

  return (
    <GlobalLayout
      user={user}
      basename="dashboard"
      resourceTree={resourceTree}
      appRoutes={routesConfig}
    >
      {props.children}
    </GlobalLayout>
  )
}

export default App

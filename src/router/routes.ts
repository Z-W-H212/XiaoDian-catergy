// import auth from '@/constants/authority'
import { Route } from './utils'

export const publicRoutes: Route[] = [
  {
    path: '/detail',
    title: '盈亏策略',
    resCode: 'dashobard-detail',
    component: () => import('@/containers/dashboard/components/new'),
  },
  // {
  //   path: '/logged',
  //   title: '登录',
  //   component: () => import('@/containers/login/logged'),
  // },
]

export const privateRoutes: Route[] = [
  {
    path: '/datadecision/dashboard',
    title: '数据策略运营平台',
    resCode: 'dashboard',
    component: () => import('@/containers/dashboard'),
    children: [
      {
        path: '/detail',
        title: '盈亏策略',
        resCode: 'dashobard-detail',
        component: () => import('@/containers/dashboard/components/new'),
      },
    ],
  },
]

export const redirectRoutes = [
  // {
  //   path: '/404',
  //   component: '/redirect/no-match',
  //   title: 'no-match',
  // },
  // {
  //   path: '/403',
  //   component: '/redirect/unauthorized',
  //   title: 'unauthorized',
  // },
  // {
  //   path: '/500',
  //   component: '/redirect/server-error',
  //   title: 'no-match',
  // },
  // {
  //   path: '*',
  //   component: '/redirect/no-match-redirect',
  //   title: 'no-match-redirect',
  // },
]

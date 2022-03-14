import { lazy } from 'react'
// import { RouteComponentProps } from 'react-router-dom'

export type ImportCom = {
  default: React.FC
}

type PathDataItem = { path: string, title: string }

export interface Route {
  title: string,
  path: string,
  pathData?: PathDataItem[],
  permission?: boolean,
  redirect?: string,
  resCode?: string,
  type?: '0' | '1' | '2',
  authority?: string[],
  children?: Route[],
  component(): Promise<ImportCom>,
}

export interface FlattenedRoute extends Route {
  Component: React.LazyExoticComponent<React.FC>
}

export function supplyRoutes (
  routes: Route[],
  parentPath = '',
  pathData: PathDataItem[] = [],
): Route[] {
  return routes.map((route) => {
    const path = parentPath + route.path
    const _pathData = [...pathData]
    _pathData.push({ path, title: route.title })
    const config = {
      ...route,
      path,
      pathData: _pathData,
    }

    if (route.children) {
      config.children = supplyRoutes(
        route.children,
        config.path,
        [..._pathData],
      )
    }

    return config
  })
}

export const flattenRoutes = (routes: Route[]): Route[] => {
  const flattenedRoutes = [] as Route[]

  (function recursion (_routes: Route[]) {
    _routes.forEach((route) => {
      flattenedRoutes.push(route)
      if (route.children) {
        recursion(route.children)
        delete route.children
      }
    })
  })(routes)

  return flattenedRoutes
}

export function generateRouteConfig (routes: Route[]): FlattenedRoute[] {
  return flattenRoutes(supplyRoutes(routes)).map((route) => {
    const Component = lazy(route.component)
    return {
      ...route,
      Component,
    }
  })
}

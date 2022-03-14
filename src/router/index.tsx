import { RouterProps } from 'react-router'
import { Router, Route, Redirect, Switch } from 'react-router-dom'
import { AsyncComponent } from '@dian/ui-common'
import { generateRouteConfig, FlattenedRoute } from './utils'
import { publicRoutes, privateRoutes, redirectRoutes } from './routes'
import App from '@/containers/app'

const privateRoutesConfig = generateRouteConfig(privateRoutes)
const publicRoutesConfig = generateRouteConfig(publicRoutes)
const redirectRoutesConfig = generateRouteConfig(redirectRoutes)

function mapRoutes (routes: FlattenedRoute[]) {
  // fallback
  return routes.map(({ path, Component }) => {
    return (
      <Route exact key={path} path={path}>
        <AsyncComponent delay={200} fallback={() => null}>
          <Component />
        </AsyncComponent>
      </Route>
    )
  })
}

function BaseRouter ({ history }: RouterProps) {
  return (
    <Router history={history}>
      <Switch>
        {mapRoutes(publicRoutesConfig)}
        <Route path="/">
          <App routesConfig={privateRoutesConfig}>
            <Switch>
              <Redirect exact from="/" to="datadecision/dashboard/detail" />
              {mapRoutes(privateRoutesConfig)}
              {mapRoutes(redirectRoutesConfig)}
            </Switch>
          </App>
        </Route>
      </Switch>
    </Router>
  )
}

export default BaseRouter

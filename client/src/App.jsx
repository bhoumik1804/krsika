import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { routes } from './config/routes'
import { flattenRoutes } from './utils/routeUtils'
import PageLoader from './components/PageLoader'
import RouteLoader from './components/RouteLoader'

// Lazy load layout and login for better initial load
const AppLayout = lazy(() => import('./components/layout/AppLayout'))
const Login = lazy(() => import('./pages/Login'))

export default function App() {
  // Get all routes in flat array for easier mapping
  const allRoutes = flattenRoutes(routes)

  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      {/* Full PageLoader only for initial app/layout load */}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Login page - no layout */}
          <Route path="/" element={<Login />} />

          {/* Authenticated routes with AppLayout */}
          <Route element={<AppLayout />}>
            {/* Declarative routes - map from config */}
            {allRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <Suspense fallback={<RouteLoader />}>
                    <route.component />
                  </Suspense>
                }
              />
            ))}
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

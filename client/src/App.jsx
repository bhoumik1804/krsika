import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import AppLayout from './components/layout/AppLayout'
import Login from './pages/Login'
import { routes } from './config/routes'
import { flattenRoutes } from './utils/routeUtils'

export default function App() {
  // Get all routes in flat array for easier mapping
  const allRoutes = flattenRoutes(routes)

  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
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
              element={<route.component />}
            />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

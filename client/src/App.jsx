import React from 'react'
import { BrowserRouter, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import AppLayout from './components/layout/AppLayout'
import { routes } from './config/routes'
import { generateRoutes } from './utils/routeUtils'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <AppLayout>
        <Routes>
          {generateRoutes(routes)}
        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}

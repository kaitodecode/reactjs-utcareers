import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { AppRouter } from './routes'
import { Toaster } from 'react-hot-toast'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={AppRouter} />
    <Toaster
      position='top-right'
      toastOptions={{
        style: {
          fontSize: '16px',
          padding: '16px',
          maxWidth: '400px',
          minWidth: '300px',
          lineHeight: '1.4',
          borderRadius: '8px',
          fontWeight: '500',
          color: '#1a1a1a',
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
        },
        duration: 4000,
        position: 'top-right',
        success: {
          iconTheme: {
            primary: '#2ecc71',
            secondary: '#ffffff'
          }
        },
        error: {
          iconTheme: {
            primary: '#e74c3c',
            secondary: '#ffffff'
          }
        }
      }}
    />
  </StrictMode>,
)

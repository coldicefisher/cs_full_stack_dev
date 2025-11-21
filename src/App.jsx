import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import PropTypes from 'prop-types'
import { createBrowserRouter } from 'react-router-dom'
import { routes } from './routes.jsx' // <-- your routes array file

const router = createBrowserRouter(routes)

const queryClient = new QueryClient()

import { SocketIOContextProvider } from './contexts/SocketIOContext.jsx'
import { RouterProvider } from 'react-router-dom'

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <SocketIOContextProvider>
          <RouterProvider router={router}></RouterProvider>
        </SocketIOContextProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  )
}

App.propTypes = {
  children: PropTypes.node.isRequired,
}

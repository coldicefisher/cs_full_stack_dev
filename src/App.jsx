import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import PropTypes from 'prop-types'
import { ApolloProvider } from '@apollo/client/react/index.js'
import { ApolloClient, InMemoryCache } from '@apollo/client/core/index.js'

import { io } from 'socket.io-client'

const queryClient = new QueryClient()

const apolloClient = new ApolloClient({
  uri: import.meta.env.VITE_GRAPHQL_URL,
  cache: new InMemoryCache(),
})

const socket = io(import.meta.env.VITE_SOCKET_HOST, {
  query: 'room=' + new URLSearchParams(window.location.search).get('room'),
  auth: {
    token: new URLSearchParams(window.location.search).get('token'),
  },
})
socket.on('connect_error', (err) => {
  console.error('Socket Authentication Error:', err.message)
})

socket.on('connect', async () => {
  console.log('Connected to socket io as: ', socket.id)
  socket.emit(
    'chat.message',
    new URLSearchParams(window.location.search).get('mymsg'),
  )
  const userInfo = await socket.emitWithAck('user.info', socket.id)
  console.log('test world')
  console.log('user info', userInfo)
})

socket.on('chat.message', (msg) => {
  console.log(`${msg.username}: ${msg.msg}`)
})

import { HelmetProvider } from 'react-helmet-async'

export function App({ children }) {
  return (
    <HelmetProvider>
      <ApolloProvider client={apolloClient}>
        <QueryClientProvider client={queryClient}>
          <AuthContextProvider>{children}</AuthContextProvider>
        </QueryClientProvider>
      </ApolloProvider>
    </HelmetProvider>
  )
}

App.propTypes = {
  children: PropTypes.node.isRequired,
}

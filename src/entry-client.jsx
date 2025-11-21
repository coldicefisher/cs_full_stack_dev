// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import { App } from './App.jsx'
// import './index.css'
// import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import { routes } from './routes.jsx'

// const router = createBrowserRouter(routes)

// ReactDOM.hydrateRoot(
//   document.getElementById('root'),
//   <React.StrictMode>
//     <App>
//       <RouterProvider router={router} />
//     </App>
//   </React.StrictMode>,
// )

console.log('[client] entry-client loaded')
window.addEventListener('error', (e) =>
  console.error('[window.onerror]', e.error || e.message),
)
window.addEventListener('unhandledrejection', (e) =>
  console.error('[unhandledrejection]', e.reason),
)

import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { App } from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routes } from './routes.jsx'

const router = createBrowserRouter(routes)
const container = document.getElementById('root')

const app = (
  <React.StrictMode>
    <App>
      <RouterProvider router={router} />
    </App>
  </React.StrictMode>
)

if (container && container.hasChildNodes()) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}

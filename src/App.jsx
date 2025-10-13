import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { createBrowserRouter } from 'react-router-dom'
import { routes } from './routes.jsx'
import { Router } from 'express'

const router = createBrowserRouter(routes)
ReactDOM.hydrateRoot(
  document.getElementById('root'),
  <React.StrictMode>
    <App>
      <Router router={router} />
    </App>
  </React.StrictMode>,
)

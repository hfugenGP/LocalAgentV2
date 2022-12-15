import ReactDOM from 'react-dom/client'
import { StyledEngineProvider } from '@mui/material/styles'
import React from 'react'
import Layout from './components/Layout'
import './styles/main.scss'
import { Provider } from 'react-redux'
import store from './store'

const root = ReactDOM.createRoot(document.getElementById('app') as HTMLElement)
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <StyledEngineProvider injectFirst>
        <Layout />
      </StyledEngineProvider>
    </Provider>
  </React.StrictMode>,
)

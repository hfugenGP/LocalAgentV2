import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Typography from '@mui/material/Typography'
import React, { Suspense } from 'react'
import Sidebar from '../../components/Sidebar'
import { Route, Routes } from 'react-router'
import { HashRouter as Router } from 'react-router-dom'
import Invoice from '../../pages/Invoice'
import Payments from '../../pages/Payments'
import OnlinePayments from '../../pages/OnlinePayments'
import DebitNotes from '../../pages/DebitNotes'
import InvoiceUpload from '../../pages/InvoiceUpload'
import ReceiptUpload from '../../pages/ReceiptUpload'

const drawerWidth = 240

interface LayoutProps {
  window?: () => Window
}
const Layout: React.FC<LayoutProps> = ({ window }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }
  const container =
    window !== undefined ? () => window().document.body : undefined
  return (
    <Suspense>
      <Router>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar
            position="fixed"
            sx={{
              width: { sm: `calc(100% - ${drawerWidth}px)` },
              ml: { sm: `${drawerWidth}px` },
            }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                Local Agent
              </Typography>
            </Toolbar>
          </AppBar>
          <Sidebar width={drawerWidth} container={container} />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: { sm: `calc(100% - ${drawerWidth}px)` },
            }}
          >
            <Toolbar />

            <Routes>
              <Route path="/" element={<Invoice key="invoice" />} />
              <Route path="/payments" element={<Payments key="payments" />} />
              <Route
                path="/online-payments"
                element={<OnlinePayments key="online-payments" />}
              />
              <Route
                path="/debit-notes"
                element={<DebitNotes key="debit-notes" />}
              />
              <Route
                path="/upload-invoices"
                element={<InvoiceUpload key="upload-invoices" />}
              />
              <Route
                path="/upload-receipts"
                element={<ReceiptUpload key="upload-receipts" />}
              />
            </Routes>
          </Box>
        </Box>
      </Router>
    </Suspense>
  )
}

export default Layout

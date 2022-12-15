import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import PaymentIcon from '@mui/icons-material/Payment'
import EventNoteIcon from '@mui/icons-material/EventNote'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DevicesIcon from '@mui/icons-material/Devices'
import LocalAtmIcon from '@mui/icons-material/LocalAtm'
import React, { useState } from 'react'
import ListItemLink from '../ListItemLink'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import ReceiptIcon from '@mui/icons-material/Receipt'
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard'
import { Collapse } from '@mui/material'

const Sidebar: React.FC<{ width: number; container: any }> = ({
  width,
  container,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandUpload, setExpandUpload] = useState(false)
  const [expandPayments, setExpandPayments] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleExpandUpload = () => {
    setExpandUpload(!expandUpload)
  }

  const handleExpandPayment = () => {
    setExpandPayments(!expandPayments)
  }

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItemLink
          to="/"
          primary="Invoices"
          icon={<InsertDriveFileIcon />}
        />
        <ListItemButton onClick={handleExpandPayment}>
          <ListItemIcon>
            <PaymentIcon />
          </ListItemIcon>
          <ListItemText primary="Payments" />
          {expandPayments ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={expandPayments} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemLink
              to="/payments"
              primary="Unpaid Invoices"
              icon={<DevicesIcon />}
              sx={{ pl: 4 }}
            />
            <ListItemLink
              to="/online-payments"
              primary="Online Payments"
              icon={<LocalAtmIcon />}
              sx={{ pl: 4 }}
            />
          </List>
        </Collapse>
        <ListItemLink
          to="/debit-notes"
          primary="Debit Notes"
          icon={<EventNoteIcon />}
        />
      </List>
      <Divider />
      <List>
        <ListItemButton onClick={handleExpandUpload}>
          <ListItemIcon>
            <CloudUploadIcon />
          </ListItemIcon>
          <ListItemText primary="Upload" />
          {expandUpload ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={expandUpload} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemLink
              to="/upload-invoices"
              primary="Invoices"
              icon={<InsertDriveFileIcon />}
              sx={{ pl: 4 }}
            />
            <ListItemLink
              to="/upload-receipts"
              primary="Receipts"
              icon={<ReceiptIcon />}
              sx={{ pl: 4 }}
            />
            <ListItemLink
              to="/upload-statements"
              primary="Statements"
              icon={<DeveloperBoardIcon />}
              sx={{ pl: 4 }}
            />
          </List>
        </Collapse>
      </List>
    </div>
  )
  return (
    <Box
      component="nav"
      sx={{ width: { sm: width }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: width,
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: width,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  )
}

export default Sidebar

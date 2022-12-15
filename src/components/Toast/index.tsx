import { AlertColor, Snackbar } from '@mui/material'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import React, { forwardRef, SyntheticEvent } from 'react'

interface ToastProps {
  children: JSX.Element
  severity: AlertColor | undefined
  open: boolean
  handleClose: (event?: SyntheticEvent | Event, reason?: string) => void
  duration?: number | undefined
}

const Toast: React.FC<ToastProps> = ({
  children,
  severity,
  open,
  handleClose,
  duration,
}) => {
  const Alert = forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
  })
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      sx={{ width: 500 }}
    >
      <Alert severity={severity} sx={{ width: '100%' }}>
        {children}
      </Alert>
    </Snackbar>
  )
}

export default Toast

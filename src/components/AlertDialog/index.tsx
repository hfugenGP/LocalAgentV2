import {
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  DialogActions,
  Button,
  DialogContentText,
} from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'
import React, { forwardRef, ReactElement, Ref } from 'react'

interface AlertDialogPop {
  children: JSX.Element
  open: boolean
  handleClose: () => void
  title: string
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement<any, any>
  },
  ref: Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const AlertDialog: React.FC<AlertDialogPop> = ({
  children,
  open,
  handleClose,
  title,
}) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {children}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default AlertDialog

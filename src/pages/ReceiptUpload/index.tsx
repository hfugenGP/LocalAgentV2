import {
  AlertTitle,
  Breadcrumbs,
  Button,
  Divider,
  Typography,
} from '@mui/material'
import React, { ChangeEvent, useState } from 'react'
import FileUpload from '../../components/FileUpload'
import AddIcon from '@mui/icons-material/Add'
import Upload from '@mui/icons-material/Upload'
import Toast from '../../components/Toast'
import config from '../../config'
import { useDispatch, useSelector } from 'react-redux'
import { AuthSliceState } from '../../interface/authSlice'
import {
  handleSplitReceipt,
  handleUploadReceipt,
} from '../../store/receiptUploadSlice'
import { ReceiptUploadSliceState } from 'interface/receiptUploadSlice'
import { ReceiptsListTable } from './components/receiptsListTable'

interface PrepUploadErrorProps {
  error: boolean
  message: string | null
}

const ReceiptUpload: React.FC = () => {
  const dispatch = useDispatch<any>()
  const auth = useSelector((state: AuthSliceState) => state.auth)
  const receiptUploadPdf = useSelector(
    (state: ReceiptUploadSliceState) => state.receiptUpload,
  )
  const [preUploadError, setPreUploadError] = useState<PrepUploadErrorProps>({
    error: false,
    message: null,
  })
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined,
  ) => {
    const target = event?.target as HTMLInputElement
    if (target && target.files && target.files.length > 0) {
      const { type, size, path } = target.files[0] as File & {
        path: string
      }
      // Check file type
      if (type !== 'application/pdf') {
        setPreUploadError({
          error: true,
          message: 'Unsupported file type. Please select a PDF to upload.',
        })
        return
      }

      // Check file size
      if (size * 0.000001 > config.uploadLimit) {
        setPreUploadError({
          error: true,
          message: `Please select a PDF that\'s equal to or lower than ${config.uploadLimit} MB.`,
        })
        return
      }

      dispatch(
        handleSplitReceipt({
          pdfPath: path,
          token: auth.token,
        }),
      )
    }
  }
  const handleCloseToast = (
    _: Event | React.SyntheticEvent<Element, Event> | undefined,
    reason?: string | undefined,
  ) => {
    setPreUploadError({
      error: false,
      message: null,
    })
  }
  const handleExportToKiple = () => {
    // const { pdfList } = receiptUploadPdf
    /*if (!pdfList || pdfList.length === 0) {
      setPreUploadError({
        error: true,
        message: 'No PDFs to export.',
      })
      return
    }*/
    dispatch(
      handleUploadReceipt({
        pdfPath: `C:\\eStream\\split\\officialreceipts\\20220928181630_0.pdf`,
        token: auth.token,
      }),
    )
  }

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Typography color="text.primary">Upload</Typography>/
        <Typography color="text.primary">Receipts</Typography>
      </Breadcrumbs>
      <Divider sx={{ marginTop: '15px', marginBottom: '15px' }} />
      <Button variant="contained" component="label" color="primary">
        {' '}
        <AddIcon /> Upload a file
        <FileUpload onChange={handleChange} />
      </Button>
      <Button
        variant="contained"
        component="label"
        color="primary"
        sx={{ marginLeft: '25px' }}
        onClick={handleExportToKiple}
      >
        {' '}
        <Upload /> Export to Kiple
      </Button>
      <ReceiptsListTable
        pdfList={receiptUploadPdf.pdfList}
        pdfPath={config.splitReceipts}
      />
      <Toast
        severity="warning"
        open={preUploadError.error}
        handleClose={handleCloseToast}
        duration={5000}
      >
        <>
          <AlertTitle>Upload Receipt</AlertTitle>
          <p>{preUploadError.message}</p>
        </>
      </Toast>
      <Toast
        severity="info"
        open={receiptUploadPdf.splitStatus !== null}
        handleClose={handleCloseToast}
        duration={5000}
      >
        <>
          <AlertTitle>Upload Receipt</AlertTitle>
          <p>Splitting receipt</p>
        </>
      </Toast>
    </>
  )
}

export default ReceiptUpload

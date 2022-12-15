import { Breadcrumbs, Button, Divider, Typography } from '@mui/material'
import { Container } from '@mui/system'
import AddIcon from '@mui/icons-material/Add'
import React, { ChangeEvent } from 'react'
import FileUpload from '../../components/FileUpload'

const InvoiceUpload: React.FC = () => {
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined,
  ) => {
    const target = event?.target as HTMLInputElement
    if (target && target.files && target.files.length > 0) {
      for (let index = 0; index < target.files.length; index++) {
        console.log(target.files[index])
        console.log(`MB: ${target.files[index].size * 0.000001}`)
      }
    }
  }
  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Typography color="text.primary">Upload</Typography>/
        <Typography color="text.primary">Invoices</Typography>
      </Breadcrumbs>
      <Divider sx={{ marginTop: '15px', marginBottom: '15px' }} />
      <Container fixed>
        <Button variant="contained" component="label" color="primary">
          {' '}
          <AddIcon /> Upload a file
          <FileUpload onChange={handleChange} />
        </Button>
      </Container>
    </>
  )
}

export default InvoiceUpload

import {
  Alert,
  AlertTitle,
  Breadcrumbs,
  Divider,
  TableCell,
  Typography,
} from '@mui/material'
import React, { useState, useEffect, MouseEvent, ChangeEvent } from 'react'
import * as moment from 'moment'
import InvoiceDataTable from './components/invoiceDataTable'
import AlertDialog from '../../components/AlertDialog'
import { useSelector, useDispatch } from 'react-redux'
import { verifyUser } from '../../store/authSlice'
import { AuthSliceState } from '../../interface/authSlice'
import {
  getInvoices,
  invoiceActions,
  transportInvoice,
} from '../../store/invoiceSlice'
import { InvoiceSliceState } from '../../interface/invoiceSlice'
import Toast from '../../components/Toast'
import DateFilter from '../../components/DateFilter'

const Invoice: React.FC<{}> = () => {
  const dispatch = useDispatch<any>()
  const auth = useSelector((state: AuthSliceState) => state.auth)
  const invoiceTransport = useSelector(
    (state: InvoiceSliceState) => state.invoice,
  )
  /*const [invoiceRecords, setInvoiceRecords] = useState<{
    list: InvoiceData[]
    pageCount: number
  }>({ list: [], pageCount: 0 })*/
  const [pageNumber, setPageNumber] = useState(0)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [filterErrors, setFilterErrors] = useState<{
    startDate: string
    endDate: string
  }>({ startDate: '', endDate: '' })
  const [searchFilters, setSearchFilters] = useState<string | null>(null)
  const [invoiceExport, setInvoiceExport] = useState<InvoiceData[]>([])
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [sortDirection, setSortDirection] = useState<string>('DOCKEY DESC')
  const handleHeaderClick = (event: MouseEvent<HTMLTableCellElement>) => {
    const { dataset } = event.currentTarget
    if (dataset.name === 'EXPORT') {
      return
    }

    if (dataset.name) {
      const sorting = sortDirection.substring(
        sortDirection.indexOf(' ') + 1,
        sortDirection.length,
      )
      const direction = sorting === 'DESC' ? 'ASC' : 'DESC'
      setSortDirection(`${dataset.name} ${direction}`)
    }
  }
  const tableColumns = [
    { name: 'DOCKEY', id: 'DOCKEY' },
    { name: 'INVOICE NUMBER', id: 'DOCNO' },
    { name: 'UNIT NUMBER', id: 'CODE' },
    { name: 'DESCRIPTION', id: 'DESCRIPTION' },
    { name: 'DOCUMENT DATE', id: 'DOCDATE' },
    { name: 'AMOUNT', id: 'DOCAMT' },
    { name: 'PAID AMOUNT', id: 'PAYMENTAMT' },
    { name: 'EXPORT', id: 'EXPORT' },
  ].map((item, _) => {
    return (
      <TableCell
        key={item.id}
        data-name={item.id}
        onClick={handleHeaderClick}
        className="invoice-header-mouse-over"
      >
        {item.name}
      </TableCell>
    )
  })

  const validateSearch = () => {
    let temp: { startDate: string; endDate: string } = {
      startDate: '',
      endDate: '',
    }
    temp.startDate = startDate ? '' : 'Start Date is required.'
    temp.endDate = endDate ? '' : 'End Date is required.'
    setFilterErrors(temp)
    return Object.values(temp).every((t) => t == '')
  }
  const handleChangePage = (
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPageNumber(newPage)
    // clear checked items
    setInvoiceExport([])
  }

  const handleStartDateChange = (newValue: Date | null) => {
    setFilterErrors({ startDate: '', endDate: '' })
    setStartDate(newValue)
  }

  const handleEndtDateChange = (newValue: Date | null) => {
    setFilterErrors({ startDate: '', endDate: '' })
    setEndDate(newValue)
  }

  const handleSearch = (event: MouseEvent<HTMLButtonElement> | null) => {
    event?.preventDefault()
    if (validateSearch()) {
      const filter = `POSTDATE >= '${moment(startDate).format(
        'DD.MM.YYYY',
      )}' AND POSTDATE <= '${moment(endDate).format('DD.MM.YYYY')}'`
      setSearchFilters(filter)
    }
  }

  const handleReset = (event: MouseEvent<HTMLButtonElement> | null) => {
    setFilterErrors({ startDate: '', endDate: '' })
    setStartDate(null)
    setEndDate(null)
    setSearchFilters(null)
    setPageNumber(0)
    setInvoiceExport([])
  }

  const handleCheck = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = event.target
    if (checked) {
      const invoice = invoiceTransport.list.filter(
        (invoice) => invoice.DOCKEY == Number(value),
      )
      if (invoice && invoice.length > 0) {
        invoiceExport.push(invoice[0])
        setInvoiceExport(invoiceExport)
        return
      }
    }

    setInvoiceExport(
      invoiceExport.filter((invoice) => invoice.DOCKEY != Number(value)),
    )
  }

  const handleExport = (event: MouseEvent<HTMLButtonElement> | null) => {
    if (invoiceExport.length === 0) {
      setDialogOpen(true)
      return
    }

    dispatch(
      transportInvoice({
        invoices: invoiceExport,
        token: auth.token as string,
      }),
    )
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  const handleCloseToast = () => {
    dispatch(invoiceActions.resetState())
  }

  useEffect(() => {
    if (!auth.isLoggedIn) {
      dispatch(verifyUser())
    }
    dispatch(
      getInvoices({
        page: pageNumber,
        filters: searchFilters,
        sort: sortDirection,
      }),
    )
  }, [pageNumber, searchFilters, sortDirection])
  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Typography color="text.primary">Invoices</Typography>
      </Breadcrumbs>
      <Divider sx={{ marginTop: '15px', marginBottom: '15px' }} />
      {auth.error !== null ? (
        <Alert severity="warning" className="invoice-alert-warning">
          <AlertTitle>Warning</AlertTitle>
          {auth.error}
        </Alert>
      ) : null}
      <DateFilter
        handleSearch={handleSearch}
        handleReset={handleReset}
        handleExport={handleExport}
        handleStartDateChange={handleStartDateChange}
        handleEndtDateChange={handleEndtDateChange}
        startDate={startDate}
        endDate={endDate}
        filterErrors={filterErrors}
      />
      <Divider sx={{ marginTop: '15px', marginBottom: '15px' }} />
      <InvoiceDataTable
        tableColumns={tableColumns}
        pageNumber={pageNumber}
        handleCheck={handleCheck}
        handleChangePage={handleChangePage}
        invoiceRecords={{ list: invoiceTransport.list, pageCount: 10 }}
      />
      <AlertDialog
        open={dialogOpen}
        handleClose={handleDialogClose}
        title="No invoice selected."
      >
        <>Please select invoices to export.</>
      </AlertDialog>
      <Toast
        severity="warning"
        open={invoiceTransport.exportStatus === 'failed' ? true : false}
        handleClose={handleCloseToast}
        duration={3000}
      >
        {invoiceTransport.error as any}
      </Toast>
      <Toast
        severity={invoiceTransport.inserted.length > 0 ? 'success' : 'warning'}
        open={invoiceTransport.exportStatus === 'success' ? true : false}
        handleClose={handleCloseToast}
        duration={10000}
      >
        <>
          {invoiceTransport.message && invoiceTransport.message.length > 0 ? (
            invoiceTransport.message
          ) : (
            <div>
              <h4>Invoice Export Results:</h4>
              <p>Duplicates: {invoiceTransport.duplicates.length}</p>
              <p>Nonexistent: {invoiceTransport.nonexistent.length}</p>
              <p>Updated: {invoiceTransport.updated.length}</p>
            </div>
          )}
        </>
      </Toast>
      <Toast
        severity="info"
        open={invoiceTransport.exportStatus === 'pending' ? true : false}
        handleClose={handleCloseToast}
        duration={3000}
      >
        <>
          <AlertTitle>Exporting Invoices</AlertTitle>
          <p>Please do not close this window.</p>
        </>
      </Toast>
    </>
  )
}

export default Invoice

import moment from 'moment'
import React, { useEffect, useState, MouseEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AuthSliceState } from '../../interface/authSlice'
import config from '../../config'
import {
  checkPendingInvoices,
  checkSqlPayments,
  paymentActions,
} from '../../store/paymentStlice'
import PendingInvoicesDataTable from './components/pendingInvoicesDataTable'
import { AlertTitle, Breadcrumbs, Divider, Typography } from '@mui/material'
import DateFilter from '../../components/DateFilter'
import Toast from '../../components/Toast'

const Payments: React.FC<{}> = () => {
  const dispatch = useDispatch<any>()
  const [queryDates, setQueryDates] = useState<{
    start: Date | null
    end: Date | null
  }>({
    start: new Date(),
    end: new Date(),
  })
  const [filterErrors, setFilterErrors] = useState<{
    startDate: string
    endDate: string
  }>({ startDate: '', endDate: '' })
  const auth = useSelector((state: AuthSliceState) => state.auth)
  const pendingInvoice = useSelector(
    (state: PaymentSliceState) => state.payment,
  )
  const [pageNumber, setPageNumber] = useState(0)
  const [unsettledInvoices, setUnsettledInvoices] = useState<
    PendingInvoiceProp[]
  >([])
  const validateSearch = () => {
    let temp: { startDate: string; endDate: string } = {
      startDate: '',
      endDate: '',
    }
    temp.startDate = queryDates.start ? '' : 'Start Date is required.'
    temp.endDate = queryDates.end ? '' : 'End Date is required.'
    setFilterErrors(temp)
    return Object.values(temp).every((t) => t == '')
  }
  const handleSearch = (event: MouseEvent<HTMLButtonElement> | null) => {
    setFilterErrors({ startDate: '', endDate: '' })
    event?.preventDefault()
    if (validateSearch()) {
      dispatch(
        checkPendingInvoices({
          invoiceQuery: {
            uuid: config.residenceUuid,
            status: ['PENDING', 'OVERDUE'],
            start: moment(queryDates.start).format('YYYY-MM-DD'),
            end: moment(queryDates.end).format('YYYY-MM-DD'),
          },
          token: auth.token,
        }),
      )
    }
  }
  const handleReset = (_: MouseEvent<HTMLButtonElement> | null) => {
    setFilterErrors({ startDate: '', endDate: '' })
    setQueryDates({ start: new Date(), end: new Date() })
    dispatch(
      checkPendingInvoices({
        invoiceQuery: {
          uuid: config.residenceUuid,
          status: ['PENDING', 'OVERDUE'],
          start: moment(new Date()).format('YYYY-MM-DD'),
          end: moment(new Date()).format('YYYY-MM-DD'),
        },
        token: auth.token,
      }),
    )
  }
  const handleExport = (event: MouseEvent<HTMLButtonElement> | null) => {
    event?.preventDefault()
    if (unsettledInvoices && unsettledInvoices.length > 0) {
      dispatch(
        checkSqlPayments({
          invoices: unsettledInvoices,
          token: auth.token,
        }),
      )
    }
  }
  const handleStartDateChange = (newValue: Date | null) => {
    setFilterErrors({ startDate: '', endDate: '' })
    queryDates.start = newValue
    setQueryDates(queryDates)
  }
  const handleEndtDateChange = (newValue: Date | null) => {
    setFilterErrors({ startDate: '', endDate: '' })
    queryDates.end = newValue
    setQueryDates(queryDates)
  }
  const handleChangePage = (
    _: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPageNumber(newPage)
    setUnsettledInvoices([])
  }
  const handleCheck = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    const { value } = event.target
    const pending: PendingInvoiceProp = JSON.parse(value)
    if (checked) {
      unsettledInvoices.push(pending)
      setUnsettledInvoices(unsettledInvoices)
    }

    if (!checked) {
      setUnsettledInvoices(
        unsettledInvoices.filter(
          (invoice) => invoice.reference_id !== pending.reference_id,
        ),
      )
    }
  }
  const handleCloseToast = () => {
    dispatch(paymentActions.resetState())
  }
  useEffect(() => {
    dispatch(
      checkPendingInvoices({
        invoiceQuery: {
          uuid: config.residenceUuid,
          status: ['PENDING', 'OVERDUE'],
          start: moment(queryDates.start).format('YYYY-MM-DD'),
          end: moment(queryDates.end).format('YYYY-MM-DD'),
        },
        token: auth.token,
      }),
    )
  }, [])

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Typography color="text.primary">Payments</Typography>/
        <Typography color="text.primary">Unpaid Invoices</Typography>
      </Breadcrumbs>
      <Divider sx={{ marginTop: '15px', marginBottom: '15px' }} />
      <DateFilter
        handleSearch={handleSearch}
        handleReset={handleReset}
        handleExport={handleExport}
        handleStartDateChange={handleStartDateChange}
        handleEndtDateChange={handleEndtDateChange}
        startDate={queryDates.start}
        endDate={queryDates.end}
        filterErrors={filterErrors}
      />
      <Divider sx={{ marginTop: '15px', marginBottom: '15px' }} />
      <PendingInvoicesDataTable
        invoiceRecords={pendingInvoice.unpaidInvoices}
        pageNumber={pageNumber}
        handleChangePage={handleChangePage}
        handleCheck={handleCheck}
        key={pageNumber} // uncheck the checkboxes on page change.
      />
      <Toast
        severity="info"
        open={pendingInvoice.fetchStatus === 'pending' ? true : false}
        handleClose={handleCloseToast}
      >
        <>
          <AlertTitle>Retrieving Pending Invoices</AlertTitle>
          <p>Please do not close this window.</p>
        </>
      </Toast>
      <Toast
        severity="info"
        open={pendingInvoice.exportStatus === 'pending' ? true : false}
        handleClose={handleCloseToast}
      >
        <>
          <AlertTitle>Exporting Payments</AlertTitle>
          <p>Please do not close this window.</p>
        </>
      </Toast>
      <Toast
        severity={
          pendingInvoice.updatedInvoices.length > 0 ? 'success' : 'warning'
        }
        open={pendingInvoice.updatedInvoices.length > 0 ? true : false}
        handleClose={handleCloseToast}
        duration={10000}
      >
        <div>
          <h4>Invoice Export Results:</h4>
          <p>Updated: {pendingInvoice.updatedInvoices.length}</p>
        </div>
      </Toast>
      <Toast
        severity="error"
        open={pendingInvoice.error !== null ? true : false}
        handleClose={handleCloseToast}
        duration={10000}
      >
        <>
          <AlertTitle>Failed to connect to Kiple Home</AlertTitle>
          <p>{pendingInvoice.error}</p>
          <p>Please double check if you can connect to the internet.</p>
        </>
      </Toast>
    </>
  )
}

export default Payments

import { AlertTitle, Breadcrumbs, Divider, Typography } from '@mui/material'
import DateFilter from '../../components/DateFilter'
import React, { useEffect, useState, MouseEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  checkAdyenOrders,
  doPayments,
  paymentActions,
} from '../../store/paymentStlice'
import { AuthSliceState } from '../../interface/authSlice'
import moment from 'moment'
import config from '../../config'
import { AdyenPaymentsTable } from './components/adyenPaymentsTable'
import Toast from '../../components/Toast'

const OnlinePayments: React.FC<{}> = () => {
  const dispatch = useDispatch<any>()
  const auth = useSelector((state: AuthSliceState) => state.auth)
  const adyenOrders = useSelector((state: PaymentSliceState) => state.payment)
  const [adyenExports, setAdyenExports] = useState<AdyenPaymentResults[]>([])
  const [filterErrors, setFilterErrors] = useState<{
    startDate: string
    endDate: string
  }>({ startDate: '', endDate: '' })
  const [queryDates, setQueryDates] = useState<{
    start: Date | null
    end: Date | null
  }>({
    start: new Date(),
    end: new Date(),
  })
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
        checkAdyenOrders({
          invoiceQuery: {
            start: moment(queryDates.start).format('YYYY-MM-DD'),
            end: moment(queryDates.end).format('YYYY-MM-DD'),
            uuid: config.residenceUuid,
          },
          token: auth.token,
        }),
      )
    }
  }
  const handleReset = () => {}
  const handleExport = (event: MouseEvent<HTMLButtonElement> | null) => {
    if (adyenExports && adyenExports.length > 0) {
      dispatch(doPayments({ payments: adyenExports, token: auth.token }))
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
  const handleCheck = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    const { value } = event.target
    const payment: AdyenPaymentResults = JSON.parse(value)
    if (checked) {
      adyenExports.push(payment)
      setAdyenExports(adyenExports)
    }

    if (!checked) {
      setAdyenExports(
        adyenExports.filter((adyen) => adyen.invoice_no !== payment.invoice_no),
      )
    }
  }
  const handleCloseToast = () => {
    dispatch(paymentActions.resetState())
  }
  useEffect(() => {
    dispatch(
      checkAdyenOrders({
        invoiceQuery: {
          start: moment(queryDates.start).format('YYYY-MM-DD'),
          end: moment(queryDates.end).format('YYYY-MM-DD'),
          uuid: config.residenceUuid,
        },
        token: auth.token,
      }),
    )
  }, [])
  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Typography color="text.primary">Payments</Typography>/
        <Typography color="text.primary">Online Payments</Typography>
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
      <AdyenPaymentsTable
        adyenRecords={adyenOrders.adyenPayments}
        handleCheck={handleCheck}
      />
      <Toast
        severity="info"
        open={adyenOrders.recordPaymentStatus === 'pending' ? true : false}
        handleClose={handleCloseToast}
      >
        <>
          <AlertTitle>Recording Payments</AlertTitle>
          <p>Please do not close this window.</p>
        </>
      </Toast>
    </>
  )
}

export default OnlinePayments

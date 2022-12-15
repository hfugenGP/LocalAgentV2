import { AlertTitle, Breadcrumbs, Divider, Typography } from '@mui/material'
import DateFilter from '../../components/DateFilter'
import React, { MouseEvent, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  debitNoteActions,
  exportDebitNotes,
  getDebitNotes,
} from '../../store/debitNoteSlice'
import { DebitNoteSliceState } from '../../interface/debiteNoteSlice'
import { DebitNotesTable } from './components/debitNotesTable'
import { AR_DN } from '../../interface/arDn'
import { AuthSliceState } from '../../interface/authSlice'
import Toast from '../../components/Toast'

const DebitNotes: React.FC = ({}) => {
  const auth = useSelector((state: AuthSliceState) => state.auth)
  const dispatch = useDispatch<any>()
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
  const debitNote = useSelector((state: DebitNoteSliceState) => state.debitNote)
  const [debitToExport, setDebitToExport] = useState<AR_DN[]>([])
  const [pageNumber, setPageNumber] = useState(0)
  const handleSearch = (event: MouseEvent<HTMLButtonElement> | null) => {
    event?.preventDefault()
    dispatch(
      getDebitNotes({
        start: queryDates.start,
        end: queryDates.end,
        page: 0,
      }),
    )
  }
  const handleReset = (event: MouseEvent<HTMLButtonElement> | null) => {}
  const handleExport = (event: MouseEvent<HTMLButtonElement> | null) => {
    event?.preventDefault()
    if (debitToExport && debitToExport.length > 0) {
      dispatch(exportDebitNotes({ notes: debitToExport, token: auth.token }))
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
    const note: AR_DN = JSON.parse(value)
    if (checked) {
      debitToExport.push(note)
      setDebitToExport(debitToExport)
      return
    }

    if (!checked) {
      setDebitToExport(
        debitToExport.filter((debit) => debit.DOCNO !== note.DOCNO),
      )
    }
  }
  const handleCloseToast = () => {
    dispatch(debitNoteActions.resetState())
  }
  const handleChangePage = (
    _: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPageNumber(newPage)
    setDebitToExport([])
  }
  useEffect(() => {
    dispatch(
      getDebitNotes({
        start: queryDates.start,
        end: queryDates.end,
        page: pageNumber,
      }),
    )
  }, [pageNumber])
  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Typography color="text.primary">Debit Notes</Typography>
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
      <DebitNotesTable
        debitNote={debitNote.due}
        handleCheck={handleCheck}
        pageNumber={pageNumber}
        handleChangePage={handleChangePage}
      />
      <Toast
        severity="info"
        open={debitNote.exportStatus === 'pending' ? true : false}
        handleClose={handleCloseToast}
      >
        <>
          <AlertTitle>Exporting Debit Notes</AlertTitle>
          <p>Please do not close this window.</p>
        </>
      </Toast>
      <Toast
        severity={
          debitNote.export.inserted && debitNote.export.inserted.length > 0
            ? 'success'
            : 'warning'
        }
        open={debitNote.exportStatus === 'done' ? true : false}
        handleClose={handleCloseToast}
        duration={10000}
      >
        <>
          {debitNote.export.message && debitNote.export.message.length > 0 ? (
            debitNote.export.message.length
          ) : (
            <div>
              <h4>Debit Notes Export Results:</h4>
              <p>Inserted: {debitNote.export.inserted.toString()}</p>
              <p>Duplicates: {debitNote.export.duplicates.toString()}</p>
              <p>Nonexistent: {debitNote.export.nonexistent.toString()}</p>
              <p>Updated: {debitNote.export.updated.toString()}</p>
            </div>
          )}
        </>
      </Toast>
      <Toast
        severity="error"
        open={debitNote.due.error !== null ? true : false}
        handleClose={handleCloseToast}
        duration={10000}
      >
        <>
          <AlertTitle>Debit Notes Error</AlertTitle>
          <p>{JSON.stringify(debitNote.due.error)}</p>
        </>
      </Toast>
    </>
  )
}

export default DebitNotes

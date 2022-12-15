import {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material'
import React, { MouseEvent } from 'react'
import * as moment from 'moment'
import { AR_DN } from '../../../interface/arDn'

interface DebitNotesTableProps {
  debitNote: {
    count: number
    invoices: AR_DN[]
    error: string | null | undefined
  }
  handleCheck: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void
  pageNumber: number
  handleChangePage: (
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => void
}

export const DebitNotesTable: React.FC<DebitNotesTableProps> = ({
  debitNote,
  handleCheck,
  pageNumber,
  handleChangePage,
}) => {
  const tableColumns = [
    'DOCKEY',
    'INVOICE NUMBER',
    'UNIT NUMBER',
    'DESCRIPTION',
    'DOCUMENT DATE',
    'DUE DATE',
    'AMOUNT',
    '',
  ].map((col, index) => {
    return (
      <TableCell component="th" key={index}>
        {col}
      </TableCell>
    )
  })

  return (
    <>
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 650 }}
          aria-label="simple table"
          className="invoice-export-list"
        >
          <TableHead>
            <TableRow>{tableColumns}</TableRow>
          </TableHead>
          <TableBody>
            {debitNote.invoices && debitNote.invoices.length > 0 ? (
              debitNote.invoices.map((row, index) => (
                <TableRow
                  key={row.DOCKEY}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell scope="row" key={index + 1}>
                    {row.DOCKEY}
                  </TableCell>
                  <TableCell scope="row" key={index + 2}>
                    {row.DOCNO}
                  </TableCell>
                  <TableCell scope="row" key={index + 3}>
                    {row.CODE}
                  </TableCell>
                  <TableCell scope="row" key={index + 4}>
                    {row.DESCRIPTION}
                  </TableCell>
                  <TableCell scope="row" key={index + 5}>
                    {moment(row.DOCDATE).format('DD MMM YYYY')}
                  </TableCell>
                  <TableCell scope="row" key={index + 6}>
                    {moment(row.DUEDATE).format('DD MMM YYYY')}
                  </TableCell>
                  <TableCell scope="row" key={index + 7}>
                    {row.DOCAMT}
                  </TableCell>
                  <TableCell scope="row" key={index + 8}>
                    <Checkbox
                      key={index + 9}
                      value={JSON.stringify(row)}
                      onChange={handleCheck}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No Debit Notes found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                component="td"
                count={debitNote.count}
                page={pageNumber}
                onPageChange={handleChangePage}
                rowsPerPage={10}
                rowsPerPageOptions={[10]}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  )
}

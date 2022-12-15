import {
  Table,
  TableContainer,
  Paper,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableFooter,
  TablePagination,
  Checkbox,
} from '@mui/material'
import React, { MouseEvent } from 'react'

interface PendingInvoicesDataTableProps {
  invoiceRecords: PendingInvoiceProp[]
  pageNumber: number
  handleChangePage: (
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => void
  handleCheck: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void
}

const PendingInvoicesDataTable: React.FC<PendingInvoicesDataTableProps> = ({
  invoiceRecords,
  pageNumber,
  handleChangePage,
  handleCheck,
}) => {
  const tableColumns = [
    'INVOICE NUMBER',
    'AMOUNT',
    'OUTSTANDING AMOUNT',
    'STATUS',
    '',
  ].map((col, index) => {
    return (
      <TableCell component="th" key={index}>
        {col}
      </TableCell>
    )
  })
  const pageSlice = pageNumber * 10
  const limitSlice = (pageNumber: number, recordCount: number): number => {
    let limit = (pageNumber / 10 + 1) * 10
    if (limit > recordCount) {
      limit = recordCount
    }

    if (limit === 0) {
      limit = 10
    }
    return limit
  }

  return (
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
          {invoiceRecords.length != 0 ? (
            invoiceRecords
              .slice(pageSlice, limitSlice(pageSlice, invoiceRecords.length))
              .map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.reference_id}</TableCell>
                  <TableCell>{row.amount_cents / 100}</TableCell>
                  <TableCell>{row.outstanding_amount_cents / 100}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>
                    <Checkbox
                      value={JSON.stringify(row)}
                      onChange={handleCheck}
                    />
                  </TableCell>
                </TableRow>
              ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No Unpaid invoices.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              component="td"
              count={invoiceRecords.length}
              page={pageNumber}
              onPageChange={handleChangePage}
              rowsPerPage={10}
              rowsPerPageOptions={[10]}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  )
}

export default PendingInvoicesDataTable

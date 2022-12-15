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
import moment from 'moment'
import React, { ChangeEvent, MouseEvent } from 'react'

interface InvoiceDataTableProps {
  tableColumns: JSX.Element[]
  pageNumber: number
  handleCheck: (event: ChangeEvent<HTMLInputElement>) => void
  handleChangePage: (
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => void
  invoiceRecords: {
    list: InvoiceData[]
    pageCount: number
  }
}

const InvoiceDataTable: React.FC<InvoiceDataTableProps> = ({
  tableColumns,
  pageNumber,
  handleCheck,
  handleChangePage,
  invoiceRecords,
}) => {
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
          {invoiceRecords.list && invoiceRecords.list.length > 0 ? (
            invoiceRecords.list.map((row: InvoiceData, index: number) => (
              <TableRow
                key={row.DOCKEY}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell key={index + 1} scope="row">
                  {row.DOCKEY}
                </TableCell>
                <TableCell key={index + 2} scope="row">
                  {row.DOCNO}
                </TableCell>
                <TableCell key={index + 3} scope="row">
                  {row.CODE}
                </TableCell>
                <TableCell key={index + 4} scope="row">
                  {row.DESCRIPTION}
                </TableCell>
                <TableCell key={index + 5} scope="row">
                  {moment(row.DOCDATE).format('DD MMM YYYY')}
                </TableCell>
                <TableCell key={index + 6} scope="row">
                  {row.LOCALDOCAMT}
                </TableCell>
                <TableCell key={index + 7} scope="row">
                  {row.PAYMENTAMT}
                </TableCell>
                <TableCell key={index + 8} scope="row">
                  <Checkbox
                    key={index + 9}
                    value={row.DOCKEY}
                    onChange={handleCheck}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} align="center">
                No invoice(s) found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              component="td"
              count={invoiceRecords.pageCount}
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

export default InvoiceDataTable

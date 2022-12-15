import {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import React from 'react'

interface AdyenPaymentsTableProps {
  adyenRecords: AdyenPaymentResults[]
  handleCheck: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void
}

export const AdyenPaymentsTable: React.FC<AdyenPaymentsTableProps> = ({
  adyenRecords,
  handleCheck,
}) => {
  const tableColumns = [
    'INVOICE NUMBER',
    'DESCRIPTION',
    'AMOUNT',
    'AMOUNT PAID',
    'UNIT NAME',
    'PAYMENT DATE',
    '',
  ].map((col, index) => {
    return (
      <TableCell component="th" key={index}>
        {col}
      </TableCell>
    )
  })
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
          {adyenRecords && adyenRecords.length > 0 ? (
            adyenRecords.map((adyen, index) => (
              <TableRow key={index}>
                <TableCell>{adyen.invoice_no}</TableCell>
                <TableCell>{adyen.description}</TableCell>
                <TableCell>{adyen.amount_cents / 100}</TableCell>
                <TableCell>{adyen.amount_paid / 100}</TableCell>
                <TableCell>{adyen.unit_name}</TableCell>
                <TableCell>{adyen.payment_date}</TableCell>
                <TableCell>
                  <Checkbox
                    value={JSON.stringify(adyen)}
                    onChange={handleCheck}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center">
                No Payments found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

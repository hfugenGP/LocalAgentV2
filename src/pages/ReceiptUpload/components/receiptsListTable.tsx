import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import React from 'react'

interface ReceiptsListTableProps {
  pdfList: string[]
  pdfPath: string
}

export const ReceiptsListTable: React.FC<ReceiptsListTableProps> = ({
  pdfList,
  pdfPath,
}) => {
  const tableColumns = ['Title', 'Full Path', 'Status'].map((col, index) => {
    return (
      <TableCell component="th" key={index}>
        {col}
      </TableCell>
    )
  })
  return (
    <>
      <h4>PDF List</h4>
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
            {pdfList && pdfList.length > 0 ? (
              pdfList.map((pdf, index) => (
                <TableRow key={index}>
                  <TableCell>{pdf}</TableCell>
                  <TableCell>
                    {pdfPath}\{pdf}
                  </TableCell>
                  <TableCell> </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No PDFs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

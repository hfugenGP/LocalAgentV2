import { Box, Button, Grid, TextField, TextFieldProps } from '@mui/material'
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import React, { MouseEvent } from 'react'
import Form from '../../components/Form'

interface DateFilterProps {
  handleSearch: (event: MouseEvent<HTMLButtonElement> | null) => void
  handleReset: (event: MouseEvent<HTMLButtonElement> | null) => void
  handleExport: (event: MouseEvent<HTMLButtonElement> | null) => void
  handleStartDateChange: (newValue: Date | null) => void
  handleEndtDateChange: (newValue: Date | null) => void
  startDate: Date | null
  endDate: Date | null
  filterErrors: {
    startDate: string
    endDate: string
  }
}
const DateFilter: React.FC<DateFilterProps> = ({
  handleSearch,
  handleReset,
  handleExport,
  handleStartDateChange,
  handleEndtDateChange,
  startDate,
  endDate,
  filterErrors,
}) => {
  return (
    <Form onSubmit={handleSearch} onReset={handleReset}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <DesktopDatePicker
                label="Start Date"
                inputFormat="MM/dd/yyyy"
                value={startDate}
                onChange={handleStartDateChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={filterErrors.startDate !== ''}
                    helperText={filterErrors.startDate}
                  />
                )}
              />
            </Grid>
            <Grid item xs={2}>
              <DesktopDatePicker
                label="End Date"
                inputFormat="MM/dd/yyyy"
                value={endDate}
                onChange={handleEndtDateChange}
                renderInput={(
                  params: JSX.IntrinsicAttributes & TextFieldProps,
                ) => (
                  <TextField
                    {...params}
                    error={filterErrors.endDate !== ''}
                    helperText={filterErrors.endDate}
                  />
                )}
              />
            </Grid>
            <Grid item xs={4} style={{ paddingTop: '24px' }}>
              <Button variant="contained" type="submit">
                Search
              </Button>
              <Button
                variant="contained"
                style={{ marginLeft: '10px' }}
                type="reset"
              >
                Clear
              </Button>
              <Button
                variant="contained"
                style={{ marginLeft: '10px' }}
                onClick={handleExport}
              >
                Export
              </Button>
            </Grid>
          </Grid>
        </Box>
      </LocalizationProvider>
    </Form>
  )
}

export default DateFilter

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PayloadRejected } from "../interface/invoiceSlice";
import InvoiceService from "../service/invoicesService";



export interface PayloadFulfilled {
  payload: {
    data: {
      result: {
        message: string,
        inserted: any[],
        duplicates: any[],
        nonexistent: any[],
        updated: any[]
      },
      status: string
    }
  }
}

/**
 * 
 */
export const getInvoices = createAsyncThunk('invoice/getInvoices', async (params: { page: number, filters: string | null, sort: string }, { rejectWithValue }) => {
  try {
    const { page, filters, sort } = params;
    const result = await window.api.arIv(`FIRST 10 SKIP ${page * 10} *`,
      filters,
      `${sort}`,);
    return result;
  } catch (error) {
    return rejectWithValue(error);
  }
});

/**
 * Export invoices from AR_IV to kiplehome DB
 * 
 */
export const transportInvoice = createAsyncThunk('invoice/transportInvoice', async (exportParams: { invoices: InvoiceData[], token: string }, { rejectWithValue }) => {
  try {
    const { invoices, token } = exportParams;
    const result = await InvoiceService.export(invoices, token).catch(error => error)
    if (result.name && result.name === "AxiosError") {
      throw new Error(result.message)
    }
    return result
  } catch (error) {
    return rejectWithValue(error);
  }
});



const invoiceSlice = createSlice({
  name: 'invoice',
  initialState: {
    error: null,
    exportStatus: null,
    message: null,
    inserted: [],
    duplicates: [],
    nonexistent: [],
    updated: [],
    list: []
  },
  reducers: {
    resetState(state) {
      state = Object.assign(state, { error: null, exportStatus: null, message: null });
    }
  },
  extraReducers(builder) {
    builder.addCase(transportInvoice.fulfilled, (state, action) => {
      const { payload } = action as PayloadFulfilled;
      state = Object.assign(state, {
        error: null,
        exportStatus: payload.data.status,
        message: payload.data.result.message,
        inserted: payload.data.result.inserted,
        duplicates: payload.data.result.duplicates,
        nonexistent: payload.data.result.nonexistent,
        updated: payload.data.result.updated
      });
    })
    builder.addCase(transportInvoice.pending, (state, action) => {
      state = Object.assign(state, { error: null, exportStatus: 'pending' });
    })
    builder.addCase(transportInvoice.rejected, (state, action) => {
      const { payload: { message } } = action as PayloadRejected;
      state = Object.assign(state, { error: message, exportStatus: 'failed' });
    })
    builder.addCase(getInvoices.fulfilled, (state, action) => {
      const { payload } = action;
      state = Object.assign(state, { list: payload.invoices, error: payload.error, exportStatus: null });
    })
    builder.addCase(getInvoices.pending, (state, action) => { })
    builder.addCase(getInvoices.rejected, (state, action) => {
      const { payload: { message } } = action as PayloadRejected;
      state = Object.assign(state, { error: message });
    })
  }
})

export const invoiceActions = invoiceSlice.actions;
export default invoiceSlice;
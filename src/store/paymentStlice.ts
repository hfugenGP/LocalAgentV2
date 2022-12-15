import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UpdateBills from "../utils/updateBills";
import InvoiceService from "../service/invoicesService";
import InsertPayment from "../utils/insertPayment";
import PaymentService from "../service/paymentService";

interface PayloadFulfilled {
  payload: {
    data: {
      result: PendingInvoiceProp[];
    }
  }
}

/**
 * Check kiple home for pending invoices. Export payments back to kiple home if any.
 * 
 */
export const checkPendingInvoices = createAsyncThunk('payment/checkPendingInvoices', async (queryParams: { invoiceQuery: PendingInvoiceQuery, token: string | null }, { rejectWithValue }) => {
  try {
    const { invoiceQuery, token } = queryParams;
    const result = await InvoiceService.pendingInvoices(invoiceQuery, token);
    if (result.name && result.name === "AxiosError") {
      throw new Error(result.message)
    }
    return result
  } catch (error) {
    return rejectWithValue(error);
  }
})

/**
 * Check payments for pending invoices. 
 * Export payments to kiplehome db.
 * 
 */
export const checkSqlPayments = createAsyncThunk('invoice/checkSqlpayments', async (pending: { invoices: PendingInvoiceProp[], token: string | null }, { rejectWithValue }) => {
  try {
    const { invoices, token } = pending;
    const payments = await UpdateBills.checkPayment(invoices);
    let result = null;
    if (payments && payments.length > 0) {
      result = await InvoiceService.exportPayments(payments, token).catch(error => error)
      if (result.name && result.name === "AxiosError") {
        throw new Error(result.message)
      }
    }
    return result;
  } catch (error) {
    return rejectWithValue(error);
  }
});

/**
 * Check payments made via the kiplelive app
 * 
 */
export const checkAdyenOrders = createAsyncThunk('invoice/checkAdyenOrders', async (queryParams: { invoiceQuery: AdyenPaymentQuery, token: string | null }, { rejectWithValue }) => {
  try {
    const { invoiceQuery, token } = queryParams;
    const adyenPayments = await PaymentService.adyenPayments(invoiceQuery, token);
    return adyenPayments;
  } catch (error) {
    return rejectWithValue(error);
  }
});

/**
 * Insert payments to SQL Accounting
 * 
 */
export const doPayments = createAsyncThunk('invoice/doPayments', async (params: { payments: AdyenPaymentResults[], token: string | null }, { rejectWithValue }) => {
  try {
    const { payments, token } = params;
    const result = await InsertPayment.doPayment(payments, token);
    return result;
  } catch (error) {
    return rejectWithValue(error);
  }
});

const pendingInvoiceSlice = createSlice({
  name: 'payment',
  initialState: {
    fetchStatus: null,
    error: null,
    unpaidInvoices: [],
    exportStatus: null,
    updatedInvoices: [],
    message: null,
    adyenPayments: [],
    recordPaymentStatus: null,
  },
  reducers: {
    resetState(state) {
      state = Object.assign(state, { error: null, exportStatus: null, message: null, fetchStatus: null, updatedInvoices: [] });
    }
  },
  extraReducers(builder) {
    builder.addCase(checkPendingInvoices.fulfilled, (state, action: PayloadFulfilled) => {
      const { payload } = action;
      state = Object.assign(state, { unpaidInvoices: payload.data.result, fetchStatus: null, exportStatus: null });
    })
    builder.addCase(checkPendingInvoices.pending, (state, _) => {
      state = Object.assign(state, { error: null, fetchStatus: 'pending' });
    })
    builder.addCase(checkPendingInvoices.rejected, (state, action) => {
      const { payload } = action as any;
      state = Object.assign(state, { error: payload.message, fetchStatus: null });
    })
    builder.addCase(checkSqlPayments.fulfilled, (state, action) => {
      const { payload } = action;
      state = Object.assign(state, { updatedInvoices: payload.data.result.updated, fetchStatus: null, exportStatus: null })
    })
    builder.addCase(checkSqlPayments.pending, (state, _) => {
      state = Object.assign(state, { error: null, exportStatus: 'pending' });
    })
    builder.addCase(checkSqlPayments.rejected, (state, action) => {
      const { payload } = action as any;
      state = Object.assign(state, { error: payload.message, exportStatus: null });
    })
    builder.addCase(checkAdyenOrders.fulfilled, (state, action) => {
      const { payload } = action;
      state = Object.assign(state, { adyenPayments: payload.data.result, fetchStatus: null, exportStatus: null })
    })
    builder.addCase(checkAdyenOrders.pending, (state, _) => {
      state = Object.assign(state, { error: null, fetchStatus: 'pending' });
    })
    builder.addCase(checkAdyenOrders.rejected, (state, action) => {
      const { payload } = action as any;
      state = Object.assign(state, { error: payload.message, fetchStatus: null });
    })
    builder.addCase(doPayments.fulfilled, (state, _) => {
      state = Object.assign(state, { error: null, recordPaymentStatus: null })
    })
    builder.addCase(doPayments.pending, (state, _) => {
      state = Object.assign(state, { error: null, recordPaymentStatus: 'pending' });
    })
    builder.addCase(doPayments.rejected, (state, action) => {
      const { payload } = action as any;
      state = Object.assign(state, { error: payload.message, recordPaymentStatus: null });
    })
  }
})

export const paymentActions = pendingInvoiceSlice.actions;
export default pendingInvoiceSlice;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PayloadRejected } from "../interface/invoiceSlice";
import * as moment from 'moment';
import SendDebitNotes from "../utils/sendDebitNotes";
import { AR_DN } from "../interface/arDn";
import { PayloadFulfilled } from "./invoiceSlice";

/**
 * 
 */
export const getDebitNotes = createAsyncThunk('debitNote/retrieve', async (params: { start: Date | null, end: Date | null, page: number }, { rejectWithValue }) => {
  try {
    const { start, end, page } = params;
    const result = await window.api.arDn(`FIRST 10 SKIP ${page * 10} *`, `DOCDATE >= '${moment(start).format('YYYY-MM-DD')}' AND DOCDATE <= '${moment(end).format('YYYY-MM-DD')}'`, 'DOCKEY ASC');
    return result;
  } catch (error) {
    return rejectWithValue(error);
  }
});

/**
 * 
 */
export const exportDebitNotes = createAsyncThunk('debitNote/exportDebitNotes', async (pending: { notes: AR_DN[], token: string | null }, { rejectWithValue }) => {
  try {
    const result = await SendDebitNotes.transport(pending);
    return result;
  } catch (error) {
    return rejectWithValue(error);
  }
});

const debitNoteSlice = createSlice({
  name: 'debitNote',
  initialState: {
    error: null,
    exportStatus: null,
    due: {
      count: 0,
      invoices: [],
      error: null
    },
    export: {
      duplicates: [],
      inserted: [],
      nonexistent: [],
      message: null,
      updated: []
    }
  },
  reducers: {
    resetState(state) {
      state = Object.assign(state, { error: null, exportStatus: null });
    }
  },
  extraReducers(builder) {
    builder.addCase(getDebitNotes.fulfilled, (state, action) => {
      const { payload } = action;
      state = Object.assign(state, {
        error: null,
        due: payload
      })
    });
    builder.addCase(getDebitNotes.pending, (state, _) => {
      state = Object.assign(state, { error: null })
    })
    builder.addCase(getDebitNotes.rejected, (state, action) => {
      const { payload: { message } } = action as PayloadRejected;
      state = Object.assign(state, { error: message });
    })
    builder.addCase(exportDebitNotes.fulfilled, (state, action) => {
      const { payload } = action as PayloadFulfilled;
      state = Object.assign(state, { error: null, export: payload.data.result, exportStatus: "done" })
    });
    builder.addCase(exportDebitNotes.pending, (state, _) => {
      state = Object.assign(state, { error: null, exportStatus: "pending" })
    })
    builder.addCase(exportDebitNotes.rejected, (state, action) => {
      const { payload: { message } } = action as PayloadRejected;
      state = Object.assign(state, { error: message, exportStatus: null });
    })
  }
});

export const debitNoteActions = debitNoteSlice.actions;
export default debitNoteSlice;
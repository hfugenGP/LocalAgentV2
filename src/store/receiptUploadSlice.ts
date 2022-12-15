import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import OfficialReceiptService from "../service/officialReceiptService";
import config from "../config";

export const handleSplitReceipt = createAsyncThunk('receiptUpload/handleSplitReceipt', async (params: { pdfPath: string, token: string | null }, { rejectWithValue }) => {
  try {
    const { pdfPath } = params;
    const result = await window.api.pdfSplit(pdfPath, config.splitReceipts);
    let pdfList: string[] = [];
    if (result === null) {
      pdfList = await window.api.pdfList(config.splitReceipts);
    }
    return pdfList;
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const handleUploadReceipt = createAsyncThunk('receiptUpload/handleUploadReceipt', async (params: { pdfPath: string | string[], token: string | null }, { rejectWithValue }) => {
  try {
    const { pdfPath, token } = params;
    // Upload PDF
    // const uuid = await OfficialReceiptService.uploadReceipt(pdfPath[0], token);
    const parse = await window.api.pdfParse(pdfPath[0]);
    if (parse === null) {
      throw new Error('Unable to parse PDF.');
    }
    const result = await OfficialReceiptService.processPdf(parse, token);
    if (result && result.error === true) {
      throw new Error(result.message);
    }
    return result;
  } catch (error) {
    return rejectWithValue(error)
  }
})

const receiptUploadSlice = createSlice({
  name: 'receiptUpload',
  initialState: {
    error: null,
    splitStatus: null,
    pdfList: []
  },
  reducers: {},
  extraReducers(builder) {
    builder.addCase(handleSplitReceipt.fulfilled, (state, action) => {
      state = Object.assign(state, { error: null, splitStatus: null, pdfList: action.payload });
    })
    builder.addCase(handleSplitReceipt.pending, (state, _) => {
      state = Object.assign(state, { error: null, splitStatus: 'pending' });
    })
    builder.addCase(handleSplitReceipt.rejected, (state, action) => {
      state = Object.assign(state, { error: 'Failed to split PDF.', splitStatus: null });
    })
    builder.addCase(handleUploadReceipt.fulfilled, (state, action) => {
      state = Object.assign(state, { error: null, splitStatus: null });
      console.log(action);
    })
    builder.addCase(handleUploadReceipt.pending, (state, _) => {
      state = Object.assign(state, { error: null, splitStatus: 'pending' });
    })
    builder.addCase(handleUploadReceipt.rejected, (state, action) => {
      state = Object.assign(state, { error: 'Failed to split PDF.', splitStatus: null });
    })
  }
})

export const receiptUploadActions = receiptUploadSlice.actions;
export default receiptUploadSlice;
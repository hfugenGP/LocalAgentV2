import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import invoiceSlice from "./invoiceSlice";
import pendingInvoiceSlice from "./paymentStlice";
import debitNoteSlice from "./debitNoteSlice";
import receiptUploadSlice from "./receiptUploadSlice";

const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        invoice: invoiceSlice.reducer,
        payment: pendingInvoiceSlice.reducer,
        debitNote: debitNoteSlice.reducer,
        receiptUpload: receiptUploadSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export default store
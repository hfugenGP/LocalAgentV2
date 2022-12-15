export interface ReceiptUploadSliceState {
  receiptUpload: {
    error: null | string;
    splitStatus: null | string;
    pdfList: string[];
  }
};
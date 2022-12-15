interface PaymentSliceState {
  payment: {
    fetchStatus: any,
    error: any;
    unpaidInvoices: PendingInvoiceProp[];
    exportStatus: any;
    updatedInvoices: any;
    message: any;
    adyenPayments: AdyenPaymentResults[];
    recordPaymentStatus: any;
  }
}
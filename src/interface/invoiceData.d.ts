interface InvoiceData {
  DOCKEY: number
  DOCNO: string
  CODE: string
  DESCRIPTION: string
  LOCALDOCAMT: number
  PAYMENTAMT: number
  DOCDATE: string
  PROJECT: string
  DUEDATE: string
  TERMS: string
}

interface PendingInvoiceQuery {
  uuid: string;
  status: string[];
  start: string;
  end: string;
}

interface PendingInvoiceProp {
  amount_cents: number;
  outstanding_amount_cents: number;
  reference_id: string;
  status: string;
  uuid: string;
}

interface AdyenPaymentQuery {
  start: string;
  end: string;
  uuid: string;
}

interface AdyenPaymentResults {
  amount_cents: number;
  amount_paid: number;
  area: string;
  billing_date: string;
  code: string;
  description: string;
  invoice_no: string;
  payment_date: string;
  project_code: string;
  residence: string;
  unit_name: string;
  uuid: string;
}
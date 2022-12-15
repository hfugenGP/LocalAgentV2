import { SqlBizzCredentials } from "./sqlBizzApp";
import { KiplePayment } from "../interface/kiplePayment";

export { }
declare global {
  interface Window {
    api: {
      arIv: (col: string, filter: string | null = null, sort: string | null = null) => Promise<{ count: number, invoices: AR_IV[], error: any }>;
      arDn: (col: string, filter: string | null = null, sort: string | null = null) => Promise<{ count: number, invoices: AR_DN[], error: any }>;
      orByInvoice: (invoiceNumber: string) => Promise<Receipt[]>;
      getSyDocNoDtl: (col: string, filter: string | null = null, sort: string | null = null) => Promise<SY_DOCNO_DTL[]>;
      updateSyDocNoDtl: (values: SY_DOCNO_DTL, condition: { idCol: string, idVal: any }) => Promise<SY_DOCNO_DTL>;
      sqlDoPayment: (params: KiplePayment) => { error: any };
      pdfSplit: (path: string, outPath: string) => Promise<any>;
      pdfParse: (path: string) => Promise<any>;
      pdfList: (path: string) => Promise<string[]>;
      scanReceipt: (dataText: string) => RegExpMatchArray | null;
      invoiceByReceipt: (receipt: string) => Promise<any>;
    }
  }
}
import OfficialReceipt from "./model/officialReceipt";
import DebitNote from "./model/debitNote";
import Invoice from "./model/invoice";
import ConnFireBird from "./utils/connFireBird";
import SyDocNoDtl from "./model/syDocNoDtl";
import SqlBizzApp from "./utils/sqlBizzApp";
import { KiplePayment } from "./interface/kiplePayment";
import PdfHandler from "./utils/pdfHandler";
import ScanReceipt from "./utils/scanReceipt";
const { contextBridge } = require('electron');

const syDoc = new SyDocNoDtl();

const API = {
  connFirebird: (sql: string) => ConnFireBird.dbConn(sql),
  arIv: (col: string, filter: string | null = null, sort: string | null = null) => {
    const arIv = new Invoice();
    return arIv.get(col, filter, sort);
  },
  arDn: (col: string, filter: string | null = null, sort: string | null = null) => {
    const arDn = new DebitNote();
    return arDn.get(col, filter, sort);
  },
  orByInvoice: (invoiceNumber: string) => {
    const officialReceipt = new OfficialReceipt();
    return officialReceipt.orByInvoice(invoiceNumber);
  },
  getSyDocNoDtl: (col: string, filter: string | null = null, sort: string | null = null) => {
    return syDoc.get(col, filter, sort);
  },
  updateSyDocNoDtl: (values: SY_DOCNO_DTL, condition: { idCol: string, idVal: any }) => {
    return syDoc.updateRecordById(values, condition);
  },
  sqlDoPayment: (params: KiplePayment) => {
    const sqlBizzApp = new SqlBizzApp({
      user: 'ADMIN',
      password: 'ADMIN',
      dcf: 'C:\\eStream\\SQLAccounting\\Share\\Default.DCF',
      fdb: 'ACC-0003.FDB'
    });
    sqlBizzApp.doPayment(params);
    return {
      error: sqlBizzApp.getError()
    }
  },
  pdfSplit: (path: string, outPath: string) => {
    return PdfHandler.split(path, outPath);
  },
  pdfParse: (path: string) => {
    return PdfHandler.parse(path);
  },
  pdfList: (path: string) => {
    return PdfHandler.listPdf(path);
  },
  scanReceipt: (dataText: string) => {
    return ScanReceipt.getReceipt(dataText);
  },
  invoiceByReceipt: (receipt: string) => {
    const invoice = new Invoice();
    return invoice.getByReceiptNumber(receipt);
  }
}

contextBridge.exposeInMainWorld('api', API)
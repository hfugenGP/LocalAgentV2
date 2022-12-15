import { AR_IV } from "../interface/arIv";
import InvoicePreRequest from "../utils/invoicePreRequest";
import LocalAgentRequest from "../utils/localAgentRequest";


export default class InvoiceService {

  private static _localAgentRequest = new LocalAgentRequest;

  /**
   * Export new invoices to kiplelive
   * 
   * @param invoices 
   * @param token
   * @return
   */
  public static async export(invoices: InvoiceData[], token: string | null): Promise<any> {
    const bills = InvoicePreRequest.buildList(invoices);
    const result = await this._localAgentRequest.post('/external-bill', {
      resource: bills
    }, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).catch(error => error);
    return result;
  }

  /**
   * Check for unpaid invoices in kiplelive db
   * 
   * @param queryString 
   * @param token 
   * @returns 
   */
  public static async pendingInvoices(queryString: PendingInvoiceQuery, token: string | null): Promise<any> {
    const result = await this._localAgentRequest.get('/external-bill', queryString, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).catch(error => error);
    return result;
  }

  /**
   * 
   * @param invoice 
   * @returns 
   */
  public static async arIvByInvoiceNumber(invoice: string): Promise<{
    count: number,
    invoices: AR_IV[],
    error: any
  }> {
    const filter = `DOCNO = '${invoice}'`;
    const result = await window.api.arIv('*', filter).catch((error) => {
      return {
        count: 0,
        invoices: [],
        error: error
      }
    })
    return result;
  }

  /**
   * Send updated invoice status to kiplehome db
   * 
   * @param invoices 
   * @param token 
   */
  public static async exportPayments(invoices: PendingInvoiceProp[], token: string | null): Promise<any> {
    const result = await this._localAgentRequest.patch('/external-bill', {
      resource: invoices
    }, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).catch(error => error);
    return result;
  }
}
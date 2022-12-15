import LocalAgentRequest from "../utils/localAgentRequest";
import { AR_IV } from "../interface/arIv";
import { Bill } from "../interface/bill";

export default class DebitNoteService {

  private static _localAgentRequest = new LocalAgentRequest;


  /**
   * 
   * 
   * @param invoice 
   * @returns 
   */
  public static async arDnByInvoiceNumber(invoice: string): Promise<{
    count: number,
    invoices: AR_IV[],
    error: any
  }> {
    const filter = `DOCNO = '${invoice}'`;
    const result = await window.api.arDn('*', filter).catch((error: any) => {
      return {
        count: 0,
        invoices: [],
        error: error
      }
    })
    return result;
  }

  /**
   * 
   * @param dNotes 
   * @param token 
   * @returns 
   */
  public static async sendToKiple(dNotes: Bill[], token: string | null) {
    const result = await this._localAgentRequest.post('/external-bill', {
      resource: dNotes
    }, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).catch(error => error);
    return result;
  }
}
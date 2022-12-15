import LocalAgentRequest from "../utils/localAgentRequest";

export default class PaymentService {

  private static _localAgentRequest = new LocalAgentRequest;

  /**
   * Check payments made via kiplelive app.
   * 
   * @param invoiceQuery 
   * @param token 
   * @returns 
   */
  public static async adyenPayments(invoiceQuery: AdyenPaymentQuery, token: string | null): Promise<any> {
    const result = await this._localAgentRequest.get('/adyen-payment', invoiceQuery, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).catch(error => error);
    return result;
  }
}
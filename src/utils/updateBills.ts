import DebitNoteService from "../service/debitNoteService";
import InvoiceService from "../service/invoicesService";

export default class UpdateBills {

  /**
   * Check for payments made in SQL Accounting local db.
   * 
   * @param invoices 
   */
  public static async checkPayment(invoices: PendingInvoiceProp[]): Promise<PendingInvoiceProp[]> {
    const result: PendingInvoiceProp[] = [];
    for (const invoice of invoices) {
      // Check in AR_INV
      const arInvoice = await InvoiceService.arIvByInvoiceNumber(invoice.reference_id);
      let balance = 0;
      if (arInvoice && arInvoice.count != 0) {
        balance = UpdateBills._adjustBalance(arInvoice.invoices[0].DOCAMT, arInvoice.invoices[0].PAYMENTAMT);
        result.push({
          amount_cents: arInvoice.invoices[0].DOCAMT * 100,
          outstanding_amount_cents: balance,
          reference_id: invoice.reference_id,
          status: UpdateBills._setStatus(balance, invoice.status),
          uuid: invoice.uuid
        });
        continue;
      }

      // Check in AR_DN
      const arDnInvoice = await DebitNoteService.arDnByInvoiceNumber(invoice.reference_id);
      if (arDnInvoice && arDnInvoice.count != 0) {
        balance = UpdateBills._adjustBalance(arDnInvoice.invoices[0].DOCAMT, arDnInvoice.invoices[0].PAYMENTAMT);
        result.push({
          amount_cents: arDnInvoice.invoices[0].DOCAMT * 100,
          outstanding_amount_cents: balance,
          reference_id: invoice.reference_id,
          status: UpdateBills._setStatus(balance, invoice.status),
          uuid: invoice.uuid
        });
        continue;
      }
    }
    return result;
  }

  /**
   * 
   * @param balance 
   * @param payment 
   * @returns 
   */
  private static _adjustBalance(balance: number, payment: number): number {
    let outstanding = 0;
    outstanding = (balance - payment) * 100;
    return outstanding;
  }

  /**
   * 
   * @param outstanding 
   * @param status 
   * @returns 
   */
  private static _setStatus(outstanding: number, status: string): string {
    let current = status;
    if (outstanding <= 0) {
      current = 'PAID';
    }
    return current;
  }
}
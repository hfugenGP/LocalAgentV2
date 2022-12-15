import config from "../config";
import moment from "moment";
import { Bill } from "../interface/bill";

export default class InvoicePreRequest {
  public static buildList(invoices: InvoiceData[]): Bill[] {
    const bills: Bill[] = invoices.map((invoice) => {
      const unit = invoice.CODE.split("-");
      return {
        reference_id: invoice.DOCNO,
        description: invoice.DESCRIPTION,
        project_code: invoice.PROJECT,
        status: InvoicePreRequest._billStatus(invoice.DUEDATE, invoice.LOCALDOCAMT, invoice.PAYMENTAMT),
        due_at: moment(invoice.DUEDATE).format('YYYY-MM-DD'),
        block: (unit[0] ? unit[0] : "Unit"),
        unit: (unit[1] ? unit[1] : ""),
        floor: (unit[2] ? unit[2] : ""),
        currency: "RM",
        amount_cents: (invoice.LOCALDOCAMT * 100),
        outstanding_amount_cents: (invoice.LOCALDOCAMT - invoice.PAYMENTAMT) * 100,
        reminder_days: Number(invoice.TERMS.substring(0, invoice.TERMS.indexOf("Days"))),
        type: InvoicePreRequest._billType(invoice.PROJECT),
        billing_date: moment(invoice.DOCDATE).format('YYYY-MM-DD'),
        residence_uuid: config.residenceUuid
      }
    });

    return bills;
  }

  /**
   * 
   * @param receipt 
   */
  public static invoicesByReceiptNumber(receipt: string) {

  }

  /**
   * 
   * @param dueDate 
   * @param amountDue 
   * @param paymentAmount 
   * @returns 
   */
  private static _billStatus(dueDate: string, amountDue: number, paymentAmount: number): string {
    let status = "PENDING"
    if (paymentAmount != 0 && (amountDue <= paymentAmount)) {
      status = "PAID"
      return status
    }

    if (!InvoicePreRequest._billOverDue(dueDate)) {
      status = "OVERDUE"
      return status
    }

    return status
  }

  /**
   * 
   * @param dueDate 
   * @returns 
   */
  private static _billOverDue(dueDate: string): boolean {
    let overdue = false
    const dateNow = moment();
    if (dateNow.diff(moment(dueDate), 'days') < 0) {
      overdue = true
    }
    return overdue
  }

  private static _billType(project: string): string {
    let type = "";
    switch (project) {
      case "WT": // WATER
      case "IWK": // INDAH WATER
      case "GAS": // GAS
        type = "UTILITY";
        break;
      default:
        type = "MANAGEMENT";
        break;
    }
    return type;
  }
}
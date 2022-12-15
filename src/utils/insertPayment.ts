import SyDocNoDtlService from "../service/syDocNoDtlService";
import config from "../config";
import { KiplePayment } from "../interface/kiplePayment";
import OfficialReceiptService from "../service/officialReceiptService";

export default class InsertPayment {

  private static _receiptsExport: KhOfficialReceipt[] = [];

  /**
   * 
   * @param payments 
   */
  public static async doPayment(payments: AdyenPaymentResults[], token: string | null): Promise<any> {
    if (payments && payments.length > 0) {
      for (const payment of payments) {
        const khReceipt = await window.api.orByInvoice(payment.invoice_no);
        if (khReceipt && khReceipt.length > 0) {
          this._receiptsExport.push({
            adyen_uuid: payment.uuid,
            or_no: khReceipt[0].OR_NUMBER,
            unit_name: khReceipt[0].UNIT_NAME,
            invoice_no: khReceipt[0].INVOICE_NUMBER,
            residence_uuid: config.residenceUuid
          })
        } else {
          await this._savePayment(payment);
        }
      }

      if (this._receiptsExport.length === 0) {
        return;
      }
      await this._exportReceipt(token);
      return;
    }
  }

  /**
   * 
   * @param payment 
   */
  private static async _savePayment(payment: AdyenPaymentResults): Promise<void> {
    let orsequence = 'OR-00000';
    const syDoc = await SyDocNoDtlService.get('*', 'PARENTKEY = 1');
    if (syDoc && syDoc.length > 0) {
      orsequence = `OR-${String(syDoc[0].NEXTNUMBER).padStart(5, '0')}`;
      // Increment for next official reciept 
      syDoc[0].NEXTNUMBER += 1;
      await SyDocNoDtlService.updateById(syDoc[0], { idCol: 'AUTOKEY', idVal: syDoc[0].AUTOKEY });
    }

    this._insertToArPm({
      ornumber: orsequence,
      unit_name: payment.unit_name,
      description: payment.description,
      amount: payment.amount_cents / 100,
      invoice_no: payment.invoice_no,
      payment_date: payment.payment_date,
      adyen_uuid: payment.uuid
    });
  }

  /**
   * 
   * @param payment 
   */
  private static _insertToArPm(payment: KiplePayment): void {
    const sqlDoPayment = window.api.sqlDoPayment(payment);
    if (sqlDoPayment.error == '') {
      this._receiptsExport.push({
        adyen_uuid: payment.adyen_uuid,
        or_no: payment.ornumber,
        unit_name: payment.unit_name,
        invoice_no: payment.invoice_no,
        residence_uuid: config.residenceUuid
      })
    }
  }

  /**
   * 
   * @param token 
   */
  private static async _exportReceipt(token: string | null): Promise<void> {
    if (this._receiptsExport && this._receiptsExport.length > 0) {
      await OfficialReceiptService.exportReceipt(this._receiptsExport, token);
    }
  }
}
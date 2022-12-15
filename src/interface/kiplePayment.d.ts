export interface KiplePayment {
  ornumber: string;
  unit_name: string;
  description: string;
  amount: number;
  invoice_no: string;
  payment_date: string;
  adyen_uuid: string;
}
import { KiplePayment } from "../interface/kiplePayment";
import { SqlBizzAppProp, SqlBizzCredentials } from "../interface/sqlBizzApp";
import * as moment from 'moment'
require('winax');

export default class SqlBizzApp {
  private _comServer: ActiveXObject & SqlBizzAppProp;
  private _errorMessage: any | null = null;
  private _user: string;
  private _password: string;
  private _dcf: string;
  private _fdb: string;

  /**
   * 
   * @param param 
   */
  constructor(param: SqlBizzCredentials) {
    this._comServer = new ActiveXObject('SQLAcc.BizApp');
    this._user = param.user;
    this._password = param.password;
    this._dcf = param.dcf;
    this._fdb = param.fdb;
    this._checkLogIn();
  }

  /**
   * Log in to SQL Accounting if not yet logged in.
   * 
   */
  private _checkLogIn(): void {
    if (!this._comServer.IsLogin) {
      try {
        this._comServer.Login(this._user, this._password, this._dcf, this._fdb);
      } catch (error) {
        const { description } = error;
        this._errorMessage = description ? description : error;
      }
    }
  }

  /**
   * 
   * @returns 
   */
  public isLogIn(): boolean | null {
    return this._comServer.IsLogin;
  }

  /**
   * 
   * @returns 
   */
  public getError(): any {
    return this._errorMessage;
  }

  /**
   * 
   * @param payment 
   */
  public doPayment(payment: KiplePayment): any {
    try {
      const bizObject = this._comServer.BizObjects.Find('AR_PM');
      const lMain = bizObject.DataSets.Find('MainDataSet');
      const lDetail = bizObject.DataSets.Find('cdsKnockOff');
      const lDate = moment().format('DD/MM/YYYY');
      bizObject.New();
      lMain.FindField("DOCKEY").value = -1;
      lMain.FindField("DocNo").value = payment.ornumber;
      lMain.FindField("CODE").value = payment.unit_name;
      lMain.FindField("DocDate").value = lDate;
      lMain.FindField("PostDate").Value = lDate;
      lMain.FindField("Description").value = payment.description;
      lMain.FindField('PaymentMethod').value = "320-000";
      lMain.FindField('Journal').value = "CASH";
      lMain.FindField('ChequeNumber').value = "KIPLEHOME - ONLINE";
      lMain.FindField('CurrencyCode').value = "----";
      lMain.FindField('CurrencyRate').value = "1.0000000000";
      lMain.FindField('DocAmt').value = payment.amount;
      lMain.FindField('BankCharge').value = 0;
      lMain.FindField('UnappliedAmt').value = 0;
      lMain.FindField('Cancelled').value = 'F';

      const v = this._comServer.CreateOleVariantArray(2);
      v.SetItem(0, 'IV');
      v.SetItem(1, payment.invoice_no);

      if (lDetail.Locate('DocType;DocNo', v.AsOleVariant(), false, false)) {
        lDetail.Edit();
        lDetail.FindField('KOAmt').value = payment.amount;
        lDetail.FindField('KnockOff').AsString = 'T';
        lDetail.Post();
      }

      bizObject.Save();
      bizObject.Close();
    } catch (error) {
      const { description } = error;
      this._errorMessage = description ? description : error;
    }

  }

  /**
   * autoInvoice
   */
  public autoInvoice() {
    try {
      const bizObject = this._comServer.BizObjects.Find('AR_IV');
      const lMain = bizObject.DataSets.Find('MainDataSet');
      const lDetail = bizObject.DataSets.Find('cdsDocDetail');
      bizObject.New();

      lMain.FindField('DocKey').value = -1;
      lMain.FindField('DocNo').value = "--IV Test--";
      lMain.FindField('DocDate').value = "01/10/2016";
      lMain.FindField('PostDate').value = "01/10/2016";
      lMain.FindField('Code').value = "300-A0003";
      lMain.FindField('Description').value = "Sales";

      /*For Tax Inclusive = True with override Tax Amount*/
      lDetail.Append();
      lDetail.FindField('DtlKey').value = -1;
      lDetail.FindField('DocKey').value = -1;
      lDetail.FindField('Account').value = "500-000";
      lDetail.FindField('Description').value = "Sales Item A";
      lDetail.FindField('Tax').value = null;
      lDetail.FindField('TaxInclusive').value = 0;
      lDetail.FindField('Amount').value = 410.37;
      lDetail.FindField('TaxAmt').value = 0;

      lDetail.DisableControls();
      lDetail.FindField('TaxInclusive').value = 1;
      lDetail.EnableControls();

      lDetail.FindField('Changed').value = "F";
      lDetail.Post();

      /*For Tax Inclusive = False with override Tax Amount*/
      lDetail.Append();
      lDetail.FindField('DtlKey').value = -1;
      lDetail.FindField('DocKey').value = -1;
      lDetail.FindField('Account').value = "500-000";
      lDetail.FindField('Description').value = "Sales Item B";
      lDetail.FindField('Tax').value = null;
      lDetail.FindField('TaxInclusive').value = 0;
      lDetail.FindField('Amount').value = 94.43;
      lDetail.FindField('TaxAmt').value = 5.66;
      lDetail.FindField('Changed').value = "F";
      lDetail.Post();

      bizObject.Save();
      bizObject.Close();
    } catch (error) {
      const { description } = error;
      this._errorMessage = description ? description : error;
    }
  }
}
import FirebirdDbconn from "../utils/firebirdDb";

export default class OfficialReceipt extends FirebirdDbconn {
  constructor() {
    super({
      host: 'localhost',
      port: 3050,
      path: `C:\\eStream\\SQLAccounting\\DB\\ACC-0003.FDB`,
      username: 'SYSDBA',
      password: 'masterkey',
      table: 'AR_IV'
    });
  }

  /**
   * 
   * @param invoiceNumber 
   */
  public async orByInvoice(invoiceNumber: string): Promise<any> {
    try {
      const sql = `SELECT a.DOCNO AS INVOICE_NUMBER, a.CODE AS UNIT_NAME, c.DOCNO AS OR_NUMBER 
                  FROM 
                  AR_IV AS a 
                  INNER JOIN AR_KNOCKOFF AS b 
                  ON a.DOCKEY = b.TODOCKEY 
                  INNER JOIN AR_PM AS c 
                  ON b.FROMDOCKEY = c.DOCKEY 
                  WHERE a.DOCNO = '${invoiceNumber}';`;
      const result = await this.customQuery<Receipt[]>(sql).catch(error => error)
      if (!Array.isArray(result)) {
        throw new Error(result);
      }
      return result;
    } catch (error) {
      return [];
    }
  }
}
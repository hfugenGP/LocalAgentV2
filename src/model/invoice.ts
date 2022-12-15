import { AR_IV } from "../interface/arIv";
import FirebirdDbconn from "../utils/firebirdDb";

export default class Invoice extends FirebirdDbconn {
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
   * @param col 
   * @param filter 
   * @returns 
   */
  public async get(col: string = 'FIRST 12 *', filter: string | null = null, sort: string | null = null): Promise<{ count: number, invoices: AR_IV[], error: any }> {
    try {
      let recordCount = 0;
      const result = await this.select<AR_IV[]>(col, filter, sort).catch((error) => error);
      if ('stack' in result) {
        throw new Error(result);
      }

      if (Array.isArray(result) && result.length > 0) {
        const countRes: any = await this.select('COUNT(*)', filter).catch((error) => error);
        if (Array.isArray(countRes) && countRes.length > 0) {
          recordCount = countRes[0].COUNT;
        }
      }
      return {
        count: recordCount,
        invoices: result,
        error: null
      };
    } catch (error) {
      return {
        count: 0,
        invoices: [],
        error: error
      };
    }
  }

  /**
   * 
   * @param receipt 
   */
  public async getByReceiptNumber(receipt: string): Promise<any> {
    try {
      const sql = `SELECT arpm.DOCNO AS OR_NUMBER, 
                  ariv.DOCNO AS INVOICE_NUMBER, 
                  ariv.DESCRIPTION, 
                  arknockoff.KOAMT, 
                  ariv.DOCAMT,
                  ariv.CODE AS UNIT_NUMBER
                FROM AR_PM AS arpm 
                LEFT JOIN AR_KNOCKOFF AS arknockoff 
                ON arpm.DOCKEY = arknockoff.FROMDOCKEY 
                LEFT JOIN AR_IV AS ariv 
                ON arknockoff.TODOCKEY = ariv.DOCKEY
                WHERE arpm.DOCNO = '${receipt}' 
                AND arknockoff.TODOCTYPE = 'IV'`;
      const result = await this.customQuery(sql).catch((error) => error);
      if (result === 'unknown') {
        throw new Error(result);
      }
      return result;
    } catch (error) {
      return [];
    }
  }
}
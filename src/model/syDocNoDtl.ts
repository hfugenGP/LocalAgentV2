import FirebirdDbconn from "../utils/firebirdDb";

export default class SyDocNoDtl extends FirebirdDbconn {
  constructor() {
    super({
      host: 'localhost',
      port: 3050,
      path: `C:\\eStream\\SQLAccounting\\DB\\ACC-0003.FDB`,
      username: 'SYSDBA',
      password: 'masterkey',
      table: 'SY_DOCNO_DTL'
    });
  }

  /**
   * 
   * @param col 
   * @param filter 
   * @param sort 
   * @returns 
   */
  public async get(col: string, filter: string | null = null, sort: string | null = null): Promise<SY_DOCNO_DTL[]> {
    try {
      const result = this.select<SY_DOCNO_DTL[]>(col, filter, sort).catch((error) => error);
      return result;
    } catch (error) {
      return [];
    }
  }

  /**
   * 
   * @param values 
   * @param condition 
   * @returns 
   */
  public async updateRecordById<SY_DOCNO_DTL>(values: SY_DOCNO_DTL, condition: { idCol: string, idVal: any }): Promise<SY_DOCNO_DTL> {
    try {
      const { idCol, idVal } = condition;
      const result = await this.updateById(values, idCol, idVal).catch((error) => error);
      return result;
    } catch (error) {
      return values;
    }
  }
}
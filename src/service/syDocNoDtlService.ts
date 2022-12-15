export default class SyDocNoDtlService {

  /**
   * 
   * @param col 
   * @param filter 
   * @param sort 
   * @returns 
   */
  public static async get(col: string, filter: string | null = null, sort: string | null = null): Promise<SY_DOCNO_DTL[]> {
    const result = await window.api.getSyDocNoDtl(col, filter, sort).catch(error => []);
    return result;
  }

  /**
   * 
   * @param values 
   * @param condition 
   * @returns 
   */
  public static async updateById(values: SY_DOCNO_DTL, condition: { idCol: string, idVal: any }): Promise<SY_DOCNO_DTL> {
    const result = await window.api.updateSyDocNoDtl(values, condition).catch(error => values);
    return result;
  }
}
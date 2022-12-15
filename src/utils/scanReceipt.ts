import PdfHandler from "./pdfHandler";
import config from "../config";

export default class ScanReceipt {

  /**
   * 
   * @param path 
   * @returns 
   */
  public static async read(path: string): Promise<any> {
    try {
      const response = await PdfHandler.split(path, config.splitReceipts);
      if (response !== null) {
        throw response;
      }
    } catch (error) {
      return error;
    }
  }

  /**
   * 
   * @param dataText 
   */
  public static getReceipt(dataText: string): RegExpMatchArray | null {
    const pattern = new RegExp(config.receiptPattern, 'gm');
    const orNumbers = dataText.match(pattern);
    return orNumbers;
  }
}
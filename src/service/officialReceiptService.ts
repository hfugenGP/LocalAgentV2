import LocalAgentRequest from "../utils/localAgentRequest";
import config from '../config';
import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import PdfUploadService from "./pdfUploadService";

export default class OfficialReceiptService {
  private static _localAgentRequest = new LocalAgentRequest;

  /**
   * 
   * @param pdfPath 
   * @param token 
   * @returns 
   */
  public static async uploadReceipt(pdfPath: string, token: string | null) {
    const fileName = pdfPath.substring(pdfPath.lastIndexOf('\\') + 1, pdfPath.length);
    const url = OfficialReceiptService._createUrl(fileName);
    const result = await PdfUploadService.upload({ pdfPath: pdfPath, url: url, token: token });
    return result;
  }
  /**
   * 
   * @param pdfText 
   * @param token 
   * @returns 
   */
  public static async processPdf(pdfText: string, token: string | null): Promise<{ error: boolean, message: any }> {
    try {
      const receipts = window.api.scanReceipt(pdfText);
      if (receipts === null || receipts.length < 1) {
        throw new Error('Unable to find receipts in PDF.')
      }
      const orUuids = await OfficialReceiptService.getOrUuid(receipts, token);
      console.log(orUuids);
      for (const receipt of receipts) {
        const res = await window.api.invoiceByReceipt(receipt);
        console.log(res);
      }
      return {
        error: false,
        message: null
      }
    } catch (error) {
      return {
        error: true,
        message: error
      };
    }
  }

  /**
   * 
   * @param receipts 
   * @param token 
   * @returns 
   */
  public static async exportReceipt(receipts: KhOfficialReceipt[], token: string | null): Promise<any> {
    const result = await this._localAgentRequest.post('/import-receipts', {
      resource: receipts
    }, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).catch(error => error);
    return result;
  }

  /**
   * 
   * @param orNumber 
   * @param token 
   * @returns
   */
  public static async getOrUuid(orNumber: string | string[], token: string | null): Promise<any> {
    let filter = `(or_no = '${orNumber}')`;
    if (Array.isArray(orNumber)) {
      filter = `(or_no IN ('${orNumber.join("','")}'))`;
    }
    const result = await this._localAgentRequest.get('/data/official_receipts', {
      filter: `(${filter} AND (residence_uuid = '${config.residenceUuid}'))`
    }, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).catch(error => error);
    return result;
  }

  /**
   * 
   * @param fileName 
   * @returns 
   */
  private static _createUrl(fileName: string): string {
    let url = '/files/Bill';
    console.log(uuidv4());
    url += `/${moment().format('YYYYMMDDHHmmss')}_${fileName.substring(0, fileName.lastIndexOf('.'))}?uuid=${uuidv4()}`;
    console.log(url);
    return url;
  }
}
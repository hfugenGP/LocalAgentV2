import LocalAgentRequest from "../utils/localAgentRequest";
import axios from "axios";
import FormData from 'form-data';

export interface PdfUploadOptions {
  pdfPath: string;
  url: string;
  token: string | null;
}

export default class PdfUploadService {
  private static _localAgentRequest = new LocalAgentRequest;

  /**
   * 
   * @param params 
   * @returns 
   */
  public static async upload<T>(params: PdfUploadOptions): Promise<T> {
    try {
      const formData = new FormData();
      const fileName = params.pdfPath.substring(params.pdfPath.lastIndexOf('\\') + 1, params.pdfPath.length);
      const _axs = axios.create();
      const response = await _axs.get(`file://${params.pdfPath.replaceAll("\\", "/")}`, {
        responseType: "blob",
      }).catch(error => error);
      const pdfFile = new File([response.data], fileName, {
        type: 'application/pdf'
      })
      formData.append('file', pdfFile, fileName);
      const result = await this._localAgentRequest.post(params.url, formData, {
        headers: {
          "Authorization": `Bearer ${params.token}`,
          "Content-Type": 'multipart/form-data'
        }
      }).catch(error => error);
      return result;
    } catch (error) {
      return error;
    }
  }
}
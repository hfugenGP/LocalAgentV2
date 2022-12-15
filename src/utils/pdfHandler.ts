import * as fs from 'fs';
const hummus = require('hummus');
const pdf = require("pdf-extraction");
import * as moment from 'moment'

export default class PdfHandler {
  /**
   * Split PDF into individual pages
   * 
   * @param path 
   */
  public static async split(path: string, outputPath: string): Promise<any> {
    let splitError: any = null;
    try {
      if (!fs.existsSync(path)) {
        splitError = `${path} does not exist.`;
        return splitError;
      }
      const pdfReader = hummus.createReader(path);
      const pages = pdfReader.getPagesCount();
      for (let i = 0; i < pages; i++) {
        const pdfWriter = hummus.createWriter(`${outputPath}\\${moment().format('YYYYMMDDHHmmss')}_${i}.pdf`);
        pdfWriter.createPDFCopyingContext(pdfReader).appendPDFPageFromPDF(i);
        pdfWriter.end();
      }
    } catch (error) {
      splitError = error;
    }
    return splitError;
  }

  /**
   * 
   * @param path 
   * @returns 
   */
  public static async parse(path: string) {
    const dataBuffer = fs.readFileSync(path);
    const pdfData = await pdf(dataBuffer);
    return pdfData && pdfData.text ? pdfData.text : null;
  }

  /**
   * 
   * @param path 
   */
  public static async listPdf(path: string): Promise<any> {
    try {
      if (!fs.existsSync(path)) {
        throw new Error(`${path} does not exist.`);
      }
      return await fs.readdirSync(path);
    } catch (error) {
      return error;
    }
  }
}
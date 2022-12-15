import * as moment from 'moment';
import DebitNoteService from '../service/debitNoteService';
import config from '../config';
import { AR_DN } from '../interface/arDn';
import { Bill } from '../interface/bill';

export default class SendDebitNotes {
  /**
   * 
   * @param forExport 
   */
  public static async transport(forExport: { notes: AR_DN[], token: string | null }): Promise<any> {
    const debits = this._buildNotes(forExport.notes);
    const result = await DebitNoteService.sendToKiple(debits, forExport.token);
    return result;
  }

  /**
   * 
   * @param notes 
   * @returns 
   */
  private static _buildNotes(notes: AR_DN[]): Bill[] {
    const dNotes: Bill[] = notes.map((note) => {
      const aUnit = note.CODE.split('-');
      return {
        reference_id: note.DOCNO,
        description: note.DESCRIPTION,
        project_code: "LP",
        status: this._setStatus(note),
        due_at: note.DUEDATE !== null ? moment(note.DUEDATE).format('YYYY-MM-DD') : '',
        block: aUnit[0] ? aUnit[0] : "Unit",
        floor: aUnit[1] ? aUnit[1] : '',
        unit: aUnit[2] ? aUnit[2] : '',
        currency: "RM",
        amount_cents: Number(note.DOCAMT) * 100,
        reminder_days: Number(note.TERMS.substring(0, note.TERMS.indexOf('Days'))),
        type: "DEBIT NOTE",
        billing_date: moment(note.DOCDATE).format('YYYY-MM-DD'),
        residence_uuid: config.residenceUuid,
        late_payment_charge: Number(note.LOCALDOCAMT) * 100
      }
    });
    return dNotes;
  }

  /**
   * 
   * @param note 
   * @returns 
   */
  private static _setStatus(note: AR_DN): string {
    let status = '';
    const currentDate = moment();
    if (note.CANCELLED === 'T') {
      status = "CANCELLED";
    } else {
      status = currentDate.diff(moment(note.DUEDATE), 'days') > 0 ? "OVERDUE" : "PENDING";
    }
    return status;
  }
} 
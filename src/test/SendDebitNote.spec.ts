import { expect } from 'chai';
import SendDebitNotes from '../utils/sendDebitNotes';

describe('Send Debit Notes - empty notes', () => {
  it('Should fail', () => {
    expect(SendDebitNotes.transport({ notes: [], token: null })).to.contain('error');
  })
})
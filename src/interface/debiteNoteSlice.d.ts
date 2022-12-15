export interface DebitNoteSliceState {
  debitNote: {
    error: string | null | undefined;
    exportStatus: string | null;
    due: {
      count: number;
      invoices: AR_DN[];
      error: string | null | undefined;
    };
    export: {
      duplicates: string[],
      inserted: string[],
      nonexistent: string[],
      message: string | null | undefined,
      updated: string[]
    }
  }
}
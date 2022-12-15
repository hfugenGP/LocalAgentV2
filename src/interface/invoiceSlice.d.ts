export interface InvoiceSliceState {
  invoice: {
    exportStatus: string | null | undefined
    error: string | null | undefined
    message: string | null | undefined,
    inserted: any[],
    duplicates: any[],
    nonexistent: any[],
    updated: any[],
    list: InvoiceData[]
  }
}

export interface PayloadRejected {
  payload: {
    message: any
  }
}
interface Config {
  api: string;
  credentials: {
    username: string;
    password: string;
  },
  apikey: string;
  residenceUuid: string;
  unitNamePattern: string;
  receiptPattern: string;
  sinkingFund: string;
  invoiceNumberPattern: string;
  splitReceipts: string;
  uploadLimit: number;
}
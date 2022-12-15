type DataSets = {
  [x: string]: any;
  DataSets: {
    Find: (fieldName: string) => any;
  }
}

export interface SqlBizzAppProp {
  IsLogin: boolean | null;
  Login: (user: string, password: string, dcf: string, dbPath: string) => void;
  BizObjects: {
    Find: (table: string) => DataSets;
    New: () => any;
    DataSets: DataSets;
    Save: () => any;
    Close: () => any;
  };
  CreateOleVariantArray: (param: number) => any;
}

export interface SqlBizzCredentials {
  user: string;
  password: string;
  dcf: string;
  fdb: string;
}
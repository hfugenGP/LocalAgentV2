const REACT_APP_ENV: any = process.env.REACT_APP_ENV;
const resUuid = process.env.RESIDENCE_UUID ? process.env.RESIDENCE_UUID : '';
const config: Config = {
    api: {
        dev: 'https://k8s-stg-api.kiplelive.com',
        // dev: 'http://192.168.56.111:3000',
        prod: 'https://k8s-api.kiplelive.com'
    }[REACT_APP_ENV],
    credentials: {
        dev: {
            username: process.env.KH_USER,
            password: process.env.KH_PASSWORD
        },
        prod: {
            username: process.env.KH_USER,
            password: process.env.KH_PASSWORD,
        }
    }[REACT_APP_ENV],
    apikey: {
        dev: process.env.API_KEY,
        prod: process.env.API_KEY
    }[REACT_APP_ENV],
    residenceUuid: resUuid,
    unitNamePattern: "\n?(\d{1,}[A-Z]?\-[A-Z0-9]{1,}\-[A-Z0-9]{1,})",
    receiptPattern: "(OR(\\d{1,})?(\\s|\\-)\\d{5})",
    sinkingFund: "(MF|SF|FI)\d{1,}\-\d{1,}",
    invoiceNumberPattern: "(IN|DN|IV)\-\d{5,}",
    splitReceipts: "C:\\eStream\\split\\officialreceipts",
    // mb
    uploadLimit: 2,
}

export default config;
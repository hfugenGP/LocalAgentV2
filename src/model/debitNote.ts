import { AR_DN } from "../interface/arDn";
import FirebirdDbconn from "../utils/firebirdDb";

export default class DebitNote extends FirebirdDbconn {
    constructor() {
        super({
            host: 'localhost',
            port: 3050,
            path: `C:\\eStream\\SQLAccounting\\DB\\ACC-0003.FDB`,
            username: 'SYSDBA',
            password: 'masterkey',
            table: 'AR_DN'
        });
    }

    /**
     * 
     * @param col 
     * @param filter 
     * @returns 
     */
    public async get(col: string = 'FIRST 12 *', filter: string | null = null, sort: string | null = null): Promise<{ count: number, invoices: AR_DN[], error: any }> {
        try {
            let recordCount = 0;
            const result = await this.select<AR_DN[]>(col, filter, sort).catch((error) => error);
            if ('stack' in result) {
                throw new Error(result);
            }
            if (Array.isArray(result) && result.length > 0) {
                const countRes: any = await this.select('COUNT(*)', filter).catch((error) => error);
                if (Array.isArray(countRes) && countRes.length > 0) {
                    recordCount = countRes[0].COUNT;
                }
            }
            return {
                count: recordCount,
                invoices: result,
                error: null
            };
        } catch (error) {
            return {
                count: 0,
                invoices: [],
                error: error
            };
        }
    }
}
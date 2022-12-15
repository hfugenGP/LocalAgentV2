const Firebird = require("node-firebird")

type DbCallback = {
    (err: any, result: any): void;
}

interface DbConnOptions {
    host: string;
    port: number;
    path: string;
    username: string;
    password: string;
}

interface FirebirdDb {
    query: (query: string, callback: DbCallback) => void;
    detach: () => void;
}

export default class ConnFireBird {
    private static _pageSize: number = 4096;
    private static _retryConnection: number = 1000;

    static dbConn(sql: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const options = {
                host: 'localhost',
                port: 3050,
                database: `C:\\eStream1\\SQLAccounting\\DB\\PUNCAK_DAMANSARA\\ACC-0002.FDB`,
                user: 'SYSDBA',
                password: 'masterkey',
                lowercase_keys: false, // set to true to lowercase keys
                role: null, // default
                pageSize: 4096, // default when creating database
                retryConnectionInterval: 1000,
            }
            Firebird.attach(options, (err: any, db: FirebirdDb) => {
                if (err) {
                    reject(err)
                    return
                }
                // db = DATABASE
                db.query(sql, function (
                    err: any,
                    result: any,
                ) {
                    if (err) {
                        reject(err)
                        return
                    }
                    resolve(result)
                    // IMPORTANT: close the connection
                    db.detach()
                })
            })
        });
    }

    static dbConnect(dbOptions: DbConnOptions): Promise<any> {
        return new Promise((resolve, reject) => {
            const options = {
                host: dbOptions.host,
                port: dbOptions.port,
                database: dbOptions.path,
                user: dbOptions.username,
                password: dbOptions.password,
                lowercase_keys: false, // set to true to lowercase keys
                role: null, // default
                pageSize: ConnFireBird._pageSize, // default when creating database
                retryConnectionInterval: ConnFireBird._retryConnection,
            }
            Firebird.attach(options, (err: any, db: FirebirdDb) => {
                if (err) {
                    reject(err)
                    return
                }
                resolve(db);
            })
        });
    }
}
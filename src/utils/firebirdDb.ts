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
  table: string;
}

interface FirebirdDb {
  query: (query: string, callback: DbCallback) => void;
  detach: () => void;
}

export default class FirebirdDbconn {

  private _pageSize: number = 4096;
  private _retryConnection: number = 1000;

  constructor(private dbOptions: DbConnOptions) { }

  /**
   * 
   * @param columns 
   * @param filter 
   * @param sort 
   * @returns 
   */
  protected async select<T>(columns: string = '*', filter: string | null = null, sort: string | null = null): Promise<T> {
    let sql = `SELECT ${columns} FROM ${this.dbOptions.table}`;
    if (filter !== null) {
      sql += ` WHERE ${filter}`;
    }
    if (sort !== null) {
      sql += ` ORDER BY ${sort}`;
    }
    console.log(sql);
    return this.connect(sql);
  }

  /**
   * 
   * @param values 
   * @param idCol 
   * @param idVal 
   */
  protected async updateById<T>(values: T, idCol: string, idVal: any): Promise<T> {
    const updateValues = [];
    for (const key in values) {
      updateValues.push(`${key} = ${values[key]}`);
    }
    const sql = `UPDATE ${this.dbOptions.table} SET ${updateValues.join(',')} WHERE ${idCol} = ${idVal};`;
    return this.connect(sql);
  }

  /**
   * 
   * @param sql 
   * @returns 
   */
  protected async customQuery<T>(sql: string): Promise<T> {
    return this.connect(sql);
  }

  /**
   * 
   * @param query 
   * @returns 
   */
  private connect(query: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const options = {
        host: this.dbOptions.host,
        port: this.dbOptions.port,
        database: this.dbOptions.path,
        user: this.dbOptions.username,
        password: this.dbOptions.password,
        lowercase_keys: false, // set to true to lowercase keys
        role: null, // default
        pageSize: this._pageSize, // default when creating database
        retryConnectionInterval: this._retryConnection,
      }

      Firebird.attach(options, (err: any, db: FirebirdDb) => {
        if (err) {
          reject(err)
          return
        }

        db.query(query, (err, result) => {
          if (err) {
            reject(err)
            return
          }

          if (!Array.isArray(result)) {
            reject(err)
            return
          }

          resolve(result)
          // IMPORTANT: close the connection
          db.detach()
        });
      });
    });
  }
} 
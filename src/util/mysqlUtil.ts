import * as mysql from 'mysql';
import { Error } from './../common/error';
import { MysqlConfiguration } from './../common/mysqlConfig';

export class MySqlUtility {
  public static async mysqlExecute(
    config: MysqlConfiguration,
    sqlCommand: string,
    paramaters: any[],
  ): Promise<any> {
    const connection = mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
    });

    return new Promise((resolve, reject) => {
      connection.connect(err => {
        if (err) {
          console.error('error connecting: ' + err.stack);
          reject(new Error('DBERR01', 'error connecting to mysql'));
        }
        console.log('connected as id ' + connection.threadId);
      });
      connection.query(sqlCommand, paramaters, (error, results, fields) => {
        if (error) {
          console.log(error);
          reject(new Error('DBERR02', 'error mysql execution'));
          connection.end();
          return;
        }
        resolve(results);
        connection.end();
      });
    });
  }
}

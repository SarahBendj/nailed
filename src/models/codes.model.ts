import { Core } from "src/core/parent.entity";
import { DB } from "src/database/db";

export class Codes extends Core{

    static tableName ='codes'


//   booking_id, code, client_id , salon_id
    static async findByInfo(data: any): Promise<any> {
        const sqlQuery = `SELECT * FROM ${this.tableName} WHERE booking_id = $1
        AND code = $2 
        AND client_id = $3 
        AND salon_id = $4 
        AND booking_time = $5`;
        const result = await DB.query(sqlQuery, [data.booking_id , data.code , data.client_id , data.salon_id ,data.booking_time ]);
        if (result.rows.length === 0) {
          return null;
        }   return result.rows[0];
    }
}
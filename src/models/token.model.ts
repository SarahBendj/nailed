import { Core } from "src/core/parent.entity";
import { DB } from "src/database/db";

export class Token extends Core {
    static tableName: string = 'refresh_token';

    // consumer_id!: string;
    // token!: string;
    // created_at!: Date;
    // updated_at!: Date;

   static async findByConsumerId(consumerId: string): Promise<Token[]> {
  const sqlQuery = `SELECT * FROM ${this.tableName} WHERE consumer_id = $1`;
  const params = [consumerId];
  const result = await DB.query(sqlQuery, params);

  return result?.rows || [];
}

}
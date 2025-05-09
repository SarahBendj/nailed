import { Core } from "src/core/parent.entity";
import { DB } from "src/database/db";

export class Token extends Core {
    static tableName: string = 'refresh_token';

    // consumer_id!: string;
    // token!: string;
    // created_at!: Date;
    // updated_at!: Date;

    static async findByConsumerId(consumerId: string): Promise<Token | null> {
        const sqlQuery = `SELECT * FROM ${this.tableName} WHERE token= $1`;
        const params = [consumerId];
        const result = await DB.query(sqlQuery, params);

        if (result && result.rows && result.rows.length > 0) {
            const token = result.rows[0] as Token;
            return token;
        }

        return null;
    }

}
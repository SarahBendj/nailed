import { Core } from "src/core/parent.entity";
import { DB } from "src/database/db";

export class Review extends Core {
    static tableName: string = 'review'


    static async findBySalonId(id : number) {
        const sqlQuery = `SELECT * FROM review WHERE salon_id =$1`
        const result = await DB.query(sqlQuery , [id])

        return result.rows || []
    }
}
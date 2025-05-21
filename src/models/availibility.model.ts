import { Core } from "src/core/parent.entity";
import { Salon } from "./salon.model";
import { DB } from "src/database/db";

const owner = Salon.tableName;

export class Availability extends Core {
    static tableName = 'availability';

    static async findByName(salonName: string) { 
       
        try {

            const sqlQuery = `
                    SELECT a.* 
                    FROM ${this.tableName} AS a
                    JOIN ${owner} ON ${owner}.id = a.salon_id
                    WHERE ${owner}.name LIKE '%' || $1 || '%'
        `;   
    
            const result = await DB.query(sqlQuery, [salonName]);
            return result.rows  

            
        } catch (error) {
            return {
                message: 'Error retrieving availability by salon name',
                error: error.message,
            };
        }
    }

       static async findBySalonId(salonId: number) { 
        try {
            const sqlQuery = `
                    SELECT *
                    FROM ${this.tableName} where salon_id = $1
        `;   
            const result = await DB.query(sqlQuery, [salonId]);
            return result;  

            
        } catch (error) {
            return {
                message: 'Error retrieving availability by salon name',
                error: error.message,
            };
        }
    }

    
}
import { Core } from "src/core/parent.entity";
import { Salon } from "./salon.model";
import { DB } from "src/database/db";
import { AvailabilityDto } from "src/availability/dto/availability.dto";

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
            return result.rows;  

            
        } catch (error) {
            return {
                message: 'Error retrieving availability by salon name',
                error: error.message,
            };
        }
    }

    static async updateDayAvailability(salon_id: number, day_id : number, body: Partial<AvailabilityDto>) : Promise<any> {
        const { sequence, ...rest } = body;
        const columns = Object.keys(rest);
        const values = Object.values(rest);
      
        const setClauses = columns.map((key, index) => `"${key}" = $${index + 3}`).join(", ");
        //*PARTICULAR CASE
        if(sequence){
             //*update it on all days
             await DB.query(`UPDATE ${Availability.tableName}  SET  sequence=$1 WHERE salon_id = $2`, [sequence,salon_id]);
        }
        
        try {
            const sqlQuery = `
                UPDATE ${Availability.tableName}
                SET  ${setClauses}
                WHERE salon_id = $1 AND id = $2
                RETURNING *;
            `;
            const result = await DB.query(sqlQuery, [ salon_id, day_id , ...values]);
            if(result.rows.length === 0) {
                return {
                    message: 'No availability found for the given salon ID and day ID.',
                    error: 'Not Found'
                };
            }
            return result.rows[0];
            
        } catch (error) {
            return {
                message: 'Error updating availability',
                error: error.message,
            };
            
        }
    }

     static async findDayAvailability(id: number, day : string) : Promise<any> {

        try {
            const sqlQuery = `
                SELECT id FROM  ${Availability.tableName}
                WHERE salon_id = $1 AND day = $2;
            `;
            const result = await DB.query(sqlQuery, [id, day]);
            return result.rows[0];
            
        } catch (error) {
            return {
                message: 'Error updating availability',
                error: error.message,
            };
            
        }
    }
    
}
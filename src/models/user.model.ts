import { Core } from "src/core/parent.entity";
import { DB } from "src/database/db";
import { Salon } from "./salon.model";

export class User extends Core {
    static tableName : string ='consumer';
    
  
    static async findbyEmail(email: string) {
        try {
          const query = `SELECT u.*, s.id AS salon_id
                FROM ${this.tableName} u
                LEFT JOIN ${Salon.tableName} s ON s.user_id = u.id
                WHERE u.email = $1`;
          const values = [email];
          const response = await DB.query(query, values);
          
            if (response.rows.length === 0) {
                return null; 
            }
          return response.rows[0];
        } catch (error) {
          console.error('Error fetching user by email:', error);
          throw new Error('Database query failed'); 
        }
      }
      
}
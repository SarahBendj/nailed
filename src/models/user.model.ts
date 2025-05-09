import { Core } from "src/core/parent.entity";
import { DB } from "src/database/db";

export class User extends Core {
    static tableName : string ='consumer';
    
  
    static async findbyEmail(email: string) {
        try {
          const query = `SELECT * FROM ${this.tableName} WHERE "email" = $1`;
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
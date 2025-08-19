import { Core } from "src/core/parent.entity";
import { DB } from "src/database/db";

export class Salon extends Core {
  static tableName = 'salon';

  static async desactivate(id: number) {
    try {
      const query = `UPDATE ${this.tableName} SET is_active = false WHERE id = $1 RETURNING *`;
      const values = [id];
      const response = await DB.query(query, values);
      return response.rows[0];
    } catch (error) {
      console.error('Error desactivating salon:', error);
      throw new Error('Database query failed');
    }
  }


}


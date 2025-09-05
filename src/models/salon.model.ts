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

static async findBestRated() {
  try {
    const sqlQuery = `
      SELECT * 
      FROM ${this.tableName}
      WHERE rating >= 3.7
      ORDER BY rating DESC
      LIMIT 10
    `;

    const result = await DB.query(sqlQuery);
    return result.rows || [];
  } catch (error) {
    console.error('Error in findBestRated:', error);
    throw error;
  }
}



}


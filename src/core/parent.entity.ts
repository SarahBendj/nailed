import { DB } from "src/database/db";

export class Core {
  id?: number;
  static tableName: string;

  constructor(obj: any) {
    if (obj?.id) {
      this.id = obj.id;
    }
  }

  static async findAll() {
    try {
      const response = await DB.query(`SELECT * FROM ${this.tableName}`);
      return response.rows;
    } catch (error) {
      console.error(JSON.stringify(error), "erreur");
      throw error;
    }
  }

  static async findOne(id: number) {
    try {
      const response = await DB.query(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id]);
      return response.rows[0];
    } catch (error) {
      console.error(JSON.stringify(error), "erreur");
      throw error;
    }
  }

  static async Create<T extends Record<string, any>>(body: T): Promise<T> {
    const columns = Object.keys(body);
    const values = Object.values(body);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

    const query = `
      INSERT INTO ${this.tableName} (${columns.join(", ")})
      VALUES (${placeholders})
      RETURNING *;
    `;

    try {
      const response = await DB.query(query, values);
      return response.rows[0] as T;
    } catch (error) {
      console.error(JSON.stringify(error), "erreur");
      throw error;
    }
  }

  static async Update<T extends Record<string, any>>(id: number, body: T): Promise<T> {
    const columns = Object.keys(body);
    const values = Object.values(body);
  
    // Générer les paires clé=valeur avec des placeholders SQL ($2, $3, ...)
    const setClauses = columns.map((key, index) => `"${key}" = $${index + 2}`).join(", ");
  
    const query = `
      UPDATE ${this.tableName}
      SET ${setClauses}
      WHERE id = $1
      RETURNING *;
    `;
  
    try {
      const response = await DB.query(query, [id, ...values]);
      return response.rows[0] as T;
    } catch (error) {
      console.error(JSON.stringify(error), "erreur");
      throw error;
    }
  }

  static async Delete(id: number): Promise<boolean> {
    try {
      const response = await DB.query(
        `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING id;`,
        [id]
      );
  
      return response.rowCount > 0;
    } catch (error) {
      console.error(JSON.stringify(error), "erreur");
      throw error;
    }
  }

}


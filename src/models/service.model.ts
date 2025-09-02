import { Core } from "src/core/parent.entity";
import { DB } from "src/database/db";
import { Salon } from "./salon.model";

export class Service extends Core {
    static tableName: string = 'service'
    static db = DB;
    name: string;
    price: string;
    duration: string;
    salon_id: number;   

    static async findByName(name?: string) {
  try {
    let query = `
      SELECT 
        s.name as salon_name,
        srv.name as service_name,
        s.phone,
        srv.price,
        srv.duration,
        s.address,
        s.description as salon_description,
        s.rating,
        s.image_folder,
        s.latitude,
        s.longitude
      FROM ${Salon.tableName} s
      JOIN ${Service.tableName} srv ON srv.salon_id = s.id
    `;

    const values: string[] = [];

    if (name) {
      query += ` WHERE srv.name ILIKE $1 OR s.name ILIKE $1 `;
      values.push(`%${name}%`);
    }

    const response = await DB.query(query, values);
    return response.rows;
  } catch (error) {
    console.error("Error fetching services by name:", error);
    throw new Error("Database query failed");
  }
}


  

}
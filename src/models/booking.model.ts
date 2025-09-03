import { Core } from "src/core/parent.entity";
import { DB } from "src/database/db";
import { Service } from "./service.model";

export class Booking extends Core {
    static tableName ='booking'


    static async releaseOldReservations(): Promise<any[]> {
    const sqlQuery = `
      UPDATE booking
      SET status = 'free'
      WHERE status = 'reserved'
        AND (created_at) < NOW() - INTERVAL '5 minutes' 
      RETURNING *;
    `;

    try {
      const result = await DB.query(sqlQuery);
      return result.rows;
    } catch (error) {
      console.error('Error releasing old reservations:', error);
      return [];
    }
  }


  static async findExistingSlot(
  salon_id : number,
  date: string,
  start_time: string,
  end_time: string,
): Promise<any> {
  try {
    const sqlQuery = `
      SELECT b.*, s.*
      FROM ${this.tableName} b
      JOIN ${Service.tableName} s ON s.id = b.service_id
      WHERE 
      b.salon_id=$1
      AND b.date = $2
      AND b.end_time >= $3 
      AND b.start_time  <= $4 ;
    `;

    const result = await DB.query(sqlQuery, [salon_id, date, start_time, end_time]);
         console.log( result.rows.length)

    if (result.rows.length > 0) {
        console.log( result.rows.length)
      return result.rows[0]; 
    }
    return null; 
  } catch (error) {
    console.error('Error in findExistingSlot:', error);
    throw error; 
  }
}

static async checkIfCancelled(id: number): Promise<boolean> {
  const sqlQuery = `
    SELECT status
    FROM booking
    WHERE status IN ('cancelled_by_client', 'cancelled_by_salon')
      AND id = $1
  `;

  const result = await DB.query(sqlQuery, [id]);

  return result.rows.length > 0;
}

static async releaseCancelledReservations(id: number): Promise<boolean> { 
  const sqlQuery = `
    UPDATE booking
    SET status = 'free'
    WHERE status IN ('cancelled_by_client', 'cancelled_by_salon')
      AND id = $1
    RETURNING *;
  `;

  const result = await DB.query(sqlQuery, [id]);
  return result.rows.length > 0; 
}

  }

  
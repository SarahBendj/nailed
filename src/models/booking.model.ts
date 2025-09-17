import { Core } from "src/core/parent.entity";
import { DB } from "src/database/db";
import { Service } from "./service.model";
import { User } from "./user.model";
import { Salon } from "./salon.model";
import { Codes } from "./codes.model";

export class Booking extends Core {
    static tableName ='booking'


    static async releaseOldReservations(): Promise<any[]> {
    const sqlQuery = `
      UPDATE ${this.tableName}
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
  //*todo
  //    static async findByBookingIdNsalonId(booking_id : number , salon_id :number): Promise<any[]> {
  //   const sqlQuery = `
  //    SELECT * FROM ${this.tableName} WHERE
  //    id=$1 AND salon_id = $2 AND  status IN ('cancelled_by_client', 'requested', 'cancelled_by_salon', 'confirmed') ;`;

  //   try {
  //     const result = await DB.query(sqlQuery, [booking_id ,salon_id]);
  //     return result.rows;
  //   } catch (error) {
  //     console.error('Error releasing old reservations:', error);
  //     return [];
  //   }
  // }

static async findBySalonId(id: number): Promise<any[]> {
  const sqlQuery = `SELECT b.* ,s.*, u.name FROM ${this.tableName} b 
  JOIN ${User.tableName} u ON b.client_id = u.id 
  JOIN ${Service.tableName } s ON b.service_id = s.id WHERE b.salon_id = $1
  AND b.status IN ('cancelled_by_client', 'requested', 'cancelled_by_salon', 'confirmed')  `;
  const result = await DB.query(sqlQuery, [id]);

  return result.rows;
}


static async findByClientId(id: number): Promise<any[]> {
  const sqlQuery = `SELECT  b.id ,b.start_time ,b.client_id, b.start_time ,b.end_time ,b.date ,srv.price, srv.name ,s.name ,s.address , c.code FROM ${this.tableName} b 
  JOIN ${Salon.tableName} s ON b.salon_id = s.id 
  JOIN ${Codes.tableName} c ON c.booking_id = b.id
  JOIN ${Service.tableName } srv ON b.service_id = srv.id WHERE b.client_id = $1`;
  const result = await DB.query(sqlQuery, [id]);

  return result.rows;
}

  static async findCancelled(): Promise<any[]> {
    const sqlQuery = `
      SELECT * FROM ${this.tableName}
      WHERE status IN ('cancelled_by_client', 'cancelled_by_salon') ;
    `;

    try {
      const result = await DB.query(sqlQuery);
      return result.rows;
    } catch (error) {
      console.error('Error releasing old reservations:', error);
      return [];
    }
  }

  static async cancelReservations(id :number, status:string): Promise<any> {
    const sqlQuery = `
      UPDATE ${this.tableName}
      SET status = $2
      WHERE id =$1
      RETURNING *;
    `;

    try {
      const result = await DB.query(sqlQuery, [ id,status ]);
      return result.rows[0];
    } catch (error) {
      console.error('Error releasing old reservations:', error);
      return null;
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
    FROM ${this.tableName}
    WHERE status IN ('cancelled_by_client', 'cancelled_by_salon')
      AND id = $1
  `;

  const result = await DB.query(sqlQuery, [id]);

  return result.rows.length > 0;
}

static async releaseCancelledReservations(): Promise<boolean> { 
  const sqlQuery = `
    DELETE FROM  ${this.tableName}
    WHERE status IN ('cancelled_by_client', 'cancelled_by_salon');
  `;

  const result = await DB.query(sqlQuery);
  console.log(result.rows.length)
    return result.rows.length > 0; 
}


 static async DeleteFree(): Promise<any[]> {
    const sqlQuery = `
      DELETE FROM ${this.tableName}
      WHERE status = 'free';
    `;

    try {
      const result = await DB.query(sqlQuery);
      return result.rows;
    } catch (error) {
      console.error('Error releasing old reservations:', error);
      return [];
    }

  
}

}
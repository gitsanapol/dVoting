import { NextResponse } from "next/server";
import { connectSQL } from "../../../../lib/tidb.js";

export async function GET(request) {
  try {
    // Ensure connection pool is available
    const pool = await connectSQL(); 

    // Use the promise-based pool to perform the query
    const promisePool = pool.promise();
    const [rows, fields] = await promisePool.query(
      `SELECT * FROM attractions;`
    );

    // Return the result as a JSON response
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching data", error);
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}
import { connectSQL } from "../../../../lib/tidb";
import { NextResponse } from 'next/server';

export async function GET() {
    try {
      const pool = await connectSQL();
      const results = await new Promise((resolve, reject) => {
        pool.query('SELECT studentId, name FROM studentInfo', (error, results) => {
          if (error) {
            console.error("Error fetching studentInfo:", error);
            reject(new Error("Failed to retrieve studentInfo"));
          } else {
            resolve(results);
          }
        });
      });
      return NextResponse.json(results, { status: 200 });
    } catch (error) {
      console.error("Database connection error:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }

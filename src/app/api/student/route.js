import { NextResponse } from "next/server";
import { mysqlPool } from '../utils/db.js';

export async function GET(request) {
  const promisePool = mysqlPool.promise();

  // Hardcoded data for testing
  const studentID = 's02';
  const email = 's02@mail.com';

  try {
    // Insert the hardcoded data into the student table
    const [result] = await promisePool.query(
      `INSERT INTO student (studentID, email) VALUES (?, ?)`,
      [studentID, email]
    );

    // Return a success response with the result of the insert query
    return NextResponse.json({ message: 'Student added successfully', result });
  } catch (error) {
    // Return an error response if something goes wrong
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
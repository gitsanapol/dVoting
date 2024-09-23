import mysql from 'mysql2';

// Establish the connection pool asynchronously
export const connectSQL = async () => {
  try {
    const pool = mysql.createPool(process.env.MYSQL_URI);
    console.log("Connection to TiDB successful");
    return pool; // Return the pool so it can be used later
  } catch (error) {
    console.error("Error connecting to TiDB", error);
    throw new Error("Database connection failed");
  }
};
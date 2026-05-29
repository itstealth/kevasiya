const db = require("./db");

async function testConnection() {
  let connection;
  try {
    console.log("Attempting to get a connection from the pool...");
    connection = await db.getConnection();
    console.log("Successfully got a connection from the pool.");

    console.log("Executing a simple query...");
    const [rows] = await connection.query("SELECT 1 + 1 AS solution");
    console.log("Query executed successfully.");
    console.log("The solution is: ", rows[0].solution);

    console.log("Database connection successful!");
  } catch (error) {
    console.error("Failed to connect to the database or execute query.");
    console.error("Error details:", error);
  } finally {
    if (connection) {
      console.log("Releasing connection...");
      connection.release();
    }
    console.log("Closing the connection pool...");
    await db.end();
    console.log("Pool closed.");
  }
}

testConnection();

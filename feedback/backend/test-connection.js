const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.join(__dirname, ".env"),
});

const config = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Mysql@123",
  database: process.env.DB_NAME || "ims_backend",
};

console.log("Testing MySQL connection...");
console.log("Host:", config.host);
console.log("Port:", config.port);
console.log("User:", config.user);
console.log("Database:", config.database);
console.log("Password:", config.password ? "***" : "(not set)");
console.log("");

// First, try connecting without specifying database
async function testConnection() {
  try {
    console.log("Step 1: Testing connection without database...");
    const connection1 = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
    });
    console.log("✅ Successfully connected to MySQL server!");
    await connection1.end();

    // Now try to create database if it doesn't exist
    console.log("\nStep 2: Checking if database exists...");
    const connection2 = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
    });
    
    const [databases] = await connection2.execute(
      `SHOW DATABASES LIKE '${config.database}'`
    );
    
    if (databases.length === 0) {
      console.log(`⚠️  Database '${config.database}' does not exist.`);
      console.log(`Creating database '${config.database}'...`);
      await connection2.execute(`CREATE DATABASE IF NOT EXISTS ${config.database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
      console.log(`✅ Database '${config.database}' created successfully!`);
    } else {
      console.log(`✅ Database '${config.database}' exists.`);
    }
    await connection2.end();

    // Now try connecting with database
    console.log("\nStep 3: Testing connection with database...");
    const connection3 = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
    });
    console.log(`✅ Successfully connected to database '${config.database}'!`);
    
    // Check if table exists
    const [tables] = await connection3.execute(
      "SHOW TABLES LIKE 'feedbacks'"
    );
    
    if (tables.length === 0) {
      console.log("\n⚠️  Table 'feedbacks' does not exist.");
      console.log("Please run the schema.sql file to create the table.");
    } else {
      console.log("✅ Table 'feedbacks' exists.");
    }
    
    await connection3.end();
    console.log("\n✅ All connection tests passed!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Connection failed!");
    console.error("Error:", error.message);
    console.error("Code:", error.code);
    console.error("\nTroubleshooting:");
    console.error("1. Make sure MySQL server is running");
    console.error("2. Verify the password is correct");
    console.error("3. Check if the user has proper permissions");
    if (error.code === "ER_ACCESS_DENIED_ERROR") {
      console.error("\n💡 Tip: The password might be incorrect or the user doesn't exist.");
      console.error("   Try connecting with MySQL command line:");
      console.error(`   mysql -u ${config.user} -p`);
    }
    process.exit(1);
  }
}

testConnection();


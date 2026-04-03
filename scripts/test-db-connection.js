import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  console.log('Testing database connection...');
  console.log('Configuration:');
  console.log(`  Host: ${process.env.DB_HOST}`);
  console.log(`  Port: ${process.env.DB_PORT}`);
  console.log(`  Database: ${process.env.DB_DATABASE}`);
  console.log(`  Username: ${process.env.DB_USERNAME}`);
  console.log('');

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    });

    console.log('✓ Connection successful!');
    
    // Test query to list tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`\n✓ Found ${tables.length} table(s) in database "${process.env.DB_DATABASE}":`);
    tables.forEach(table => {
      const tableName = Object.values(table)[0];
      console.log(`  - ${tableName}`);
    });

    await connection.end();
    console.log('\n✓ Connection closed successfully');
    process.exit(0);
  } catch (error) {
    console.error('✗ Connection failed!');
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testConnection();

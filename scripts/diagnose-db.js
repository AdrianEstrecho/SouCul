import mysql from 'mysql2/promise';

async function testRootConnection() {
  const port = 3307; // Updated to your XAMPP port
  
  console.log('Testing connection with XAMPP default root user...');
  console.log('Host: 127.0.0.1');
  console.log(`Port: ${port}`);
  console.log('User: root');
  console.log('Password: (empty - XAMPP default)');
  console.log('');

  try {
    // Test with default XAMPP root user (no password)
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      port: port,
      user: 'root',
      password: ''
    });

    console.log('✓ Connection with root successful!');
    
    // List all databases
    const [databases] = await connection.execute('SHOW DATABASES');
    console.log('\n✓ Available databases:');
    databases.forEach(db => {
      console.log(`  - ${db.Database}`);
    });

    // Check if soucul database exists
    const dbExists = databases.some(db => db.Database === 'soucul');
    
    if (dbExists) {
      console.log('\n✓ Database "soucul" exists!');
      
      // Switch to soucul database and show tables
      await connection.execute('USE soucul');
      const [tables] = await connection.execute('SHOW TABLES');
      console.log(`\n✓ Found ${tables.length} table(s) in "soucul":`);
      tables.forEach(table => {
        const tableName = Object.values(table)[0];
        console.log(`  - ${tableName}`);
      });
    } else {
      console.log('\n✗ Database "soucul" does NOT exist yet!');
      console.log('  You need to create it in phpMyAdmin first.');
    }

    // Check if user soucul_dev exists
    console.log('\nChecking if user "soucul_dev" exists...');
    const [users] = await connection.execute(
      "SELECT User, Host FROM mysql.user WHERE User = 'soucul_dev'"
    );
    
    if (users.length > 0) {
      console.log('✓ User "soucul_dev" exists for hosts:');
      users.forEach(user => {
        console.log(`  - ${user.User}@${user.Host}`);
      });
    } else {
      console.log('✗ User "soucul_dev" does NOT exist!');
      console.log('\nYou need to create this user. Here\'s the SQL to run in phpMyAdmin:');
      console.log('\n--- Copy and run these SQL commands in phpMyAdmin ---');
      console.log("CREATE USER 'soucul_dev'@'localhost' IDENTIFIED BY 'SouCul@Dev2026';");
      console.log("GRANT ALL PRIVILEGES ON soucul.* TO 'soucul_dev'@'localhost';");
      console.log("FLUSH PRIVILEGES;");
      console.log('--- End of SQL commands ---\n');
    }

    await connection.end();
    console.log('✓ Test completed');
    process.exit(0);
  } catch (error) {
    console.error('✗ Connection failed!');
    console.error('Error:', error.message);
    console.error('\nMake sure XAMPP MySQL is running!');
    process.exit(1);
  }
}

testRootConnection();

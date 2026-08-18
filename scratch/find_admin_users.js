const pg = require('pg');
require('dotenv').config({ path: './apps/api/.env' });

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/foodmania_dev?schema=public";
const pool = new pg.Pool({ connectionString });

async function findUsers() {
  const users = await pool.query('SELECT id, email, role, "restaurantId" FROM "User" WHERE role = \'SUPER_ADMIN\' OR role = \'OWNER\'');
  console.log('ADMIN & OWNER USERS:');
  console.log(users.rows);
  await pool.end();
}

findUsers().catch(e => { console.error(e); pool.end(); });

const pg = require('pg');
require('dotenv').config({ path: './apps/api/.env' });

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/foodmania_dev?schema=public";
const pool = new pg.Pool({ connectionString });

async function checkPG() {
  console.log('--- CONNECTING TO POSTGRES DB ---');
  
  const users = await pool.query('SELECT id, email, role, "restaurantId", password FROM "User"');
  console.log('USERS IN DB (' + users.rows.length + '):');
  console.log(users.rows);

  const restaurants = await pool.query('SELECT id, name, slug, code FROM "Restaurant"');
  console.log('\nRESTAURANTS IN DB (' + restaurants.rows.length + '):');
  console.log(restaurants.rows);

  const menuItems = await pool.query('SELECT id, name, price, "restaurantId" FROM "MenuItem"');
  console.log('\nMENU ITEMS IN DB (' + menuItems.rows.length + '):');
  console.log(menuItems.rows);

  const orders = await pool.query('SELECT id, "orderNumber", "totalAmount", "restaurantId" FROM "Order"');
  console.log('\nORDERS IN DB (' + orders.rows.length + '):');
  console.log(orders.rows);

  await pool.end();
}

checkPG().catch(e => { console.error('PG Error:', e.message); pool.end(); });

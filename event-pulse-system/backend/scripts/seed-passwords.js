// One-time helper: the sample data ships with placeholder password_hash values
// ('hash1', 'hash2', ...) that aren't real bcrypt hashes, so nobody can log in
// as those seeded users yet. This script sets a real, working password for
// each of them so you can log in during your demo/viva without signing up
// from scratch.
//
// Run once from the backend folder:
//   node scripts/seed-passwords.js
//
// It uses the SAME password for every seeded user, printed below.

require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../db');

const DEMO_PASSWORD = 'Password123!';

async function run() {
  const password_hash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const [users] = await pool.query('SELECT user_id, email, full_name FROM Users');

  for (const u of users) {
    await pool.query('UPDATE Users SET password_hash = ? WHERE user_id = ?', [password_hash, u.user_id]);
  }

  console.log(`Updated ${users.length} users. They can now log in with:\n`);
  console.log(`  password: ${DEMO_PASSWORD}\n`);
  console.log('  emails:');
  users.forEach((u) => console.log(`    ${u.email}  (${u.full_name})`));

  await pool.end();
}

run().catch((err) => {
  console.error('Failed to seed passwords:', err.message);
  process.exit(1);
});

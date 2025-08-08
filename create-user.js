const SQLite = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.error('Usage: node create-user.js <email> <password>');
  process.exit(1);
}

const db = new SQLite.Database('./gymtrack.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  )`);

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error('Error hashing password:', err);
      process.exit(1);
    }
    db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hash], function(err) {
      if (err) {
        console.error('Error creating user:', err.message);
      } else {
        console.log('Created user with ID', this.lastID);
      }
      db.close();
    });
  });
});

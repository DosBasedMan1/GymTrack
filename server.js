const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const SQLite = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
const path = require('path');

const db = new SQLite.Database('./gymtrack.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT,
    category TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    exercise_id INTEGER,
    weight INTEGER,
    reps INTEGER,
    sets INTEGER,
    notes TEXT,
    performed_at TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(exercise_id) REFERENCES exercises(id)
  )`);
});

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  db.get('SELECT * FROM users WHERE email = ?', email, (err, row) => {
    if (err) return done(err);
    if (!row) return done(null, false, { message: 'Incorrect email.' });
    bcrypt.compare(password, row.password, (err, res) => {
      if (res) return done(null, row);
      return done(null, false, { message: 'Incorrect password.' });
    });
  });
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  db.get('SELECT * FROM users WHERE id = ?', id, (err, row) => {
    if (err) return done(err);
    done(null, row);
  });
});

function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

app.get('/', ensureAuth, (req, res) => {
  db.all('SELECT logs.*, exercises.name FROM logs JOIN exercises ON logs.exercise_id = exercises.id WHERE logs.user_id = ? ORDER BY performed_at DESC', [req.user.id], (err, logs) => {
    if (err) logs = [];
    res.render('index', { user: req.user, logs });
  });
});

app.get('/register', (req, res) => {
  res.render('register', { messages: req.flash('error') });
});

app.post('/register', (req, res, next) => {
  const { email, password } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return next(err);
    db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hash], function(err) {
      if (err) {
        req.flash('error', 'User exists');
        return res.redirect('/register');
      }
      req.login({ id: this.lastID, email }, (err) => {
        if (err) return next(err);
        res.redirect('/');
      });
    });
  });
});

app.get('/login', (req, res) => {
  res.render('login', { messages: req.flash('error') });
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/login');
  });
});

app.get('/exercise/add', ensureAuth, (req, res) => {
  res.render('addExercise');
});

app.post('/exercise/add', ensureAuth, (req, res) => {
  const { name, category } = req.body;
  db.run('INSERT INTO exercises (user_id, name, category) VALUES (?, ?, ?)', [req.user.id, name, category], err => {
    res.redirect('/');
  });
});

app.get('/log', ensureAuth, (req, res) => {
  db.all('SELECT * FROM exercises WHERE user_id = ?', req.user.id, (err, exercises) => {
    res.render('log', { exercises });
  });
});

app.post('/log', ensureAuth, (req, res) => {
  const { exercise_id, weight, reps, sets, notes } = req.body;
  const date = new Date().toISOString();
  db.run('INSERT INTO logs (user_id, exercise_id, weight, reps, sets, notes, performed_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [req.user.id, exercise_id, weight, reps, sets, notes, date], err => {
    res.redirect('/');
  });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));

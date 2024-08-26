const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose(); // Import SQLite3
const path = require('path'); // Import path module for serving static files

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' folder

// SQLite connection
const db = new sqlite3.Database('./city_management.db', (err) => {
  if (err) {
    console.error('Error opening SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Create tables if not exist (Run this once)
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS cities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    population INTEGER,
    country TEXT,
    latitude TEXT,
    longitude TEXT
  )`);
});

// Add City API
app.post('/cities', (req, res) => {
  const { name, population, country, latitude, longitude } = req.body;

  const query = 'INSERT INTO cities (name, population, country, latitude, longitude) VALUES (?, ?, ?, ?, ?)';
  db.run(query, [name, population, country, latitude, longitude], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ message: 'City already exists' });
      }
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(201).json({ message: 'City added successfully', city: { id: this.lastID, name, population, country, latitude, longitude } });
  });
});

// Update City API
app.put('/cities/:name', (req, res) => {
  const { name } = req.params;
  const { population, country, latitude, longitude } = req.body;

  const query = 'UPDATE cities SET population = ?, country = ?, latitude = ?, longitude = ? WHERE name = ?';
  db.run(query, [population, country, latitude, longitude, name], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'City not found' });
    }
    res.status(200).json({ message: 'City updated successfully', city: { name, population, country, latitude, longitude } });
  });
});

// Delete City API
app.delete('/cities/:name', (req, res) => {
  const { name } = req.params;

  const query = 'DELETE FROM cities WHERE name = ?';
  db.run(query, [name], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'City not found' });
    }
    res.status(200).json({ message: 'City deleted successfully' });
  });
});

// Get Cities API
app.get('/cities', (req, res) => {
  const { page = 1, limit = 10, filter = '', sort = '', search = '', projection = '' } = req.query;

  let query = 'SELECT * FROM cities';
  const queryParams = [];

  // Apply filtering
  if (filter) {
    query += ' WHERE country LIKE ?';
    queryParams.push(`%${filter}%`);
  }

  // Apply searching
  if (search) {
    query += (queryParams.length ? ' AND' : ' WHERE') + ' name LIKE ?';
    queryParams.push(`%${search}%`);
  }

  // Apply sorting
  if (sort) {
    const [sortField, sortOrder] = sort.split(':');
    query += ` ORDER BY ${sortField} ${sortOrder.toUpperCase()}`;
  }

  // Apply pagination
  const startIndex = (page - 1) * limit;
  query += ` LIMIT ?, ?`;
  queryParams.push(startIndex, parseInt(limit));

  db.all(query, queryParams, (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    // Apply projection
    if (projection) {
      const projectionFields = projection.split(',').filter(Boolean);
      rows = rows.map(row => {
        return projectionFields.reduce((obj, field) => {
          if (row[field]) obj[field] = row[field];
          return obj;
        }, {});
      });
    }

    res.status(200).json(rows);
  });
});

// Serve index.html from 'public' folder
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

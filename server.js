const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path'); // Import path module for serving static files

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' directory

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Dhruv@2981',
  database: 'city_management'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + db.threadId);
});

// Add City API
app.post('/cities', (req, res) => {
  const { name, population, country, latitude, longitude } = req.body;

  const query = 'INSERT INTO cities (name, population, country, latitude, longitude) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [name, population, country, latitude, longitude], (err, results) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'City already exists' });
      }
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(201).json({ message: 'City added successfully', city: { id: results.insertId, name, population, country, latitude, longitude } });
  });
});

// Update City API
app.put('/cities/:name', (req, res) => {
  const { name } = req.params;
  const { population, country, latitude, longitude } = req.body;

  const query = 'UPDATE cities SET population = ?, country = ?, latitude = ?, longitude = ? WHERE name = ?';
  db.query(query, [population, country, latitude, longitude, name], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'City not found' });
    }
    res.status(200).json({ message: 'City updated successfully', city: { name, population, country, latitude, longitude } });
  });
});

// Delete City API
app.delete('/cities/:name', (req, res) => {
  const { name } = req.params;

  const query = 'DELETE FROM cities WHERE name = ?';
  db.query(query, [name], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    if (results.affectedRows === 0) {
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

  db.query(query, queryParams, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    // Apply projection
    if (projection) {
      const projectionFields = projection.split(',').filter(Boolean);
      results = results.map(row => {
        return projectionFields.reduce((obj, field) => {
          if (row[field]) obj[field] = row[field];
          return obj;
        }, {});
      });
    }

    res.status(200).json(results);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

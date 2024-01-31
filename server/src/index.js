// Import necessary modules
import express, { json } from 'express';
import pkg from 'pg';
const { Pool } = pkg;

// Create an instance of express
const app = express();

// Define PostgreSQL connection parameters
const pool = new Pool({
  user: 'vidal',
  host: 'localhost',
  database: 'appareils_4mtec',
  password: 'aaa',
  port: 5432, // default PostgreSQL port
});

// Middleware to parse JSON requests
app.use(express.json());

// Define a simple route to test the database connection
app.get('/', async (req, res) => {
  try {
    // Query the database
    const result = await pool.query('SELECT $1::text as message', ['Hello, PostgreSQL!']);

    // Send the result as JSON
    res.json({ message: result.rows[0].message });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/type_appareils', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM type_appareils');
      res.json(result.rows);
    } catch (error) {
      console.error('Error executing query', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Set up the server to listen on a specific port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

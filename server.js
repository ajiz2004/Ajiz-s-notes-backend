const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL Connection
const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "Ajiz@2004",
  database: "notes", // Replace with your database name
});

// Routes
// Root route
app.get("/", (req, res) => {
    res.send("Welcome to the Notes API");
  });
  
// Get all notes
app.get("/api/notes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM notes");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Add a new note
app.post("/api/notes", async (req, res) => {
  const { title, content } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *",
      [title, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete a note
app.delete("/api/notes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM notes WHERE id = $1", [id]);
    res.status(200).send("Note deleted successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

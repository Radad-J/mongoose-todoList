const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const path = require('path');
const Todo = require('./Todo');

app.use(cors({
  origin: 'https://mongoose-todo-list.vercel.app', // Replace with your Vercel app domain
}));

let uri = process.env.MONGODB_URI;

const app = express();
app.use(express.json());

// Connect to MongoDB with error handling
mongoose.connect(uri);

app.use(express.static(path.join(__dirname, 'public')));

// Get all todos with error handling
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    console.error('Error fetching todos:', err);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// Create a new todo with validation and error handling
app.post('/todos', async (req, res) => {
  const { text } = req.body;

  // Validate input
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return res.status(400).json({ error: 'Invalid input: text must be a non-empty string' });
  }

  try {
    const todo = new Todo({
      text
    });
    await todo.save();
    res.status(201).json(todo); // Created status
  } catch (err) {
    console.error('Error saving todo:', err);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// Delete a todo by ID with error handling
app.delete('/todos/:id', async (req, res) => {
  try {
    const result = await Todo.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.sendStatus(204); // No content status
  } catch (err) {
    console.error('Error deleting todo:', err);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// Global error handler for any unhandled errors
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(3000, () => console.log('Server started on http://localhost:3000'));

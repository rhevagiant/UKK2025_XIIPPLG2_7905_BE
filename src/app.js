const express = require('express');
const authRoutes = require('./Routes/auth/authRoutes');
const categoryRoutes = require('./Routes/category/categoryRoutes');

const app = express();

app.use(express.json())

app.use('/user', authRoutes);
app.use('/category', categoryRoutes);

app.use((err, req, res, next) => {
    console.error('Error:', err.stack); 
    res.status(500).json({ message: 'Internal Server Error' });
  });

module.exports = app;
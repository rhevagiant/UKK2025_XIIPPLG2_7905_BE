const express = require('express');
const authRoutes = require('./Routes/auth/authRoutes');

const app = express();

app.use(express.json())

app.use('/user', authRoutes);

app.use((err, req, res, next) => {
    console.error('Error:', err.stack); 
    res.status(500).json({ message: 'Internal Server Error' });
  });

module.exports = app;
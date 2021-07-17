const express = require('express');
const { Sequelize } = require('sequelize');
const path = require('path');

const userRoutes = require('./routes/user');
// const postRoutes = require('/routes/post);

const app = express();

const sequelize = new Sequelize('groupomania_db', 'szymon', 'abcd1234', {
    host: 'localhost',
    dialect: 'mysql'
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/user', userRoutes); 
// app.use('/api/post', postRoutes);

module.exports = app;

// 8qCxCF4kFP
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const { now } = require('sequelize/types/lib/utils');
const models = require('../models');

exports.signup = (req, res, next) => {
    console.log('works')
    const { username, email, password } = req.body
    models.User.findOne({
        attributes: ['email'],
        where: { email: email }
    }).then(user =>{
        if (!user) {
            console.log('Not a user')
            bcrypt.hash(password, 10, function (err, bcryptPassword) {
                let newUser = models.User.create({ 
                    email: email, 
                    username: username, 
                    password: bcryptPassword 
                })
                .then(newUser => {res.status(201).json({ 'username': newUser.username })})
                .catch(err => {
                    res.status(500).json({ err })
                })
            })
        } else {
            console.log('User already exists')
            res.status(403).json({ error: 'User already exists' })
        }
    })
   
}

exports.login = (req, res, next) => {
    console.log('bing')
    const { email, password } = req.body
    if (email == null || password == null) {
        res.status(400).json({ error: 'Please enter a valid email and password'})
    }
    models.User.findOne({
        where: { email: email }
    })
    .then(user => {
        if (user) {
            bcrypt.compare(password, user.password, (errComparePassword, bcryptResult) => {
                if (bcryptResult) {
                    res.status(200).json({ 'ok': 'ok' })
                } else {
                    res.status(403).json({ error: 'incorrect password'})
                }
            })
        }
    }).catch(err => { res.status(500).json({ err })})
}
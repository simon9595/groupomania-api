const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const { now } = require('sequelize/types/lib/utils');
const models = require('../models');

exports.signup = (req, res, next) => {
    console.log(req.body)
    const { username, email, password } = req.body
    const regexEmail = /^[a-zA-Z0-9._-]{3,}@[a-zA-Z0-9._-]{2,}\.[a-z]{2,10}$/;
    const regexUsername = /^[a-zA-Z0-9_-]{3,15}$/;
    const regexPassword = /^.{8,}$/;
    let correctEmail = regexEmail.test(email);
    let correctUsername = regexUsername.test(username);
    let correctPassword = regexPassword.test(password);
    console.log(correctEmail, correctUsername, correctPassword);
    if (username == null || email == null || password == null || !correctEmail || !correctUsername || !correctPassword) {
        res.status(400).json({ error: 'Please enter a valid username, email and password'})
    } else {
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
    }).catch(err => { res.status(500).json({ err })})
   }};

exports.login = (req, res, next) => {
    console.log(req.body)
    const { email, password } = req.body
    const regexEmail = /^[a-zA-Z0-9._-]{3,}@[a-zA-Z0-9._-]{2,}\.[a-z]{2,10}$/;
    const regexPassword = /^.{8,}$/;
    let correctEmail = regexEmail.test(email);
    let correctPassword = regexPassword.test(password);

    if (email == null || password == null || !correctEmail || !correctPassword) {
        res.status(400).json({ error: 'Please enter a valid email and password'})
    } else {
    models.User.findOne({
        where: { email: email }
    })
    .then(user => {
        if (user) {
            const token = jwt.sign(
                { userId: user.UUID },
                'CHANGE_ME',
                {expiresIn: '24h' });
            bcrypt.compare(password, user.password, (errComparePassword, bcryptResult) => {
                if (bcryptResult) {
                    res.status(200).json({ 
                        username: user._id,
                        token: token
                     })
                } else {
                    res.status(403).json({ error: 'incorrect password'})
                }
            })
        }
        else {
            console.log('Not a user')
            res.status(404).json({ error: 'User not found'})
        }
    }).catch(err => { res.status(500).json({ err })})
}};
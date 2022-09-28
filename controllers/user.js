const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const { now } = require('sequelize/types/lib/utils');
const models = require('../models');

exports.signup = (req, res, next) => {
    console.log(req.body)
    const { username, email, password } = req.body
    const regexEmail = /^[a-zA-Z0-9\._-]{3,}@[a-zA-Z0-9._-]{2,}\.[a-z]{2,10}(\.[a-z]{2,8})?$/;
    const regexUsername = /^[a-zA-Z0-9_-]{4,15}$/; // fix this
    const regexPassword = /^.{8,}$/;
    let correctEmail = regexEmail.test(email);
    let correctUsername = regexUsername.test(username);
    let correctPassword = regexPassword.test(password);
    console.log('correct email:', correctEmail, 'correct username:', correctUsername,'correct password:', correctPassword);
    if (!correctEmail || !correctUsername || !correctPassword || username == null) {
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
    const regexEmail = /^[a-zA-Z0-9._-]{3,}@[a-zA-Z0-9._-]{2,}\.[a-z]{2,10}(\.[a-z]{2,8})?$/;
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
                { userId: user._id },
                'CHANGE_ME',
                {expiresIn: '24h' });
            bcrypt.compare(password, user.password, (errComparePassword, bcryptResult) => {
                if (bcryptResult) {
                    res.status(200).json({ 
                        userId: user.id,
                        username: user.username,
                        email: user.email,
                        isAdmin: user.isAdmin,
                        token: token,
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

exports.getUser = (req, res) => {
    const id = req.params.id;
    models.User.findOne({
        where: { id: id }
    })
    .then(
        (user) => {
            res.status(200).json(user)
        }
    )
    .catch(
        (error) => {
            res.status(404).json({
                error: error
            })
        }
    )
};

exports.changePassword = (req, res) => {
    console.log(req.body)
    const { userId, password } = req.body;
    models.User.findOne({
        where: { id: userId }
    }).then(user =>{
        if (!user) {
            res.send(500).json({'Error': 'Something went wrong.'})
        } else {
            console.log('Changing password')
            bcrypt.hash(password, 10, function (err, bcryptPassword) {
                models.User.update(
                    { password: bcryptPassword },
                    { where: { id: userId }}
                )
                .then(() => {
                    console.log('Password changed!')
                    res.status(200).json({ 'Request successful': 'Password changed!'})
                })
                .catch(error => console.log(error))
            })
        }
        console.log(user)
    })
    res.status(200).json({'Request received' : 'Okay'})
}

exports.deleteAccount = (req, res) => {
    console.log('account deletion')
    // implement a more secure way of doing this
    res.status(200).json({'Account deletion request received': 'OK'})

}
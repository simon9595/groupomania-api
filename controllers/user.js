const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models');

exports.signup = (req, res) => {
	const { username, email, password } = req.body
	const regexEmail = /^[a-zA-Z0-9\._-]{3,}@[a-zA-Z0-9._-]{2,}\.[a-z]{2,10}(\.[a-z]{2,8})?$/;
	const regexUsername = /^[a-zA-Z0-9_-]{3,15}$/;
	const regexPassword = /^.{8,}$/;
	let correctEmail = regexEmail.test(email);
	let correctUsername = regexUsername.test(username);
	let correctPassword = regexPassword.test(password);
	if (!correctEmail || !correctUsername || !correctPassword || username == null) {
		res.status(400).json({ error: 'Please enter a valid username, email and password'})
	} else {
	models.User.findOne({ 
		attributes: ['email'],
		where: { email: email }
	}).then(user =>{
			if (!user) {
				bcrypt.hash(password, 10, function (err, bcryptPassword) {
					models.User.create({ 
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
				res.status(403).json({ error: 'User already exists' })
			}
	}).catch(err => { res.status(500).json({ err })})
	}};

exports.login = (req, res) => {
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
				{ userId: user.id },
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
	const { userId, password } = req.body;
	models.User.findOne({
		where: { id: userId }
	}).then(user =>{
		if (!user) {
			res.send(500).json({'Error': 'Something went wrong.'})
	} else {
		bcrypt.hash(password, 10, function (err, bcryptPassword) {
			models.User.update(
				{ password: bcryptPassword },
				{ where: { id: userId }}
				)
				.then(() => {
					res.status(200).json({ 'Request successful': 'Password changed!'})
				})
				.catch(error => res.send(500).json({error}))
			})
		}
	}).catch(error => res.status(500).json({ error }))
}

exports.deleteAccount = (req, res) => {
const { userId, password } = req.body;
models.User.findOne({
	where: { id: userId }
	}).then(user => {
		bcrypt.compare(password, user.password, (errComparePassword, bcryptResult) => {
			if (bcryptResult) {
				models.Post.destroy({
					where: {userId: user.id}
					}).then(() => {
						models.User.destroy({
							where: { id: userId }
						}).then(
							res.status(200).json('Account deleted')
						).catch(error => { res.send(400).json({ error })})
					}).catch(error => res.send(500).json(error))
				} else {
					res.status(403).json('Password mismatch')
			}
		})
	}).catch(error => res.send(500).json({ error }))
}

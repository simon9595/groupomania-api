const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/:username', userCtrl.getUser);
router.put('/:id', userCtrl.changePassword);
router.delete('/:id', userCtrl.deleteAccount);

module.exports = router;
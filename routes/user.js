const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/:id', userCtrl.getUser);
router.put('/:id', userCtrl.changePassword);
router.delete('/:id', auth, userCtrl.deleteAccount);

module.exports = router;
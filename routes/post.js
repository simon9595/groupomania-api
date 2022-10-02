const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config')
const auth = require('../middleware/auth')
const postCtrl = require('../controllers/post');

router.post('/publish', auth, multer, postCtrl.publish);
router.put('/modify', auth, postCtrl.modifyPost);
router.get('/', auth, postCtrl.getAll);
// router.get('/:id', postCtrl.getPost);
router.delete('/:id', auth, postCtrl.deletePost);
router.post('/:id/like', postCtrl.likePost);
// comments

module.exports = router;
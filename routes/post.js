const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config')
const auth = require('../middleware/auth')
const postCtrl = require('../controllers/post');

router.post('/publish', auth, multer, postCtrl.publish);
router.put('/modify', auth, multer, postCtrl.modifyPost);
router.get('/', auth, postCtrl.getAll);
router.delete('/:id', auth, postCtrl.deletePost);
router.post('/:id/like', postCtrl.likePost);
router.post('/seen', postCtrl.seenPosts)

module.exports = router;
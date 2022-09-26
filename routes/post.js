const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config')
const postCtrl = require('../controllers/post');

router.post('/publish', multer, postCtrl.publish);
router.put('/modify', postCtrl.modifyPost);
router.get('/', postCtrl.getAll);
// router.get('/:id', postCtrl.getPost);
// router.delete('/:id', postCtrl.deletePost);
router.post('/:id/like', postCtrl.likePost);
// comments

module.exports = router;
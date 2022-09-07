const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post');

router.post('/publish', postCtrl.publish);
// router.put('/modify', postCtrl.modifyPost);
router.get('/', postCtrl.getAll);
// router.get('/:id', postCtrl.getPost);
// router.delete('/:id', postCtrl.deletePost);
// router.post('/:id/like', sauceCtrl.likePost);
// comments

module.exports = router;
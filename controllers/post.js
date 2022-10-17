const models = require('../models');
const jwt = require('jsonwebtoken');
const fs = require('fs');

exports.publish = (req, res) => {
  const { userId, text } = req.body;
  const attachment = req.file;
  const url = req.protocol + '://' + req.get('host');
  models.User.findOne({
    attributes: ['id'],
    where: { id: userId }
  }).then(user => {
    if (!user){
      res.status(500).json({ 'error': 'Something went wrong' })
    } else {
      if (req.file !== undefined) {
        var attachmentUrl = url + '/images/' + attachment.filename
      } 
      models.Post.create({
        text: text,
        userId: user.id,
        attachment: attachmentUrl
      }).then(res.status(201).json({'Post published': 'OK'}))
      .catch(err => res.status(500).json({ err }))
    }
  })
  .catch(err => res.status(500).json({ err }))
}

exports.modifyPost = (req, res) => {
  const { userId, postId, text } = req.body;
  const attachment = req.file;
  models.User.findOne({
    where: { id: userId }
  }).then(user => {
    if (!user) {
      res.status(500).json({ 'error': 'Something went wrong'})
    } else {
      if(req.file){
        const url = req.protocol + '://' + req.get('host');
        let attachmentUrl = url + '/images/' + attachment.filename
          models.Post.update(
            {text: text,
            attachment: attachmentUrl},
            {where: { id: postId}}
          ).then(res.status(200).json({ 'Success': 'Post has been successfully edited'}))
          .catch(err => res.status(500).json({err}))
      } else {
      models.Post.update(
        { text: text },
        { where: { id: postId}}
      ).
      then(() => {
        res.status(200).json({'Success': 'Post had been modified'})
      })
      .catch(error => res.status(500).json({error}))
    }}
  })
}

exports.deletePost = (req, res) => {
  const postId = req.params.id
  models.Post.findOne({
    where: { id: postId }
  }).then((post) =>{
    const attachment = post.attachment
    if(attachment) {
      const filename = attachment.split('/images/')[1];
      fs.unlink('images/' + filename, () => {
        models.Post.destroy({
          where: { id: post.id }
        }).then(
          res.status(200).json({ 'OK': 'Post with image has been deleted'})
        ).catch(error => res.status(500).json({error}))
      })
    } else {
      models.Post.destroy({
        where: { id: post.id }
      }).then(
        res.status(200).json({ 'OK': 'Post without image has been deleted'})
      ).catch(error => res.send(500).json({ error }))
    }
  }).catch(error => {
    res.status(500).json({ error })
  })
}

exports.getAll = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, 'CHANGE_ME');
  const userId = decodedToken.userId
  models.Post.findAll({ include: [
    {
      model: models.User,
      attributes: ['username'],
     }, {
      model: models.Seen,
      where: {userID: userId},
      attributes: ['seen'],
      required: false
     }
  ], order: [['createdAt', 'DESC']]})
  .then(posts => {
    res.status(200).json(posts)})
  .catch(error => res.status(500).json({error}))
}

exports.seenPosts = (req, res) => { 
  const { userId } = req.body
  models.Post.findAll({attributes: ['id']}).then(allPosts => {
    for(let i = 0; i < allPosts.length; i++) {
      models.Seen.findOrCreate({
        where: {userId: userId, postId: allPosts[i].id, seen: true}
      }).then(console.log('Marking post as seen'))
      .catch(error => res.status(500).json({error}))
    }
  }).then(res.status(200).json({ 'OK': 'Posts marked as seen!'}))
  .catch(error => res.status(500).json({error}))
}

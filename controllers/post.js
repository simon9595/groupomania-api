const models = require('../models');
const fs = require('fs')

exports.publish = (req, res) => {
  const { userId, text } = req.body;
  console.log('User ID', userId)
  const attachment = req.file;
  const url = req.protocol + '://' + req.get('host');
  models.User.findOne({
    attributes: ['id'],
    where: { id: userId }
  }).then(user => {
    if (!user){
      console.log('User not found.')
      res.status(500).json({ 'error': 'Something went wrong' })
    } else {
      if (req.file !== undefined) {
        console.log('Post contains image')
        var attachmentUrl = url + '/images/' + attachment.filename
      } 
      let newPost = models.Post.create({
        text: text,
        userId: user.id,
        attachment: attachmentUrl
      }).then(newPost => res.status(201).json({ 'post published': 'OK' }))
      .catch(err => res.status(500).json({ err }))
    }
  })
  .catch(err => res.status(500).json({ err }))
}

exports.modifyPost = (req, res) => {
  const { userId, postId, text } = req.body;
  models.User.findOne({
    where: { id: userId }
  }).then(user => {
    if (!user) {
      res.status(500).json({ 'error': 'Something went wrong'})
    } else {
      console.log(userId, postId, text)
      models.Post.update(
        { text: text },
        { where: { id: postId}}
      ).
      then(() => {
        console.log('Success')
        res.status(200).json({'Success': 'Post had been modified'})
      })
      .catch(error => console.log(error))
    }
  }).catch(error => console.log(error))
}

exports.likePost = (req, res) => {
  console.log(req.body)
  // BROKEN BROKEN BROKEN
  // models.Post.findOne({
  //   attributes: ['id'],
  //   where: { id: req.body.id}
  // }).then(post => {
  //   console.log(post)
  //   models.Post.update({
  //     attributes: ['id'],
  //     where: { id: req.body.id },
  //     $inc: { likes: 1 },
  //     $push: { likedUsers: req.body.userId }
  //   }).then(() =>
  //     {res.status(201).json({ message: 'Liked!'})}
  //   ).catch(error => { res.status(500).json({ error })})
  // }).catch(error => {res.status(500).json({ error })})
}

exports.deletePost = (req, res) => {
  const postId = req.params.id
  models.Post.findOne({
    where: { id: postId }
  }).then((post) =>{
    console.log(post.attachment)
    const attachment = post.attachment
    if(attachment) {
      console.log('Post contains an attachment')
      const filename = attachment.split('/images/')[1];
      fs.unlink('images/' + filename, () => {
        models.Post.destroy({
          where: { id: post.id }
        }).then(
          res.status(200).json({ 'OK': 'Post with image has been deleted'})
        ).catch(error => res.status(500).json({error}))
      })
    } else {
      console.log('It doesn\'t')
      models.Post.destroy({
        where: { id: post.id }
      }).then(
        res.status(200).json({ 'OK': 'Post without image has been deleted'})
      ).catch(error => res.send(500).json({ error }))
    }
  }).catch(error => {
    console.log(error)
    res.status(500).json({ error })
  })
}

exports.getAll = (req, res, next) => {
  const { userId } = req.body
  console.log(userId);
  console.log(req.params )
  models.Post.findAll({ include: [{model: models.User, attributes: ['username']}], order: [['createdAt', 'DESC']]})
  .then(posts => 
    res.status(200).json(posts))
    // models.Seen.findAll({
      
    // })
  .catch(err => console.log(err))
}
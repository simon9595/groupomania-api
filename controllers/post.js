const models = require('../models');

exports.publish = (req, res) => {
  console.log(req.body);
  const { userId, text, attachment } = req.body;
  console.log('testing');
  console.log(userId, text, attachment);
  models.User.findOne({
    attributes: ['id'],
    where: { id: userId }
  }).then(user => {
    if (!user){
      console.log('User not found.')
    } else {
      let newPost = models.Post.create({
        text: text,
        attachment: attachment,
        userId: user.id
      }).then(newPost => res.status(201).json({ 'post published': 'OK' }))
      .catch(err => res.status(500).json({ err }))}})
    .catch(err => res.status(500).json({ err }))
    }

exports.getAll = (req, res, next) => {
  console.log('Get all posts');
  models.Post.findAll({ include: [{model: models.User, attributes: ['username']}]})
  .then(posts => 
    res.status(200).json(posts))
  .catch(err => console.log(err))
}
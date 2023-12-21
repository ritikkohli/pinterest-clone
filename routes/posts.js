const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  image:{
    type: String,
    required: true
  },
  postText: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;

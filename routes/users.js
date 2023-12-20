const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const plm = require('passport-local-mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/pinterest');

// Define the User schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  dp: {
    type: String, // Assuming dp is a URL to the profile picture
  },
  fullname: {
    type: String,
    required: true,
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post', // Assuming you have a Post model
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
  password: {
    type: String
  }
});

userSchema.plugin(plm);

// Create and export the User model
module.exports = mongoose.model('User', userSchema);
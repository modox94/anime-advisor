const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
  },
  search: { type: Array, default: [] }, // тут хранятся id сериалов/фильмов MAL
  recommendations: { type: Object, default: {} }, // тут хранятся id сериалов/фильмов MAL
  expections: { type: Array, default: [] }, // тут хранятся id сериалов/фильмов MAL
});

module.exports = mongoose.model('User', userSchema);

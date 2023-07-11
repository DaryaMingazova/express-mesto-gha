const mongoose = require('mongoose');
// eslint-disable-next-line no-unused-vars
const validator = require('validator');
const { imgUrlRegExp } = require('../utils/regexp');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'Нужно хотя бы 2 символа.'],
    maxlength: [30, 'Максимальная длина — 30 символов.'],
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (image) => imgUrlRegExp.test(image),
      message: 'Неверный url изображения.',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });
module.exports = mongoose.model('card', cardSchema);

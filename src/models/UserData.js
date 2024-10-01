// models/UserData.js
const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  age: Number,
  phone: String,
  address: String,
  course: String,
  semester: String,
  favoriteColor: String,
  favoriteFood: String,
  interestingFact: String,
});

const UserData = mongoose.model('UserData', userDataSchema);
module.exports = UserData;

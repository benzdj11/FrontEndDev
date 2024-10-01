// routes/userRoutes.js
const express = require('express');
const User = require('../models/User');
const router = express.Router();


function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).send({ message: 'Unauthorized' });
}

// POST: Create or update user data
router.post('/api/user/data', isAuthenticated, async (req, res) => {
  const userId = req.user.id;
  const { age, phone, address, course, semester, favoriteColor, favoriteFood, interestingFact } = req.body;

  try {
    await User.findByIdAndUpdate(userId, {
      age,
      phone,
      address,
      course,
      semester,
      favoriteColor,
      favoriteFood,
      interestingFact,
    }, { new: true, upsert: true }); // Create if not exists

    res.status(200).send({ message: 'User data saved successfully' });
  } catch (error) {
    console.error('Error saving user data:', error);
    res.status(500).send({ message: 'Error saving user data' });
  }
});

// PUT: Update user data
router.put('/api/user/data', isAuthenticated, async (req, res) => {
  const userId = req.user.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
    res.status(200).send(updatedUser);
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).send({ message: 'Error updating user data' });
  }
});

// DELETE: Delete user data
router.delete('/api/user/data', isAuthenticated, async (req, res) => {
  const userId = req.user.id;

  try {
    await User.findByIdAndUpdate(userId, { $unset: { age: "", phone: "", address: "", course: "", semester: "", favoriteColor: "", favoriteFood: "", interestingFact: "" } });
    res.status(200).send({ message: 'User data deleted successfully' });
  } catch (error) {
    console.error('Error deleting user data:', error);
    res.status(500).send({ message: 'Error deleting user data' });
  }
});

module.exports = router;

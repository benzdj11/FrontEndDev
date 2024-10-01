const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const User = require('./models/User');
const UserData = require('./models/UserData'); 
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 
require('./config/passport')(passport);

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'yourSecretKey', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose.connect('mongodb+srv://benzd1996:Coolguy4@backenddev.jb94j.mongodb.net/users', { useNewUrlParser: true, useUnifiedTopology: true });

// User Registration
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).send('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });

  try {
    await newUser.save();
    console.log('Registered User:', newUser);
    res.status(201).send('User registered successfully');
  } catch (err) {
    res.status(400).send('Error registering user');
  }
});

// User Login
app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Error during authentication.' });
    }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Login failed.' });
      }
      // Generate a token and send it
      const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' }); 
      return res.json({ message: 'Logged in successfully!', token }); 
    });
  })(req, res, next);
});

// User Logout
app.get('/logout', (req, res) => {
  req.logout();
  res.send('Logged out successfully');
});

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401); 

  jwt.verify(token, 'your_jwt_secret', (err, user) => { 
    if (err) return res.sendStatus(403); 
    req.user = user; 
    next();
  });
};

// User Data Routes
app.post('/api/user/data', authenticateToken, async (req, res) => {
  const userId = req.user.id; 
  const newData = new UserData({ ...req.body, userId });

  try {
    const savedData = await newData.save();
    res.status(201).json({ message: 'Data saved successfully', data: savedData });
  } catch (error) {
    res.status(400).json({ message: 'Error saving data', error });
  }
});

// Get user data
app.get('/api/user/data', authenticateToken, async (req, res) => {
    try {
      const userDataArray = await UserData.find({ userId: req.user.id }); 
      if (!userDataArray.length) {
        return res.status(404).json({ message: 'User data not found' });
      }
  
      const filteredData = userDataArray.map(doc => {
        const { _id, userId, __v, ...data } = doc.toObject(); 
        return data; 
      });
  
      res.json(filteredData); // Send the filtered data
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

// PUT route to update user data
app.put('/api/user/data/:id', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const updatedData = await UserData.findOneAndUpdate(
      { _id: req.params.id, userId },
      req.body,
      { new: true }
    );

    if (!updatedData) {
      return res.status(404).json({ message: 'Data not found or not owned by user' });
    }

    res.json({ message: 'Data updated successfully', data: updatedData });
  } catch (error) {
    res.status(400).json({ message: 'Error updating data', error });
  }
});

// DELETE route to delete user data
app.delete('/api/user/data/:id', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const deletedData = await UserData.findOneAndDelete({ _id: req.params.id, userId });

    if (!deletedData) {
      return res.status(404).json({ message: 'Data not found or not owned by user' });
    }

    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting data', error });
  }
});

// Start server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});

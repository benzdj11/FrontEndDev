const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        const user = await User.findOne({ username });
        
        if (!user) {
          console.log('User not found:', username);
          return done(null, false, { message: 'Incorrect username.' });
        }

        // Log user found and stored password
        console.log('User found:', user.username);
        console.log('Stored Hashed Password:', user.password);

        // Use the comparePassword method
        const match = await user.comparePassword(password);
        console.log('Password Attempt:', password);
        console.log('Password Match Result:', match);

        if (!match) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        
        return done(null, user);
      } catch (err) {
        console.error('Error during authentication:', err);
        return done(err);
      }
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      console.error('Error during deserialization:', err);
      done(err);
    }
  });
};

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/userSchema');

const saltRounds = 12;

// ALL URL IN THIS PAGE STARTS WITH /AUTH


// this route is to sign up a new user
// steps taken:
// firstly, using the user schema/model .findOne(), find if the username sent in the req.body is already present
// if username is taken, we return a 409 status
// if username is not taken, use the User schema/model .create() to create a new user with the deatils provided, and hash the password
// save this new created user into a variable named user
// extract the username and id of the user and save to a variable named payload
// create a jwt token using this payload and the secretkey in the .env file
// return this key to the user as a response when user is successfully created
router.post('/sign-up', async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username });

    if (userInDatabase) {
      return res.status(409).json({ err: 'Username already taken.' });
    }
    console.log(req.body);
    const user = await User.create({
    name: req.body.name,
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, saltRounds),
      email: req.body.email
      
    });

    const payload = { username: user.username, _id: user._id };

    const token = jwt.sign({ payload }, process.env.JWT_SECRET);

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});


// this route is to sign in a existing user
router.post('/sign-in', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).json({ err: 'Invalid credentials.' });
    }

    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      user.hashedPassword
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({ err: 'Invalid credentials.' });
    }

    const payload = { username: user.username, _id: user._id };

    const token = jwt.sign({ payload }, process.env.JWT_SECRET);

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;

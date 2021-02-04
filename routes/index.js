const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const User = require('../models/User');
const marked = require('marked');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);

router.post('/note', ensureAuthenticated, async (req, res) => {
  const notes = req.user.notes;
  const userId = req.user._id;
  const title = req.body.title;
  const description = req.body.description;

  if (!req.body.title) {
    return res.redirect('/dashboard');
  }

  if (!req.body.description) {
    return res.redirect('/dashboard');
  }

  const note = {
    index: notes.length,
    title: title,
    description: marked(description)
  }

  notes.push(note);

  const updatedUser = {
    name: req.user.name,
    email: req.user.email,
    password: req.user.password, 
    date: req.user.date,
    notes: notes,
  }

  const done = await User.findByIdAndUpdate(userId, updatedUser, {
    new: true
  });

  res.redirect('/dashboard');
});

router.delete('/note/:index', ensureAuthenticated, async (req, res) => {
  const notes = req.user.notes;

  if (notes.length >= 1) {
    notes.splice(0, 1);
  }
  else {
    notes.splice(req.params.index, 1);
  }


  const updatedUser = {
    name: req.user.name,
    email: req.user.email,
    password: req.user.password, 
    date: req.user.date,
    notes: notes,
  }

  const done = await User.findByIdAndUpdate(req.user._id, updatedUser, {
    new: true
  });

  res.redirect('/dashboard');
});


module.exports = router;

const express = require('express');
const mongoose = require('mongoose');
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');

const Story = mongoose.model('stories')

const router = express.Router();

router.get('/', ensureGuest, (req, res) => {
  res.render('index/welcome');
})

router.get('/about', (req,res) => {
  res.render('index/about');
})

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  Story.find({user: req.user.id})
    .then(stories => res.render('index/dashboard', {stories}))
})

module.exports = router;
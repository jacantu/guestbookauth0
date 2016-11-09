var express = require('express');
var passport = require('passport');
var router = express.Router();
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();


/* GET user profile. */
router.get('/', ensureLoggedIn, function(req, res, next) {
  res.render('user', { user: req.user });
});

module.exports = router;

var express = require('express');
var passport = require('passport');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();

var env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Guestbook' , env: env});
});

router.get('/login',
  function(req, res){
    res.render('login', { env: env });
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

router.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '/url-if-something-fails' }),
  function(req, res) {
    res.redirect(req.session.returnTo || '/user');
  });

/* GET Userlist page. */
router.get('/user', ensureLoggedIn, function(req, res) {
    var db = req.db;
    var collection = db.get('guestcollection');
    collection.find({},{},function(e,docs){
        res.render('user', {
            "userlist" : docs
        });
    });
});

/* POST to Add User Service */
router.post('/adduser', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userEmail = req.body.useremail;
    var userMessage = req.body.usermessage;

    // Set our collection
    var collection = db.get('guestcollection');

    // Submit to the DB
    collection.insert({
        "name" : userName,
        "email" : userEmail,
        "message" : userMessage
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("/user");
        }
    });
});

//delete guest book entry
router.get('/:id', function(req,res){
	var id = req.params.id;
	var objectId = new ObjectID(id);

	var db = req.db;
	var collection = db.get('guestcollection');
	console.log(collection);
	collection.remove({_id: objectId});
	res.redirect('/user');

});

//get user message
router.get('/:id/usermessage', function(req,res){
	var id = req.params.id;
	var objectId = new ObjectID(id);

	var db = req.db;
	var collection = db.get('guestcollection');
	console.log(collection);
	collection.find({_id: objectId}, function(err, result){

		if(err){
			res.send("there was an error");
		}
		else{
		res.render('message', {
				"usermessage" : result
			});
		//res.json(result);
		}
	});

});

//delete user message
router.get('/usermessage', function(req,res){
	var id = req.params.id;
	var objectId = new ObjectID(id);

	var db = req.db;
	var collection = db.get('guestcollection');
	console.log(collection);
	collection.remove({_id: objectId});
	res.redirect('/user');

});

module.exports = router;

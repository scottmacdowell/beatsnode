var passport   = require('passport');

var authController = {

	//Display Authorization and acquires Auth code
	authorize: passport.authenticate('beatsmusic'),

	//Acquires Access Token
	acquireToken: passport.authenticate('beatsmusic', { failureRedirect: '/' }),

	//Redirects on successful login
	success: function(req, res) {
	  	User.findById(req.session.passport.user, function(err, usr){
			if(usr){
				res.redirect('/music/' + usr.beatsid );
			} 
		});
  	} 	
}

module.exports = authController;
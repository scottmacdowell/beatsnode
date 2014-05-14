////////
//Get Dependencies
var express 		= require('express'); //For the simple framework
	http    		= require('http');//To access the http server and client
	routes 			= require('./routes'),//My Routes
	passport		= require('passport'),//Authentication
	mongoose		  = require('./lib/mongoose'),//Easy DB access
	BeatsMusicStrategy = require('passport-beatsmusic').Strategy,//To simplify the OAuth2 process
	config 			= require('./lib/config'),//Keep my privates secret and organized
	exphbs  		= require('express3-handlebars'),//Templating system
	log 			= require('winston'),//Pretty server logging
	path			= require('path'); //To make file calls easier
	bodyParser 		= require('body-parser'), //New Express doesn't include this anymore :(
	cookieParser    = require('cookie-parser'),//What do my cookies say?
	session         = require('express-session'), //New Express doesn't include this anymore :(
	User 			= require('./models/userModel'),
	hbs 			= require('./lib/handlebars'),//HandleBars configurations
	app     		= express();//The App

////////
//Configure App
app.engine('handlebars', hbs.engine);//Register handlebars with the Express app
app.set('view engine', 'handlebars');
app.use(bodyParser()); //Parse application/json and application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, "public")));//Setup public folder
app.use(cookieParser()); // required before session.
app.use(session({ secret: 'this is my secret', key: 'sid', cookie: { secure: true }}))
app.use(passport.initialize());
app.use(passport.session());
///////

////////
//Initiate Routes
routes.set(app); //launch routes
///////
//Initiate Authentication
passport.use('beatsmusic', new BeatsMusicStrategy({
	    clientID: config.get('BeatsAPI:client'),//Beats Client Key
	    clientSecret: config.get('BeatsAPI:secret'),//Beats Secret Key
	    callbackURL: "http://beatsnode.herokuapp.com//music" //Callback URL
 	},
	function(accessToken, refreshToken, profile, done) {
		User.findOne({ beatsid: profile.id }, function (err, user) {
	      	if (!user) {
	    		
	    		User.create({
	    			beatsid: profile.id,
	    			beatsusername: profile.username,
					full_name:  profile.displayName,
					country:  profile.country,
					access_token: accessToken
	    		}, function (err, maker) {
	    			return done(err, user);
				});
	    		

	    	} else if (err) {
	    		log.error('error: ' + err);
	    		return done(err, user);
	    	} else {
	    		user.update({access_token: accessToken}, function(err){
	    			if(!err){
	    				user.save();
	    				return done(err, user);
	    			}
	    		})
	    	}
	    });
  	}
));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

////////
//Launch Server
app.listen(process.env.PORT || 3000, function(){
    log.info('Express server listening on port ' + config.get('port'));
});
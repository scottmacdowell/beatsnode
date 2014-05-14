var User = require('../models/userModel'),
	https = require('https'),
	async = require('async'),
	config 			= require('../lib/config'),
	currentUser = {},
	tracks = [],
	currentPlaylists = [{
		tracks: []
	}
	];

var musicController = {

	render: function(req, res){
		currentUser.beatsid = req.params.beatsid;
		renderIt(req, res);
	}
}

function renderIt(req, res) {
	async.series({
		userinfo: function(cb){
			User.findOne({beatsid: currentUser.beatsid}, function(err, usr){
				if(usr.full_name){
					var name = usr.full_name.split(' ');
					currentUser.first_name = name[0]+',';
				} else {
					currentUser.first_name ='';
				}

				currentUser.access_token = usr.access_token;
				currentUser.beatsid = usr.beatsid;
				cb(false, null);
			}); 
		},
		playlists: function(cb){
			https.get('https://partner.api.beatsmusic.com/v1/api/users/'
			+ currentUser.beatsid
			+ '/playlists?access_token=' 
			+ currentUser.access_token, 

			function (res) {
		    	var str = '';

		    	//compile all the response data into a string
	        	res.on('data', function (chunk) {
	               str += chunk;
	         	});

	        	//After response...
	        	res.on('end', function () {
	        		//parse the response string into a JSON object
	        		var response = JSON.parse(str).data;
	        		currentPlaylists.length = 0;
		        		for(var x=0; x<response.length; x++) {
		        			//clear track holder
		        			tracks.length = 0;

		        			//create new playlist
		        			currentPlaylists.push({name: response[x].name, id: response[x].id, tracks: []});

		        			//add in tracks
		        			for(var y=0; y< response[x].refs.tracks.length; y++){
		        				currentPlaylists[x].tracks.push({trackid: response[x].refs.tracks[y].id})
		        			}
						}
			    	cb(false, null);
				});	
			});
		},
	},
	function (err, results) {
		if (err){
			log.error(err);
			return res.redirect('/');
		} else {
			return res.render('music', renderContent());
		}
	}); 
}

function renderContent(){
	var musicData = {
		//Meta
		artist: 'Hello ' + currentUser.first_name,
		title: 'Choose a playlist',
		album: "And let's get the beats going",
		year: 'ya!',
		access_token: currentUser.access_token,
		//Playlists
		playlists: currentPlaylists,

		client_key: config.get('BeatsAPI:client') 
	};
	return musicData;
}

module.exports = musicController;
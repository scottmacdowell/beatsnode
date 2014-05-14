var mongoose    = require('mongoose'),
	Schema 		= mongoose.Schema;

var user = new Schema({
	beatsid: { type: String, index: { unique: true } },
	beatsusername: { type: String, index: { unique: true } },
	full_name: { type: String },
	country: { type: String },
	access_token: { type: String}
});

module.exports = mongoose.model('User', user);
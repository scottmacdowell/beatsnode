var Controller = require('../controllers'); //Load controllers

module.exports.set = function(app) {
	app.get('/', Controller.index.render);
	app.get('/auth', Controller.auth.authorize);
	app.get('/music', Controller.auth.acquireToken, Controller.auth.success);
	app.get('/music/:beatsid', Controller.music.render);
}
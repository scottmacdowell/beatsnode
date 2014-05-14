var indexController = require('./indexController'),
	authController = require('./authController'),
	musicController = require('./musicController'),

Controllers = {
	index : indexController,
	auth  : authController,
	music : musicController
};

module.exports = Controllers;
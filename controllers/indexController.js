var indexController = {

	render: function(req, res){
		res.render('login', {
			//Login Link
			login_link: '/auth'
		});
	}
}

module.exports = indexController;
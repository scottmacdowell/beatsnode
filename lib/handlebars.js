var helpers = require('./handlebarHelpers');

// Create `ExpressHandlebars` instance with a default layout.
var handleBarsConfig = exphbs.create({
    defaultLayout: 'main',
    helpers      : helpers,

    partialsDir: [
        'views/partials/'
    ]
});

module.exports = handleBarsConfig;
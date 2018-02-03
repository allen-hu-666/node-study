const http = require('http');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const initializeDb = require('./db');
const middleware = require('./middleware');
const api = require('./api');
const config = require('./config.json');

let app = express();
app.server = http.createServer(app);

// logger
app.use(morgan('dev'));
//console.log(app);
// 3rd party middleware
/* app.use(cors({
	exposedHeaders: config.corsHeaders
})); */

app.use(bodyParser.json({
	limit: config.bodyLimit
}));

// connect to db
initializeDb(db => {

	// internal middleware
	app.use(middleware({ config, db }));
	app.use('/static', express.static('static'));

	// api router
	app.use('/api', api({ config, db }));

	// index
	app.get('/', function (req, res) {
		res.redirect('/static/nav');
	});

	// 404
	app.get('*', function (req, res) {
		res.send("404 not found!")
	});

	app.server.listen(process.env.PORT || config.port, () => {
		console.log(`Started on   port ${app.server.address().port}`);
	});
});

module.exports = app;

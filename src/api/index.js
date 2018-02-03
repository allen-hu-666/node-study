const { version } = require('../../package.json');
const { Router } = require('express');
const facets = require('./facets');
const first = require('./first');

module.exports = ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	api.use('/first', first({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	return api;
}

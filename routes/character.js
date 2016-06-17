var express = require('express');
var router = express.Router();
var request = require('request');
var debug = require('debug')('starWars:character');

router.get('/', function (req, res, next) {
	debug('Hit character / endpoint')
	res.status(400).send('This resource requires a name as a path param i.e. /character/luke');
});

router.get('/:name', function (req, res, next) {
	debug('Hit character /name endpoint')
	let name = req.params.name.toString();
	if (!name) {
		res.status(400).send('You must provide a character name for this endpoint.')
	} else {
		var id = getCharID(name);
		if (!id) {
			res.status(400).send('Sorry, ' + name + ' is not a recognized name.');
		} else {
			request('http://swapi.co/api/people/' + id, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					var data = JSON.parse(body);
					res.render('character', {character: data}); 
				} 
			});			
		}
	}
});

// hardcoded 'nicknames' for full names present in the allCharIDs.json file
var characters = [
	{
		name: 'luke',
		id: 1
	},
	{
		name: 'han',
		id: 14
	},
	{
		name: 'leia',
		id: 5,
	},
	{
		name: 'rey',
		id: 85
	}
];

function getCharID (name) {
	var id = 0;
	characters.forEach(char => {
		if (char.name === name) {
			id = char.id;
		}
	});
	return id;
};

module.exports = router;

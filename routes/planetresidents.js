var express = require('express');
var router = express.Router();
var request = require('request');
var fs = require('fs');
var debug = require('debug')('starWars:planetresidents');

// read in character IDs from getCharIDs script
const CHARS = JSON.parse(fs.readFileSync(__dirname + "/../allCharIDs.json", "utf8"));
debug('Loaded ' + CHARS.length + ' characters!')

// GET -- returns object with planet names as keys and array of residents as values
router.get('/', function (req, res, next) {
	debug('Welcome to the planetresidents endpoint!');

	getPlanets().then(function (data) {
		var planets = [];
		data.forEach(planet => {
			var people = [];
			planet.residents.forEach(resident => {
				people.push(getCharName(extractID(resident)));
			});
			var planetObj = {
				name: planet.name,
				residents: people
			};
			planets.push(planetObj);
		});
		var toReturn = {};
		planets.forEach(planet => {
			toReturn[planet.name] = planet.residents;
		});
		res.send(toReturn);
	}, function errorCallback(error) {
		debug('Error');
		debug(error);
		res.status(500).send('Error! Unable to retrieve character data at this time.');
	});	
});

// some silly string manipulation to extract ID from the URL
function extractID (string) { 
	var s = string.slice(string.indexOf('/people/'), string.length);
	s = s.replace('/people/', '');
	s = s.replace('/', '');
	return parseInt(s);
};

// return char name from the matching given ID
function getCharName (id) { 
	var toReturn;
	CHARS.forEach(person => {
		if (person.id === id) {
			toReturn = person.name;
		}
	});
	return toReturn;
};

// repeatedly calls itself to get all planets
function getPlanets () {

	var planets = [];

	return new Promise(function (resolve, reject) {

		function get(url) {
			request(url, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					var data = JSON.parse(body);
					data.results.forEach(planet => {
						planets.push(planet);
					});
					if (data.next) {
						get(data.next);
					} else {
						resolve(planets);
					}
				} else {
					debug('received error');
					reject(body);
				}
			});
		};

		get('http://swapi.co/api/planets/');

	});
};

module.exports = router;

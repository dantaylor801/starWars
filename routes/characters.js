var express = require('express');
var router = express.Router();
var request = require('request');
var debug = require('debug')('starWars:characters');
var Promise = require('promise');

// GET -- retrieves characters list
// Optional SORT functionality
//    - name, mass, height are valid sort options
router.get('/', function (req, res, next) {
	debug('Hit the characters endpoint!');
	var sortBy;
	if (req.query.sort) {
		sortBy = req.query.sort.toString();
	}
	if (sortBy && !validSort(sortBy)) {
		debug('user wishes to sort by: ' + req.query.sort);
		res.status(400).send(sortBy + ' is not a valid sort.  Please use name, mass or height.');
	} else {
		getCharacters().then(function (data) {
			var toReturn = data;
			if (sortBy) {
				toReturn = mySort(toReturn, sortBy);
			}
			toReturn = toReturn.slice(0, 50); // limit to 50 results
			res.send(toReturn);
		}, function errorCallback(error) {
			debug('Error');
			debug(error);
			res.status(500).send('Error! Unable to retrieve character data at this time.');
		});		
	}

});

// repeatedly calls itself to get all pages of characters
function getCharacters () {

	var characters = [];

	return new Promise(function (resolve, reject) {

		function get(url) {
			request(url, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					var data = JSON.parse(body);
					data.results.forEach(person => {
						characters.push(person);
					});
					if (data.next) {
						get(data.next);
					} else {
						resolve(characters);
					}
				} else {
					debug('GET Function -- ERROR');
					reject(body);
				}
			});
		};

		get('http://swapi.co/api/people/');

	});
};

let sorts = ['name', 'mass', 'height'];

// checks if a sort param is valid
function validSort (sortBy) {
	return (sorts.indexOf(sortBy) + 1); // returns positive value if index is found, or 0 (false) when not
};

// custom sorting to handle the string values handed back from server
function mySort (toSort, sortBy) {
	var array = toSort;
	// specifically used for mass or height -- i.e. '1,358' throws issues with comparison
	// will sort highest value to lowest
	if (sortBy === 'mass' || sortBy === 'height') {
		array.sort(function (a,b) {
			var x = a[sortBy].replace(',', ''); // replace any commas in the string
			var y = b[sortBy].replace(',', ''); 
			if (x === 'unknown') x = 0; // treat unkown values as 0 value for sake of sorting
			if (y === 'unknown') y = 0;
			if (parseFloat(x) < parseFloat(y)) return 1;  // convert to float and compare
			if (parseFloat(x) > parseFloat(y)) return -1; 
			return 0;
		});
	} else {
		// simple alphabetical sort for names
		array.sort(function (a,b) {
			if (a[sortBy] < b[sortBy]) return -1;
			if (a[sortBy] > b[sortBy]) return 1;
			return 0;
		});
	}
	return array;
};

module.exports = router;

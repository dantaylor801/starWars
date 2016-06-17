var http = require('http');
var request = require('request');
var fs = require('fs');

var listLength;
var allChars = [];
var id = 1;

// used to determine 'people' list length
function getLength () {
	request('http://swapi.co/api/people/', function (error, response, body) {
		if (!error && response.statusCode == 200) {

			var data = JSON.parse(body);
			// make sure getChar() knows how many results to expect
			listLength = data.count; 
			console.log('The database has ' + listLength + ' characters stored.');
			console.log('Beginning to pull character ID numbers from server.');			

			// call getChar to process listLength clients
			getChar(id);
		} 
	});
};

function getChar (id) {
	request('http://swapi.co/api/people/' + id, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			// create new character with name & ID
			var character = JSON.parse(body);
			var person = {
				name: character.name,
				id: id
			};
			// add new character to master list
			allChars.push(person);
			if (allChars.length >= listLength) {
				var toPrint = JSON.stringify(allChars, null, ' ');
				console.log(allChars.length + ' characters gathered!\n\n');
				console.log(toPrint);
				fs.writeFile('allCharIDs.json', toPrint, function (err) {
					if (err) return console.log(err);
					console.log('Wrote data for ' + listLength + ' characters(s) to allCharIDs.json\n');
				});
			} else {
				id++;
				getChar(id);				
			}
		} else {
			// if (error) {
			// 	console.log('Error!');
			// 	console.log(error);
			// }
			// console.log(response.statusCode);
			// console.log(response.body);
			id++;
			getChar(id);
		}
	});
};

// get count of DB characters -- getLength() will then call getChar until all are gathered
getLength();


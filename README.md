# Star Wars API Server

### Designed to demo some basic express route handling skills.

## Current Endpoints
	• /character/:name - Will return an ejs view with character info when given a valid
		• i.e. /character/luke
	• /characters - Returns list of characters, currently capped at 50
		• Optional Sort methods include: name, mass, height.  These must be passed in as query params
		• i.e. /characters?sort=name
	• /planetresidents - Returns a planet object with planet names as keys and their respective array of residents as its value

Make sure to npm install before running.

Start app with 'DEBUG=starWars:* npm start' to enable debug messaging.

### getCharIDs.js ###
I wrote this as a quick script to pull in all characters IDs and store them in a local .json file.  This can be updated manually as often as one likes by running the script with node.  I just thought it would be useful to cut down on calls fired off by trying to get the names of every resident for every planet.

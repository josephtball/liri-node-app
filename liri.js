// node packages
var twitter = require("twitter");
var spotify = require("spotify");
var request = require("request");

var keys = require("./keys.js");
var command = process.argv[2];

var commands = {
	tweets: function() {
		var client = new twitter (keys.twitterKeys);
		var params = {screen_name: 'Mr_WebDev321', count: "20"};

		client.get("statuses/user_timeline", params, function(error, tweets, response) {
			if (!error) {
				for (var i = 0; i < tweets.length; i++) {
					console.log(tweets[i].text);
				}
			} else {
				console.log("Error: "+error);
			}
		});	
	},
}

switch (command) {
	case "my-tweets":
		commands.tweets();
		break;
	case "spotify-this-song":

		break;
	case "movie-this":

		break;
	case "do-what-it-says":

		break;
	default:
		console.log("Valid commands: \"my-tweets\", \"spotify-this-song '<song name here>'\", \"movie-this '<movie name here>'\", or \"do-what-it-says\".")
}
// node packages
var twitter = require("twitter");
var spotify = require("spotify");
var request = require("request");
var fs = require("fs");

var keys = require("./keys.js");
//console.log(keys);
var command = process.argv[2];
var title = process.argv;
title.splice(0, 3);
title = title.join("+");

var commands = {
	tweets: function() {
		var client = new twitter (keys.twitterKeys);
		var params = {screen_name: 'Mr_WebDev321', count: "20"};

		client.get("statuses/user_timeline", params, function(error, tweets, response) {
			if (!error) {
				console.log("Tweets:");
				for (var i = 0; i < tweets.length; i++) {
					console.log(" "+tweets[i].text);
				}
			} else {
				console.log("Error: "+error);
			}
		});	
	},
	spotify: function()  {
		console.log("Work in progress");
	},
	OMDb: function() {
		var key = keys.OMDbKey;

		if (!title) {
			request("http://www.omdbapi.com/?apikey="+key+"&t=mr+nobody&type=movie", function(error, response, movie) {
				if (!error) {
					movie = JSON.parse(movie);
					console.log("Title: "+movie.Title);
					console.log("Released: "+movie.Year);
					console.log("IMDB rating: "+movie.imdbRating);
					console.log("Country: "+movie.Country);
					console.log("Language: "+movie.Language);
					console.log("Plot: "+movie.Plot);
					console.log("Actors: "+movie.Actors);
					console.log("Rotten Tomatoes Link: https://www.rottentomatoes.com/m/mr_nobody");
				} else {
					console.log("Error: "+error);
				}
			});
		} else {
			request("http://www.omdbapi.com/?apikey="+key+"&t="+title+"&type=movie", function(error, response, movie) {
				if (!error) {
					movie = JSON.parse(movie);
					console.log("Title: "+movie.Title);
					console.log("Released: "+movie.Year);
					console.log("IMDB rating: "+movie.imdbRating);
					console.log("Country: "+movie.Country);
					console.log("Language: "+movie.Language);
					console.log("Plot: "+movie.Plot);
					console.log("Actors: "+movie.Actors);
					title = title.replace("+", "_");
					console.log("Rotten Tomatoes Link: https://www.rottentomatoes.com/m/"+title);
				} else {
					console.log("Error: "+error);
				}
			});
		}
	},
	readFile: function() {
		fs.readFile("random.txt", "utf8", function(err, data) {
			if (!err) {
				command = data.split(",", 1);
				command = command[0];

				var start = data.indexOf('"')+1;
				var end = data.lastIndexOf('"');
				title = data.substring(start, end);

				switch (command) {
					case "my-tweets":
						commands.tweets();
						break;
					case "spotify-this-song":
						commands.spotify();
						break;
					case "movie-this":
						commands.OMDb();
						break;
					default:
						console.log("No valid command found in random.txt");
				};

			} else {
				console.log("Error: "+error);
			}
		});
	},
};

switch (command) {
	case "my-tweets":
		commands.tweets();
		break;
	case "spotify-this-song":
		commands.spotify();
		break;
	case "movie-this":
		commands.OMDb();
		break;
	case "do-what-it-says":
		commands.readFile();
		break;
	default:
		console.log("Valid commands: \"my-tweets\", \"spotify-this-song '<song name here>'\", \"movie-this '<movie name here>'\", or \"do-what-it-says\".")
};
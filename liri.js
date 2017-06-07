// node packages
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

// variables
var keys = require("./keys.js");
var appendData
var command = process.argv[2];
var title = process.argv;
// remove first 3 items in process.argv array and turn the remaining items into a string
title.splice(0, 3);
title = title.join("+");

// constructor for data to be written to log.txt
function AppendData(error, response, data) {
	this.command = command;
	if (title) {
		this.title = title
	}
	this.error = error;
	this.responseCode = response;
	this.data = data;
}

// object containing functions to be called apon by commands
var commands = {
	// function to handle my-tweets command
	tweets: function() {
		var client = new Twitter (keys.twitterKeys);
		var params = {screen_name: 'Mr_WebDev321', count: "20"};
		// use node twitter package to get tweets
		client.get("statuses/user_timeline", params, function(error, tweets, response) {
			if (!error) {
				var tweetsData = [];
				console.log("Tweets:");
				// loop through returned tweets array and log tweets
				for (var i = 0; i < tweets.length; i++) {
					// log tweets
					console.log(" "+tweets[i].text);
					// setup array to be used by appendFile
					tweetsData.push(tweets[i].text);
				}
			} else {
				console.log("Error: "+error);
			}
			// construct object to be written to log.txt
			appendData = new AppendData(error, response.statusCode, tweetsData);
			fs.appendFile("log.txt", JSON.stringify(appendData)+"\n", "utf8", function(err) {
				if (err) {
					console.log("Append to log.txt has incontered an error: "+err);
				}
			});
		});	
	},
	// function to handle spotify-this-song command
	spotify: function()  {
		var spotify = new Spotify(keys.spotifyKeys);
		// check if title was specified
		if (!title) {
			// use node node-spotify-api package to get song
			spotify.search({type: "track", query: "The Sign"}, function(err, data) {
				if (err) {
					return console.log("Error: "+err);
				}
				// log data
				console.log("Artist(s): "+data.tracks.items[0].artists[0].name);
				console.log("Song: "+data.tracks.items[0].name);
				console.log("Preview: "+data.tracks.items[0].preview_url);
				console.log("Album: "+data.tracks.items[0].album.name);

				// create object to be used by AppendData constructor
				var spotifyData = {
					artists: data.tracks.items[0].artists[0].name,
					song: data.tracks.items[0].name,
					preview: data.tracks.items[0].preview_url,
					album: data.tracks.items[0].album.name,
				};
				// construct object to be written to log.txt
				appendData = new AppendData(err, null, spotifyData);
				fs.appendFile("log.txt", JSON.stringify(appendData)+"\n", "utf8", function(err) {
					if (err) {
						console.log("Append to log.txt has incontered an error: "+err);
					}
				});
			});
		} else {
			// use node node-spotify-api package to get song
			spotify.search({type: "track", query: title}, function(err, data) {
				if (err) {
					return console.log("Error: "+err);
				}
				// log data
				console.log("Artist(s): "+data.tracks.items[0].artists[0].name);
				console.log("Song: "+data.tracks.items[0].name);
				console.log("Preview: "+data.tracks.items[0].preview_url);
				console.log("Album: "+data.tracks.items[0].album.name);

				// create object to be used by AppendData constructor
				var spotifyData = {
					artists: data.tracks.items[0].artists[0].name,
					song: data.tracks.items[0].name,
					preview: data.tracks.items[0].preview_url,
					album: data.tracks.items[0].album.name,
				};
				// construct object to be written to log.txt
				appendData = new AppendData(err, null, spotifyData);
				fs.appendFile("log.txt", JSON.stringify(appendData)+"\n", "utf8", function(err) {
					if (err) {
						console.log("Append to log.txt has incontered an error: "+err);
					}
				});
			});
		}
	},
	// function to handle movie-this command
	OMDb: function() {
		var key = keys.OMDbKey;
		// check if title was specified
		if (!title) {
			// use node request package to get movie
			request("http://www.omdbapi.com/?apikey="+key+"&t=mr+nobody&type=movie", function(error, response, movie) {
				if (!error) {
					movie = JSON.parse(movie);
					// log data
					console.log("Title: "+movie.Title);
					console.log("Released: "+movie.Year);
					console.log("IMDB rating: "+movie.imdbRating);
					console.log("Country: "+movie.Country);
					console.log("Language: "+movie.Language);
					console.log("Plot: "+movie.Plot);
					console.log("Actors: "+movie.Actors);
					console.log("Rotten Tomatoes Link: https://www.rottentomatoes.com/m/mr_nobody");

					// create object to be used by AppendData constructor
					var movieData = {
						title: movie.Title,
						released: movie.Year,
						IMDBrating: movie.imdbRating,
						country: movie.Country,
						language: movie.Language,
						plot: movie.Plot,
						actors: movie.Actors,
						rottenTomatoesLink: "https://www.rottentomatoes.com/m/"+title,
					};
					// construct object to be written to log.txt
					appendData = new AppendData(error, response.statusCode, movieData);
					fs.appendFile("log.txt", JSON.stringify(appendData)+"\n", "utf8", function(err) {
						if (err) {
							console.log("Append to log.txt has incontered an error: "+err);
						}
					});
					} else {
						console.log("Error: "+error);
					}
				});
		} else {
			// use node request package to get movie
			request("http://www.omdbapi.com/?apikey="+key+"&t="+title+"&type=movie", function(error, response, movie) {
				if (!error) {
					movie = JSON.parse(movie);
					// log data
					console.log("Title: "+movie.Title);
					console.log("Released: "+movie.Year);
					console.log("IMDB rating: "+movie.imdbRating);
					console.log("Country: "+movie.Country);
					console.log("Language: "+movie.Language);
					console.log("Plot: "+movie.Plot);
					console.log("Actors: "+movie.Actors);
					title = title.replace("+", "_");
					console.log("Rotten Tomatoes Link: https://www.rottentomatoes.com/m/"+title);

					// create object to be used by AppendData constructor
					var movieData = {
						title: movie.Title,
						released: movie.Year,
						IMDBrating: movie.imdbRating,
						country: movie.Country,
						language: movie.Language,
						plot: movie.Plot,
						actors: movie.Actors,
						rottenTomatoesLink: "https://www.rottentomatoes.com/m/"+title,
					};
					// construct object to be written to log.txt
					appendData = new AppendData(error, response.statusCode, movieData);
					fs.appendFile("log.txt", JSON.stringify(appendData)+"\n", "utf8", function(err) {
						if (err) {
							console.log("Append to log.txt has incontered an error: "+err);
						}
					});
				} else {
					console.log("Error: "+error);
				}
			});
		}
	},
	readFile: function() {
		// use node file system to read a command from random.txt
		fs.readFile("random.txt", "utf8", function(err, data) {
			if (!err) {
				// set part of string before the "," to the command variable
				command = data.split(",", 1);
				command = command[0];
				// set rest of the string to title and remove quotes
				var start = data.indexOf('"')+1;
				var end = data.lastIndexOf('"');
				title = data.substring(start, end);
				// switch case to call a function based on command
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

// switch case to call a function based on command
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
	// code to handle invalid commands
	default:
		console.log("Valid commands: \"my-tweets\", \"spotify-this-song '<song name here>'\", \"movie-this '<movie name here>'\", or \"do-what-it-says\".")
};
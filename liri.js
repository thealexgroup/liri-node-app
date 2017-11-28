var Twitter = require('twitter');
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');


var myTitle;
var myCommand = process.argv[2] ;
var secondArg = process.argv.slice(3);
myTitle = secondArg.join(" ");

var doIt = function () {
	fs.readFile('random.txt', "utf8", function(error, data){
    var txt = data.split(',');
    spotIt(txt[1]);
  });
}; //end of doIt function

var movieIt = function () {
	
	var baseUrl = "http://www.omdbapi.com/?apikey=trilogy&t=";

	if (!myTitle) {
	baseUrl += "Mr. Nobody";
	} else {
	baseUrl += myTitle;		
	}

    request(baseUrl, function (error, response, body) {
    	if (error) {
    console.log('error:', error); 
	} else {
		var movieData = JSON.parse(body);
		console.log("\n-------------- Your Movie Info ---------------------\n")
    	console.log("Title: " + movieData.Title); 
    	console.log("Year: " + movieData.Year); 
    	console.log("IMDB Rating: " + movieData.Ratings[0].Value); 
    	console.log("Rotten Tomatoes Rating: " + movieData.Ratings[2].Value); 
    	console.log("Country: " + movieData.Country); 
    	console.log("Language(s): " + movieData.Language);
    	console.log("Plot: " + movieData.Plot);
    	console.log("Actors: " + movieData.Actors);    	
    }
  });
}; //end of movieIt Function

var spotIt = function() {

		var songInfo;

		var spotify = new Spotify({
		  id: '991b07ffce27421abd7c8f03f607cfea',
		  secret: 'e53baadb4e3c422dae82a55af31b3072'
		});

		if (!myTitle) {
			myTitle = 'The Sign';
		}

		spotify.search({ type: 'track', query: myTitle }, function(err, data) {
		  if (err) {
		    return console.log('Error occurred: ' + err);
		  }
		 songInfo = data.tracks.items[0]; 

		 		console.log("\n-------------- Your Song Info ---------------------\n")

		  var numberOfArtists = songInfo.artists.length;

		  console.log("Artist(s): ");
		 for (i = 0; i < numberOfArtists; i++) {
		 console.log(songInfo.artists[i].name);
		}
		 console.log("\nPreview URL: " + songInfo.preview_url);
		 console.log("Title: " + myTitle);
		 console.log("Album Name: " + songInfo.album.name);
		});

};//end of spotIt function

var tweeted = function() {

	var client = new Twitter(keys);
	 
	var params = {screen_name: 'TheFakeTalex'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	    var myTweets = tweets.slice(0, 20);
	    var i = 0;

	    for (;myTweets[i];) {
	    console.log("\n ------- TheFakeTalex Tweet -----------------\n")
	    console.log("Created on: " + myTweets[i].created_at);
	    console.log("Words of wisdom are: " + myTweets[i].text);
	    console.log("\n ------- End of Tweet -----------------\n")
	    i++;
	    }
	  }
	  else {
	  	console.log("error");
	  }
	});

}; //end of tweeted function


switch (myCommand) {

	case "my-tweets":
	tweeted();
	break;

	case "spotify-this-song":
	spotIt();
	break;

	case "movie-this":
	movieIt();
	break;

	case "do-what-it-says":
	doIt();
	break;

	default:
	console.log("I need a command");
};


//Request and require, but not "cakes and ale."  Google it if you don't understand the reference!
const Spotify = require("node-spotify-api");
const request = require("request");
const moment = require("moment");
const dotEnv = require("dotenv").config();
const keysJS = require("./keys.js");
const fs = require("fs");

//Make a new Spotify object for song searchin'!  This way didn't work!  I instead used Spotify keys directly in findSong()!
let spotty = new Spotify(keysJS.spotify);

// Grab the command from the third command line argument
let command = process.argv[2];

// Joini the remaining argument(s) into a search term
let term = process.argv.slice(3).join(" ");

// By default, if no command type is provided, search for a Spotify song
if (!command)
{
  command = "spotify-this-song";
}

// By default, if no search term is included, search for New Creation Church's Anthem of Grace
if (!term)
{
    term = "Anthem of Grace";
}

//Search for relevant things
if (command === "spotify-this-song" || command === "spotify" || command === "song")
{
  console.log("\nSearchin' for a Song on Spotify!");
  findSong(term);
}
else if (command === "bands-in-town" || command === "band" || command === "concert" || command === "concert-this" || command === "artist")
{
  console.log("\nSearchin' for a Band on Bands in Town!");
  findBand(term);
}
else if (command === "movie-this" || command === "movie" || command === "omdb" || command === "imdb")
{
  console.log("\nSearchin' for a Movie on OMDB (Open Movie Database)!");
  findMovie(term);
}

//Handle all non-blank, non-null commands
else
{
  console.log("\nDoin' random.txt!");
  doAThing();
}

//OMDB Access via Request
function findMovie(movie)
{
    let queryURL = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    request(queryURL, function(err, response, body)
    {
        // parse the response body from a string to a JSON object
        let JSONData = JSON.parse(body);

        //The full list of data is more than enough to suit our purposes.
        console.log("JSONData", JSONData);

        //Wanting to use the below due to the "DROW" (Don't Redo Others' Work) principle,
        //but doing it this way likely for more points but also to learn.
        
        let movieData =
        [   "Title: " + JSONData.Title,
            "Released Year: " + JSONData.Year,
            "MPAA Rating: " + JSONData.Rated,
            "IMDB Rating: " + JSONData.imdbRating,
            "Actors: " + JSONData.Actors,
            "Plot: " + JSONData.Plot,
            "Rotten Tomatoes Rating: " + ratingsRay[1], //Has Tomato info
            "Region(s) of Filming: " + JSONData.Country,
            "Language(s) of Film: " + JSONData.Language
        ];
        console.log(movieData);
    }
)};

//Random Function: Searches OMDB for "Passion of the Christ" instead of Spotify for "I Want it That Way"
function doAThing()
{
    fs.readFile("random.txt", "utf8", function(err, data)
    {
        var randomInput = data.split(",");
        findMovie(randomInput[1]);
    });
}

//Bands in Town function
function findBand(artist)
{
    let queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    request(queryURL, function(err, response, body)
    {   //Parse the response body from a string to a JSON object
        let JSONData = JSON.parse(body);
        
        //Incorporating Moment.JS's time reformatting variables!
        let dateToFormat = JSONData[0].datetime;
        let dateFormat = "MM/DD/YYYY";
        let formattedDate = moment(dateToFormat).format(dateFormat);

        //The full list of data is more than enough to suit our purposes; however, I'm purposely parsing stuff below.
        //Using this to learn.
        let bandData =
        [   "NEXT LISTED UPCOMING EVENT:",
            "Venue Name: " + JSONData[0].venue.name,
            "Venue Location: " + JSONData[0].venue.city + ", " + JSONData[0].venue.region + ", " + JSONData[0].venue.country,
            "Event Time: " + formattedDate
        ];
        console.log(bandData);
    }
)};

//Spotify function
function findSong(song)
{
    //BACKUP PLAN: Use keys from this function instead of another file!  This method worked!  Alleluia!
    spotty = new Spotify
    ({
        id: "8062bae2315243fa80d731df006cb21d",
        secret: "c721913a99b849dea4a25253d5206bb2"
    });

    //This uses the default Spotify NPM package search.
    spotty
    .search
    ({
        type: 'track',
        query: song
     },
     
     function(err, data)
     {
        if (err)
        {
            return console.log('ERROR Details: ' + err);
        }
        
        //Saves us typing and reading time!
        let prefix = data.tracks.items[0];

        //Shows ALL data related to first result!
        //console.log(data.tracks.items[0]);

        let songData =
        [
            "Song Name: " + prefix.name,
            "Artist/Band Name: " + prefix.artists[0].name,
            "Song Album: " + prefix.album.name,
            "Year Released: " + prefix.album.release_date,
        ];
        console.log(songData);
    });
}
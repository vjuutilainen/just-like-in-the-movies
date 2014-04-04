var http = require('http');
var url = require('url');
var fs = require('fs');
var mime = require('mime');
var querystring = require('querystring');
var mongoclient = require('mongodb').MongoClient;
var Scraper = require('./scraper').Scraper;

var data;

mongoclient.connect("mongodb://localhost:27017/movies", function(err, db) {

	if(err){
		console.log('could not connect to the database');
	}

  if(!err) {

  		var collection = db.collection('bestmovies');

	  	 	collection.find().toArray(function(err,array){

				data = array;
				db.close();
				init();
		
		});

	}

});	


var init = function(){

	var giveStaticFile = function(file,res){

		fs.readFile(file,'utf8', function(err,fileData){
				if(err) throw "not found";
				res.writeHead(200, {'Content-Type':mime.lookup(file)});
				res.end(fileData);
				
			});

	}

	var routes = {
		'/': 'index.html',
		'/main.js': 'main.js',
		'/d3.v3.min.js': 'd3.v3.min.js',
		'/style.css': 'style.css'
	};

	var requestHandler = function(req,res){

		var urlstring = req.url;

		// static files

		if (urlstring in routes){
			console.log("Received a request for " + urlstring);
			giveStaticFile(routes[urlstring],res);
		}

		// API for data

		if (url.parse(urlstring).pathname === '/data'){

			console.log("Received a request for quotes" + urlstring);

			var query = querystring.parse(url.parse(urlstring).query);

			res.writeHead(200, {'Content-Type':'application/json'});
			
			// give back data from server var!
			
			var randomData = JSON.stringify(getRandomQuote(data));

			console.log("sent these:");
			console.log(randomData);
			res.end(randomData);
			
		}

	}

	var getRandomQuote = function(data){

		var quote = {movie: '', quote: ''};

		var randomMovieIndex = Math.floor(Math.random()*data.length);
		var randomQuoteIndex = Math.floor(Math.random()*data[randomMovieIndex].quotes.length);

		quote.movie = data[randomMovieIndex].text;	
		quote.quote = data[randomMovieIndex].quotes[randomQuoteIndex].text;

		return quote;

	}


	http.createServer(requestHandler).listen(8888);
	console.log("Server started");

}


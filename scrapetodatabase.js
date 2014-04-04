var http = require('http');
var url = require('url');
var fs = require('fs');
var mime = require('mime');
var querystring = require('querystring');
var mongoclient = require('mongodb').MongoClient;
var Scraper = require('./scraper').Scraper;

mongoclient.connect("mongodb://localhost:27017/movies", function(err, db) {
  if(!err) {


  		var collection = db.collection('bestmovies');


	  	var scrapeMovieData = function(callback){

			var scrapeUrl = "http://www.imdb.com/chart/top";
			var selector = '.titleColumn a';
			var properties = ['text', 'href'];

			var movieScraper = new Scraper();
			movieScraper.selector = selector;
			movieScraper.properties = properties;

			movieScraper.run(scrapeUrl,function(objects){

				callback(objects);

			});
		
		}

		var handleQuoteData = function(movies){

			var movies = movies;

			var scrapeQuoteData = function(obj){

				var scrapeUrl = "http://www.imdb.com" + obj.href + "quotes";
				var selector = '.quote p';
				var properties = ['text'];

				var scraper = new Scraper();

				scraper.selector = selector;
				scraper.properties = properties;

				scraper.run(scrapeUrl, function(objects){

					obj.quotes = objects;
					updateToDatabase(obj);

				});

			};

			var updateToDatabase = function(obj){

				collection.insert(obj, {safe:true}, function(err,updated){

					if(err || !updated){
						console.log("Not able to insert into database");
					}

					else{
						console.log("Inserted item into database");
						
					}

				});


			};


			movies.forEach(function(obj){

				scrapeQuoteData(obj);

			});




		}

		scrapeMovieData(function(objects){

				handleQuoteData(objects);

		});


 
	

	}

});	
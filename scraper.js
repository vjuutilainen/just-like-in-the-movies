var jsdom = require('jsdom');

// Scraper constructor function

var Scraper = function(){

	this.selector;
	this.properties;

	this.run = function(url,callback){

		if(this.selector && this.properties){

			scrape(url,this.selector, this.properties, function(objects){

				console.log("Created " + objects.length + " objects, ranging from:");
				console.log(objects[0]);
				console.log("...");
				console.log(objects[objects.length-1]);

				callback(objects);

			});

		}

		else{

			console.log("Selector and properties not defined");
			callback("Selector and properties not defined");
		}

	};

	// Takes url, jquery selector and properties, returns a list of matching elements as objects with properties

	var scrape = function(url,selector,properties, callback){

		var url = url.substr(0,7) !== 'http://' ? 'http://' + url : url;
		var selector = selector;
		var properties = properties;

		var whenReady = function(errors, window){

			console.log("Connected to " + url);

			var elements = window.$(selector);

			if(elements.length > 0){				
				console.log("Total of " + elements.length + " " + selector + " elements");
				createObjects(elements,properties);
			}
			else{
				console.log("No matching elements found");
				callback("No matching elements found");
			}
		};

		var createObjects = function(elements,properties){

			var elementObjects = [];

			elements.each(function(index,value){

				elementObjects[index] = {};

				for(var i = 0; i < properties.length; i++){

					if(properties[i] === 'href'){
						elementObjects[index][properties[i]] = this.getAttribute(properties[i]).split('?')[0];
					}

					if(properties[i] === 'html'){
						elementObjects[index][properties[i]] = this.innerHTML;
					}

					if(properties[i] === 'text'){
						elementObjects[index][properties[i]] = this.textContent;
					}

				}
			});

			callback(elementObjects);

		}

		jsdom.env({url: url, done: whenReady, scripts: ["http://code.jquery.com/jquery.js"]});

	};

};

exports.Scraper = Scraper;
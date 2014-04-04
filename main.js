var quotecontainer;
var height = window.innerHeight;
var width = window.innerWidth;
var timeoutLength;

var init = function(){

	quotecontainer = d3.select('body').append('div').attr('id','quotecontainer');

};

var updateQuotes = function(quote){

	var text = quote.quote === '' ? '...' : quote.quote;

	var character = text.split(':').length > 1 ? text.split(':')[0]+':' : '';

	text = text.split(':').length > 1 ? text.split(':')[1] : text.split(':')[0];

	timeoutLength = text.length*40;
	transitionLength = 1000;
	
	if(quotecontainer.select('.quoteblock').node() !== null){
	
		quotecontainer.select('.quoteblock')
						.transition()
						.duration(transitionLength)
						.style('bottom',height)
						.each('end',function(){
							this.remove();
						});	

	}

	var thisQuote = quotecontainer.append('div')
			.attr('class','quoteblock')		
			.html(function(d){

			   	 	return '<div class=\'character\'>'+character+'</div> <div class =\'quote\'>'+text+'</div>';
			 	});

	var quoteHeight = parseInt(thisQuote.style('height'));

	
	thisQuote.style('bottom',-quoteHeight)
			 .transition()
			 .duration(transitionLength)
			 .style('bottom',(height/2)-quoteHeight/2)
			 .each('end',function(){

			 	setTimeout(getQuote,timeoutLength);

			 });

}

var getQuote = function(){

		d3.json("data", function(err, quote){

			if(!err) updateQuotes(quote);
				
		});
		
	};

window.onload = function(){

	init();
	getQuote();

}


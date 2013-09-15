
/*
 * GET home page.
 */

 var http = require('http'),
 	 cache = require('memory-cache');

exports.index = function(req, res){
	var body = cache.get('tfl');
	if(!body) {
		http.get("http://cloud.tfl.gov.uk/TrackerNet/LineStatus", function(response) {
			response.on('data', function (chunk) {
		    	body = chunk;
		    	cache.put('tfl', chunk, 1000);
				res.send(body);
			});	
		}).on('error', function(e) {
			console.log("Got error: " + e.message);
		});
	} else {
		res.send(body);
	}

};
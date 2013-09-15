
/*
 * GET home page.
 */

 var http = require('http'),
 	 cache = require('memory-cache');

exports.index = function(req, res){
	var body = cache.get('tfl');
	res.header('Content-Type', 'text/xml');
	res.header('Cache-Control', 'public, max-age=60');

	if(!body) {
		body = "";
		http.get("http://cloud.tfl.gov.uk/TrackerNet/LineStatus", function(response) {
			response.on('data', function (chunk) {
				if(chunk.length >0 ) body += chunk;

			}).on('end', function() {
			    cache.put('tfl', body, 1000);
				res.end(body.toString("utf8"));			
			});	
		}).on('error', function(e) {
			console.log("Got error: " + e.message);
		});
	} else {
		res.send(body.toString("utf8"));
	}

};
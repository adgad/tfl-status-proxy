
/*
 * GET home page.
 */

 var http = require('http'),
 	 cache = require('memory-cache'),
 	 xml2js = require('xml2js');

exports.index = function(req, res){
	var body = cache.get('tfl');
	var parser = new xml2js.Parser();

	res.header('Content-Type', 'application/json');
	res.header('Cache-Control', 'public, max-age=60');

	if(!body) {
		body = "";
		http.get("http://cloud.tfl.gov.uk/TrackerNet/LineStatus", function(response) {
			response.on('data', function (chunk) {
				if(chunk.length >0 ) body += chunk;

			}).on('end', function() {
				var output = {};
				parser.parseString(body.replace("\ufeff", ""), function (err, result) {
			       	var statii = result['ArrayOfLineStatus']['LineStatus'], i;
			       	for(i in statii) {
			       		output[statii[i]["Line"][0]["$"]["Name"]] = {
		       				 "status":statii[i]["Status"][0]["$"]["Description"],
		       				 "status_details":statii[i]["$"]["StatusDetails"]
			       		};	
			       	}
				    cache.put('tfl', output, 60000);
					res.end(JSON.stringify(output));	
			    });		
			});	
		}).on('error', function(e) {
			console.log("Got error: " + e.message);
		});
	} else {
		res.send(JSON.stringify(body));
	}

};
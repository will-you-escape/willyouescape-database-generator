// Librairies
const request = require("request");
const json2csv = require('json2csv');
const csv2json = require('csv2json');
const fs = require('fs');
const sleep = require('sleep');
const async = require('async');
// Variables
const gmapsApiKey = 'AIzaSyDd15RNeX8dBu257b6F3HF8uCVy0JihxB8';

const inputFile = 'data/raw.csv';
const outputFile = 'data/roomsdb-v1.csv';

var handler = function () {
	const tempFile = 'tmp/escaperooms.json';


  // Parses raw csv
  fs.createReadStream(inputFile)
  .pipe(csv2json({
    // Defaults to comma. 
    separator: ','
  }))
  .pipe(fs.createWriteStream(tempFile))
  .on('finish', () => {
  	let result = [];
  	let rooms = JSON.parse(fs.readFileSync(tempFile, 'utf8'));
  	let total = rooms.length;
  	let index = 1;
  	let room = rooms[0];
  	async.eachLimit(rooms, 1, function (room,callback) {
  		setTimeout(function(){
  			let append = (index == 1 ? false : true);
  			console.log('Processing location ' + index + ' on ' + total);
  			index = index + 1;
      	// Finds location 
      	let url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + room.Organization.split(' ').join('+') + ',' + room.City.split(' ').join('+') + '&key=' + gmapsApiKey;
      	let address = '';
      	let lat = '';
      	let lng = '';
      	let gmapsName = '';
      	let gmapsId = '';
      	let gmapsPlaceId = '';
      	request(url, function (gmapsError, gmapsResponse, gmapsBody) {
      		try {
      			let gmapsJson = JSON.parse(gmapsBody);
      			if (gmapsJson.results.length) {
      				address = gmapsJson.results[0].formatted_address;
      				lat = gmapsJson.results[0].geometry.location.lat;
      				lng = gmapsJson.results[0].geometry.location.lng;
      				gmapsName = gmapsJson.results[0].name;
      				gmapsId = gmapsJson.results[0].id;
      				gmapsPlaceId = gmapsJson.results[0].place_id;
      			} else {
      				console.log('No location found ' + url);
      			}
      		} catch (e) {
      			console.log(url);
      		}
        	// Pushes result inside array
        	result.push({
        		"Country": room.Country,
        		"Region": room.Region,
        		"City":room.City,
        		"Organization":room.Organization,
        		"Room":room.Room,
        		"URL":room.URL,
        		"Address":address,
        		"Lat":lat,
        		"Lng":lng,
        		"GmapsName":gmapsName,
        		"GmapsId":gmapsId,
        		"GmapsPlaceId":gmapsPlaceId
        	});

        	callback();

        });
      }, 1000);

  	}, function (err){
  		createCsv(result);
  	})

  });
};


var createCsv = function (rooms) {
	let fields = ['Country', 'Region', 'City','Organization','Room','URL','Address','Lat','Lng','GmapsName','GmapsId','GmapsPlaceId'];
	let csv = json2csv({ data: rooms, fields: fields });
	fs.writeFile(outputFile, csv, 'utf8', function(err) {
		if (err) throw err;
		console.log('File saved !');
	});
};

handler();


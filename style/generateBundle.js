var fs = require('fs');
var http = require('https');
var path = require('path');
var output = process.argv[2];

var libs = [
	"https://fonts.googleapis.com/css?family=Noto+Serif|Nunito:400,700",
	"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
];

console.log('Truncating: ' + output);
fs.writeFileSync(output, '');

function append(callback){
	if(libs.length){
		var lib = libs.shift();
		console.log("appending: " + lib);
        http.get(lib, function(res) {
			if (res.statusCode !== 200) {
				callback(res.statusCode);
			}
			else{
				var css = '';
				res.on('data', function(chunk){
					css += chunk;
				});
				res.on('end', function(){
					css.match(/url\([^)]+\)/g).map(function(match){
						if(!/(\(http:)|(\(https:)/.test(match)){
							css = css.replace(match, match.replace('url(', 'url(' + path.dirname(lib) + '/'));
						}
					});
					fs.appendFileSync(output, css);
					append(callback);
				});
        	}
        });
	}
	else callback();
}

append(function(err){
	if(err) console.error(err)
	else console.log("done");
});
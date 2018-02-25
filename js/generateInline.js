var inline = require('inline-source');
var fs = require('fs');
var path = require('path');
var htmlpath = path.resolve(process.argv[2]);

var finalHtml;

(function replace(){
	inline(htmlpath, {
		compress: true,
		rootpath: path.dirname(process.argv[2]),
		ignore: ['png']
	}, function (err, html) {
		if(err) console.error(err);
		else {
			if(html == finalHtml) fs.writeFileSync(process.argv[3], finalHtml);
		}
	});
})();
importScripts('serviceWorker/serviceworker-cache-polyfill.js');

var cacheVersion = "1.01";
var cacheableEndpoints = [
	/\/lib.js\?v=.+/,
	/\/lib.css\?v=.+/
];

this.addEventListener('install', function(event) {
	event.waitUntil(
		caches.keys().then(function(keyList) {
			return Promise.all(keyList.map(function(key) {
				if (key != cacheVersion) {
					return caches.delete(key);
				}
			}));
		})
	);
});

this.addEventListener('activate', function(event){
	console.log("worker activated");
});

this.addEventListener('fetch', function(evt) {
	for (var i = 0; i < cacheableEndpoints.length; i++) {
		if (cacheableEndpoints[i].test(evt.request.url)) {
			evt.respondWith(caches.open(cacheVersion).then(function(cache) {
				return cache.match(evt.request).then(function(matching) {
					if(matching) return matching;
					else {
						return fetch(evt.request).then(function(response){
							if (response.status == 200) {
								return caches.open(cacheVersion).then(function(cache) {
									// add response clone to cache
									cache.put(evt.request, response.clone());
									// return response from network
									return response;
								});
							}
							return Promise.resolve();
						});
					}
				});
			}));

			break;
		}
	}
});
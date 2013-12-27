(function(window) {
	window.__log__ = function() {
		console.log.apply(console, arguments);
	};

	var getResults = function(data) {
		if (!data) {
			return [];
		}
		var results = [];
		for (var key in data) {
			results.push({
				description: key,
				suite: [],
				success: true,
				log: [],
				time: data[key]
			});
		}
		return results;
	}

	var createStartFn = function(tc, runnerPassedIn) {
		return function() {

			var runner = runnerPassedIn || window.__telemetry__;
			var timer = new Date().getTime();
			if (window.location !== top.location) {
				throw new Error('Cannot run telemetry inside an iframe. Add "client: {useIframe: true}" in the karma configuration to open it in a new window');
			}

			runner(function(data) {
				var results = getResults(data);
				tc.info({
					total: results.length
				});
				for (var i = 0; i < results.length; i++) {
					tc.result(results[i]);
				}
				tc.complete({
					coverage: window.__coverage__
				});
			});
		}
	};

	window.__karma__.start = createStartFn(window.__karma__);
})(window);
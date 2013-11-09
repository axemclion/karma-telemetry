(function(window) {
	window.__log__ = function() {
		console.log.apply(console, arguments);
	};

	var emitTelemetryResults = function(tc, win) {
		return function(data, timer) {
			win.close();
			var totalNumberOfTest = 0,
				timer = null;
			if (typeof data === 'undefined') {
				tc.result({
					description: 'Tests Failed',
					suite: [],
					success: false,
					log: [],
					time: new Date().getTime() - timer
				})
			} else {
				for (var key in data) {
					tc.result({
						description: key,
						suite: [],
						success: true,
						log: [],
						time: data[key]
					});
					totalNumberOfTest++;
				}
			}
			tc.info({
				total: totalNumberOfTest
			});
			tc.complete({
				coverage: window.__coverage__
			});
		}
	}

	var createStartFn = function(tc, runnerPassedIn) {
		return function() {
			var origin = window.location.protocol + '//' + window.location.host + '/'
			var win = window.open(origin + 'debug.html');
			window.emitTelemetryResults = emitTelemetryResults(tc, win);
		}
	};

	if (window.location != window.top.location) {
		window.__karma__.start = createStartFn(window.__karma__);
	} else {
		document.addEventListener('load', function() {
			var timer = new Date().getTime();
			window.__telemetry__(function(data) {
				window.opener.emitTelemetryResults(data, timer);
			});
		}, true);
	}

})(window);
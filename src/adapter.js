(function(window) {
	var createStartFn = function(tc, runnerPassedIn) {
		return function() {
			var telemetry = runnerPassedIn || window.__telemetry__;
			timer = new Date().getTime();

			telemetry(function(data) {
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
					}
				}

				tc.info({
					total: totalNumberOfTest
				});

				tc.complete({
					coverage: window.__coverage__
				});
			});
		};
	};

	window.__karma__.start = createStartFn(window.__karma__);
})(window);
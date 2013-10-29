(function(window) {
	var createStartFn = function(tc, runnerPassedIn) {
		return function() {
			if (window.location == window.top.location){
				// Need to do this since chrome does not show loadTimes() in iFrames
				// So a new window is opened to calculate that time. Telemetry does not 
				// have to run in that new window opened
				window.__log__('Exiting same frame stats');
				return;
			}
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
						totalNumberOfTest++;
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
	window.__log__ = console.log;

})(window);
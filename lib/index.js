var createPattern = function(path) {
	return {
		pattern: path,
		included: true,
		served: true,
		watched: false
	};
};

var init = function(files) {
	files.unshift(createPattern(__dirname + '/../src/adapter.js'));
	var scriptPath = __dirname + '/../src/scripts/';
	require('fs').readdirSync(scriptPath).forEach(function(script) {
		files.unshift(createPattern(scriptPath + script));
	});
};

init.$inject = ['config.files'];

module.exports = {
	'framework:telemetry': ['factory', init]
};
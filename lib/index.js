var createPattern = function(path) {
	return {
		pattern: path,
		included: true,
		served: true,
		watched: false
	};
};

var init = function(files) {
	console.log(files);
	files.unshift(createPattern(__dirname + '/../src/adapter.js'));
	var scriptPath = __dirname + '/../src/scripts/';
	require('fs').readdirSync(scriptPath).forEach(function(script) {
		files.unshift(createPattern(scriptPath + script));
	});
};

init.$inject = ['config.files'];

/*************** Custom Firefox Browser ***********/
// TOOD: Derieve this from karma-firefox-launcher instead of maintaining my own

var fs = require('fs');
var spawn = require('child_process').spawn;
var PREFS =
	'user_pref("browser.shell.checkDefaultBrowser", false);\n' +
	'user_pref("browser.bookmarks.restore_default_bookmarks", false);\n' +
	'user_pref("dom.send_after_paint_to_content", true);\n' +
	'user_pref("dom.disable_open_during_load", false)\n;'


// https://developer.mozilla.org/en-US/docs/Command_Line_Options
var FirefoxPerfBrowser = function(id, baseBrowserDecorator, logger) {
	baseBrowserDecorator(this);

	var log = logger.create('launcher');

	this._start = function(url) {
		var self = this;
		var command = this._getCommand();

		fs.createWriteStream(self._tempDir + '/prefs.js', {
			flags: 'a'
		}).write(PREFS);
		self._execCommand(command, [url, '-profile', self._tempDir, '-no-remote']);
	};
};


FirefoxPerfBrowser.prototype = {
	name: 'Firefox',

	DEFAULT_CMD: {
		linux: 'firefox',
		darwin: '/Applications/Firefox.app/Contents/MacOS/firefox-bin',
		win32: process.env.ProgramFiles + '\\Mozilla Firefox\\firefox.exe'
	},
	ENV_CMD: 'FIREFOX_BIN'
};

FirefoxPerfBrowser.$inject = ['id', 'baseBrowserDecorator', 'logger'];

/**************** Custome Chrome Launcher **************************/
var ChromePerfBrowser = function(baseBrowserDecorator, args) {
	baseBrowserDecorator(this);

	var flags = args.flags || [];

	this._getOptions = function(url) {
		// Chrome CLI options
		// http://peter.sh/experiments/chromium-command-line-switches/
		return [
			'--user-data-dir=' + this._tempDir,
			'--no-default-browser-check',
			'--no-first-run',
			'--disable-default-apps',
			'--start-maximized',
			'--disable-popup-blocking',
			'--enable-gpu-benchmarking',
			'--enable-threaded-compositing'
		].concat(flags, [url]);
	};
};

ChromePerfBrowser.prototype = {
	name: 'Chrome',

	DEFAULT_CMD: {
		linux: 'google-chrome',
		darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
		win32: process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe'
	},
	ENV_CMD: 'CHROME_BIN'
};

ChromePerfBrowser.$inject = ['baseBrowserDecorator', 'args'];

module.exports = {
	'framework:telemetry': ['factory', init],
	'launcher:FirefoxPerf': ['type', FirefoxPerfBrowser],
	'launcher:ChromePerf': ['type', ChromePerfBrowser]
};
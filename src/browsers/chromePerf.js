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

module.exports = ChromePerfBrowser;
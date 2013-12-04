// Karma configuration
// Generated on Sun Oct 27 2013 19:11:55 GMT-0700 (Pacific Daylight Time)

module.exports = function(config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '',


        // frameworks to use
        plugins: [
            require('./'),
            'karma-junit-reporter',
            'karma-sauce-launcher',
            'karma-chrome-launcher',
            'karma-ie-launcher',
            'karma-firefox-launcher',
            'karma-opera-launcher'
        ],

        frameworks: ['telemetry'],

        // list of files / patterns to load in the browser
        files: [
            'test/components/*.js'
        ],


        // list of files to exclude
        exclude: [

        ],

        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['junit', 'progress'],
        junitReporter: {
            outputFile: 'test-results/test-results.xml',
            suite: ''
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera (has to be installed with `npm install karma-opera-launcher`)
        // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
        // - PhantomJS
        // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
        browsers: [
            'firefox_perf',
            'chrome_perf',
            'IE',
            //'Opera',
            //'sl_chrome',
            //'sl_firefox',
        ],
        customLaunchers: {
            chrome_perf: {
                base: 'Chrome',
                flags: ['--disable-popup-blocking', '--enable-gpu-benchmarking', '--enable-threaded-compositing']
            },
            firefox_perf: {
                base: 'Firefox',
                prefs: {
                    'dom.send_after_paint_to_content': true,
                    'dom.disable_open_during_load': false
                }
            },
            sauce_chrome: {
                base: 'SauceLabs',
                browserName: 'chrome',
                chromeOptions: {
                    args: ['--enable-gpu-benchmarking', '--disable-popup-blocking', '--enable-thread-composting']
                },
                'disable-popup-handler': true
            },
            sauce_firefox: {
                base: 'SauceLabs',
                browserName: 'firefox',
                firefox_profile: (function() {
                    var FirefoxProfile = require('firefox-profile');
                    var fp = new FirefoxProfile();
                    fp.setPreference('dom.send_after_paint_to_content', true);
                    fp.setPreference('dom.disable_open_during_load', false);
                    fp.updatePreferences();
                    return fp.encodedSync();
                }()),
                'disable-popup-handler': true
            }
        },
        sauceLabs: {
            username: process.env.SAUCE_USERNAME,
            accessKey: process.env.SAUCE_ACCESS_KEY,
            startConnect: true,
            testName: 'Karma-telemetry tests'
        },


        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true
    });
};
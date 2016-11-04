#karma-telemetry

> Adapter for running the [Chromium Telemetry](http://www.chromium.org/developers/telemetry) performance benchmarks for [Karma](https://github.com/karma-runner/karma).

## About
This plugin runs with Karma and is ideal for testing the rendering performance of components in frameworks. It reports various rendering metrics like first paint time, mean frame time, load time, etc. It can be integrated with continuous integration systems to ensure that the performance of components do not degrade over time.

### Usage Example
It can be used for [Topcoat](http://topcoat.io) components to generate graphs like [these](http://bench.topcoat.io). When expensive styles with blur or gradients are added, the performance of components may suffer and this plugin could be used to catch them. 

### Try it out now !
1. Clone this project
2. Run `npm install`
3. Run `grunt test` (or `karma start`, if you have karma installed).  
4. You should see browsers open and a gradient-circle scroll.
5. Once the browsers close, open `test-results.xml` (or the `test-results` folder) to see the various rendering performance metrics that were recorded. 

## Installation

The easiest way is to keep `karma-telemetry` as a devDependency in your `package.json`.

```json
{
  "devDependencies": {
    "karma": "~0.10",
    "karma-telemetry": "*"
  }
}
```

You can simple do it by:

```bash
npm install karma-telemetry --save-dev
```

Since this is a Karma framework, you would need to use the [Karma](http://karma-runner.github.io) testing framework. 


### Configuration
Following code shows the default configuration.

```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    // This is the name of the framework for running telemetry
    frameworks: ['telemetry'],

    // We need to open the test cases in a new window instead of an iFrame
    // To be able to record the paint times accurately 
    client: {
      useIframe: false
    },

    // Each test case represents a rendering metric.
    // The Junit reporter can be used to see times of individual metrics
    reporters: ['junit', 'progress'],
    junitReporter: {
      outputFile: 'test-results/test-results.xml',
      suite: ''
    },

    // To enable more accurate rendering benchmarking, firefox and chrome have to be started with special flags. 
    // Other browsers can be started normally
    browsers: [
      'firefox_perf',
      'chrome_perf'
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

      // Browsers on Saucelabs also need the following configuration
      sauce_chrome: {
        base: 'SauceLabs',
        browserName: 'chrome',
        chromeOptions: {
          args: ['--enable-gpu-benchmarking', '--disable-popup-blocking', '--enable-thread-composting']
        },
        'disable-popup-handler': true
      },

      // In case of firefox, remember to install the firefox profile creator. 
      // This is a modified version of the firefox-profile-js with a Synchronous method and can be installed using
      // $ npm install axemclion/firefox-profile-js
      sauce_firefox: {
        base: 'SauceLabs',
        browserName: 'firefox',
        firefox_profile: (function() {
          // Note that the firefox-profile module is 
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
  });
};
```

In case of using Firefox on saucelabs, remember to install the firefox profile generator using `npm install axemclion/firefox-profile-js`. You can look at the project's karma.conf.js for a full configuration

### Writing tests
Note that Karma adds all the Javascript test files into a single HTML file for testing. It is ideal to test one component at a time and hence it may be better to dynamically generate a karma configuration for each test case. In case of grunt, look at the defination of the test task in `Gruntfile.js`. 
The test case should append the component to the document body sufficient number of times to allow the page to scroll. Look at `test/test.js` for an example. 

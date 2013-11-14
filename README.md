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

The easiest way is to keep `karma-qunit` as a devDependency in your `package.json`.

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
Following code shows the default configuration...

```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    frameworks: ['karma-telemetry'],
    browsers: ['ChromePerf', 'FirefoxPerf', 'IE'],
    reporters: ['junit', 'progress'],
    files: [
      'tests/*.js'
    ]
  });
};
```

Note that you need the `junit` reporter for seeing the test results. The framework also uses `ChromePerf` and `FirefoxPerf` as the browsers as they are regular browsers started with additional flags to enable popups and collect performance data. 

### Writing tests
Note that Karma adds all the Javascript test files into a single HTML file for testing. It is ideal to test one component at a time and hence it may be better to dynamically generate a karma configuration for each test case. In case of grunt, look at the defination of the test task in `Gruntfile.js`. 
The test case should append the component to the document body sufficient number of times to allow the page to scroll. Look at `test/test.js` for an example. 


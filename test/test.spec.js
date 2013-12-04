var fs = require('fs'),
	xml2js = require('xml2js'),
	expect = require('chai').expect,
	glob = require("glob").sync;

describe('Karma Telemetry', function() {
	var testResults = __dirname + '/../test-results/';
	it('generate test folders', function() {
		expect(glob(testResults).length).to.equal(1);
		expect(fs.statSync(glob(testResults)[0]).isDirectory()).to.be.true;
		expect(glob(testResults + '**/*.xml').length).to.be.greaterThan(1);
	});

	describe('parse files', function() {
		glob(testResults + '**/*.xml').forEach(function(file) {
			describe('filename ' + file, function() {
				xml2js.parseString(fs.readFileSync(file), function(err, data) {
					it('have test suites', function() {
						expect(err).to.be.null;
						expect(data.testsuites.testsuite.length).to.be.greaterThan(0);
					});
					data.testsuites.testsuite.forEach(function(data) {
						it('test on browser ' + data.$.name, function() {
							var results = {};
							for (var i = 0; i < data.testcase.length; i++) {
								results[data.testcase[i].$.name] = data.testcase[i].$.time;
							}

							expect(results.first_paint).to.be.greaterThan(0);
							expect(results.mean_frame_time).to.be.greaterThan(0);
							expect(results.dom_content_loaded_time_ms).to.be.greaterThan(0);
							expect(results.load_time_ms).to.be.greaterThan(0);

							if (data.$.name.match(/Chrome/)) {
								expect(data['system-out'][0].match('Extension:object')).to.not.be.null;
							} else if (data.$.name.match(/Firefox/)) {
								expect(data['system-out'][0].match('Extension:true')).to.not.be.null;
							}
						});
					});
				});
			});
		});
	});

});
module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);
	grunt.initConfig({
		'karma': {}
	});

	grunt.registerTask('test', 'Runs Karma Perf Framework', function() {
		var karmaTask = grunt.config.data.karma,
			port = 9000;
		grunt.file.mkdir('test-results');
		grunt.util._.forEach(grunt.file.expand('test/*.js'), function(file) {
			karmaTask[file] = {
				options: {
					files: [file],
					configFile: 'karma.conf.js',
					singleRun: true,
					port: port++,
					junitReporter: {
						outputFile: 'test-results/' + file + '.xml',
					}
				}
			}
		});
		grunt.task.run('karma');
		grunt.log.subhead("Test results available at ./test-results/");
	});
	grunt.registerTask('default', ['test']);
};
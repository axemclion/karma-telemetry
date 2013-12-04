module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);
	grunt.initConfig({
		clean: ['./test-results'],
		karma: {
			options: {
				configFile: 'karma.conf.js',
			}
		},
		mochaTest: {
			test: {
				options: {
					reporter: 'spec'
				},
				src: ['test/**/*.spec.js']
			}
		}
	});

	grunt.registerTask('karma-perf', 'Runs Karma Perf Framework', function() {
		var karmaTask = grunt.config.data.karma,
			port = 9000;
		grunt.file.mkdir('test-results');
		grunt.util._.forEach(grunt.file.expand('test/components/*.js'), function(file) {
			karmaTask[file] = {
				options: {
					files: [file],
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

	grunt.registerTask('default', ['clean', 'karma-perf', 'mochaTest']);
};
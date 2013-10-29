/**
 * Script inserted into the page to collect various benchmarks
 */

'use strict';
(function(window, undefined) {

	var results = {};

	function getStats(cb) {
		// Smoothness Benchmarks
		var stats = window.__RenderingStats();

		stats.start();
		window.__log__('Starting scrolling action');
		var action = new __ScrollAction(function() {
			window.__log__('Scrolling action completed');
			// Load Timing from page
			var load_timings = window.performance.timing;
			results['load_time_ms'] = load_timings['loadEventStart'] - load_timings['navigationStart'];
			results['dom_content_loaded_time_ms'] = load_timings['domContentLoadedEventStart'] - load_timings['navigationStart'];

			stats.stop();
			var rendering_stats_deltas = stats.getDeltas();
			calcScrollResults(rendering_stats_deltas, results);
			calcTextureUploadResults(rendering_stats_deltas, results);
			calcImageDecodingResults(rendering_stats_deltas, results);
			calcFirstPaintTimeResults(results, function() {
				window.__log__('Got First paint results, now exiting');
				cb(results);
			});
		});

		document.body.scrollTop = 1;
		action.start(document.body.scrollTop === 1 ? document.body : document.documentElement)
	}

	function calcFirstPaintTimeResults(results, cb) {
		results['first_paint'] = null;
		if (typeof window.chrome !== 'undefined') {
			if (window.location != window.top.location) {
				window.__log__('Need to open a')
				var w = window.open(window.location);
				if (w) {
					window.__log__("Window opened")
					w.onload = function() {
						window.__log__("Loaded on Window")
						w.setTimeout(function() {
							window.__log__('Now startin to read the values')
							var loadTimes = w.chrome.loadTimes();
							results['first_paint'] = (loadTimes.firstPaintTime - loadTimes.startLoadTime) * 1000;
							window.__log__(loadTimes.firstPaintTime, loadTimes.startLoadTime);
							w.close();
							cb();
						}, 1000);
					}
				} else {
					cb();
				}
			}
		} else if (window.performance.timing.msFirstPaint) {
			results['first_paint'] = window.performance.timing.msFirstPaint - window.performance.timing.navigationStart;
			cb();
		} else {
			cb();
		}
	}

	function calcScrollResults(rendering_stats_deltas, results) {
		var num_frames_sent_to_screen = rendering_stats_deltas['numFramesSentToScreen'];
		var mean_frame_time_seconds = rendering_stats_deltas['totalTimeInSeconds'] / num_frames_sent_to_screen;
		var dropped_percent = rendering_stats_deltas['droppedFrameCount'] / num_frames_sent_to_screen;
		var num_impl_thread_scrolls = rendering_stats_deltas['numImplThreadScrolls'] || 0;
		var num_main_thread_scrolls = rendering_stats_deltas['numMainThreadScrolls'] || 0;
		var percent_impl_scrolled = (num_impl_thread_scrolls + num_main_thread_scrolls) === 0 ? 0 : num_impl_thread_scrolls / (num_impl_thread_scrolls + num_main_thread_scrolls);
		var num_layers = (rendering_stats_deltas['numLayersDrawn'] || 0) / num_frames_sent_to_screen;
		var num_missing_tiles = (rendering_stats_deltas['numMissingTiles'] || 0) / num_frames_sent_to_screen;

		results['mean_frame_time'] = mean_frame_time_seconds * 1000
		results['dropped_percent'] = dropped_percent * 100;
		results['percent_impl_scrolled'] = percent_impl_scrolled * 100;
		results['average_num_layers_drawn'] = num_layers;
		results['average_num_missing_tiles'] = num_missing_tiles;
	}

	function calcTextureUploadResults(rendering_stats_deltas, results) {
		var averageCommitTimeMs = 0;
		if (typeof rendering_stats_deltas['totalCommitCount'] !== 'undefined' && rendering_stats_deltas['totalCommitCount'] !== 0)
			averageCommitTimeMs = 1000 * rendering_stats_deltas['totalCommitTimeInSeconds'] / rendering_stats_deltas['totalCommitCount']

		results['texture_upload_count'] = rendering_stats_deltas['textureUploadCount'] || 0;
		results['total_texture_upload_time'] = rendering_stats_deltas['totalTextureUploadTimeInSeconds'] || 0;
		results['average_commit_time'] = averageCommitTimeMs;
	}

	function calcImageDecodingResults(rendering_stats_deltas, results) {
		var totalDeferredImageDecodeCount = rendering_stats_deltas['totalDeferredImageDecodeCount'] || 0;
		var totalDeferredImageCacheHitCount = rendering_stats_deltas['totalDeferredImageCacheHitCount'] || 0;
		var totalImageGatheringCount = rendering_stats_deltas['totalImageGatheringCount'] || 0;
		var totalDeferredImageDecodeTimeInSeconds = rendering_stats_deltas['totalDeferredImageDecodeTimeInSeconds'] || 0;
		var totalImageGatheringTimeInSeconds = rendering_stats_deltas['totalImageGatheringTimeInSeconds'] || 0;
		var averageImageGatheringTime = totalImageGatheringCount === 0 ? 0 : totalImageGatheringTimeInSeconds * 1000 / totalImageGatheringCount;

		results['total_deferred_image_decode_count'] = totalDeferredImageDecodeCount;
		results['total_image_cache_hit_count'] = totalDeferredImageCacheHitCount;
		results['average_image_gathering_time'] = averageImageGatheringTime;
		results['total_deferred_image_decoding_time'] = totalDeferredImageDecodeTimeInSeconds;
	}


	window.__telemetry__ = getStats;

}(window));
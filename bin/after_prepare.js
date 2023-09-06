'use strict';

module.exports = function (context) {
	var Q = require('q'),
		path = require('path'),
		fs = require("./lib/filesystem")(Q, require('fs'), path),
		settings = require("./lib/settings")(fs, path),
		pu = require('./lib/platform-util')(context),
		platforms = {};

	platforms.android = pu.forPlatform('android', () => require("./lib/android")(context));
	platforms.ios = pu.forPlatform('ios', () => require("./lib/ios")(Q, fs, path, require('plist'), require('xcode')));

	return settings.get()
		.then(function (config) {
			var promises = [];
			context.opts.platforms.forEach (function (platformName) {
				if (platforms[platformName] && platforms[platformName].build) {
					promises.push (platforms[platformName].build (config));
				}
			});
			return Q.all(promises);
		})
		.catch(function(err) {
			if (err.code === 'NEXIST') {
				console.log("app-settings.json not found: skipping build");
				return;
			}

			console.log ('unhandled exception', err);

			throw err;
		});
};

'use strict';

module.exports = function (context) {
	var Q = require('q'),
		path = require('path'),
		fs = require("./lib/filesystem")(Q, require('fs'), path),
		settings = require("./lib/settings")(fs, path),
		pu = require('./lib/platform-util')(context),

		android = pu.forPlatform('android', () => require("./lib/android")(context)),
		ios = pu.forPlatform('ios', () => require("./lib/ios")(Q, fs, path, require('plist'), require('xcode')));

	return settings.get()
		.then(function (config) {
			return Q.all([
				android && android.clean && android.clean(config),
				ios && ios.clean && ios.clean(config)
			]);
		})
		.then(settings.remove)
		.catch(function(err) {
			if (err.code === 'NEXIST') {
				console.log("app-settings.json not found: skipping clean");
				return;
			}

			console.log ('unhandled exception', err);

			throw err;
		});
};

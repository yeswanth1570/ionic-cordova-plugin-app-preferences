'use strict';

module.exports = function (context) {
	var Q = require('q'),
		path = require('path'),
		fs = require("./lib/filesystem")(Q, require('fs'), path),
		settings = require("./lib/settings")(fs, path),
		pu = require('./lib/platform-util')(context),
		android = pu.forPlatform('android', () => require("./lib/android")(context));

	return settings.get()
		.then(function (config) {
			return Q.all([
				android && android.afterPluginInstall && android.afterPluginInstall(config)
			]);
		})
		.catch(function(err) {
			if (err.code === 'NEXIST') {
				console.log("app-settings.json not found: creating a sample file");
				return settings.create();
			}

			console.log ('unhandled exception', err);

			throw err;
		});
};

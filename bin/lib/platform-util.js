'use strict';

module.exports = (context) => ({
    forPlatform: function (platform, action) {
        try {
            if (context.opts.platforms && context.opts.platforms.indexOf(platform)=== -1) {
                return;
            } else {
                return action();
            }
        } catch (e) {
            console.info(`Failed for platform: ${platform} -- START`);
            console.info(`If you don't need ${platform} just ignore this error.`);
            console.info(e);
            console.info(`Failed for platform: ${platform} -- END`);
        }
    },
});

const path = require('path');

module.exports = {
    pluginOptions: {
        sassResources: {
            resources: path.resolve(__dirname, './src/styles/global.scss'),
        },
    },
}
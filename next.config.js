const { resolve } = require('path');

module.exports = {
    webpack: config => {
        config.resolve.alias = {
            ...config.resolve.alias,
            pages: resolve(__dirname, 'pages/'),
            components: resolve(__dirname, 'components/'),
            hooks: resolve(__dirname, 'hooks/'),
            config: resolve(__dirname, 'config/'),
            types: resolve(__dirname, 'types/'),
        };

        return config;
    },
};

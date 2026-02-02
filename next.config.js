const imagesPlugin = require('./lib/next-config/plugins/images.js');

const plugins = {
  images: typeof imagesPlugin === 'function' ? imagesPlugin : imagesPlugin.default || imagesPlugin,
};

const nextConfig = {
  // Allow easier debugging.
  productionBrowserSourceMaps: process.env.ENABLE_SOURCE_MAPS === 'true',

  env: {
    CONTENTSTACK_API_KEY: process.env.CONTENTSTACK_API_KEY,
    CONTENTSTACK_PREVIEW_TOKEN: process.env.CONTENTSTACK_PREVIEW_TOKEN,
    CONTENTSTACK_DELIVERY_TOKEN: process.env.CONTENTSTACK_DELIVERY_TOKEN,
  },

  // Enable React Strict Mode
  reactStrictMode: true,

  // Disable the X-Powered-By header. Follows security best practices.
  poweredByHeader: false,
};

module.exports = () => {
  // Run the base config through any configured plugins
  const finalNextConfig = Object.values(plugins).reduce((acc, plugin) => plugin(acc), nextConfig);
  // console.log('finalNextConfig', JSON.stringify(finalNextConfig, null, 2));
  return finalNextConfig;
};

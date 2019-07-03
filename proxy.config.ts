const PROXY_CONFIG = {
  '/api/*': {
    target: 'https://listingx-backend.herokuapp.com:443/',
    changeOrigin: true
  },
  logLevel: 'debug'
};

module.exports = PROXY_CONFIG;

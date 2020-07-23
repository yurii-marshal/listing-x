const PROXY_CONFIG = {
  '/api/*': {
    // target: 'https://dev-app-back.accuflip.com/',
    target: 'http://localhost:8000/', // for local server
    changeOrigin: true
  },
  logLevel: 'debug'
};

module.exports = PROXY_CONFIG;

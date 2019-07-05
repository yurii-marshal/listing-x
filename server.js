//Install express server
const express = require('express');
const path = require('path');
const httpProxy = require('http-proxy');

const app = express();
const proxy = httpProxy.createProxyServer({
  changeOrigin: true
});

// Serve only the static files form the dist directory
app.use(express.static('./dist/listingX'));

app.get('/*', function(req,res) {
  res.sendFile(path.join(__dirname,'/dist/listingX/index.html'));
});

app.all('/api/*', django);

// Django routes
function django(req, res) {
  proxy.proxyRequest(req, res, {
    host: 'https://listingx-backend.herokuapp.com',
    port: 443
  });
};
// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);

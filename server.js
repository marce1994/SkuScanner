var express = require('express');
var cors_proxy = require('cors-anywhere');
var path = require('path');

// Listen on a specific host via the HOST environment variable
var host = process.env.HOST || '0.0.0.0';
var port = process.env.PORT || 8080;

// Create an instance of express
var app = express();

// Serve static files from the 'src' folder
app.use(express.static(path.join(__dirname, 'src')));

// CORS Anywhere Proxy Server Setup
// We set up the proxy separately to avoid conflicts
var proxy = cors_proxy.createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: [],
    removeHeaders: []
});

// Use CORS Anywhere as middleware for the /proxy route
app.all('/proxy/*', function(req, res) {
    var targetUrl = req.url.replace('/proxy/', ''); // Get the full URL after the '/proxy/'
    
    if (!targetUrl) {
        return res.status(400).send('No URL provided');
    }
    
    // Redirect the request to the CORS proxy
    req.url = targetUrl; // Make sure the target URL is set correctly
    proxy.emit('request', req, res); // Forward the request to the proxy
});

// Start the express server
app.listen(port, host, function () {
    console.log('Server is running at http://' + host + ':' + port);
});

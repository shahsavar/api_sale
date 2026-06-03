
require('rootpath')();
const express = require('express');
const helmet = require("helmet");
const rateLimit = require('express-rate-limit')
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const http = require('http');
const https = require('https');

const app = express();

app.set('trust proxy', true)// added by saeedi

const jwt = require('./_helpers/jwt');
const errorHandler = require('./_helpers/error-handler');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin: '*' }));
// app.use(cors({
//   origin: [
//           'https://sale.ikd.ir'
//           ],
//           methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
// }));
app.use(jwt());

//Public
app.use('/api/users', require('./public/users/users.controller'));
app.use('/api/file', require('./public/file/file.controller'));
app.use('/api/sms', require('./public/sms/sms.controller'));
app.use('/api/ikco', require('./public/ikco/ikco.controller'));
//Sale
app.use('/api/sales', require('./Sales/baseIndex'));


app.use(errorHandler);
try {
    const credentials = {
    pfx: fs.readFileSync('sslcert/ikd.pfx','utf8'),
    passphrase:'pV4ps5ax',
    headersTimeout: 5000, requestTimeout: 10000, connectionsCheckingInterval: 500
  };
  const httpsServer = https.createServer(credentials, app);
  httpsServer.setTimeout(100000)
  httpsServer.listen(420, function () {console.log('Server listening on port 420' );});
 
} catch (err) {}

//------------------http
const httpServer = http.createServer(app);
httpServer.listen(421, function () {console.log('Server listening on port 421' );});

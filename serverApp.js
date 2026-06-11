require('rootpath')();
const express = require('express');
const helmet = require("helmet");
const rateLimit = require('express-rate-limit')
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const http = require('http');
const https = require('https');
const { checkLicense, startLicenseWatcher } = require('./_helpers/license');

const app = express();

app.set('trust proxy', true);

const jwt = require('./_helpers/jwt');
const errorHandler = require('./_helpers/error-handler');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin: '*' }));
app.use(jwt());

// Public
app.use('/api/users', require('./public/users/users.controller'));
app.use('/api/file', require('./public/file/file.controller'));
app.use('/api/sms', require('./public/sms/sms.controller'));
app.use('/api/ikco', require('./public/ikco/ikco.controller'));

// Sale
app.use('/api/sales', require('./Sales/baseIndex'));

app.use(errorHandler);


async function startServer() {
  // ۱. اول لایسنس چک کن
  await checkLicense();

  // ۲. نگهبان ۲۴ ساعته رو فعال کن
  startLicenseWatcher();

  // ۳. HTTPS
  // try {
  //   const credentials = {
  //     pfx: fs.readFileSync('sslcert/ikd.pfx'),  // ❌ utf8 نباید باشه - فایل pfx باینریه
  //     headersTimeout: 5000,
  //     requestTimeout: 10000,
  //     connectionsCheckingInterval: 500
  //   };
  //   const httpsServer = https.createServer(credentials, app);
  //   httpsServer.setTimeout(100000);
  //   httpsServer.listen(420, () => console.log('HTTPS Server listening on port 420'));
  // } catch (err) {
  //   console.error('❌ HTTPS failed:', err.message);
  // }

  // ۴. HTTP
  const httpServer = http.createServer(app);
  httpServer.listen(421, () => console.log('HTTP Server listening on port 421'));
}

startServer();

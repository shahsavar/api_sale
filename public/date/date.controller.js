const express = require('express');
const router = express.Router();
const myService = require('./date.service');
const auth = require('../../_helpers/auth')
const authorize = require('../../_helpers/authorize')
const today = require('../../_helpers/today')
const captcha = require('../../_helpers/captcha')
// routes
//Users

//router.get('/getDate', today ,getDate);
router.get('/getDate2', getDate2);

module.exports = router;
//---------------------
function getDate2(req, res, next) {
    myService.getDate2(req)
        .then(user => res.json(user))
        .catch(next);
}

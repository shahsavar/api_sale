const express = require('express');
const router = express.Router();
const myService = require('./account.service');
const auth = require('../../_helpers/auth')
// routes
router.post('/getShenasePardakht',auth,getShenasePardakht)
router.post('/getShenasePardakhtUIData',auth,getShenasePardakhtUIData)
router.post('/shenasePardakhtSave',auth,shenasePardakhtSave)
router.post('/getRespons',auth,getRespons)
router.post('/getCustomerList',auth,getCustomerList)

module.exports = router;
//----------------------
function getShenasePardakht(req, res, next) {
    myService.getShenasePardakht(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function getShenasePardakhtUIData(req, res, next) {
    myService.getShenasePardakhtUIData(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function shenasePardakhtSave(req, res, next) {
    myService.shenasePardakhtSave(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function getRespons(req, res, next) {
    myService.getRespons(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function getCustomerList(req, res, next) {
    myService.getCustomerList(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}


    

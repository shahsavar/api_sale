const express = require('express');
const router = express.Router();
const proo = require('./ikco.service');

router.post('/getCustomerInfo', getCustomerInfo);
router.post('/getResponInfo', getResponInfo);
router.post('/getAgencyInfo',getAgencyInfo);
router.post('/getFactorInfo',getFactorInfo);
router.post('/getInfoAll',getInfoAll);
router.post('/getAmarTolid',getAmarTolid);

module.exports = router;

//--------
function getCustomerInfo(req, res, next) {
    proo.getCustomerInfo(req, res)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getResponInfo(req, res, next) {
    proo.getResponInfo(req, res)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getFactorInfo(req, res, next) {
    proo.getFactorInfo(req, res)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getAgencyInfo(req, res, next) {
    proo.getAgencyInfo(req, res)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getInfoAll(req, res, next) {
    proo.getInfoAll(req, res)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getAmarTolid(req, res, next) {
    proo.getAmarTolid(req, res)
        .then(data => res.json(data))
        .catch(err => next(err));
}


//---------

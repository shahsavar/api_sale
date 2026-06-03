const express = require('express');
const router = express.Router();
const myService = require('./saleReport.service');
const auth = require('../../_helpers/auth')
// routes

router.post('/getFactorTahviliAmarSal',auth,getFactorTahviliAmarSal)
router.post('/getFactorTahviliAmarSalMah',auth,getFactorTahviliAmarSalMah)
router.post('/initAmarSalMah',auth,initAmarSalMah)
router.post('/getFactorReport', auth, getFactorReport);
router.post('/getFactorSubHazine', auth, getFactorSubHazine);

module.exports = router;
//----------------------

function getFactorTahviliAmarSal(req, res, next) {
    myService.getFactorTahviliAmarSal(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function getFactorTahviliAmarSalMah(req, res, next) {
    myService.getFactorTahviliAmarSalMah(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function initAmarSalMah(req, res, next) {
    myService.initAmarSalMah(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function getFactorReport(req, res, next) {
    myService.getFactorReport(req, res)
        .then(data => res.json(data))
        .catch(err => next(err));
}
function getFactorSubHazine(req, res, next) {
    myService.getFactorSubHazine(req, res)
        .then(data => res.json(data))
        .catch(err => next(err));
}


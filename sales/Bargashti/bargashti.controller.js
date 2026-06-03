const express = require('express');
const router = express.Router();
const myService = require('./bargashti.service');
const auth = require('../../_helpers/auth')
const captcha = require('../../_helpers/captcha')
// routes
router.post('/getBargashtiRespon', auth, getBargashtiRespon);
router.post('/getElatBargashtAgency', auth, getElatBargashtAgency);
router.post('/getBargashtiPayment', auth, getBargashtiPayment);
router.post('/ersalRespon', auth, ersalRespon);
router.post('/getRelatResponWithCustomer', auth, getRelatResponWithCustomer);
router.post('/ersalPaymentMarkazi', auth, ersalPaymentMarkazi);
router.post('/getContronAgencyResponList', auth, getContronAgencyResponList);
router.post('/ellatBargashtAgencyInsert', auth, ellatBargashtAgencyInsert);
router.post('/ellatBargashtAgencyUpdate', auth, ellatBargashtAgencyUpdate);
router.post('/ellatBargashtAgencyDelete', auth, ellatBargashtAgencyDelete);
router.post('/controlAgencyResponOk', auth, controlAgencyResponOk);
router.post('/controlAgencyResponNotOk', auth, controlAgencyResponNotOk);
router.post('/controlAgencyResponBack', auth, controlAgencyResponBack);
router.post('/getControlAgencyResponArchive', auth, getControlAgencyResponArchive);
router.post('/getContronAgencyPaymentList', auth, getContronAgencyPaymentList);
router.post('/controlAgencyPaymentOk', auth, controlAgencyPaymentOk);
router.post('/controlAgencyPayemntNotOk', auth, controlAgencyPayemntNotOk);
router.post('/controlAgencyPaymentBack', auth, controlAgencyPaymentBack);
router.post('/getControlAgencyPaymentArchive', auth, getControlAgencyPaymentArchive);
router.post('/controlAgencyPaymentUIData', auth, controlAgencyPaymentUIData);


module.exports = router;

function getBargashtiRespon(req, res, next) {

    myService.getBargashtiRespon(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getElatBargashtAgency(req, res, next) {

    myService.getElatBargashtAgency(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}
function getBargashtiPayment(req, res, next) {

    myService.getBargashtiPayment(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}
function ersalRespon(req, res, next) {

    myService.ersalRespon(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getRelatResponWithCustomer(req, res, next) {

    myService.getRelatResponWithCustomer(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function ersalPaymentMarkazi(req, res, next) {

    myService.ersalPaymentMarkazi(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getContronAgencyResponList(req, res, next) {

    myService.getContronAgencyResponList(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function ellatBargashtAgencyInsert(req, res, next) {

    myService.ellatBargashtAgencyInsert(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}
function ellatBargashtAgencyUpdate(req, res, next) {

    myService.ellatBargashtAgencyUpdate(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}
function ellatBargashtAgencyDelete(req, res, next) {

    myService.ellatBargashtAgencyDelete(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}
function controlAgencyResponOk(req, res, next) {

    myService.controlAgencyResponOk(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function controlAgencyResponNotOk(req, res, next) {

    myService.controlAgencyResponNotOk(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}
function controlAgencyResponBack(req, res, next) {

    myService.controlAgencyResponBack(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getControlAgencyResponArchive(req, res, next) {

    myService.getControlAgencyResponArchive(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getContronAgencyPaymentList(req, res, next) {

    myService.getContronAgencyPaymentList(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}
function controlAgencyPaymentOk(req, res, next) {

    myService.controlAgencyPaymentOk(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function controlAgencyPayemntNotOk(req, res, next) {

    myService.controlAgencyPayemntNotOk(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function controlAgencyPaymentBack(req, res, next) {

    myService.controlAgencyPaymentBack(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}
function getControlAgencyPaymentArchive(req, res, next) {

    myService.getControlAgencyPaymentArchive(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}


function controlAgencyPaymentUIData(req, res, next) {

    myService.controlAgencyPaymentUIData(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

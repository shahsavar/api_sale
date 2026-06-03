const express = require('express');
const router = express.Router();
const myService = require('./prefactor.service');
const auth = require('../../_helpers/auth')
const captcha = require('../../_helpers/captcha')

// routes
router.post('/getPreFactorUIData', auth, getPreFactorUIData)
router.post('/getPreFactorDocPrint', auth, getPreFactorDocPrint);
router.post('/getPreFactor', auth, getPreFactor);
router.post('/prefactorInsert', auth, prefactorInsert);
router.post('/prefactorDelete', auth, prefactorDelete);
router.post('/prefactorUpdate', auth, prefactorUpdate);
router.post('/prefactorChangeStatus', auth, prefactorChangeStatus);
router.post('/BankMellatGetTransactions', auth, BankMellatGetTransactions);
router.post('/preFactorDocPrintUpdate', auth, preFactorDocPrintUpdate);
router.post('/preFactorDocPrintInsert', auth, preFactorDocPrintInsert);
router.post('/PrefactorDocPrintDelete', auth, PrefactorDocPrintDelete);


router.post('/getPrefactorDocPrintData', auth, getPrefactorDocPrintData);

router.post('/PreFactorNotConfirmReasonInsert', auth, PreFactorNotConfirmReasonInsert);
router.post('/PreFactorExpireReasonUpdate', auth, PreFactorExpireReasonUpdate);
router.post('/UpdateSystemDateLastSmsSend', auth, UpdateSystemDateLastSmsSend);
router.post('/preFactorResponInsert', auth, preFactorResponInsert);
router.post('/getPreFactorNotConfirmReason', auth, getPreFactorNotConfirmReason);
router.post('/getRelatePrefactorWithSaleProject', auth, getRelatePrefactorWithSaleProject);

module.exports = router;

function getPreFactor(req, res, next) {
    myService.getPreFactor(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getPreFactorDocPrint(req, res, next) {
    myService.getPreFactorDocPrint(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getPreFactorUIData(req, res, next) {
    myService.getPreFactorUIData(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function prefactorInsert(req, res, next) {
    myService.prefactorInsert(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function prefactorDelete(req, res, next) {
    myService.prefactorDelete(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function prefactorUpdate(req, res, next) {
    myService.prefactorUpdate(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function prefactorChangeStatus(req, res, next) {
    myService.prefactorChangeStatus(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function BankMellatGetTransactions(req, res, next) {
    myService.BankMellatGetTransactions(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function preFactorDocPrintUpdate(req, res, next) {
    myService.preFactorDocPrintUpdate(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function preFactorDocPrintInsert(req, res, next) {
    myService.preFactorDocPrintInsert(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}




function getPrefactorDocPrintData(req, res, next) {
    myService.getPrefactorDocPrintData(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}


function PrefactorDocPrintDelete(req, res, next) {
    myService.PrefactorDocPrintDelete(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function PreFactorNotConfirmReasonInsert(req, res, next) {
    myService.PreFactorNotConfirmReasonInsert(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}


function PreFactorExpireReasonUpdate(req, res, next) {
    myService.PreFactorExpireReasonUpdate(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getPreFactorNotConfirmReason(req, res, next) {
    myService.getPreFactorNotConfirmReason(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function UpdateSystemDateLastSmsSend(req, res, next) {
    myService.UpdateSystemDateLastSmsSend(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function preFactorResponInsert(req, res, next) {
    myService.preFactorResponInsert(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getRelatePrefactorWithSaleProject(req, res, next) {
    myService.getRelatePrefactorWithSaleProject(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}








const express = require('express');
const router = express.Router();
const myService = require('./linkpardakht.service');
const auth = require('../../_helpers/auth')
const captcha = require('../../_helpers/captcha')
const authorize = require('../../_helpers/authorize')
// routes
router.post('/getLinkPardakht', authorize, getLinkPardakht);
router.post('/BankMellatGetLinkTransactions', auth, BankMellatGetLinkTransactions);
router.post('/getNumberOfUnRecivedBankDataLink',auth, getNumberOfUnRecivedBankDataLink);
router.post('/linkPardakhtInsert',auth, linkPardakhtInsert);
router.post('/linkPardakhtUpdate',auth, linkPardakhtUpdate);
router.post('/linkPardakhtDelete',auth, linkPardakhtDelete);
router.post('/LinkPardakhtSend',auth, LinkPardakhtSend);
router.post('/getDavatnameReadyToSendUrlLink',auth, getDavatnameReadyToSendUrlLink);

router.post('/getLinkPardakhtUIData',auth, getLinkPardakhtUIData);
router.post('/getTypePaymentShenase',authorize, getTypePaymentShenase);
router.post('/LinkPardakhtDavatnameSend',auth, LinkPardakhtDavatnameSend);
router.post('/customerCodeSelectExcel',auth, customerCodeSelectExcel);

router.post('/customerMobilSelectExcel',auth, customerMobilSelectExcel);
router.post('/getImportLinkPardakhtListError',auth, getImportLinkPardakhtListError);



module.exports = router;

function getLinkPardakht(req, res, next) {
     myService.getLinkPardakht(req)
         .then(data => res.json(data))
         .catch(err => next(err));
 }

 function BankMellatGetLinkTransactions(req, res, next) {
    myService.BankMellatGetLinkTransactions(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}
 
 function getNumberOfUnRecivedBankDataLink(req, res, next) {
    myService.getNumberOfUnRecivedBankDataLink(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getLinkPardakhtUIData(req, res, next) {
    myService.getLinkPardakhtUIData(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function linkPardakhtInsert(req, res, next) {
    myService.linkPardakhtInsert(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function linkPardakhtUpdate(req, res, next) {
    myService.linkPardakhtUpdate(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function linkPardakhtDelete(req, res, next) {
    myService.linkPardakhtDelete(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function LinkPardakhtSend(req, res, next) {
    myService.LinkPardakhtSend(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getTypePaymentShenase(req, res, next) {
    myService.getTypePaymentShenase(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getDavatnameReadyToSendUrlLink(req, res, next) {
    myService.getDavatnameReadyToSendUrlLink(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function LinkPardakhtDavatnameSend(req, res, next) {
    myService.LinkPardakhtDavatnameSend(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function customerCodeSelectExcel(req, res, next) {
    myService.customerCodeSelectExcel(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function customerMobilSelectExcel(req, res, next) {
    myService.customerMobilSelectExcel(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getImportLinkPardakhtListError(req, res, next) {
    myService.getImportLinkPardakhtListError(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}








 

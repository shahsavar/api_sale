const express = require('express');
const router = express.Router();
const myService = require('./payment.service');
const auth = require('../../_helpers/auth')
const captcha = require('../../_helpers/captcha')
// routes
router.post('/GetMandePayment', auth, GetMandePayment);

router.post('/GetCustomerPaymentUIData', auth, GetCustomerPaymentUIData);
router.post('/getBanks', auth, getBanks);
router.post('/getBranchs', auth, getBranchs);
router.post('/getPaymentSahebCheck', auth, getPaymentSahebCheck);
router.post('/PaymentSaleInsert', auth, PaymentSaleInsert);
router.post('/PaymentSaleUpdate', auth, PaymentSaleUpdate);
router.post('/PaymentSaleDelete', auth, PaymentSaleDelete);
router.post('/getPaymentModatDarTree', auth, getPaymentModatDarTree);
router.post('/getPaymentModatDarDetail', auth, getPaymentModatDarDetail);
router.post('/getPaymentModatDar', auth, getPaymentModatDar);
router.post('/getPaymentModatDarRespon', auth, getPaymentModatDarRespon);



//relateResponWithAccount
router.post('/GetMandeRelatResponWithPayment', auth, GetMandeRelatResponWithPayment);
router.post('/RelatResponWithPaymentInsert', auth, RelatResponWithPaymentInsert);
router.post('/RelatResponWithPaymentUpdate', auth, RelatResponWithPaymentUpdate);
router.post('/RelatResponWithPaymentDelete', auth, RelatResponWithPaymentDelete);
router.post('/GetPaymentAll', auth, GetPaymentAll);
router.post('/getSplitedQrCodeData', auth, getSplitedQrCodeData);



module.exports = router;

    function GetMandePayment(req, res, next) {
        myService.GetMandePayment(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }
    function GetPaymentAll(req, res, next) {
        myService.GetPaymentAll(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }
    function GetCustomerPaymentUIData(req, res, next) {
        myService.GetCustomerPaymentUIData(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }
    
    function getBanks(req, res, next) {
        myService.getBanks(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }

    function getBranchs(req, res, next) {
        myService.getBranchs(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }

    function getPaymentSahebCheck(req, res, next) {
        myService.getPaymentSahebCheck(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }

    function PaymentSaleInsert(req, res, next) {
        myService.PaymentSaleInsert(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }

    function PaymentSaleUpdate(req, res, next) {
        myService.PaymentSaleUpdate(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }

    function PaymentSaleDelete(req, res, next) {
        myService.PaymentSaleDelete(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }

    ///////////////////////////////////////////////////

    function GetMandeRelatResponWithPayment(req, res, next) {
        myService.GetMandeRelatResponWithPayment(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }

    function RelatResponWithPaymentDelete(req, res, next) {
        myService.RelatResponWithPaymentDelete(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }
    function RelatResponWithPaymentInsert(req, res, next) {
        myService.RelatResponWithPaymentInsert(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }
    function RelatResponWithPaymentUpdate(req, res, next) {
        myService.RelatResponWithPaymentUpdate(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }
    
    function getPaymentModatDarTree(req, res, next) {
        myService.getPaymentModatDarTree(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }
    
    function getPaymentModatDarDetail(req, res, next) {
        myService.getPaymentModatDarDetail(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }
    function getPaymentModatDar(req, res, next) {
        myService.getPaymentModatDar(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }

    function getPaymentModatDarRespon(req, res, next) {
        myService.getPaymentModatDarRespon(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }
    function getSplitedQrCodeData(req, res, next) {
        myService.getSplitedQrCodeData(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }
    

    
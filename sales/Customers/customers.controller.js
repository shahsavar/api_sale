const express = require('express');
const router = express.Router();
const myService = require('./customers.service');
const auth = require('../../_helpers/auth')
const captcha = require('../../_helpers/captcha')

 const rateLimit = require('express-rate-limit')
const orderLimiter = rateLimit({windowMs: 1000, //2 secound
    max: 10, 
    standardHeaders: true, 
    legacyHeaders: false,
    message: "عدم رعایت فاصله زمانی لطفا دقایقی دیگر تلاش نمایید"
})


// routes
router.post('/getCustomers', auth, getCustomers); 
router.post('/getCustomersAgency', auth, getCustomersAgency); 
router.post('/getCustomerUIData', auth, getCustomerUIData); 
router.post('/CustomerInsert', auth, customerInsert); 
router.post('/CustomerUpdate', auth, customerUpdate); 
router.post('/CustomerDelete', auth, customerDelete); 
router.post('/getRelatCustomerWithAccount', auth, getRelatCustomerWithAccount);
router.post('/getCustomerAccountUIData', auth, getCustomerAccountUIData);
router.post('/getPersonelSematUIData', auth, getPersonelSematUIData);

router.post('/CustomerAccountInsert', auth, CustomerAccountInsert);
router.post('/CustomerAccountUpdate', auth, CustomerAccountUpdate);
router.post('/CustomerAccountDelete', auth, CustomerAccountDelete);
router.post('/getIntCustomerSheba', auth, getIntCustomerSheba);
router.post('/verifyPostalCode', [auth,orderLimiter], verifyPostalCode);
router.post('/getCustomersPostalCode', auth, getCustomersPostalCode);
router.post('/getCustomersForHerasat', auth, getCustomersForHerasat); 
router.post('/TransferIntCustomerToCustomer', auth, TransferIntCustomerToCustomer);
router.post('/getBardashVajhCustomnerList', auth, getBardashVajhCustomnerList);
router.post('/getBardashtVajhCustomerUIData', auth, getBardashtVajhCustomerUIData);
router.post('/bardashVajhCustomerInsert', auth, bardashVajhCustomerInsert);
router.post('/bardashVajhCustomerUpdate', auth, bardashVajhCustomerUpdate);
router.post('/bardashVajhCustomerDelete', auth, bardashVajhCustomerDelete);
router.post('/bardashVajhCustomerErsalMali', auth, bardashVajhCustomerErsalMali);
router.post('/paymentUsedBardashtVajhCustomerInsert', auth, paymentUsedBardashtVajhCustomerInsert);
router.post('/bardashtVajhCustomerPrintUIData', auth, bardashtVajhCustomerPrintUIData);

// router.post('/GetMandePaymentByCustomer', auth, GetMandePaymentByCustomer);
// router.post('/RelatResponWithPaymentDelete', auth, RelatResponWithPaymentDelete);
// router.post('/getBanks', auth, getBanks);
// router.post('/getBranchs', auth, getBranchs);
// router.post('/getPaymentSahebCheck', auth, getPaymentSahebCheck);
// router.post('/PaymentSaleInsert', auth, PaymentSaleInsert);
// router.post('/PaymentSaleUpdate', auth, PaymentSaleUpdate);

module.exports = router;

    function getCustomers(req, res, next) {
        
        myService.getCustomers(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }
    function getCustomersAgency(req, res, next) {
        
        myService.getCustomersAgency(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }
    function getCustomerUIData(req, res, next) {
        myService.getCustomerUIData(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }
    
    function customerInsert(req, res, next) {
        myService.customerInsert(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }
    function customerUpdate(req, res, next) {
        myService.customerUpdate(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }
    function customerDelete(req, res, next) {
        myService.customerDelete(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }

    function getRelatCustomerWithAccount(req, res, next) {
        myService.getRelatCustomerWithAccount(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }
    
    function getCustomerAccountUIData(req, res, next) {
        myService.getCustomerAccountUIData(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }

    function getPersonelSematUIData(req, res, next) {
        myService.getPersonelSematUIData(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }
    
    
    function CustomerAccountInsert(req, res, next) {
        myService.CustomerAccountInsert(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }

        
    function CustomerAccountUpdate(req, res, next) {
        myService.CustomerAccountUpdate(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }
    
    function CustomerAccountDelete(req, res, next) {
        myService.CustomerAccountDelete(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }

    function getIntCustomerSheba(req, res, next) {
        myService.getIntCustomerSheba(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }
    function verifyPostalCode(req, res, next) {
        myService.verifyPostalCode(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }
    function getCustomersPostalCode(req, res, next) {
        myService.getCustomersPostalCode(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }
    function getCustomersForHerasat(req, res, next) {
        myService.getCustomersForHerasat(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }
    function TransferIntCustomerToCustomer(req, res, next) {
        myService.TransferIntCustomerToCustomer(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }
    function getBardashVajhCustomnerList(req, res, next) {
        myService.getBardashVajhCustomnerList(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }
    
    function getBardashtVajhCustomerUIData(req, res, next) {
        myService.getBardashtVajhCustomerUIData(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }
    function bardashVajhCustomerInsert(req, res, next) {
        myService.bardashVajhCustomerInsert(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }
    
    function bardashVajhCustomerUpdate(req, res, next) {
        myService.bardashVajhCustomerUpdate(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }
    
    function bardashVajhCustomerDelete(req, res, next) {
        myService.bardashVajhCustomerDelete(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }
    
    function bardashVajhCustomerErsalMali(req, res, next) {
        myService.bardashVajhCustomerErsalMali(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }
    function paymentUsedBardashtVajhCustomerInsert(req, res, next) {
        myService.paymentUsedBardashtVajhCustomerInsert(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    } 
    
    function bardashtVajhCustomerPrintUIData(req, res, next) {
        myService.bardashtVajhCustomerPrintUIData(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    } 
    
    
const express = require('express');
const router = express.Router();
const myService = require('./daraee.service');
const auth = require('../../_helpers/auth')


// routes
router.post('/sendFactor', auth ,sendFactor); 
router.post('/chekFactor', auth ,chekFactor); 
router.post('/sendEbtal', auth ,sendEbtal); 
router.post('/getFactorReadyToSendDaraee', auth ,getFactorReadyToSendDaraee); 
router.post('/getFactorErrorDaraee', auth ,getFactorErrorDaraee); 
router.post('/getFactorSendedDaraee', auth ,getFactorSendedDaraee); 
router.post('/getFactorEbtalReadyToSendDaraee', auth ,getFactorEbtalReadyToSendDaraee); 
router.post('/getFactorDaraeeLog', auth ,getFactorDaraeeLog); 
router.post('/getAgencyInfoForDaraeeUIData', auth ,getAgencyInfoForDaraeeUIData); 
router.post('/getAgencyNationalCode', auth ,getAgencyNationalCode); 
router.post('/AgencyInfoForDaraeeInsert',auth, AgencyInfoForDaraeeInsert);
router.post('/AgencyInfoForDaraeeUpdate',auth, AgencyInfoForDaraeeUpdate);
router.post('/AgencyInfoForDaraeeDelete',auth, AgencyInfoForDaraeeDelete);

module.exports = router;
//----------------------
function sendFactor(req, res, next) {
    myService.sendFactor(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}

function chekFactor(req, res, next) {
    myService.chekFactor(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}

function sendEbtal(req, res, next) {
    myService.sendEbtal(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function getFactorReadyToSendDaraee(req, res, next) {
    myService.getFactorReadyToSendDaraee(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function getFactorErrorDaraee(req, res, next) {
    myService.getFactorErrorDaraee(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
   
function getFactorSendedDaraee(req, res, next) {
    myService.getFactorSendedDaraee(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function getFactorEbtalReadyToSendDaraee(req, res, next) {
    myService.getFactorEbtalReadyToSendDaraee(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
    
function getFactorDaraeeLog(req, res, next) {
    myService.getFactorDaraeeLog(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function getAgencyInfoForDaraeeUIData(req, res, next) {
    myService.getAgencyInfoForDaraeeUIData(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function getAgencyNationalCode(req, res, next) {
    myService.getAgencyNationalCode(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
    
function  AgencyInfoForDaraeeInsert (req, res, next) {
    myService. AgencyInfoForDaraeeInsert (req)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function  AgencyInfoForDaraeeUpdate (req, res, next) {
    myService. AgencyInfoForDaraeeUpdate (req)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function  AgencyInfoForDaraeeDelete (req, res, next) {
    myService. AgencyInfoForDaraeeDelete (req)
    .then(data => res.json(data))
    .catch(err => next(err));
}    

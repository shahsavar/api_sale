const express = require('express');
const router = express.Router();
const myService = require('./DavatName.service');
const auth = require('../../_helpers/auth')
// routes
router.post('/getDavatName', auth ,getDavatName); 
router.post('/getDavatnameData', auth ,getDavatnameData); 
//router.post('/getDavatNameWithFactor', auth ,getDavatNameWithFactor); 
router.post('/getNobatBandiList', auth ,getNobatBandiList); 
router.post('/NobatBandiDetailDelete', auth ,NobatBandiDetailDelete); 
router.post('/getResponDavatNamehPickList', auth ,getResponDavatNamehPickList); 
router.post('/getInitialChangeDavatNameh', auth ,getInitialChangeDavatNameh); 
router.post('/primarySubmitDavatNameh', auth ,primarySubmitDavatNameh); 
router.post('/getTepmNobatbandiDetailList', auth ,getTepmNobatbandiDetailList); 
router.post('/TepmNobatbandiDetailDelete', auth ,TepmNobatbandiDetailDelete); 
router.post('/finalSubmitDavatNameh', auth ,finalSubmitDavatNameh); 


module.exports = router;

function getDavatName(req, res, next) {
    myService.getDavatName(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}

function getDavatnameData(req, res, next) {
    myService.getDavatnameData(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function getNobatBandiList(req, res, next) {
    myService.getNobatBandiList(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}

function NobatBandiDetailDelete(req, res, next) {
    myService.NobatBandiDetailDelete(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function getResponDavatNamehPickList(req, res, next) {
    myService.getResponDavatNamehPickList(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function getInitialChangeDavatNameh(req, res, next) {
    myService.getInitialChangeDavatNameh(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function primarySubmitDavatNameh(req, res, next) {
    myService.primarySubmitDavatNameh(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function getTepmNobatbandiDetailList(req, res, next) {
    myService.getTepmNobatbandiDetailList(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}

function TepmNobatbandiDetailDelete(req, res, next) {
    myService.TepmNobatbandiDetailDelete(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}

function finalSubmitDavatNameh(req, res, next) {
    myService.finalSubmitDavatNameh(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}


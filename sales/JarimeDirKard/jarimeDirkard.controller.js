const express = require('express');
const router = express.Router();
const myService = require('./jarimeDirkard.service');
const auth = require('../../_helpers/auth')
// routes

router.post('/getJarimeDirKardList', auth ,getJarimeDirKardList); 
router.post('/getJarimeDirKardItemsList', auth ,getJarimeDirKardItemsList); 
router.post('/getJarimeDirKardItemsList', auth ,getJarimeDirKardItemsList); 
router.post('/ConfirmJarimeDirKard', auth ,ConfirmJarimeDirKard); 
router.post('/EbtalJarimeDirKard', auth ,EbtalJarimeDirKard); 
router.post('/getJarimeResponNonAuto', auth ,getJarimeResponNonAuto); 
router.post('/JarimeResponNonAutoInsert', auth ,JarimeResponNonAutoInsert); 
router.post('/JarimeResponNonAutoDelete', auth ,JarimeResponNonAutoDelete); 
router.post('/JarimeDirKardManualCalc', auth ,JarimeDirKardManualCalc);

router.post('/getJarimeDirKardResponList', auth ,getJarimeDirKardResponList); 
router.post('/getJarimeDirKardResponItemsList', auth ,getJarimeDirKardResponItemsList); 
router.post('/JarimeDirKardResponCalcAll', auth ,JarimeDirKardResponCalcAll); 
router.post('/JarimeDirKardForResponCalc', auth ,JarimeDirKardForResponCalc); 
router.post('/getSanadReportUIData', auth ,getSanadReportUIData); 
router.post('/readSanadReport', auth ,readSanadReport); 


module.exports = router;


function getJarimeDirKardList(req, res, next) {
    myService.getJarimeDirKardList(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function getJarimeDirKardItemsList(req, res, next) {
    myService.getJarimeDirKardItemsList(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function ConfirmJarimeDirKard(req, res, next) {
    myService.ConfirmJarimeDirKard(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function EbtalJarimeDirKard(req, res, next) {
    myService.EbtalJarimeDirKard(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function getJarimeResponNonAuto(req, res, next) {
    myService.getJarimeResponNonAuto(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function JarimeResponNonAutoInsert(req, res, next) {
    myService.JarimeResponNonAutoInsert(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function JarimeResponNonAutoDelete(req, res, next) {
    myService.JarimeResponNonAutoDelete(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function JarimeDirKardManualCalc(req, res, next) {
    myService.JarimeDirKardManualCalc(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}


function getJarimeDirKardResponList(req, res, next) {
    myService.getJarimeDirKardResponList(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function getJarimeDirKardResponItemsList(req, res, next) {
    myService.getJarimeDirKardResponItemsList(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}

function JarimeDirKardResponCalcAll(req, res, next) {
    myService.JarimeDirKardResponCalcAll(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}

function JarimeDirKardForResponCalc(req, res, next) {
    myService.JarimeDirKardForResponCalc(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function getSanadReportUIData(req, res, next) {
    myService.getSanadReportUIData(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function readSanadReport(req, res, next) {
    myService.readSanadReport(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}






    

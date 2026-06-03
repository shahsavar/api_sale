const express = require('express');
const router = express.Router();
const myService = require('./pelak.service');
const auth = require('../../_helpers/auth')
// routes
router.post('/importExcel', auth ,importExcel); 
router.post('/getImportPelakOk', auth ,getImportPelakOk); 
router.post('/getImportPelakError', auth ,getImportPelakError); 
router.post('/getPelackTracking', auth ,getPelackTracking);
router.post('/getPelackTrackingHistory', auth ,getPelackTrackingHistory);
router.post('/PelakTrackingAction', auth ,PelakTrackingAction);
router.post('/PelakTrackingCheckOption', auth ,PelakTrackingCheckOption);
router.post('/PelakTrackingCheckUpdate', auth ,PelakTrackingCheckUpdate);
router.post('/getImportShomareGozariError', auth ,getImportShomareGozariError);
router.post('/ErsalKoliPelakTracking', auth ,ErsalKoliPelakTracking);
router.post('/getPelakActionUIData', auth ,getPelakActionUIData);
router.post('/getPelackFakHistory', auth ,getPelackFakHistory);


module.exports = router;

// function getJarimeDirKardList(req, res, next) {
//     myService.getJarimeDirKardList(req,res.next)
//     .then(data => res.json(data))
//     .catch(err => next(err));
// }

function importExcel(req, res, next) {
    
    myService.importExcel(req, res)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getImportPelakOk(req, res, next) {
    
    myService.getImportPelakOk(req, res)
        .then(data => res.json(data))
        .catch(err => next(err));
}
function getImportPelakError(req, res, next) {
    myService.getImportPelakError (req, res)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getPelackTracking(req, res, next) {
    myService.getPelackTracking (req, res)
        .then(data => res.json(data))
        .catch(err => next(err));
}  

function getPelackTrackingHistory(req, res, next) {
    myService.getPelackTrackingHistory (req, res)
        .then(data => res.json(data))
        .catch(err => next(err));
}  

function PelakTrackingAction(req, res, next) {
    myService.PelakTrackingAction (req, res)
        .then(data => res.json(data))
        .catch(err => next(err));
} 
function PelakTrackingCheckOption(req, res, next) {
    myService.PelakTrackingCheckOption (req, res)
        .then(data => res.json(data))
        .catch(err => next(err));
} 
function PelakTrackingCheckUpdate(req, res, next) {
    myService.PelakTrackingCheckUpdate (req, res)
        .then(data => res.json(data))
        .catch(err => next(err));
} 
function getImportShomareGozariError(req, res, next) {
    myService.getImportShomareGozariError (req, res)
        .then(data => res.json(data))
        .catch(err => next(err));
} 

function ErsalKoliPelakTracking(req, res, next) {
    myService.ErsalKoliPelakTracking (req, res)
        .then(data => res.json(data))
        .catch(err => next(err));
} 
function getPelakActionUIData(req, res, next) {
    myService.getPelakActionUIData (req, res)
        .then(data => res.json(data))
        .catch(err => next(err));
} 

function getPelackFakHistory(req, res, next) {
    myService.getPelackFakHistory (req, res)
        .then(data => res.json(data))
        .catch(err => next(err));
} 

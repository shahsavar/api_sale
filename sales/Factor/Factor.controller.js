const express = require('express');
const router = express.Router();
const myService = require('./Factor.service');
const auth = require('../../_helpers/auth')
// routes

router.post('/getFakRahn', auth ,getFakRahn);
router.post('/getFakRahnPrintUIData', auth ,getFakRahnPrintUIData);
router.post('/getInitialFactorUIData', auth ,getInitialFactorUIData);


module.exports = router;


function getFakRahn(req, res, next) {
    myService.getFakRahn (req, res)
        .then(data => res.json(data))
        .catch(err => next(err));
} 
function getFakRahnPrintUIData(req, res, next) {
    myService.getFakRahnPrintUIData (req, res)
        .then(data => res.json(data))
        .catch(err => next(err));
} 
function getInitialFactorUIData(req, res, next) {
    myService.getInitialFactorUIData (req, res)
        .then(data => res.json(data))
        .catch(err => next(err));
} 



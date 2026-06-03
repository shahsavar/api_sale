const express = require('express');
const router = express.Router();
const myService = require('./MoarefiName.service');
const auth = require('../../_helpers/auth')
// routes
router.post('/getMoarefiName', auth ,getMoarefiName); 
router.post('/getMoarefiNameData', auth ,getMoarefiNameData); 
router.post('/getMoarefiNameDetail', auth ,getMoarefiNameDetail);


module.exports = router;

function getMoarefiName(req, res, next) {
    myService.getMoarefiName(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}

function getMoarefiNameData(req, res, next) {
    myService.getMoarefiNameData(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}

function getMoarefiNameDetail(req, res, next) {
    myService.getMoarefiNameDetail(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}






    

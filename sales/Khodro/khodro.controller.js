const express = require('express');
const router = express.Router();
const myService = require('./khodro.service');
const auth = require('../../_helpers/auth')
// routes

router.post('/getAmarKhodro', auth ,getAmarKhodro); 
router.post('/getAmarKhodroUIData', auth ,getAmarKhodroUIData); 


module.exports = router;

function getAmarKhodro(req, res, next) {
    myService.getAmarKhodro(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}


function getAmarKhodroUIData(req, res, next) {
    myService.getAmarKhodroUIData(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}


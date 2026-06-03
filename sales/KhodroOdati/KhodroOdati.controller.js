const express = require('express');
const router = express.Router();
const myService = require('./KhodroOdati.service');
const auth = require('../../_helpers/auth')
// routes
router.post('/getKhodroOdati', auth ,getKhodroOdati); 
router.post('/ConfirmkhodroOdati', auth ,ConfirmkhodroOdati); 


module.exports = router;

function getKhodroOdati(req, res, next) {
    myService.getKhodroOdati(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}

function ConfirmkhodroOdati(req, res, next) {
    myService.ConfirmkhodroOdati(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}




    

const express = require('express');
const router = express.Router();
const myService = require('./saleProjects.service');
const auth = require('../../_helpers/auth')
const captcha = require('../../_helpers/captcha')
// routes
router.post('/getSaleprojects', getSaleProjects); 
router.post('/getSaleProjectPrices', auth ,getSaleProjectPrices);  


module.exports = router;

    function getSaleProjects(req, res, next) {
        myService.getSaleProjects(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }

    function getSaleProjectPrices(req, res, next) {
        myService.getSaleProjectPrices(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    

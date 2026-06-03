const express = require('express');
const router = express.Router();
const cryptoService = require('./crypto.service');

// routes
router.post('/encryptData', encryptData);
router.post('/decryptData', decryptData);

module.exports = router;

function encryptData(req, res, next) 
{
        cryptoService.encryptData(req.body)
        .then(data => res.json(data))
        .catch(err => next(err));
}


function decryptData(req, res, next) 
{
        cryptoService.decryptData(req.body)
        .then(data => res.json(data))
        .catch(err => next(err));
}





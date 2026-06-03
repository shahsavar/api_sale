const express = require('express');
const router = express.Router();
const myService = require('./baseInfo.service');
const auth = require('../../_helpers/auth')
// routes

router.post('/getDueDeliver', auth ,getDueDeliver); 
router.post('/dueDeliverInsert', auth ,dueDeliverInsert);
router.post('/dueDeliverUpdate', auth ,dueDeliverUpdate);
router.post('/dueDeliverDelete', auth ,dueDeliverDelete);
router.post('/changeMojavezModel', auth ,changeMojavezModel);


module.exports = router;

function getDueDeliver(req, res, next) {
    myService.getDueDeliver(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function dueDeliverInsert(req, res, next) {
    myService.dueDeliverInsert(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function dueDeliverUpdate(req, res, next) {
    myService.dueDeliverUpdate(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
    
}

function dueDeliverDelete(req, res, next) {
    myService.dueDeliverDelete(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
    
}

function changeMojavezModel(req, res, next) {
    myService.changeMojavezModel(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
    
}



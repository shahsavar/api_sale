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
router.post('/getModelPropertiesUIData', auth ,getModelPropertiesUIData);
router.post('/modelUpdate', auth ,modelUpdate);
router.post('/getFactorHazinehList', auth ,getFactorHazinehList);
router.post('/getFactorHazinehUIData', auth ,getFactorHazinehUIData);
router.post('/getMoinPickList', auth ,getMoinPickList);
router.post('/getTafsiliPickList', auth ,getTafsiliPickList);
router.post('/factorHazineInsert', auth ,factorHazineInsert);
router.post('/factorHazineUpdate', auth ,factorHazineUpdate);
router.post('/factorHazineDelete', auth ,factorHazineDelete);




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

function getModelPropertiesUIData(req, res, next) {
    myService.getModelPropertiesUIData(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
    
}

function modelUpdate(req, res, next) {
    myService.modelUpdate(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
    
}

function getFactorHazinehList(req, res, next) {
    myService.getFactorHazinehList(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
    
}

function getFactorHazinehUIData(req, res, next) {
    myService.getFactorHazinehUIData(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
    
}
function getMoinPickList(req, res, next) {
    myService.getMoinPickList(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
    
}

function getTafsiliPickList(req, res, next) {
    myService.getTafsiliPickList(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
    
}
function factorHazineInsert(req, res, next) {
    myService.factorHazineInsert(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
    
}
function factorHazineUpdate(req, res, next) {
    myService.factorHazineUpdate(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
    
}

function factorHazineDelete(req, res, next) {
    myService.factorHazineDelete(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
    
}


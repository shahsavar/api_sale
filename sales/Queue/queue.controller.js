const express = require('express');
const router = express.Router();
const myService = require('./queue.service');
const auth = require('../../_helpers/auth')
// routes
router.post('/getQueueList', auth ,getQueueList); 
router.post('/getOrderPriorityUIData', auth ,getOrderPriorityUIData); 
router.post('/queueChangeNobat', auth ,queueChangeNobat); 
router.post('/getResponNotQueuePickList', auth ,getResponNotQueuePickList); 
router.post('/queueControlAdd', auth ,queueControlAdd); 
router.post('/getModelsInRespon', auth ,getModelsInRespon); 


module.exports = router;



function getQueueList(req, res, next) {
    
    myService.getQueueList(req, res)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getOrderPriorityUIData(req, res, next) {
    
    myService.getOrderPriorityUIData(req, res)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function queueChangeNobat(req, res, next) {
    
    myService.queueChangeNobat(req, res)
        .then(data => res.json(data))
        .catch(err => next(err));
}
function getResponNotQueuePickList(req, res, next) {
    
    myService.getResponNotQueuePickList(req, res)
        .then(data => res.json(data))
        .catch(err => next(err));
}
function queueControlAdd(req, res, next) {
    
    myService.queueControlAdd(req, res)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getModelsInRespon(req, res, next) {
    
    myService.getModelsInRespon(req, res)
        .then(data => res.json(data))
        .catch(err => next(err));
}

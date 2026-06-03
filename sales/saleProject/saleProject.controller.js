const express = require('express');
const router = express.Router();
const myService = require('./saleProject.service');
const auth = require('../../_helpers/auth')
const captcha = require('../../_helpers/captcha')
const authorize = require('../../_helpers/authorize')
// routes
router.post('/getViewsaleProjects',authorize, getViewsaleProjects); 
router.post('/getModel',auth, getModel);
router.post('/getModelSub',auth, getModelSub);
router.post('/getSaleProjectsUIData',auth, getSaleProjectsUIData);
router.post('/getExtraFormData',auth, getExtraFormData);
router.post('/getUsagelist',auth, getUsageList);
router.post('/getPrice',auth, getPrice);
router.post('/SaleProjectsInsert',auth, SaleProjectsInsert);
router.post('/SaleProjectsUpdate',auth, SaleProjectsUpdate);
router.post('/getPrePaymentList',auth, getPrePaymentList);
router.post('/getPrePaymentUIData',auth, getPrePaymentUIData);
router.post('/PrePaymentInsert',auth, PrePaymentInsert);
router.post('/PrePaymentUpdate',auth, PrePaymentUpdate);
router.post('/PrePaymentDelete',auth, PrePaymentDelete);
router.post('/getFactorSoudList',auth, getFactorSoudList);
router.post('/getFactorSoudUIData',auth, getFactorSoudUIData);
router.post('/FactorSoudInsert',auth, FactorSoudInsert);
router.post('/FactorSoudUpdate',auth, FactorSoudUpdate);
router.post('/FactorSoudDelete',auth, FactorSoudDelete);
router.post('/SaleProjectsDelete',auth, SaleProjectsDelete);
router.post('/getEsterdadSoudList',auth, getEsterdadSoudList);
router.post('/getEsterdadSoudUIData',auth, getEsterdadSoudUIData);
router.post('/EsterdadSoudInsert',auth, EsterdadSoudInsert);
router.post('/EsterdadSoudUpdate',auth, EsterdadSoudUpdate);
router.post('/EsterdadSoudDelete',auth, EsterdadSoudDelete);
router.post('/getTakhfifDeliverList',auth, getTakhfifDeliverList);
router.post('/TakhfifDeliverInsert',auth, TakhfifDeliverInsert);
router.post('/TakhfifDeliverUpdate',auth, TakhfifDeliverUpdate);
router.post('/TakhfifDeliverDelete',auth, TakhfifDeliverDelete);
router.post('/getIncreasePriceList',auth, getIncreasePriceList);
router.post('/IncreasePriceInsert',auth, IncreasePriceInsert);
router.post('/IncreasePriceUpdate',auth, IncreasePriceUpdate);
router.post('/IncreasePriceDelete',auth, IncreasePriceDelete);
router.post('/getResponHazinehList',auth, getResponHazinehList);
router.post('/getResponHazinehUIData',auth, getResponHazinehUIData);
router.post('/ResponHazinehInsert',auth, ResponHazinehInsert);
router.post('/ResponHazinehUpdate',auth, ResponHazinehUpdate);
router.post('/ResponHazinehDelete',auth, ResponHazinehDelete);
router.post('/SaleProjectsCopy',auth, SaleProjectsCopy);
router.post('/getDueDeliverProgList',auth, getDueDeliverProgList);
router.post('/getDueDeliverUIData',auth, getDueDeliverUIData);
router.post('/DueDeliverProgInsert',auth, DueDeliverProgInsert);
router.post('/getDueDeliverExtraUIData',auth, getDueDeliverExtraUIData);
router.post('/DueDeliverProgUpdate',auth, DueDeliverProgUpdate);
router.post('/DueDeliverProgDelete',auth, DueDeliverProgDelete);
router.post('/getDeliverExpireDate',auth, getDeliverExpireDate);
router.post('/getRelatOptionalList',auth, getRelatOptionalList);
router.post('/getRelatOptionalPickList',auth, getRelatOptionalPickList);
router.post('/RelatOptionalInsert',auth, RelatOptionalInsert);
router.post('/RelateOptionalDelete',auth, RelateOptionalDelete);
router.post('/getSaleProjectMessage',auth, getSaleProjectMessage);
router.post('/getCommissionList',auth, getCommissionList);
router.post('/getCommissionExtraData',auth, getCommissionExtraData);
router.post('/getStepCommission',auth, getStepCommission);
router.post('/SaleProjectsCommissionInsert',auth, SaleProjectsCommissionInsert);
router.post('/SaleProjectsCommissionUpdate',auth, SaleProjectsCommissionUpdate);
router.post('/SaleProjectsCommissionDelete',auth, SaleProjectsCommissionDelete);


module.exports = router;

    function getViewsaleProjects(req, res, next) {
        myService.getViewsaleProjects(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }

    function getModel(req, res, next) {
        myService.getModel(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function getModelSub(req, res, next) {
        myService.getModelSub(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function getSaleProjectsUIData(req, res, next) {
        myService.getSaleProjectsUIData(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function getExtraFormData(req, res, next) {
        myService.getExtraFormData(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function getUsageList(req, res, next) {
        myService.getUsageList(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function getPrice(req, res, next) {
        myService.getPrice(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function SaleProjectsInsert(req, res, next) {
        myService.SaleProjectsInsert(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function SaleProjectsUpdate(req, res, next) {
        myService.SaleProjectsUpdate(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  getPrePaymentList (req, res, next) {
        myService. getPrePaymentList (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  getPrePaymentUIData (req, res, next) {
        myService. getPrePaymentUIData (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  PrePaymentInsert (req, res, next) {
        myService. PrePaymentInsert (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  PrePaymentUpdate (req, res, next) {
        myService. PrePaymentUpdate (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  PrePaymentDelete (req, res, next) {
        myService. PrePaymentDelete (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  getFactorSoudList (req, res, next) {
        myService. getFactorSoudList (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  getFactorSoudUIData (req, res, next) {
        myService. getFactorSoudUIData (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  FactorSoudInsert (req, res, next) {
        myService. FactorSoudInsert (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  FactorSoudUpdate (req, res, next) {
        myService. FactorSoudUpdate (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  FactorSoudDelete (req, res, next) {
        myService. FactorSoudDelete (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  SaleProjectsDelete (req, res, next) {
        myService. SaleProjectsDelete (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  getEsterdadSoudList (req, res, next) {
        myService. getEsterdadSoudList (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  getEsterdadSoudUIData (req, res, next) {
        myService. getEsterdadSoudUIData (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  EsterdadSoudInsert (req, res, next) {
        myService. EsterdadSoudInsert (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  EsterdadSoudUpdate (req, res, next) {
        myService.EsterdadSoudUpdate (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  EsterdadSoudDelete (req, res, next) {
        myService.EsterdadSoudDelete (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  getTakhfifDeliverList (req, res, next) {
        myService.getTakhfifDeliverList (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  TakhfifDeliverInsert (req, res, next) {
        myService.TakhfifDeliverInsert (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  TakhfifDeliverUpdate (req, res, next) {
        myService.TakhfifDeliverUpdate (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  TakhfifDeliverDelete (req, res, next) {
        myService.TakhfifDeliverDelete (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  getIncreasePriceList (req, res, next) {
        myService.getIncreasePriceList (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  IncreasePriceInsert (req, res, next) {
        myService.IncreasePriceInsert (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  IncreasePriceUpdate (req, res, next) {
        myService.IncreasePriceUpdate (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  IncreasePriceDelete (req, res, next) {
        myService.IncreasePriceDelete (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  getResponHazinehList (req, res, next) {
        myService.getResponHazinehList (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  getResponHazinehUIData (req, res, next) {
        myService.getResponHazinehUIData (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  ResponHazinehInsert (req, res, next) {
        myService.ResponHazinehInsert (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  ResponHazinehUpdate (req, res, next) {
        myService.ResponHazinehUpdate (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  ResponHazinehDelete (req, res, next) {
        myService.ResponHazinehDelete (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  SaleProjectsCopy (req, res, next) {
        myService.SaleProjectsCopy (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  getDueDeliverProgList (req, res, next) {
        myService.getDueDeliverProgList (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  getDueDeliverUIData (req, res, next) {
        myService.getDueDeliverUIData (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  DueDeliverProgInsert (req, res, next) {
        myService.DueDeliverProgInsert (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  getDueDeliverExtraUIData (req, res, next) {
        myService.getDueDeliverExtraUIData (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  DueDeliverProgUpdate (req, res, next) {
        myService.DueDeliverProgUpdate (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  DueDeliverProgDelete (req, res, next) {
        myService.DueDeliverProgDelete (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  getDeliverExpireDate (req, res, next) {
        myService.getDeliverExpireDate (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    
    function  getRelatOptionalList (req, res, next) {
        myService.getRelatOptionalList (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    
    function  getRelatOptionalPickList (req, res, next) {
        myService.getRelatOptionalPickList (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  getSaleProjectMessage (req, res, next) {
        myService.getSaleProjectMessage (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    
    function  RelatOptionalInsert (req, res, next) {
        myService.RelatOptionalInsert (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  RelateOptionalDelete (req, res, next) {
        myService.RelateOptionalDelete (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  getCommissionList (req, res, next) {
        myService.getCommissionList (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  getCommissionExtraData (req, res, next) {
        myService.getCommissionExtraData (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  getStepCommission (req, res, next) {
        myService.getStepCommission (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  SaleProjectsCommissionInsert (req, res, next) {
        myService.SaleProjectsCommissionInsert (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  SaleProjectsCommissionUpdate (req, res, next) {
        myService.SaleProjectsCommissionUpdate (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function  SaleProjectsCommissionDelete (req, res, next) {
        myService.SaleProjectsCommissionDelete (req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
     
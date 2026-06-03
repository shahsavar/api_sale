const express = require('express');
const router = express.Router();
const myService = require('./agency.service');
const auth = require('../../_helpers/auth')
const captcha = require('../../_helpers/captcha')
// routes
router.post('/getUserSystem', auth, getUserSystem);
router.post('/getTransferAgency', auth, getTransferAgency);
router.post('/UserAgencySave', auth, UserAgencySave);
router.post('/getTransferAgencyFile', auth, getTransferAgencyFile);
router.post('/getDataFileUserAccessAgency', auth, getDataFileUserAccessAgency);
router.post('/getUserAccessAgency', auth, getUserAccessAgency);
router.post('/checkBilinking', auth, checkBilinking);
router.post('/getAgencyPersonelWithPost', auth, getAgencyPersonelWithPost);
router.post('/getAgency', auth, getAgency);
router.post('/agencyInsert', auth, agencyInsert);
router.post('/agencyUpdate', auth, agencyUpdate);
router.post('/getAgencyUIData', auth, getAgencyUIData);
router.post('/getAgencyHistory', auth, getAgencyHistory);
router.post('/AgencyHistoryInsert', auth, AgencyHistoryInsert);
router.post('/getAgencyPersonel', auth, getAgencyPersonel);
router.post('/AgencyPersonelInsert', auth, AgencyPersonelInsert);
router.post('/AgencyPersonelUpdate', auth, AgencyPersonelUpdate);
router.post('/getAgencyPersonelHistory', auth, getAgencyPersonelHistory);
router.post('/AgencyPersonelHistoryInsert', auth, AgencyPersonelHistoryInsert);
router.post('/getAgencyZemanat', auth, getAgencyZemanat);
router.post('/getPaymentZemanat', auth, getPaymentZemanat);
router.post('/getMahzars', auth, getMahzars);
router.post('/AgencyZemanatSabtInsert', auth, AgencyZemanatSabtInsert);
router.post('/AgencyZemanatSabtUpdate', auth, AgencyZemanatSabtUpdate);
router.post('/agencyZemanatChangeStatus', auth, agencyZemanatChangeStatus);
router.post('/agencyZemanatnameDelete', auth, agencyZemanatnameDelete);
router.post('/getAgencyPersonelSemat', auth, getAgencyPersonelSemat);
router.post('/agencyPersonelSematDelete', auth, agencyPersonelSematDelete);
router.post('/agencyPersonelSematHistoryInsert', auth, agencyPersonelSematHistoryInsert);
router.post('/getAgencyPersonelAmouzesh', auth, getAgencyPersonelAmouzesh);
router.post('/getAgencyPersonelSematHistory', auth, getAgencyPersonelSematHistory);
router.post('/agencyPersonelSematInsert', auth, agencyPersonelSematInsert);
router.post('/agencyPersonelDelete', auth, agencyPersonelDelete);
router.post('/getAgencyPersonelUIData', auth, getAgencyPersonelUIData);
router.post('/getAgencyChartData', auth, getAgencyChartData);

router.post('/getAgencySahebEmza', auth, getAgencySahebEmza );
router.post('/agencySahebEmzaDelete', auth, agencySahebEmzaDelete );
router.post('/agencySahebEmzaInsert', auth, agencySahebEmzaInsert );


module.exports = router;

function getUserSystem(req, res, next) {

    myService.getUserSystem(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}
function getTransferAgency(req, res, next) {

    myService.getTransferAgency(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}
function UserAgencySave(req, res, next) {

    myService.UserAgencySave(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}
function getTransferAgencyFile(req, res, next) {
    myService.getTransferAgencyFile(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getDataFileUserAccessAgency(req, res, next) {
    myService.getDataFileUserAccessAgency(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}
function getUserAccessAgency(req, res, next) {
    myService.getUserAccessAgency(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function checkBilinking(req, res, next) {
    myService.checkBilinking(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getAgencyPersonelWithPost(req, res, next) {
    myService.getAgencyPersonelWithPost(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getAgency(req, res, next) {
    myService.getAgency(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function agencyInsert(req, res, next) {
    myService.agencyInsert(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function agencyUpdate(req, res, next) {
    myService.agencyUpdate(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getAgencyHistory(req, res, next) {
    myService.getAgencyHistory(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function AgencyHistoryInsert(req, res, next) {
    myService.AgencyHistoryInsert(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getAgencyPersonel(req, res, next) {
    myService.getAgencyPersonel(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function AgencyPersonelInsert(req, res, next) {
    myService.AgencyPersonelInsert(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function AgencyPersonelUpdate(req, res, next) {
    myService.AgencyPersonelUpdate(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getAgencyPersonelHistory(req, res, next) {
    myService.getAgencyPersonelHistory(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function AgencyPersonelHistoryInsert(req, res, next) {
    myService.AgencyPersonelHistoryInsert(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getAgencyZemanat(req, res, next) {
    myService.getAgencyZemanat(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getPaymentZemanat(req, res, next) {
    myService.getPaymentZemanat(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getMahzars(req, res, next) {
    myService.getMahzars(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}


function AgencyZemanatSabtInsert(req, res, next) {
    myService.AgencyZemanatSabtInsert(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function AgencyZemanatSabtUpdate(req, res, next) {
    myService.AgencyZemanatSabtUpdate(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}


function agencyZemanatChangeStatus(req, res, next) {
    myService.agencyZemanatChangeStatus(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function agencyZemanatnameDelete(req, res, next) {
    myService.agencyZemanatnameDelete(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getAgencyUIData(req, res, next) {
    myService.getAgencyUIData(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getAgencyPersonelSemat(req, res, next) {
    myService.getAgencyPersonelSemat(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function agencyPersonelDelete(req, res, next) {
    myService.agencyPersonelDelete(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function agencyPersonelSematDelete(req, res, next) {
    myService.agencyPersonelSematDelete(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function agencyPersonelSematInsert(req, res, next) {
    myService.agencyPersonelSematInsert(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getAgencyPersonelSematHistory(req, res, next) {
    myService.getAgencyPersonelSematHistory(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function agencyPersonelSematHistoryInsert(req, res, next) {
    myService.agencyPersonelSematHistoryInsert(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getAgencyPersonelAmouzesh(req, res, next) {
    myService.getAgencyPersonelAmouzesh(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getAgencyPersonelUIData(req, res, next) {
    myService.getAgencyPersonelUIData(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}


function getAgencyChartData(req, res, next) {
    myService.getAgencyChartData(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}


function getAgencySahebEmza(req, res, next) {
    myService.getAgencySahebEmza(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}


function agencySahebEmzaDelete(req, res, next) {
    myService.agencySahebEmzaDelete(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}


function agencySahebEmzaInsert(req, res, next) {
    myService.agencySahebEmzaInsert(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}


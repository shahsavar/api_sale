const express = require('express');
const router = express.Router();
const auth = require('../../_helpers/auth')
const myService = require('./file.service');
//routes
const multer = require('multer');
let upload = multer({ dest: 'download/' })
//بخشنامه
router.post('/getDataImageBK',getDataImageBK)
router.post('/downloadFileBK',downloadFileBK)
router.post('/getBakhshname',getBakhshname)
//---------------------
router.post('/getDataFiles',getDataFiles)
router.post('/getDataFile',getDataFile)

router.post('/getDataFileType',auth,getDataFileType)
router.post('/deleteDataFile',auth,deleteDataFile)
router.post('/okDataFile',auth,okDataFile)
router.post('/archiveDataFile',auth,archiveDataFile)
router.post('/uploadFile', [upload.single('file'),auth],uploadFile)
router.post('/uploadFileOutput', [upload.single('file'),auth],uploadFileOutput)
router.post('/uploadExcelFile', [upload.single('file'),auth],uploadExcelFile)

router.post('/getDataImage',auth,getDataImage)
router.post('/downloadFile',auth,downloadFile)
router.post('/downloadExcelFile',auth,downloadExcelFile)
router.post('/getDataFilesWithParams',auth,getDataFilesWithParams)
//SaleInternet
router.post('/readJsonProjectFile',auth,readJsonProjectFile)
router.post('/writeJsonProjectFile',auth,writeJsonProjectFile)
router.post('/downloadPrintPdfFile',auth,downloadPrintPdfFile)
router.post('/enteghalProjectsData',auth,enteghalProjectsData)
router.post('/dataFileSendLetter', auth, dataFileSendLetter);
router.post('/userAccessAgencyUpdate', auth, userAccessAgencyUpdate);

router.post('/downloadExcelFileTemplateHR',  downloadExcelFileTemplateHR);


module.exports = router;
//SaleInternet
function readJsonProjectFile(req, res, next) {
    myService.readJsonProjectFile(req)
        .then(user => res.json(user))
        .catch(next);
}
function writeJsonProjectFile(req, res, next) {
    myService.writeJsonProjectFile(req)
        .then(user => res.json(user))
        .catch(next);
}
//بخشنامه های فروش
function downloadFileBK(req, res, next) {
    myService.downloadFileBK(req,res,next)
}
function getDataImageBK(req, res, next) {
    myService.getDataImageBK(req,res,next) 
    .then(user => res.json(user))
    .catch(next);
}
function getBakhshname(req, res, next) {
    myService.getBakhshname(req,res,next) 
    .then(user => res.json(user))
    .catch(next);
}
//----------
function getDataFileType(req,res,next){
    myService.getDataFileType(req,res,next)
    .then(user => res.json(user))
    .catch(next);
}
function getDataFiles(req,res,next){
    myService.getDataFiles(req,res,next)
    .then(user => res.json(user))
    .catch(next);
}
function getDataFile(req,res,next){
    myService.getDataFile(req,res,next)
    .then(user => res.json(user))
    .catch(next);
}
function getDataFilesWithParams(req,res,next){
    myService.getDataFilesWithParams(req,res,next)
    .then(user => res.json(user))
    .catch(next);
}
function deleteDataFile(req, res, next) {
    myService.deleteDataFile(req,res,next)
    .then(user => res.json(user))
    .catch(next);
}
function okDataFile(req, res, next) {
    myService.okDataFile(req,res,next)
    .then(user => res.json(user))
    .catch(next);
}
function archiveDataFile(req, res, next) {
    myService.archiveDataFile(req,res,next)
    .then(user => res.json(user))
    .catch(next);
}
function downloadExcelFile(req, res, next) {
    myService.downloadExcelFile(req,res,next)
}

function downloadFile(req, res, next) {
    myService.downloadFile(req,res,next)
}
function getDataImage(req, res, next) {
    myService.getDataImage(req,res,next) 
    .then(user => res.json(user))
    .catch(next);
}

function uploadFile(req, res, next) {
    myService.uploadFile(req,res)
        .then(user => res.json(user))
        .catch(next);
}

function uploadFileOutput(req, res, next) {
    myService.uploadFileOutput(req,res)
        .then(user => res.json(user))
        .catch(next);
}

function uploadExcelFile(req, res, next) {
    myService.uploadExcelFile(req,res)
        .then(user => res.json(user))
        .catch(next);
}


function downloadPrintPdfFile(req, res, next) {
    myService.downloadPrintPdfFile(req,res,next)
}

function enteghalProjectsData(req, res, next) {
    myService.enteghalProjectsData(req)
        .then(user => res.json(user))
        .catch(next);
}

function dataFileSendLetter(req, res, next) {
    myService.dataFileSendLetter(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}
function userAccessAgencyUpdate(req, res, next) {
    myService.userAccessAgencyUpdate(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function downloadExcelFileTemplateHR(req, res, next) {
    myService.downloadExcelFileTemplateHR(req,res,next)
}

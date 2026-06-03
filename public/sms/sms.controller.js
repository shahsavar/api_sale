const express = require('express');
const router = express.Router();
const myService = require('./sms.service');
const auth = require('../../_helpers/auth');
const authorize = require('../../_helpers/authorize');
// routes
router.post('/getInitPaymentSum', auth ,getInitPaymentSum); 
router.post('/sendMessages', auth ,sendMessages); 
router.post('/sendMessagesAll', auth ,sendMessagesAll); 
router.post('/getSMSRespon', auth ,getSMSRespon); 
router.post('/getCustomers', auth, getCustomers); 
router.post('/getCustomerCount', auth, getCustomerCount); 
router.post('/getCustomerUIData', auth, getCustomerUIData); 
router.post('/getAgency', auth, getAgency);  

router.post('/getFactorSanad', auth, getFactorSanad);
router.post('/getSanadMalekiat', auth, getSanadMalekiat);
router.post('/getSanadMalekiatTahvili', auth, getSanadMalekiatTahvili);
router.post('/getPaymentSms', auth, getPaymentSms);
router.post('/getPrsnClassForSms', auth, getPrsnClassForSms);
router.post('/getGroupsAmoozesh', auth, getGroupsAmoozesh);
router.post('/getBazrasiDesc', auth, getBazrasiDesc);
router.post('/getTebKarForSMS', auth, getTebKarForSMS);
router.post('/getPersonel', auth, getPersonel);
router.post('/getMobileConfirm', auth, getMobileConfirm);
router.post('/getMoavenatBarnameRiziList', auth, getMoavenatBarnameRiziList);
router.post('/delMoavenatBarnameRizi', auth, delMoavenatBarnameRizi);
router.post('/saveMoavenatBarnameRizi', auth, saveMoavenatBarnameRizi);
router.post('/updateMoavenatBarnameRizi', auth, updateMoavenatBarnameRizi);
router.post('/getMessageOut', auth, getMessageOut);
router.post('/getRegisterInfo', auth, getRegisterInfo);
router.post('/getRegisterList', auth, getRegisterList);
router.post('/registerEdit', auth, registerEdit);
router.post('/getAgencyCapacityMaster', auth, getAgencyCapacityMaster);
router.post('/AgencyCapacityInit', auth, AgencyCapacityInit);
router.post('/getAgencyCapacity', auth, getAgencyCapacity);
router.post('/AgencyCapacityEdit', auth, AgencyCapacityEdit);
router.post('/getAgencyIntroBank', auth,getAgencyIntroBank)
router.post('/getClientIdTypeUserAccess', auth, getClientIdTypeUserAccess);
router.post('/sendSingeMessage',auth,sendSingeMessage)
router.post('/getSuggestion',auth,getSuggestion)
router.post('/getSuggestionB',auth,getSuggestionB)
router.post('/getCustomerCodeForSMS',auth,getCustomerCodeForSMS)

router.post('/getCustomerMobilForSMS',auth,getCustomerMobilForSMS)

router.post('/getCreditValue',auth,getCreditValue)

router.post('/getPrefactorsForSms',auth,getPrefactorsForSms)


router.post('/getSuggestionDefect',auth,getSuggestionDefect)
router.post('/getSuggestionDefectUIData',auth,getSuggestionDefectUIData)
router.post('/SuggestionDefectSave',auth,SuggestionDefectSave)
router.post('/SuggestionDefectUpdate',auth,SuggestionDefectUpdate)
router.post('/SuggestionDefectDelete',auth,SuggestionDefectDelete)
router.post('/getSuggestionDetail',auth,getSuggestionDetail)
router.post('/suggestionAction',auth,suggestionAction)
router.post('/getCartableInfo',auth,getCartableInfo)
router.post('/getCartableInfoList',auth,getCartableInfoList)
router.post('/getCartableInfoListAll',auth,getCartableInfoListAll)
router.post('/addCartableInfo',auth,addCartableInfo)
router.post('/deleteCartableInfo',auth,deleteCartableInfo)
router.post('/getAgencyResponsReport',getAgencyResponsReport)
router.post('/getInternetResponsDayWithTotalCount',getInternetResponsDayWithTotalCount)
router.post('/getIntPaymentlogReport',getIntPaymentlogReport)
router.post('/getIntPaymentlogReportGroup',getIntPaymentlogReportGroup)

router.post('/updateSuggestionDefectValue',auth,updateSuggestionDefectValue)


//---کارتابل نمایندگی
router.post('/getAgencyRemind',auth,getAgencyRemind)
router.post('/getAgencyRemindCartable',auth,getAgencyRemindCartable)
router.post('/getResponCartable',auth,getResponCartable)
router.post('/getFactorCartable',auth,getFactorCartable)
router.post('/getAgencyTransfer',auth,getAgencyTransfer)
router.post('/getProjects',auth,getProjects)
router.post('/getSaleProjectColor',auth,getSaleProjectColor)
router.post('/getSaleProjectUsage',auth,getSaleProjectUsage)
router.post('/getColorWithModel',auth,getColorWithModel)
router.post('/getUsageWithModel',auth,getUsageWithModel)
router.post('/addBaseColorWithModel',auth,addBaseColorWithModel)
router.post('/addBaseUsageWithModel',auth,addBaseUsageWithModel)
router.post('/deleteBaseColorWithModel',auth,deleteBaseColorWithModel)
router.post('/deleteBaseUsageWithModel',auth,deleteBaseUsageWithModel)
router.post('/getMsgCount',auth,getMsgCount)
router.post('/getJarimeCalculateList',auth,getJarimeCalculateList)
router.post('/saveMessageContent',auth,saveMessageContent)
router.post('/getMessageContent',auth,getMessageContent)
router.post('/getMessageContentAll',auth,getMessageContentAll)
router.post('/deleteMessageContent',auth,deleteMessageContent)
router.post('/getSendMessages',auth,getSendMessages)
router.post('/getSAPCustomerHaghighi_New', getSAPCustomerHaghighi_New);
router.post('/sendMessageAPI',sendMessageAPI)
router.get('/getVamcoTolidData',getVamcoTolidData)
router.get('/getCharkheshgarTolidData',getCharkheshgarTolidData)

//پارامترهای پیامک
router.post('/getMessageType',auth,getMessageType)
router.post('/getMessageContentParam',auth,getMessageContentParam)
router.post('/getMessageContentParamDetail',auth,getMessageContentParamDetail)

router.post('/messageContentParamInsert',auth,messageContentParamInsert)
router.post('/messageContentParamDelete',auth,messageContentParamDelete)
router.post('/MessageContentParamUpdate',auth,MessageContentParamUpdate)

router.post('/getAgencyCapacityControl',auth,getAgencyCapacityControl)


router.post('/messageContentParamDetailInsert',auth,messageContentParamDetailInsert)
router.post('/messageContentParamDetailDelete',auth,messageContentParamDetailDelete)
router.post('/messageContentParamDetailUpdate',auth,messageContentParamDetailUpdate)
router.post('/updateDueDeliverProg',auth,updateDueDeliverProg)
router.post('/deleteDueDeliverProg',auth,deleteDueDeliverProg)

router.post('/getNotTransfer',auth,getNotTransfer)
router.post('/initCartable',auth,initCartable)

router.post('/createSuggestion',auth,createSuggestion)
router.post('/getSuggestionUIData',auth,getSuggestionUIData)


module.exports = router;
//----------------------
function addCartableInfo(req, res, next) {
    myService.addCartableInfo(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function deleteCartableInfo(req, res, next) {
    myService.deleteCartableInfo(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function getCartableInfoListAll(req, res, next) {
    myService.getCartableInfoListAll(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function getCartableInfoList(req, res, next) {
    myService.getCartableInfoList(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function getCartableInfo(req, res, next) {
    myService.getCartableInfo(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function sendSingeMessage(req, res, next) {
    myService.sendSingeMessage(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}

function getInitPaymentSum(req, res, next) {
    myService.getInitPaymentSum(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
    
function sendMessages(req, res, next) {
    myService.sendMessages(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function sendMessagesAll(req, res, next) {
    myService.sendMessagesAllFormDB(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function getSMSRespon(req, res, next) {
    myService.getSMSRespon(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}

function getCreditValue(req, res, next) {
    myService.getCreditValue(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}


function getCustomers(req, res, next) {
    myService.getCustomers(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function getCustomerCount(req, res, next) {
    myService.getCustomerCount(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}
function getCustomerUIData(req, res, next) {
    myService.getCustomerUIData(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function getAgency(req, res, next) {
    myService.getAgency(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function getAgencyTransfer(req, res, next) {
    myService.getAgencyTransfer(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}
function getFactorSanad(req, res, next) {
    myService.getFactorSanad(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function getSanadMalekiat(req, res, next) {
    myService.getSanadMalekiat(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function getSanadMalekiatTahvili(req, res, next) {
    myService.getSanadMalekiatTahvili(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function getPaymentSms(req, res, next) {
    myService.getPaymentSms(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function getPrsnClassForSms(req, res, next) {
    myService.getPrsnClassForSms(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function getGroupsAmoozesh(req, res, next) {
    myService.getGroupsAmoozesh(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function getBazrasiDesc(req, res, next) {
    myService.getBazrasiDesc(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function getTebKarForSMS(req, res, next) {
    myService.getTebKarForSMS(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function getPersonel(req, res, next) {
    myService.getPersonel(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function getMobileConfirm(req, res, next) {
    myService.getMobileConfirm(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function getMoavenatBarnameRiziList(req, res, next) {
    myService.getMoavenatBarnameRiziList(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function getMessageOut(req, res, next) {
    myService.getMessageOut(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function AgencyCapacityInit(req, res, next) {
    myService.AgencyCapacityInit(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function AgencyCapacityEdit(req, res, next) {
    myService.AgencyCapacityEdit(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function getAgencyCapacityMaster(req, res, next) {
    myService.getAgencyCapacityMaster(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}
function getAgencyCapacity(req, res, next) {
    myService.getAgencyCapacity(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}
function getClientIdTypeUserAccess(req, res, next) {
    myService.getClientIdTypeUserAccess(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function getAgencyRemind(req, res, next) {
    myService.getAgencyRemind(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function getSuggestion(req, res, next) {
    
    myService.getSuggestion(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function getSuggestionB(req, res, next) {
    
    myService.getSuggestionB(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function getCustomerCodeForSMS(req, res, next) {
    
    myService.getCustomerCodeForSMS(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function getCustomerMobilForSMS(req, res, next) {
    
    myService.getCustomerMobilForSMS(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}


function getSuggestionDefect(req, res, next) {
    myService.getSuggestionDefect(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}
function SuggestionDefectSave(req, res, next) {
    
    myService.SuggestionDefectSave(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}
function SuggestionDefectUpdate(req, res, next) {
    
    myService.SuggestionDefectUpdate(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}
function getSuggestionDefectUIData(req, res, next) {
    myService.getSuggestionDefectUIData(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}
function SuggestionDefectDelete(req, res, next) {
    
    myService.SuggestionDefectDelete(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function updateSuggestionDefectValue(req, res, next) {
    
    myService.updateSuggestionDefectValue(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}


function getSuggestionDetail(req, res, next) {
    
    myService.getSuggestionDetail(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function suggestionAction(req, res, next) {
    myService.suggestionAction(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function delMoavenatBarnameRizi(req, res, next) {
    myService.delMoavenatBarnameRizi(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function saveMoavenatBarnameRizi(req, res, next) {
    myService.saveMoavenatBarnameRizi(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function updateMoavenatBarnameRizi(req, res, next) {
    myService.updateMoavenatBarnameRizi(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}
    
   
function getAgencyResponsReport(req, res, next) {
    myService.getAgencyResponsReport(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}
function getInternetResponsDayWithTotalCount(req, res, next) {
    myService.getInternetResponsDayWithTotalCount(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}
function getIntPaymentlogReport(req, res, next) {
    myService.getIntPaymentlogReport(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function getIntPaymentlogReportGroup(req, res, next) {
    myService.getIntPaymentlogReportGroup(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}
//---کارتابل نمایندگی
function getAgencyIntroBank(req, res, next) {
    
    myService.getAgencyIntroBank(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function getAgencyRemindCartable(req, res, next) {
    myService.getAgencyRemindCartable(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function getResponCartable(req, res, next) {
    myService.getResponCartable(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}
function getFactorCartable(req, res, next) {
    myService.getFactorCartable(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}
function getRegisterInfo(req, res, next) {
    myService.getRegisterInfo(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}
function getRegisterList(req, res, next) {
    myService.getRegisterList(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function registerEdit(req, res, next) {
    myService.registerEdit(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}
function getProjects(req, res, next) {
    myService.getProjects(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}
function getSaleProjectColor(req, res, next) {
    myService.getSaleProjectColor(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}
function getSaleProjectUsage(req, res, next) {
    myService.getSaleProjectUsage(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function getColorWithModel(req, res, next) {
    myService.getColorWithModel(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function getUsageWithModel(req, res, next) {
    myService.getUsageWithModel(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}
function addBaseColorWithModel(req, res, next) {
    myService.addBaseColorWithModel(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function addBaseUsageWithModel(req, res, next) {
    myService.addBaseUsageWithModel(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function deleteBaseColorWithModel(req, res, next) {
    myService.deleteBaseColorWithModel(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function deleteBaseUsageWithModel(req, res, next) {
    myService.deleteBaseUsageWithModel(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function getMsgCount(req, res, next) {
    myService.getMsgCount(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}

function getJarimeCalculateList(req, res, next) {
    myService.getJarimeCalculateList(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function saveMessageContent(req, res, next) {
    myService.saveMessageContent(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}

function getMessageContent(req, res, next) {
    myService.getMessageContent(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}

function getMessageContentAll(req, res, next) {
    myService.getMessageContentAll(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}

function deleteMessageContent(req, res, next) {
    myService.deleteMessageContent(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function getSendMessages(req, res, next) {
    myService.getSendMessages(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function sendMessageAPI(req, res, next) {
    myService.sendMessageAPI(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}


///دریافت دیتا از سرویس های شرکت ومکو و چرخشگر...........
function getVamcoTolidData(req, res, next) {
    myService.getVamcoTolidData(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getCharkheshgarTolidData(req, res, next) {
    myService.getCharkheshgarTolidData(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

///.........................................................

function getSAPCustomerHaghighi_New(req, res, next) {
    myService.getSAPCustomerHaghighi_New(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getMessageType(req, res, next) {
    myService.getMessageType(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}


function getMessageContentParam(req, res, next) {
    myService.getMessageContentParam(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getMessageContentParamDetail(req, res, next) {
    myService.getMessageContentParamDetail(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}


function messageContentParamInsert(req, res, next) {
    myService.messageContentParamInsert(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function messageContentParamDelete(req, res, next) {
    myService.messageContentParamDelete(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function MessageContentParamUpdate(req, res, next) {
    myService.MessageContentParamUpdate(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function messageContentParamDetailInsert(req, res, next) {
    myService.messageContentParamDetailInsert(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}


function messageContentParamDetailDelete(req, res, next) {
    myService.messageContentParamDetailDelete(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}


function messageContentParamDetailUpdate(req, res, next) {
    myService.messageContentParamDetailUpdate(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}


function updateDueDeliverProg(req, res, next) {
    myService.updateDueDeliverProg(req,res)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function deleteDueDeliverProg(req, res, next) {
    myService.deleteDueDeliverProg(req,res)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getNotTransfer(req, res, next) {
    myService.getNotTransfer(req,res)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function initCartable(req, res, next) {
    myService.initCartable(req,res)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getPrefactorsForSms(req, res, next) {
    myService.getPrefactorsForSms(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}


function getAgencyCapacityControl(req, res, next) {
    myService.getAgencyCapacityControl(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}


function createSuggestion(req, res, next) {
    myService.createSuggestion(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getSuggestionUIData(req, res, next) {
    myService.getSuggestionUIData(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}








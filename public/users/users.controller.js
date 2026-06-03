const express = require('express');
const router = express.Router();
const userService = require('./users.service');
const auth = require('../../_helpers/auth')
const authorize = require('../../_helpers/authorize')
const today = require('../../_helpers/today')
const captcha = require('../../_helpers/captcha')
// routes
//Users

router.post('/readSystemCode',authorize,readSystemCode)

router.post('/readAspNetPermissionsMenuTree',auth,readAspNetPermissionsMenuTree)
router.post('/saveAspNetPermission',auth,saveAspNetPermission)
router.post('/deleteAspNetPermission',auth,deleteAspNetPermission)

router.post('/readAspNetPermissionSqlParams',auth,readAspNetPermissionSqlParams)
router.post('/saveAspNetPermissionSqlParams',auth,saveAspNetPermissionSqlParams)
router.post('/deleteAspNetPermissionSqlParams',auth,deleteAspNetPermissionSqlParams)


router.post('/readAspNetUserPermissionSqlParams',auth,readAspNetUserPermissionSqlParams)
router.post('/saveAspNetUserPermissionSqlParams',auth,saveAspNetUserPermissionSqlParams)
router.post('/deleteAspNetUserPermissionSqlParams',auth,deleteAspNetUserPermissionSqlParams)

router.post('/readAspNetOperations',auth,readAspNetOperations)

router.post('/readPersonel',authorize,readPersonel)
router.post('/readUsers',authorize,readUsers)
router.post('/saveUsers',authorize,saveUsers)
router.post('/deleteUsers',authorize,deleteUsers)
router.post('/readUserPermissions',authorize,readUserPermissions)
router.post('/saveUserPermissions',authorize,saveUserPermissions)
router.post('/saveAspNetUserFilter',auth,saveAspNetUserFilter)

router.post('/setAspNetUserPassword',authorize,setAspNetUserPassword)
//---------
router.post('/callStoreWithTableParams',callStoreWithTableParams)
router.post('/authenticate', authenticate);
router.post('/changePassword', auth ,changePassword); 
router.post('/sendSmsForgotPassword', sendSmsForgotPassword);
router.post('/recoverPassword', recoverPassword); 
router.post('/optionPermission', auth ,optionPermission); 
router.post('/aspNetReadSystemCode',auth,  aspNetReadSystemCode);
// router.post('/readPermissions',auth,  readPermissions);

//roles
router.post('/readRoles',authorize ,  readRoles);
router.post('/saveRoles',auth,  saveRoles);
router.post('/deleteRoles',auth,  deleteRoles);
router.post('/readUsersRole',auth,  readUsersRole);
router.post('/readUsersNotInRole',auth,  readUsersNotInRole);
router.post('/readRolePermissions',auth,  readRolePermissions);
router.post('/saveRolePermissions',auth,  saveRolePermissions);
router.post('/addUserRole',auth,  addUserRole);
router.post('/deleteUserRole',auth,  deleteUserRole);


router.post('/readAspNetUserPermission',auth,  readAspNetUserPermission);
router.post('/deleteAspNetUserPermission',auth,  deleteAspNetUserPermission);

//router.get('/getDate', today ,getDate);
router.get('/getDate', getDate);
router.post('/readDate', readDate);
router.post('/getCaptchaData',getCaptchaData)
router.post('/recoverPasswordAngular',recoverPasswordAngular)
router.post('/getCaptchaDataLogin',  getCaptchaDataLogin);
//
router.post('/readTCode', auth, readTCode);
router.post('/readSearchTCode', auth, readSearchTCode);
router.post('/readUrlTCode',auth,readUrlTCode)

router.post('/readAccessPermissions',auth,readAccessPermissions)
router.post('/saveAccessPermissions',auth,saveAccessPermissions)
//OldSystem
router.post('/readOldSystemPass',auth,readOldSystemPass)
router.post('/saveOldSystemPass',auth,saveOldSystemPass)
router.post('/readUserPermissionsOld',auth,readUserPermissionsOld)
router.post('/readAspNetUserPermissionOld',auth,readAspNetUserPermissionOld)
router.post('/deleteAspNetUserPermissionOld',auth,deleteAspNetUserPermissionOld)
router.post('/saveUserPermissionsOld',auth,saveUserPermissionsOld)
router.post('/getAspNetUserPermissionAll',auth,  getAspNetUserPermissionAll);
router.post('/getAspNetUserPermissionLog',auth,  getAspNetUserPermissionLog);
router.post('/getUserAccess',auth,  getUserAccess);
router.post('/getAspNetUserAccessPermission',auth,  getAspNetUserAccessPermission);
router.post('/CreateSameUserInOldSystem',auth,CreateSameUserInOldSystem)
router.post('/CreateNewUserInOldSystem',auth,CreateNewUserInOldSystem)
router.post('/getSystemOld',auth,getSystemOld)
router.post('/getControlSystemOld',auth,getControlSystemOld)
router.post('/delControlSystemOld',auth,delControlSystemOld)
router.post('/saveControlSystemOld',auth,saveControlSystemOld)
router.post('/UpdateAccessFilterOldSystem',auth,UpdateAccessFilterOldSystem)

//new Menu
router.post('/getAspNetUsers',auth,getAspNetUsers)
router.post('/getNavigation',auth,getNavigation)
router.post('/getRouters',auth,getRouters)
router.post('/favoriteMenus',auth,favoriteMenus)
router.post('/getFavoriteMenueList',auth,getFavoriteMenueList)


module.exports = router;
//---------------------
//users
function readSystemCode(req, res, next) {
    userService.readSystemCode(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function getSystemOld(req, res, next) {
    userService.getSystemOld(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function getControlSystemOld(req, res, next) {
    userService.getControlSystemOld(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function delControlSystemOld(req, res, next) {
    userService.delControlSystemOld(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function saveControlSystemOld(req, res, next) {
    userService.saveControlSystemOld(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function UpdateAccessFilterOldSystem(req, res, next) {
    userService.UpdateAccessFilterOldSystem(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function CreateNewUserInOldSystem(req, res, next) {
    userService.CreateNewUserInOldSystem(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function CreateSameUserInOldSystem(req, res, next) {
    userService.CreateSameUserInOldSystem(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function readAspNetPermissionsMenuTree(req, res, next) {
    userService.readAspNetPermissionsMenuTree(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}


function saveAspNetPermission(req, res, next) {
    userService.saveAspNetPermission(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function deleteAspNetPermission(req, res, next) {
    userService.deleteAspNetPermission(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}


function readAspNetPermissionSqlParams(req, res, next) {
    userService.readAspNetPermissionSqlParams(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function saveAspNetPermissionSqlParams(req, res, next) {
    userService.saveAspNetPermissionSqlParams(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}
function deleteAspNetPermissionSqlParams(req, res, next) {
    userService.deleteAspNetPermissionSqlParams(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function readAspNetUserPermissionSqlParams(req, res, next) {
    userService.readAspNetUserPermissionSqlParams(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function saveAspNetUserPermissionSqlParams(req, res, next) {
    userService.saveAspNetUserPermissionSqlParams(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}
function deleteAspNetUserPermissionSqlParams(req, res, next) {
    userService.deleteAspNetUserPermissionSqlParams(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}


function readAspNetOperations(req, res, next) {
    userService.readAspNetOperations(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}
function readPersonel(req, res, next) {
    userService.readPersonel(req)
        .then(user => res.json(user))
        .catch(next);
}
function readUsers(req, res, next) {
    userService.readUsers(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}
function saveUsers(req, res, next) {
    userService.saveUsers(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}
    
function deleteUsers(req, res, next) {
    userService.recoverPasswordAngular(req,res.next)
    .deleteUsers(req)
    .then(user => res.json(user))
    .catch(err => next(err));
}
function setAspNetUserPassword(req, res, next) {
    userService.setAspNetUserPassword(req)
        .then(user => res.json(user))
        .catch(next);
}
function saveUserPermissions(req, res, next) {
    userService.saveUserPermissions(req)
        .then(user => res.json(user))
        .catch(next);
}

function saveAspNetUserFilter(req, res, next) {
    userService.saveAspNetUserFilter(req)
        .then(user => res.json(user))
        .catch(next);
}

function readUserPermissions(req, res, next) {
    userService.readUserPermissions(req)
        .then(user => res.json(user))
        .catch(next);
}
//-------------------
function recoverPasswordAngular(req,res,next){
    userService.recoverPasswordAngular(req,res.next)
    .then(data => res.json(data))
    .catch(err => next(err));
}
function callStoreWithTableParams(req, res, next) {
    userService.callStoreWithTableParams(req)
        .then(user => res.json(user))
        .catch(next);
}
function getDate(req, res, next) {
    userService.getDate(req)
        .then(user => res.json(user))
        .catch(next);
}
function readDate(req, res, next) {
    userService.readDate(req)
        .then(user => res.json(user))
        .catch(next);
}
function getCaptchaData(req,res,next){
    userService.getCaptchaData(req)
    .then(user => res.json(user))
    .catch(next);
}
function optionPermission(req, res, next) {
    userService.optionPermission(req,res)
        .then(user => res.json(user))
        .catch(next);
}
function authenticate(req, res, next) {
    userService.authenticate(req,res)
        .then(user => res.json(user))
        .catch(next);
}

function isHuman(req, res, next) {
    userService.isHuman(req,res)
        .then(user => res.json(user))
        .catch(next);
}
function sendSmsForgotPassword(req, res, next) {
    userService.sendSmsForgotPassword(req.body)
        .then(user => res.json(user))
        .catch(next);
}


function recoverPassword(req, res, next) {
    userService.recoverPassword(req,res)
    .then(user => res.json(user))
    .catch(next);
}
function changePassword(req, res, next) {
    userService.changePassword(req)
        .then(user => res.json(user))
        .catch(next);
}

function getCaptchaDataLogin(req, res, next) {
    userService.getCaptchaDataLogin(req)
        .then(user => res.json(user))
        .catch(next);
}
function aspNetReadSystemCode(req, res, next) {
    userService.aspNetReadSystemCode(req)
        .then(user => res.json(user))
        .catch(next);
}

// function readPermissions(req, res, next) {
//     userService.readPermissions(req)
//         .then(user => res.json(user))
//         .catch(next);
// }
//roles
function readRoles(req, res, next) {
    userService.readRoles(req)
        .then(user => res.json(user))
        .catch(next);
}
function saveRoles(req, res, next) {
    userService.saveRoles(req)
        .then(user => res.json(user))
        .catch(next);
}
function deleteRoles(req, res, next) {
    userService.deleteRoles(req)
        .then(user => res.json(user))
        .catch(next);
}

function readUsersRole(req, res, next) {
    userService.readUsersRole(req)
        .then(user => res.json(user))
        .catch(next);
}

function readUsersNotInRole(req, res, next) {
    userService.readUsersNotInRole(req)
        .then(user => res.json(user))
        .catch(next);
}

function readRolePermissions(req, res, next) {
    userService.readRolePermissions(req)
        .then(user => res.json(user))
        .catch(next);
}

function saveRolePermissions(req, res, next) {
    userService.saveRolePermissions(req)
        .then(user => res.json(user))
        .catch(next);
}

function addUserRole(req, res, next) {
    userService.addUserRole(req)
        .then(user => res.json(user))
        .catch(next);
}
function deleteUserRole(req, res, next) {
    userService.deleteUserRole(req)
        .then(user => res.json(user))
        .catch(next);
}


function readAspNetUserPermission(req, res, next) {
    userService.readAspNetUserPermission(req)
        .then(user => res.json(user))
        .catch(next);
}

function getAspNetUserPermissionAll(req, res, next) {
    userService.getAspNetUserPermissionAll(req)
        .then(user => res.json(user))
        .catch(next);
}

function getAspNetUserPermissionLog(req, res, next) {
    userService.getAspNetUserPermissionLog(req)
        .then(user => res.json(user))
        .catch(next);
}

function getUserAccess(req, res, next) {
    userService.getUserAccess(req)
        .then(user => res.json(user))
        .catch(next);
}

function getAspNetUserAccessPermission(req, res, next) {
    userService.getAspNetUserAccessPermission(req)
        .then(user => res.json(user))
        .catch(next);
}

function deleteAspNetUserPermission(req, res, next) {
    userService.deleteAspNetUserPermission(req)
        .then(user => res.json(user))
        .catch(next);
}

function readTCode(req, res, next) {
    userService.readTCode(req)
        .then(user => res.json(user))
        .catch(next);
}

function readSearchTCode(req, res, next) {
    userService.readSearchTCode(req)
        .then(user => res.json(user))
        .catch(next);
}


function readUrlTCode(req, res, next) {
    userService.readUrlTCode(req)
        .then(user => res.json(user))
        .catch(next);
}

function readAccessPermissions(req, res, next) {
    userService.readAccessPermissions(req)
        .then(user => res.json(user))
        .catch(next);
}
function saveAccessPermissions(req, res, next) {
    userService.saveAccessPermissions(req)
        .then(user => res.json(user))
        .catch(next);
}


function readOldSystemPass(req, res, next) {
    userService.readOldSystemPass(req)
        .then(user => res.json(user))
        .catch(next);
}

function saveOldSystemPass(req, res, next) {
    userService.saveOldSystemPass(req)
        .then(user => res.json(user))
        .catch(next);
}


function readUserPermissionsOld(req, res, next) {
    userService.readUserPermissionsOld(req)
        .then(user => res.json(user))
        .catch(next);
}
function readAspNetUserPermissionOld(req, res, next) {
    userService.readAspNetUserPermissionOld(req)
        .then(user => res.json(user))
        .catch(next);
}

function deleteAspNetUserPermissionOld(req, res, next) {
    userService.deleteAspNetUserPermissionOld(req)
        .then(user => res.json(user))
        .catch(next);
}


function saveUserPermissionsOld(req, res, next) {
    userService.saveUserPermissionsOld(req)
        .then(user => res.json(user))
        .catch(next);
}

function getAspNetUsers(req, res, next) {
    userService.getAspNetUsers(req)
        .then(user => res.json(user))
        .catch(next);
}

function getNavigation(req, res, next) {
    userService.getNavigation(req)
        .then(user => res.json(user))
        .catch(next);
}
function getRouters(req, res, next) {
    userService.getRouters(req)
        .then(data => res.json(data))
        .catch(next);
}
function favoriteMenus(req, res, next) {
    userService.favoriteMenus(req)
        .then(data => res.json(data))
        .catch(next);
}
function getFavoriteMenueList(req, res, next) {
    userService.getFavoriteMenueList(req)
        .then(data => res.json(data))
        .catch(next);
}

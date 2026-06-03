const config = require("../../config.json");
const jwt = require("jsonwebtoken");
const sql = require("mssql");
const pools = require("../../_helpers/pool-manegment");
const { SqlCommandCreator } = require("../../_helpers/SqlCommandCreator");
const { getPersianDate } = require("../../_helpers/persian.calender");
const axios = require("axios");
const cryptoService = require("../crypto/crypto.service");
const {sendMessage} = require("../../_helpers/sendMessage");
const xlsx = require("xlsx"); //npm install xlsx
var svgCaptcha = require('svg-captcha');

module.exports = {
  //users
  readSystemCode,
  readAspNetPermissionsMenuTree,
  saveAspNetPermission,
  deleteAspNetPermission,

  readAspNetPermissionSqlParams,
  saveAspNetPermissionSqlParams,
  deleteAspNetPermissionSqlParams,

  readAspNetUserPermissionSqlParams,
  saveAspNetUserPermissionSqlParams,
  deleteAspNetUserPermissionSqlParams,
  readAspNetUserPermission,
  deleteAspNetUserPermission,
  
  readAspNetOperations,
  //---------
  callStoreWithTableParams,
  getDate,
  readDate,
  getCaptchaData,
  recoverPasswordAngular,
  optionPermission,

  authenticate,
  sendSmsForgotPassword,
  recoverPassword,
  changePassword,
  getCaptchaDataLogin,
  aspNetReadSystemCode,
  // users
  setAspNetUserPassword,
  readUsers,
  readPersonel,
  saveUsers,
  deleteUsers,
  readUserPermissions,
  saveUserPermissions,
  saveAspNetUserFilter,
  //roles
  readRoles,
  saveRoles,
  deleteRoles,
  readUsersRole,
  readUsersNotInRole,
  readRolePermissions,
  saveRolePermissions,
  addUserRole,
  deleteUserRole,
  //--
  readTCode,
  readSearchTCode,
  readUrlTCode,
  readAccessPermissions,
  saveAccessPermissions,
  //OldSystem
  readOldSystemPass,
  saveOldSystemPass,
  readUserPermissionsOld,
  getAspNetUserPermissionAll,
  readAspNetUserPermissionOld,
  deleteAspNetUserPermissionOld,
  saveUserPermissionsOld,
  getAspNetUserPermissionLog,
  getAspNetUserAccessPermission,
  getUserAccess,
  CreateSameUserInOldSystem,
  CreateNewUserInOldSystem,
  getSystemOld,
  getControlSystemOld,
  saveControlSystemOld,
  delControlSystemOld,
  UpdateAccessFilterOldSystem,

  //New Menu
  getAspNetUsers,
  getNavigation,
  getRouters,
  favoriteMenus,
  getFavoriteMenueList,

};

async function getCaptchaData(req) {
  try {
    let userName = req.privateData.UserLogin;
    var captcha = svgCaptcha.create({
      size: 5,
      noise: 3,
      color: false,
      ignoreChars: "0oil1LOI",
    });

    const pool = await pools.getPool();
    let result = await pool
      .request()
      .input("nationalCode", sql.VarChar(15), userName)
      .input("idIntPayment", sql.Int, req.body.orderNo)
      .input("captchaText", sql.VarChar(5), captcha.text)
      .output("msgRet", sql.NVarChar(500))
      .execute("dbo.uspCaptchaTextAdd");

    if (result.output.msgRet === "")
      return { statusResult: 0, capchaData: captcha.data };
    else return { statusResult: 1, message: result.output.msgRet };
  } catch (err) {
    return { statusResult: 2, message: "خطا" };
  }
}

function encryptPass(text) {
  var crypto = require("crypto");
  var alg = "des-ede-cbc";
  var key = new Buffer.from("{BAF48E76-417F-4", "utf-8");
  var iv = new Buffer.from("QUJDREVGR0g=", "base64");
  var cipher = crypto.createCipheriv(alg, key, iv);
  var encoded = cipher.update(text, "ascii", "base64");
  encoded += cipher.final("base64");
  return encoded;
}

async function getDate(req) {
  try {
    return {
      statusResult: 0,
      message: "خواندن موفق",
      today: getPersianDate(),
      //today:req.today,
    };
  } catch (err) {
    return { statusResult: 2, message: "خطا" };
  }
}
async function readDate(req) {
  try {
    return {
      statusResult: 0,
      message: `خواندن موفق req.body: ${req.body}`,
      today: getPersianDate(),
      //today:req.today,
    };
  } catch (err) {
    return { statusResult: 2, message: "خطا" };
  }
}
async function callStoreWithTableParams(req) {
  try {
    var tvp = new sql.Table("MyTableType");
    tvp.columns.add("id", sql.VarChar(50), { nullable: false });
    req.body.leftList.map((r) => {
      tvp.rows.add(r.id);
    });
    // tvp.rows.add('1');
    const pool = await pools.getPool();
    let result = await pool
      .request()
      .input("inputTable", sql.TVP("MyTableType"), tvp)
      .execute("[UsersDB].[dbo].[uspTestTableParams]");

    return {
      statusResult: 0,
      rows: result.recordset,
      message: "Ok",
    };
  } catch (err) {
    return { statusResult: 2, message: err.message };
  }
}
async function optionPermission(req, res) {
  try {
    const { permissionName } = req.body;
    let obj = req.privateData;
    let userName = obj.UserLogin;
    const pool = await pools.getPool();
    let result = await pool
      .request()
      .input("userName", sql.VarChar(150), userName)
      .input("permissionName", sql.VarChar(150), permissionName)
      .output("msgRet", sql.NVarChar(500))
      .execute("UsersDB.dbo.uspAspNetReadUserPermissionOptions");

    return {
      statusResult: 0,
      rows: result.recordset,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function recoverPasswordAngular(req) {
  try {
    const { systemCode, userName, password } = req.body;
    var pass = encryptPass(password);
    const pool = await pools.getPool();
    let result = await pool
      .request()
      .input("systemCode", sql.VarChar(20), systemCode)
      .input("userName", sql.VarChar(20), userName)
      .input("password", sql.VarChar(128), pass)
      .execute("UsersDB.dbo.uspAspNetRecoverPasswordAngular");
    return {
      statusResult: 0,
      message: "تغییر رمز با موفقیت انجام شد",
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
//-------------User Service-----------

async function recoverPassword(req, res) {
  try {
    const { systemCode, userName, password, smsKey } = req.body;
    if (systemCode != "hr") {
      var pass = encryptPass(password);
      const pool = await pools.getPool();
      let result1 = await pool
        .request()
        .input("systemCode", sql.VarChar(50), systemCode)
        .input("nationalCode", sql.VarChar(20), userName)
        .input("password", sql.NVarChar(128), pass)
        .input("smsKey", sql.VarChar(10), smsKey)
        .output("msgRet", sql.NVarChar(500))
        .execute("UsersDB.dbo.uspAspNetRecoverPassword");

      if (result1.output.msgRet != "") {
        return {
          statusResult: 1,
          message: result1.output.msgRet,
        };
      }
      return {
        statusResult: 0,
        message: "تغییر رمز با موفقیت انجام شد",
      };
    } else {
      var pass = encryptPass(password);

      const poolHR = await pools.getPool("HR");
      let result = await poolHR
        .request()
        .input("appId", sql.Int, 62)
        .input("nationalCode", sql.VarChar(10), userName)
        .input("password", sql.VarChar(100), pass)
        .input("smsKey", sql.VarChar(10), smsKey)
        .output("msgRet", sql.VarChar(500))
        .execute("SecurityDB.dbo.uspAspNetRecoverPassword");
      if (result.output.msgRet != "") {
        return {
          statusResult: 1,
          message: result.output.msgRet,
        };
      }
      return {
        statusResult: 0,
        message: "تغییر رمز با موفقیت انجام شد",
      };
    }
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

async function sendSmsForgotPassword(req) {
  try {
    const { systemCode, userName }=req
    if (systemCode != "hr") {
      const pool = await pools.getPool();
      let result = await pool
        .request()
        .input("systemCode", sql.VarChar(50), systemCode)
        .input("nationalCode", sql.VarChar(50), userName)
        .execute("UsersDB.dbo.uspAspNetGetForgotPasswordInfo");

      const user = result.recordset[0];

      if (!user || user === "undefined" || user == "") {
        return {
          statusResult: 1,
          message: "کاربری با این مشخصات یافت نشد",
        };
      }
      let smsErsali = Math.floor(Math.random() * 90000) + 10000;
      let message = "کد تایید فراموشی رمز شرکت ایران خودرو دیزل : " + smsErsali;
     
      let sendResult=await sendMessage(user.Mobile, message,req.privateData?.UserLogin,'30',30);
        if(sendResult.statusResult!=0){
            return sendResult
        }
      
      await pool
        .request()
        .input("Mobile", sql.VarChar(15), user.Mobile)
        .input("SmsErsali", sql.VarChar(50), smsErsali)
        .input("typeName", sql.VarChar(30), "ForgotPassword")
        .execute("UsersDB.dbo.uspAspNetSmsLog");

      return {
        statusResult: 0,
        message: "ارسال موفق",
        mobile: user.Mobile,
      };
    } else {
      const pool = await pools.getPool("HR");
      let result = await pool
        .request()
        .input("nationalCode", sql.VarChar(10), userName)
        .output("mobile", sql.VarChar(15))
        .execute("SecurityDB.dbo.uspAspNetGetMobileNumber");
      const mobile = result.output.mobile;
      if (!mobile || mobile.toString().length != 11) {
        return {
          statusResult: 1,
          message: "کاربری با این مشخصات یافت نشد",
        };
      }
      let smsErsali = Math.floor(Math.random() * 90000) + 10000;
      let message = "کد تایید فراموشی رمز شرکت ایران خودرو دیزل : " + smsErsali;
      
      let sendResult=await sendMessage(mobile, message,req.privateData?.UserLogin,44,44);
        if(sendResult.statusResult!=0){
            return sendResult
        }
      
      await pool
        .request()
        .input("mobile", sql.VarChar(15), mobile)
        .input("smsErsali", sql.VarChar(50), smsErsali)
        .input("typeName", sql.VarChar(30), "ForgotPassword")
        .execute("SecurityDB.dbo.uspAspNetSmsLog");
      return {
        statusResult: 0,
        message: "ارسال موفق",
        mobile: mobile,
      };
    }
  } catch (err) {
    console.log('err.message :>> ', err.message);
    return {
      statusResult: 2,
      message: err.message,
    };
  }
}

async function changePassword(req) {
  try {
    const { systemCode, oldPassword, newPassword } = req.body;
    var clientIp = req.ip;
    let obj = req.privateData;
    let userName = obj.UserLogin;
    var oldPass = encryptPass(oldPassword);
    var newpass = encryptPass(newPassword);

    if (systemCode != "hr") {
      const pool = await pools.getPool();
      let result1 = await pool
        .request()
        .input("systemCode", sql.VarChar(50), systemCode)
        .input("userName", sql.VarChar(20), userName)
        .input("oldPassword", sql.NVarChar(128), oldPass)
        .input("password", sql.NVarChar(128), newpass)
        .input("clientIp", sql.VarChar(50), clientIp)
        .output("msgRet", sql.NVarChar(500))
        .execute("UsersDB.dbo.uspAspNetChangePassword");

      if (result1.output.msgRet != "") {
        return {
          statusResult: 1,
          message: result1.output.msgRet,
        };
      }
      return {
        statusResult: 0,
        message: "تغییر رمز با موفقیت انجام شد",
      };
    } else {
      const poolHR = await pools.getPool("HR");
      let result = await poolHR
        .request()
        .input("UserLogin", sql.VarChar(20), userName)
        .input("OldPassword", sql.VarChar(100), oldPass)
        .input("NewPassword", sql.VarChar(100), newpass)
        .input("AppId", sql.Int, 62)
        .output("msgRet", sql.NVarChar(1000))
        .execute("SecurityDB.secure.uspAppUsersChangePassword");
      if (result.output.msgRet != "") {
        return {
          statusResult: 1,
          message: result.output.msgRet,
        };
      }
      return {
        statusResult: 0,
        message: "تغییر رمز با موفقیت انجام شد",
      };
    }
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getCaptchaDataLogin(req) {
  try {
    let userName = "userLogin";
    var captcha = svgCaptcha.create({
      size: 5,
      noise: 3,
      color: false,
      ignoreChars: "0oil1LOI",
    });
    var clientIp = req.ip;
    const pool = await pools.getPool();
    let result = await pool
      .request()
      .input(
        "guidOld",
        sql.UniqueIdentifier,
        req.body.token == "" ? null : req.body.token
      )
      .input("userName", sql.VarChar(15), userName)
      .input("captchaId", sql.VarChar(20), req.body.captchaId)
      .input("captchaType", sql.VarChar(20), req.body.captchaType)
      .input("captchaText", sql.VarChar(5), captcha.text)
      .input("clientIp", sql.VarChar(50), clientIp)
      .output("guid", sql.UniqueIdentifier)
      .output("msgRet", sql.NVarChar(500))
      .execute("UsersDB.dbo.uspAddCaptchaTextLogin");

    if (result.output.msgRet === "")
      return {
        statusResult: 0,
        capchaData: captcha.data,
        token: result.output.guid,
      };
    else return { statusResult: 1, message: result.output.msgRet };
  } catch (err) {
    return { statusResult: 2, message: "خطا" };
  }
}

async function aspNetReadSystemCode(req, res) {
  try {
    let obj = req.privateData;
    let userName = obj.UserLogin;
    const pool = await pools.getPool();
    let result = await pool
      .request()
      .input("userName", sql.VarChar(150), userName)
      .execute("UsersDB.dbo.uspAspNetReadSystemCode");
    return {
      statusResult: 0,
      rows: result.recordset,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

async function authenticate(req, res) {
  try {
    const { systemCode, captchaToken, captchaText, userName, password } = req.body;
    var encryptPassword = null;
    var clientIp = req.ip;
    const pool = await pools.getPool();
    encryptPassword = encryptPass(password);
    let result = await pool
      .request()
      .input("userName", sql.VarChar(20), userName)
      .input("password", sql.NVarChar(128), encryptPassword)
      .input("ip", sql.VarChar(50), clientIp)
      .output("msgRet", sql.NVarChar(500))
      .execute("UsersDB.dbo.uspAspNetAuthenticate2");
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet,
      };
    }
    const user = result.recordsets[0][0];
    let permissions = [];
    result.recordsets[1].forEach((element) => {
      permissions.push(element.Id);
    });
    const myObj = {
      UserId: user.UserId,
      UserLogin: user.UserName,
      PersonelId: user.PersonelId,
      CompanyId: user.CompanyId,
      Mobile: user.Mobile,
      UnitOrgId:user.UnitOrgId,
      MarkazCode:user.MarkazCode,
      RadehSazman:user.RadehSazman,
      ChartAddressId:user.ChartAddressId,
    };
    // console.log('myObj :>> ', myObj);
    const myJSON = JSON.stringify(myObj);
    const privateDate = cryptoService.dataEncrypt(myJSON);
    const token = jwt.sign(
      {
        userName: userName,
        personelId: user.PersonelId,
        fullName: user.FullName,
        privateData: privateDate,
      },
      config.secret,
      { expiresIn: "10h" }
    );
    return {
      statusResult: 0,
      message: "ورود موفق",
      token,
      permissions,
    };
  } catch (err) {
    console.log('7777777777err.message :>> ', err.message);
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

//users
async function readSystemCode(req, res, next) {
  try {
    let systemUserName = req.privateData.UserLogin;
    const userFilter=req.userFilter
    let queryString=`select * from UsersDB.dbo.VAspNetSystemCode`
    if(systemUserName!='admin')
        queryString=`select * from UsersDB.dbo.VAspNetSystemCode where ${req.userFilter}`
    const pool = await pools.getPool();
    let result = await pool
      .request()
      .query(queryString);
    return {
      statusResult: 0,
      systemCodeList: result.recordset,
    };
  } catch (err) {
    console.log('err.message :>> ', err.message);
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function readPersonel(req, res, next) {
  try {
    //var query = SqlCommandCreator(req.body.lazyParams,"UsersDB.dbo.VPersonel","*",`PersonelId not in(select isnull(PersonelId,'') as PersonelId from UsersDb.dbo.AspNetUsers)`);
    var query = SqlCommandCreator(req.body.lazyParams,"UsersDB.dbo.VPersonel","*");
    const pool = await pools.getPool();
    let resultq = await pool.request().query(query);
    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

async function readUsers(req, res, next) {
  try {
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "UsersDB.dbo.VAspNetUsers",
      "*"
    );
    const pool = await pools.getPool();
    let resultq = await pool.request().query(query);
    let result2 = await pool
      .request()
      .query("select * from UsersDB.dbo.VAspNetCompany ");

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
      companyList: result2.recordset,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

async function saveUsers(req, res) {
  try {
    const {
      userName,
      id,
      firstName,
      lastName,
      nationalCode,
      sex,
      personelId,
      companyId,
      mobile,
      phoneNumber,
      email,
      activity,
      isCompany,
      isGroup,
      userType,
    } = req.body;
    let spName = "UsersDB.dbo.uspAspNetRegister";
    if (id != "") spName = "UsersDB.dbo.uspAspNetRegisterEdit";
    const pool = await pools.getPool();
    let result = await pool
      .request()
      .input("id", sql.NVarChar(128), id)
      .input("userName", sql.VarChar(20), userName)
      .input("firstName", sql.NVarChar(50), firstName)
      .input("lastName", sql.NVarChar(50), lastName)
      .input("nationalCode", sql.VarChar(15), nationalCode)
      .input("sex", sql.TinyInt, sex)
      .input("personelId", sql.VarChar(20), personelId)
      .input("companyId", sql.Int, companyId)
      .input("mobile", sql.VarChar(50), mobile)
      .input("phoneNumber", sql.VarChar(20), phoneNumber)
      .input("email", sql.VarChar(50), email)
      .input("activity", sql.Bit, activity)
      .input("isCompany", sql.Bit, isCompany)
      .input("isGroup", sql.TinyInt, isGroup)
      .input("userType", sql.TinyInt, userType)
      .output("msgRet", sql.NVarChar(100))
      .execute(spName);
    
    if (result.output.msgRet == "")
      return {
        statusResult: 0,
        message: "ذخیره اطلاعات با موفقیت انجام شد",
      };
    else
      return {
        statusResult: 1,
        message: result.output.msgRet,
      };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

async function deleteUsers(req) {
  try {
    const { id } = req.body;
    const pool = await pools.getPool();
    let result = await pool
      .request()
      .input("id", sql.NVarChar(128), id)
      .output("msgRet", sql.NVarChar(200))
      .execute("dbo.uspAspNetRegisterDelete");
    if (result.output.msgRet == "")
      return {
        statusResult: 0,
        message: "حذف اطلاعات با موفقیت انجام شد",
      };
    else
      return {
        statusResult: 1,
        message: result.output.msgRet,
      };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

async function readUserPermissions(req, res) {
  try {
    const { systemCode, userName } = req.body;
    let systemUserName = req.privateData.UserLogin;
    const pool = await pools.getPool();
    let result = await pool
      .request()
      .input("userName", sql.VarChar(50), userName)
      .input("systemUserName", sql.VarChar(50), systemUserName)
      .execute("UsersDB.dbo.uspAspNetUserPermissionReadTree");
    return {
      statusResult: 0,
      rows: result.recordset,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

async function saveUserPermissions(req, res) {
  try {
    const { selectedRows,oldSelectedRows}=req.body
    let myselectedRows = [];
    for (var i = 0; i < selectedRows.length; i++) {
      myselectedRows.push({
        id: selectedRows[i].id,
      });
    }
    myselectedRows = JSON.stringify(myselectedRows);

    let myoldSelectedRows = [];
    for (var i = 0; i < oldSelectedRows.length; i++) {
      myoldSelectedRows.push({
        id: oldSelectedRows[i].id,
      });
    }
    myoldSelectedRows = JSON.stringify(myoldSelectedRows);
    
    let systemUserName = req.privateData.UserLogin;
    const pool = await pools.getPool();
    let result = await pool
      .request()
      .input("systemUserName", sql.VarChar(50), systemUserName)
      .input("systemCode", sql.VarChar(50), req.body.systemCode)
      .input("userName", sql.VarChar(50), req.body.userName)
      .input("selectedRows", sql.NVarChar(sql.MAX), myselectedRows)
      .input("oldSelectedRows", sql.NVarChar(sql.MAX), myoldSelectedRows)
      .execute("UsersDB.dbo.uspAspNetUserPermissionSaveTree");

    return {
      statusResult: 0,
      message: "ذخیره اطلاعات با موفقیت انجام شد",
    };
  } catch (err) {
    console.log('err.message :>> ', err.message);
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function saveRolePermissions(req, res) {
  try {
    const { selectedRows,oldSelectedRows}=req.body
    let myselectedRows = [];
    for (var i = 0; i < selectedRows.length; i++) {
      myselectedRows.push({
        id: selectedRows[i].id,
        
      });
    }
    myselectedRows = JSON.stringify(myselectedRows);

    let myoldSelectedRows = [];
    for (var i = 0; i < oldSelectedRows.length; i++) {
      myoldSelectedRows.push({
        id: oldSelectedRows[i].id,
        
      });
    }
    myoldSelectedRows = JSON.stringify(myoldSelectedRows);
    let systemUserName = req.privateData.UserLogin;
    const pool = await pools.getPool();
    let result = await pool
      .request()
      .input("systemUserName", sql.VarChar(50), systemUserName)
      .input("roleId", sql.VarChar(50), req.body.roleId)
      .input("selectedRows", sql.NVarChar(sql.MAX), myselectedRows)
      .input("oldSelectedRows", sql.NVarChar(sql.MAX), myoldSelectedRows)
      .execute("UsersDB.dbo.uspAspNetRolePermissionSaveTree");

    return {
      statusResult: 0,
      message: "ذخیره اطلاعات با موفقیت انجام شد",
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function setAspNetUserPassword(req) {
  try {
    const { systemCode, userName, newPassword } = req.body;
    let userLogin = req.privateData.UserLogin;

    var newpass = encryptPass(newPassword);
    const pool = await pools.getPool();
    let result = await pool
      .request()
      .input("systemCode", sql.VarChar(50), systemCode)
      .input("userName", sql.VarChar(20), userName)
      .input("password", sql.NVarChar(128), newpass)
      .output("msgRet", sql.NVarChar(100))
      .execute("UsersDB.dbo.uspAspNetUserPasswordChange");

    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet,
      };
    }
    return {
      statusResult: 0,
      message: "تغییر رمز با موفقیت انجام شد",
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function readAspNetPermissionsMenuTree(req, res) {
  try {
    const { systemCode } = req.body;
    const pool = await pools.getPool();
    let result = await pool
      .request()
      .input("systemCode", sql.VarChar(50), systemCode)
      .execute("UsersDB.dbo.uspAspNetPermissionReadMenuTree");
    return {
      statusResult: 0,
      rows: result.recordset,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

async function saveAspNetPermission(req, res) {
  try {
    const { id, systemCode, parentId, childId, title, url, webApi, radif, code, active ,isPublic} =
      req.body;
    const pool = await pools.getPool();
    let result = await pool
      .request()
      .input("id", sql.VarChar(150), id)
      .input("systemCode", sql.VarChar(50), systemCode)
      .input("childId", sql.VarChar(150), childId)
      .input("parentId", sql.VarChar(150), parentId)
      .input("title", sql.NVarChar(150), title)
      .input("url", sql.VarChar(150), url)
      .input("webApi", sql.VarChar(150), webApi)
      .input("radif", sql.Int, radif)
      .input("code", sql.VarChar(10), code)
      .input("active", sql.Bit, active)
      .input("isPublic", sql.Bit, isPublic)
      .execute("UsersDB.dbo.uspAspNetPermissionSave");
    return {
      statusResult: 0,
      row: result.recordset[0],
    };
  } catch (err) {
    console.log('err.message :>> ', err.message);
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

async function deleteAspNetPermission(req, res) {
  try {
    const { id } = req.body;
    const pool = await pools.getPool();
    let result = await pool
      .request()
      .input("id", sql.VarChar(150), id)
      .input("userName", sql.VarChar(50), req.privateData.UserLogin)
      .output("msgRet", sql.NVarChar(100))
      .execute("UsersDB.dbo.uspAspNetPermissionDelete");
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet,
      };
    }
    return {
      statusResult: 0,
      message: "حذف با موفقیت انجام شد",
    };
  } catch (err) {
    console.log('err.message :>> ', err.message);
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

async function readAspNetPermissionSqlParams(req, res) {
  try {
    const { permissionName } = req.body.firstParams;
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "UsersDB.dbo.AspNetPermissionSqlParams",
      "*",
      `permissionName='${permissionName}'`
    );
    const pool = await pools.getPool();
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

async function saveAspNetPermissionSqlParams(req, res) {
  try {
    const { sqlParamId,sqlParamType, permissionName, sqlParam, sqlParamName } = req.body;
    const pool = await pools.getPool();
    let result = await pool
      .request()
      .input("sqlParamId", sql.Int, sqlParamId)
      .input("sqlParamType", sql.Int, sqlParamType)
      .input("permissionName", sql.VarChar(150), permissionName)
      .input("sqlParam", sql.VarChar(150), sqlParam)
      .input("sqlParamName", sql.NVarChar(150), sqlParamName)
      .execute("UsersDB.dbo.uspAspNetPermissionSqlParamsSave");
    return {
      statusResult: 0,
      rows: result.recordset,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function deleteAspNetPermissionSqlParams(req, res) {
  try {
    const { sqlParamId } = req.body;
    const pool = await pools.getPool();
    let result = await pool
      .request()
      .input("sqlParamId", sql.Int, sqlParamId)
      .output("msgRet", sql.NVarChar(500))
      .execute("UsersDB.dbo.uspAspNetPermissionSqlParamsDelete");
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet,
      };
    }
    return {
      statusResult: 0,
      message: "حذف با موفقیت انجام شد",
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

//----------AspNetUserPermissionSqlParams--------------
async function readAspNetUserPermissionSqlParams(req, res) {
  try {
    const { permissionName, userName } = req.body.firstParams;
    var query = SqlCommandCreator(req.body.lazyParams,"UsersDB.dbo.VAspNetUserPermissionSqlParams","*",`permissionName='${permissionName}' and userName='${userName}'`);
    const pool = await pools.getPool();
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}



async function saveAspNetUserPermissionSqlParams(req, res) {
  try {
    const { id, userName, sqlParamId, opId, sqlParamValue } = req.body;
    const userLogin=req.privateData.UserLogin;
    const pool = await pools.getPool();
    let result = await pool
      .request()
      .input("id", sql.BigInt, id)
      .input("userName", sql.VarChar(50), userName)
      .input("sqlParamId", sql.Int, sqlParamId)
      .input("opId", sql.Int, opId)
      .input("sqlParamValue", sql.NVarChar(150), sqlParamValue)
      .input("systemUserName",sql.VarChar(20),userLogin)
      .execute("UsersDB.dbo.uspAspNetUserPermissionSqlParamsSave");
    return {
      statusResult: 0,
      message: "ذخیره با موفقیت انجام شد",
    };
  } catch (err) {
    console.log('err.message :>> ', err.message);
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function deleteAspNetUserPermissionSqlParams(req, res) {
  try {
    const { id } = req.body;
    const pool = await pools.getPool();
    let result = await pool
      .request()
      .input("id", sql.BigInt, id)
      .output("msgRet", sql.NVarChar(500))
      .execute("UsersDB.dbo.uspAspNetUserPermissionSqlParamsDelete");
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet,
      };
    }
    return {
      statusResult: 0,
      message: "حذف با موفقیت انجام شد",
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

async function readAspNetOperations(req, res) {
  try {
    const { permissionName } = req.body;
    const pool = await pools.getPool();
    let result = await pool
      .request()
      .input("permissionName", sql.VarChar(150), permissionName)
      .execute("UsersDB.dbo.uspAspNetOperationsRead");
    return {
      statusResult: 0,
      opIdList:result.recordsets[0],
      sqlParamIdList: result.recordsets[1],
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}


//-----roles

async function readRoles(req, res, next) {
  try {
    
    var query = SqlCommandCreator(req.body.lazyParams,"UsersDB.dbo.AspNetRoles","*",`isAdmin=0`,req.userFilter);
    
    const pool = await pools.getPool();
    let resultq = await pool.request().query(query);
    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function saveRoles(req, res) {
  try {
    const {id,name,caption,systemCode} = req.body;
    if(!systemCode && req.privateData.UserLogin!='admin' ){
      return {
        statusResult: 1,
        message: 'لطفا نام سیستم را انتخاب کنید',
      };
    }
    const pool = await pools.getPool();
    let result = await pool
      .request()
      .input("id", sql.NVarChar(128), id)
      .input("name", sql.VarChar(20), name)
      .input("caption", sql.NVarChar(50), caption)
      .input("systemCode", sql.VarChar(50), systemCode)
      .output("msgRet", sql.NVarChar(100))
      .execute("UsersDB.dbo.uspAspNetRolesSave");
    if (result.output.msgRet == "")
      return {
        statusResult: 0,
        message: "ذخیره اطلاعات با موفقیت انجام شد",
      };
    else
      return {
        statusResult: 1,
        message: result.output.msgRet,
      };
  } catch (err) {
    console.log('err.message :>> ', err.message);
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function deleteRoles(req) {
  try {
    const { id } = req.body;
    const pool = await pools.getPool();
    let result = await pool
      .request()
      .input("id", sql.NVarChar(128), id)
      .output("msgRet", sql.NVarChar(200))
      .execute("dbo.uspAspNetRolesDelete");
    if (result.output.msgRet == "")
      return {
        statusResult: 0,
        message: "حذف اطلاعات با موفقیت انجام شد",
      };
    else
      return {
        statusResult: 1,
        message: result.output.msgRet,
      };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function readUsersRole(req, res, next) {
  try {
    const {roleId }=req.body.firstParams
    var query = SqlCommandCreator(req.body.lazyParams,"UsersDB.dbo.VAspNetUserRoleName","*",`roleId='${roleId}'`);
    const pool = await pools.getPool();
    let resultq = await pool.request().query(query);
    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function readUsersNotInRole(req, res, next) {
  try {
    const {roleId }=req.body.firstParams
    var query = SqlCommandCreator(req.body.lazyParams,`UsersDB.dbo.VAspNetUserPersonel`,"*",` Activity=1 and  Id not in(select userid from UsersDB.dbo.AspNetUserRoles where RoleId='${roleId}')`);
    const pool = await pools.getPool();
    let resultq = await pool.request().query(query);
    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function readRolePermissions(req, res) {
  try {
    const { roleId } = req.body;
    let systemUserName = req.privateData.UserLogin;
    const pool = await pools.getPool();
    let result = await pool
      .request()
      .input("roleId", sql.VarChar(128), roleId)
      .input("systemUserName", sql.VarChar(50), systemUserName)
      .execute("UsersDB.dbo.uspAspNetRolePermissionReadTree");
    return {
      statusResult: 0,
      rows: result.recordset,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

async function addUserRole(req, res) {
  try {
    let rows = [];
    for (var i = 0; i < req.body.rows.length; i++) {
      rows.push({
        id: req.body.rows[i].Id
      });
    }
    rows = JSON.stringify(rows);
    let systemUserName = req.privateData.UserLogin;
    const pool = await pools.getPool();
    let result = await pool
      .request()
      .input("systemUserName", sql.VarChar(50), systemUserName)
      .input("roleId", sql.VarChar(50), req.body.roleId)
      .input("rows", sql.NVarChar(sql.MAX), rows)
      .execute("UsersDB.dbo.uspAspNetUserRoleAdd");

    return {
      statusResult: 0,
      message: "ذخیره اطلاعات با موفقیت انجام شد",
    };
  } catch (err) {
    console.log('err.message :>> ', err.message);
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function deleteUserRole(req, res) {
  try {
    let rows = [];
    for (var i = 0; i < req.body.rows.length; i++) {
      rows.push({
        id: req.body.rows[i].UserId
      });
    }
    rows = JSON.stringify(rows);
    let systemUserName = req.privateData.UserLogin;
    const pool = await pools.getPool();
    let result = await pool
      .request()
      .input("systemUserName", sql.VarChar(50), systemUserName)
      .input("roleId", sql.VarChar(50), req.body.roleId)
      .input("rows", sql.NVarChar(sql.MAX), rows)
      .execute("UsersDB.dbo.uspAspNetUserRoleDelete");

    return {
      statusResult: 0,
      message: "حذف اطلاعات با موفقیت انجام شد",
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
//---------
async function readAspNetUserPermission(req, res) {
  try {
    const { permissionName } = req.body.firstParams;
    var query = SqlCommandCreator(req.body.lazyParams,"UsersDB.dbo.VAspNetUserPermission","*",`permissionName='${permissionName}'`);
    const pool = await pools.getPool();
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    console.log('err.message :>> ', err.message);
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function deleteAspNetUserPermission(req, res) {
  try {
    const { permissionName,userId } = req.body;
    const pool = await pools.getPool();
    let result = await pool
      .request()
      .input("permissionName", sql.VarChar(150), permissionName)
      .input("userId", sql.VarChar(150), userId)
      .output("msgRet", sql.NVarChar(500))
      .execute("UsersDB.dbo.uspAspNetUserPermissionDelete");
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet,
      };
    }
    return {
      statusResult: 0,
      message: "حذف با موفقیت انجام شد",
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function readTCode(req, res) {
  try {
    var query = SqlCommandCreator(req.body.lazyParams,"UsersDB.dbo.AspNetPermission","*",`isnull(code,'')!=''`);
    const pool = await pools.getPool();
    let resultq = await pool.request().query(query);
    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

async function readSearchTCode(req, res) {
  try {
    let userName = req.privateData.UserLogin;
    const { systemCode } = req.body.firstParams;
    var query = SqlCommandCreator(req.body.lazyParams,`UsersDB.[dbo].[udfReadPermission]('${userName}','${systemCode}')`,"*");
    const pool = await pools.getPool();
    let resultq = await pool.request().query(query);
    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

async function readUrlTCode(req, res) {
  try {
    const userName = req.privateData.UserLogin;
    const { systemCode,code } = req.body;
    const pool = await pools.getPool();
    let resultq = await pool.request().query(`select * from UsersDB.[dbo].[udfReadPermission]('${userName}','${systemCode}') where code='${code}'`);
    if(resultq.recordset.length>0)
      return {
        statusResult: 0,
        rows: resultq.recordset,
      }
    else return {
      statusResult: 1,
      message: "رکوردی یافت نشد",
    };
 
    
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

async function readAccessPermissions(req, res) {
  try {
    const { userName } = req.body;
    const pool = await pools.getPool();
    let result = await pool
      .request()
      .input("userName", sql.VarChar(50), userName)
      .execute("UsersDB.dbo.uspAspNetAccessPermissionReadTree");
    return {
      statusResult: 0,
      rows: result.recordset,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function saveAccessPermissions(req, res) {
  try {
    const { selectedRows,oldSelectedRows}=req.body
    let myselectedRows = [];
    for (var i = 0; i < selectedRows.length; i++) {
      myselectedRows.push({
        id: selectedRows[i].id,
        
      });
    }
    myselectedRows = JSON.stringify(myselectedRows);

    let myoldSelectedRows = [];
    for (var i = 0; i < oldSelectedRows.length; i++) {
      myoldSelectedRows.push({
        id: oldSelectedRows[i].id,
        
      });
    }
    myoldSelectedRows = JSON.stringify(myoldSelectedRows);
    
    let systemUserName = req.privateData.UserLogin;
    const pool = await pools.getPool();
    let result = await pool
      .request()
      .input("systemUserName", sql.VarChar(50), systemUserName)
      .input("systemCode", sql.VarChar(50), req.body.systemCode)
      .input("userName", sql.VarChar(50), req.body.userName)
      .input("selectedRows", sql.NVarChar(sql.MAX), myselectedRows)
      .input("oldSelectedRows", sql.NVarChar(sql.MAX), myoldSelectedRows)
      .execute("UsersDB.dbo.uspAspNetAccessPermissionSaveTree");

    return {
      statusResult: 0,
      message: "ذخیره اطلاعات با موفقیت انجام شد",
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}


async function saveAspNetUserFilter(req, res) {
  try {
    const { userName,permissionName,userFilter } = req.body;
    let systemUserName = req.privateData.UserLogin;
    const pool = await pools.getPool();
    let result = await pool
      .request()
      .input("userName", sql.VarChar(50), userName)
      .input("permissionName", sql.VarChar(50), permissionName)
      .input("userFilter", sql.VarChar(250), userFilter)
      .input("systemUserName", sql.VarChar(50), systemUserName)
      .execute("UsersDB.dbo.uspAspNetUserFilterSave");
    return {
      statusResult: 0,
      rows: result.recordset,
    };
  } catch (err) {
    console.log('err.message :>> ', err.message);
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}


async function readOldSystemPass(req, res, next) {
  try {
    const { userCode } = req.body.firstParams;
    var query = SqlCommandCreator(req.body.lazyParams,"UsersDB.dbo.vwPass","*",`userCode='${userCode}'`);
    const pool = await pools.getPool();
    let resultq = await pool.request().query(query);
    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

async function getAspNetUserPermissionLog(req, res) {
  try {
    var query = SqlCommandCreator(req.body.lazyParams,"UsersDB.dbo.VAspNetUserPermissionLog","*", req.body.firstFilter);
    const pool = await pools.getPool();
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    console.log('err.message :>> ', err.message);
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

async function getAspNetUserAccessPermission(req, res) {
  try {
    var query = SqlCommandCreator(req.body.lazyParams,"UsersDB.dbo.VAspNetUserAccessPermission","*", req.body.firstFilter);
    const pool = await pools.getPool();
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    console.log('err.message :>> ', err.message);
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}


async function getUserAccess(req, res) {
  try {
    var query = SqlCommandCreator(req.body.lazyParams,"UsersDB.dbo.VUserAccess","*", req.body.firstFilter);
    const pool = await pools.getPool();
    let resultq = await pool.request().query(query);   
    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    console.log('err.message :>> ', err.message);
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}


async function getSystemOld(req, res) {
  try {
    var query = SqlCommandCreator(req.body.lazyParams,"UsersDB.dbo.vwSystemNameOld","*", req.body.firstFilter);
    const pool = await pools.getPool();
    let resultq = await pool.request().query(query);   
    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    console.log('err.message :>> ', err.message);
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

async function saveOldSystemPass(req, res) {
  try {
    const { systemCode,userCode,faal } = req.body;
    const pool = await pools.getPool();
    let result = await pool
      .request()
      .input("systemCode", sql.VarChar(50), systemCode)
      .input("userCode", sql.VarChar(50), userCode)
      .input("faal", sql.Bit, faal)
      .execute("UsersDB.dbo.uspOldSystemPassSave");
    return {
      statusResult: 0,
      rows: result.recordset,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: err.message,
    };
  }
}

async function getAspNetUserPermissionAll(req, res) {
  try {
    var query = SqlCommandCreator(req.body.lazyParams,"UsersDB.dbo.VAspNetUserPermissionList","*", req.body.firstFilter);
    const pool = await pools.getPool();
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    console.log('err.message :>> ', err.message);
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

async function readUserPermissionsOld(req, res) {
  try {
    const { systemCode, userCode } = req.body;
    const pool = await pools.getPool();
    let result = await pool
      .request()
      .input("userCode", sql.VarChar(50), userCode)
      .input("systemCode", sql.Int, systemCode)
      .execute("UsersDB.dbo.uspAspNetUserPermissionReadTreeOld");
    return {
      statusResult: 0,
      rows: result.recordset,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function readAspNetUserPermissionOld(req, res) {
  try {
    const { permissionName,systemCode } = req.body.firstParams;
    var query = SqlCommandCreator(req.body.lazyParams,"UsersDB.dbo.VAspNetUserPermissionOld","*",`permissionName='${permissionName}' and systemCode='${systemCode}' `);
    const pool = await pools.getPool();
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    console.log('err.message :>> ', err.message);
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

async function CreateNewUserInOldSystem(req) {
  try {
      const { systemCode, userCode, newPassword } = req.body;    
      const pool = await pools.getPool();
      let result = await pool
        .request()
        .input("systemCode", sql.VarChar(50), systemCode)
        .input("UserId", sql.VarChar(20), userCode)
        .input("Pass", sql.NVarChar(128), newPassword)
        .input("UserCodeOwner", sql.VarChar(50), req.privateData.UserLogin)
        .output("msgRet", sql.NVarChar(100))
        .execute("UsersDB.dbo.uspInsertNewUserInOldSystem");

      if (result.output.msgRet != "") {
        return {
          statusResult: 1,
          message: result.output.msgRet,
        };
    }
    return {
      statusResult: 0,
      message: "تغییر رمز با موفقیت انجام شد",
    };
  } catch (err) {
    console.log(err.message)
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

async function CreateSameUserInOldSystem(req) {
  try {

    const { systemCode, userSource ,personelId, newPassword } = req.body;
    
    const pool = await pools.getPool();
    let result = await pool
      .request()
      .input("systemCode", sql.VarChar(50), systemCode)
      .input("userSource", sql.VarChar(20), userSource)
      .input("userDest", sql.VarChar(20), personelId)
      .input("Pass", sql.NVarChar(128), newPassword)
      .input("UserCodeOwner", sql.VarChar(50), req.privateData.UserLogin)
      .output("msgRet", sql.NVarChar(100))
      .execute("UsersDB.dbo.uspInsertSameUserInOldSystem");

    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet,
      };
    }
    return {
      statusResult: 0,
      message: "تغییر رمز با موفقیت انجام شد",
    };
  } catch (err) {
    console.log(err.message)
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

async function getControlSystemOld(req) {
  try {
    const { SystemCode, MenuName ,UserCode } = req.body;    
    const pool = await pools.getPool();
    let result = await pool.request()
      .input("SystemCode", sql.VarChar(50), SystemCode)
      .input("MenuName", sql.VarChar(20), MenuName)
      .input("UserCode", sql.VarChar(20), UserCode)
      .input("UserCodeAdmin", sql.VarChar(128), req.privateData.UserLogin)
      .execute("UsersDB.dbo.uspSelectControlsOldSystem");
      return {
        statusResult: 0,
        rows: result.recordset,
      };
    } catch (err) {
      return {
        statusResult: 2,
        message: "خطا در برقراری ارتباط با پایگاه داده ای",
      };
    }
}


async function delControlSystemOld(req) {
  try {
    const { SystemCode, MenuName ,UserCode,ControlName } = req.body;    
    const pool = await pools.getPool();
    let result = await pool.request()
      .input("SystemCode", sql.VarChar(50), SystemCode)
      .input("MenuName", sql.VarChar(20), MenuName)
      .input("UserCode", sql.VarChar(20), UserCode)
      .input("ControlName", sql.VarChar(128), ControlName)
      .execute("UsersDB.dbo.uspUserAccessDeleteOldSystem");
      return {
        statusResult: 0,
        message: "عملیات با موفقیت انجام شد",
      };
    } catch (err) {
      return {
        statusResult: 2,
        message: "خطا در برقراری ارتباط با پایگاه داده ای",
      };
    }
}

async function UpdateAccessFilterOldSystem(req) {
  try {
    const { SystemCode, MenuName ,UserCode,ControlName,userFilter } = req.body;    
    const pool = await pools.getPool();
    let result = await pool.request()
      .input("SystemCode", sql.VarChar(50), SystemCode)
      .input("MenuName", sql.VarChar(20), MenuName)
      .input("UserCode", sql.VarChar(20), UserCode)
      .input("ControlName", sql.VarChar(128), ControlName)
      .input("AccessFilter", sql.VarChar(500), userFilter)
      .execute("UsersDB.dbo.uspUpdateAccessFilterOldSystem");
      return {
        statusResult: 0,
        message: "عملیات با موفقیت انجام شد",
      };
    } catch (err) {
      return {
        statusResult: 2,
        message: "خطا در برقراری ارتباط با پایگاه داده ای",
      };
    }
    
}


async function saveControlSystemOld(req) {
  try {
    const { SystemCode, MenuName ,UserCode,ControlName,AllChild } = req.body;    
    const pool = await pools.getPool();
    let result = await pool.request()
      .input("SystemCode", sql.VarChar(50), SystemCode)
      .input("MenuName", sql.VarChar(20), MenuName)
      .input("UserCode", sql.VarChar(20), UserCode)
      .input("ControlName", sql.VarChar(128), ControlName)
      .input("AllChild", sql.TinyInt, AllChild)
      .input("UserCodeOwner", sql.VarChar(128), req.privateData.UserLogin)
      .execute("UsersDB.dbo.uspUserAccessSaveSystemOld");
      return {
        statusResult: 0,
        message: "عملیات با موفقیت انجام شد",
      };
    } catch (err) {
      console.log(err.message)
      return {
        statusResult: 2,
        message: "خطا در برقراری ارتباط با پایگاه داده ای",
      };
    }
}

async function deleteAspNetUserPermissionOld(req, res) {
  try {
    const { permissionName,userCode,systemCode } = req.body;
    const pool = await pools.getPool();
    let result = await pool
      .request()
      .input("permissionName", sql.VarChar(150), permissionName)
      .input("userCode", sql.VarChar(20), userCode)
      .input("systemCode", sql.Int, systemCode)
      .output("msgRet", sql.NVarChar(500))
      .execute("UsersDB.dbo.uspAspNetUserPermissionDeleteOld");
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet,
      };
    }
    return {
      statusResult: 0,
      message: "حذف با موفقیت انجام شد",
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

async function saveUserPermissionsOld(req, res) {
  try {
    const { selectedRows,oldSelectedRows,systemCode,userCode}=req.body
    let myselectedRows = [];
    for (var i = 0; i < selectedRows.length; i++) {
      myselectedRows.push({
        id: selectedRows[i].id,
      });
    }
    myselectedRows = JSON.stringify(myselectedRows);

    let myoldSelectedRows = [];
    for (var i = 0; i < oldSelectedRows.length; i++) {
      myoldSelectedRows.push({
        id: oldSelectedRows[i].id,
      });
    }
    myoldSelectedRows = JSON.stringify(myoldSelectedRows);
    
    let systemUserName = req.privateData.UserLogin;
    const pool = await pools.getPool();
    let result = await pool
      .request()
      .input("systemUserName", sql.VarChar(50), systemUserName)
      .input("systemCode", sql.VarChar(50), systemCode)
      .input("userCode", sql.VarChar(50), userCode)
      .input("selectedRows", sql.NVarChar(sql.MAX), myselectedRows)
      .input("oldSelectedRows", sql.NVarChar(sql.MAX), myoldSelectedRows)
      .execute("UsersDB.dbo.uspAspNetUserPermissionSaveTreeOld");

    return {
      statusResult: 0,
      message: "ذخیره اطلاعات با موفقیت انجام شد",
    };
  } catch (err) {
    console.log('err.message :>> ', err.message);
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

async function getAspNetUsers(req, res) {
  try {
    // const { sal, mah,separateType } = req.body.firstParams;
    let firstFilter=`Activity=1  and isnull(PersonelId,'')!=''`;
    const pool = await pools.getPool()
    var query=SqlCommandCreator(req.body.lazyParams,'UsersDB.dbo.vAspNetUsers','*',firstFilter)
    
    let resultq = await pool.request().query(query);
    
    return {
        statusResult:0,
        rows:resultq.recordsets[0],
        totalRecords:resultq.recordsets[1][0].totalCount,
    };
}catch (err) {
  console.log('err.message :>> ', err.message);
    return {statusResult:2,message:'خطا در برقراری ارتباط با پایگاه داده ای'}
}
}

async function getNavigation(req, res) {
  // console.log('getNavigationgetNavigationgetNavigation')
// console.log('bodybodybodybody', req.body)

try {
  const {SystemCode } = req.body;
  let systemUserName = req.privateData.UserLogin;
  const pool = await pools.getPool();
  let result = await pool
    .request()
    .input("systemCode", sql.NVarChar(50),SystemCode)
    .input("userName", sql.NVarChar(100), systemUserName)
    .execute("UsersDB.dbo.uspGetUserMenusJsonBySaeedi");

    // console.log('getNavigation-result.recordset===>', result.recordset[0].Menus)
    return {
      statusResult: 0,
      data: result.recordset[0].Menus,
    };
} catch (err) {
  return {
    statusResult: 2,
    message: "خطا در برقراری ارتباط با پایگاه داده ای"+err.message,
  };
}
  
}

async function getRouters(req, res) {
// console.log('bodybodybodybody', req.body)
let systemUserName = req.privateData.UserLogin;
   try {
    const {SystemCode } = req.body;
  const pool = await pools.getPool();
  let result = await pool
    .request()
    .input("systemCode", sql.NVarChar(50),SystemCode)
    .input("userName", sql.NVarChar(100), systemUserName)
    .execute("UsersDB.dbo.uspGetRoutersJsonbySaeedi");

    // console.log('getRouters-result.recordset===>', result.recordset[0].JsonResult)
    return {
      statusResult: 0,
      data: result.recordset[0].JsonResult,
    };
} catch (err) {
  return {
    statusResult: 2,
    message: "خطا در برقراری ارتباط با پایگاه داده ای"+err.message,
  };
}
  
}
async function favoriteMenus(req, res) {
  try {
    console.log('favoriteMenus-->req.body', req.body)
    const { menuName,SystemCode } = req.body;
    let systemUserName = req.privateData.UserLogin;
    const pool = await pools.getPool();
    let result = await pool
      .request()
      .input("menuName", sql.VarChar(150), menuName)
      .input("userName", sql.NVarChar(100), systemUserName)
      .input("systemCode", sql.NVarChar(50), SystemCode)
      .output("msgRet", sql.NVarChar(500))
      .execute("UsersDB.dbo.uspFavoriteMenus");
    if (result.output.msgRet == "1") {
      return {
        statusResult: 0,
        message: "منوی مورد نظر با موفقیت در لیست منوهای دلخواه صفحه اصلی اضافه شد.",
      };
    }
    else if (result.output.msgRet == "2") {
    return {
      statusResult: 0,
      message: "منوی مورد نظر از لیست دلخواه حذف شد",
    };
   }
    else
    {
      return {
        statusResult: 1,
        message: "خطا در ثبت منوی دلخواه",
      };

    }
  }
  catch (err) {
    console.log('favoriteMenus-->catch-->err.message', err.message)
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

async function getFavoriteMenueList(req, res) {
  let systemUserName = req.privateData.UserLogin;
     try {
      const {SystemCode } = req.body;
    const pool = await pools.getPool();
    let result = await pool
      .request()
      .input("systemCode", sql.NVarChar(50),SystemCode)
      .input("userName", sql.NVarChar(100), systemUserName)
      .execute("UsersDB.dbo.uspGetFavoriteMenusbySaeedi");
  // console.log('result.recordset[0].JsonResult', result.recordset[0].JsonResult)
      return {
        statusResult: 0,
        data: result.recordset,
      };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای"+err.message,
    };
  }
    
  }


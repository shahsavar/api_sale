const config = require('../../config.json');
const sql = require('mssql');
const pools = require('../../_helpers/pool-manegment');
const { SqlCommandCreator } = require("../../_helpers/SqlCommandCreator");
const { getPersianDate } = require("../../_helpers/persian.calender");
const requestIp = require('request-ip');
const os = require('node:os');
const jwt = require('jsonwebtoken');
const axios = require('axios')
const cryptoService = require('../../public/crypto/crypto.service');
module.exports = {
  getViewsaleProjects,
  getModel,
  getModelSub,
  getSaleProjectsUIData,
  getExtraFormData,
  getUsageList,
  getPrice,
  SaleProjectsInsert,
  SaleProjectsUpdate,
  getPrePaymentList,
  getPrePaymentUIData,
  PrePaymentInsert,
  PrePaymentUpdate,
  PrePaymentDelete,
  getFactorSoudList,
  getFactorSoudUIData,
  FactorSoudInsert,
  FactorSoudUpdate,
  FactorSoudDelete,
  SaleProjectsDelete,
  getEsterdadSoudList,
  getEsterdadSoudUIData,
  EsterdadSoudInsert,
  EsterdadSoudUpdate,
  EsterdadSoudDelete,
  getTakhfifDeliverList,
  TakhfifDeliverInsert,
  TakhfifDeliverUpdate,
  TakhfifDeliverDelete,
  getIncreasePriceList,
  IncreasePriceInsert,
  IncreasePriceUpdate,
  IncreasePriceDelete,
  getResponHazinehList,
  getResponHazinehUIData,
  ResponHazinehInsert,
  ResponHazinehUpdate,
  ResponHazinehDelete,
  SaleProjectsCopy,
  getDueDeliverProgList,
  getDueDeliverUIData,
  DueDeliverProgInsert,
  getDueDeliverExtraUIData,
  DueDeliverProgUpdate,
  DueDeliverProgDelete,
  getDeliverExpireDate,
  getRelatOptionalList,
  getRelatOptionalPickList,
  RelatOptionalInsert,
  RelateOptionalDelete,
  getSaleProjectMessage,
  getCommissionList,
  getCommissionExtraData,
  getStepCommission,
  SaleProjectsCommissionInsert,
  SaleProjectsCommissionUpdate,
  SaleProjectsCommissionDelete,
}

const axiosConfig = {
  "async": true,
  "crossDomain": false,
  "method": "POST",
  "headers": {
    "Content-Type": "application/json",
    "cache-control": "no-cache",
    'Access-Control-Allow-Origin': "*",
  },
  "processData": true,
};

async function getViewsaleProjects(req, res) {
  try {
    const { typeNamayesh, tabagheProject/*, vazeiatProject */ } = req.body.firstParams;
    let today = getPersianDate()
    let userFilter = ''
    if (typeNamayesh == 0) {  //دفتر مرکزی
      if (tabagheProject == 0)  //باز
        // userFilter = "(" + vazeiatProject + "=3 or ViewInCentralOffice=" + vazeiatProject + ") and ( ExpaireDate='' or ExpaireDate>='" + today + "')"
        userFilter = "( ViewInCentralOffice > 0) and ( ExpaireDate='' or ExpaireDate>='" + today + "')"
      else if (tabagheProject == 1) //بسته
        // userFilter = "(" + vazeiatProject + "=3 or ViewInCentralOffice=" + vazeiatProject + ") and ( ExpaireDate <> '' and ExpaireDate<'" + today + "')"
        userFilter = "(ViewInCentralOffice > 0) and ( ExpaireDate <> '' and ExpaireDate<'" + today + "')"
      else
        userFilter = "(ViewInCentralOffice > 0)"//همه(باز و بسته)
    }
    else if (typeNamayesh == 1) {//نمایندگی
      if (tabagheProject == 0)  //باز
        // userFilter = "(" + vazeiatProject + "=3 or ViewInAgency=" + vazeiatProject + ") and ( ExpaireDate='' or ExpaireDate>='" + today + "')"
        userFilter = "( ViewInAgency > 0)  and ( ExpaireDate='' or ExpaireDate>='" + today + "')"
      else if (tabagheProject == 1) //بسته
        // userFilter = "(" + vazeiatProject + "=3 or ViewInAgency=" + vazeiatProject + ") and ( ExpaireDate <> '' and ExpaireDate <'" + today + "')"
        userFilter = "( ViewInAgency > 0)  and ( ExpaireDate <> '' and ExpaireDate <'" + today + "')"
      else
        userFilter = "( ViewInAgency > 0)"//همه(باز و بسته)
    }
    else if (typeNamayesh == 2) {//اینترنتی
      if (tabagheProject == 0)  //باز
        //  userFilter = "(" + vazeiatProject + "=3 or ViewInSaleInternet=" + vazeiatProject + ") and (ExpaireDateInternet='' or ExpaireDateInternet>='" + today + "')"
        userFilter = "( ViewInSaleInternet > 0) and (ExpaireDateInternet='' or ExpaireDateInternet>='" + today + "')"
      else if (tabagheProject == 1) //بسته
        // userFilter = "(" + vazeiatProject + "=3 or ViewInSaleInternet=" + vazeiatProject + ") and (ExpaireDateInternet<>'' and ExpaireDateInternet<'" + today + "')"
        userFilter = "( ViewInSaleInternet > 0)  and (ExpaireDateInternet<>'' and ExpaireDateInternet<'" + today + "')"
      else
        userFilter = "( ViewInSaleInternet > 0) "//همه(باز و بسته)
      //filter = " ViewInSaleInternet in (1,2,3) "
    }
    else if (typeNamayesh == 3) {//همه - دفتر-نمایندگی-اینترنتی
      if (tabagheProject == 0)  //باز
        // userFilter = "(((" + vazeiatProject + "=3 or ViewInCentralOffice = " + vazeiatProject + " or ViewInAgency = " + vazeiatProject + ") and (ExpaireDate = '' or ExpaireDate >= '" + today + "')) or((ViewInSaleInternet =" + vazeiatProject + ") and(ExpaireDateInternet = '' or ExpaireDateInternet >= '" + today + "')))"
        userFilter = "(( ViewInCentralOffice > 0 or  ViewInAgency > 0) and (ExpaireDate = '' or ExpaireDate >= '" + today + "') or (( ViewInSaleInternet > 0) and (ExpaireDateInternet = '' or ExpaireDateInternet >= '" + today + "')))"
      else if (tabagheProject == 1) //بسته
        userFilter = "(( ViewInCentralOffice > 0 or  ViewInAgency > 0) and(ExpaireDate<>'' and ExpaireDate<'" + today + "') or (( ViewInSaleInternet > 0) and (ExpaireDateInternet<>'' and ExpaireDateInternet <'" + today + "')))"
      else
        userFilter = ""//همه)
    }

    //  console.log('userFilter1', userFilter)
    var query = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.VSaleProjects', '*', userFilter, req.userFilter)
    // console.log('query', query)
    let pool = await pools.getPool('Sale')
    let result = await pool.request().query(query)
    return {

      statusResult: 0,
      rows: result.recordsets[0],
      totalRecords: result.recordsets[1][0].totalCount,
    }
  } catch (err) {
    console.log("err.message", err.message)
    throw (err)
  }
}

async function getModel(req, res) {
  try {

    var query = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.VModel', '*')
    let pool = await pools.getPool('Sale')
    let result = await pool.request().query(query)
    return {
      statusResult: 0,
      rows: result.recordsets[0],
      totalRecords: result.recordsets[1][0].totalCount,
    }
  } catch (err) {
    console.log("err.message", err.message)
    throw (err)
  }
}
async function getModelSub(req, res) {
  try {


    var query = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.VModelTolidSUB', '*', req.body.firstFilter)
    let pool = await pools.getPool('Sale')
    let result = await pool.request().query(query)
    return {
      statusResult: 0,
      rows: result.recordsets[0],
      totalRecords: result.recordsets[1][0].totalCount,
    }
  } catch (err) {
    console.log("err.message", err.message)
    throw (err)
  }
}

async function getSaleProjectsUIData(req) {
  try {

    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('IdSaleProject', sql.Int, req.body.IdSaleProject)
      .execute('Sale.sale.uspGetSaleProjectsUIData')
    // var registerInfo=result.recordsets[0][0];
    return {
      statusResult: 0,
      message: "خواندن موفق",
      typeProject: result.recordsets[0],
      typeKhodro: result.recordsets[1],
      typeClass: result.recordsets[2],
      typeSale: result.recordsets[3] ? result.recordsets[3] : [],
      typeSaleTashilat: result.recordsets[4] ? result.recordsets[4] : [],
      cheqModatDar: result.recordsets[5] ? result.recordsets[5] : [],
      usageList: result.recordsets[6] ? result.recordsets[6] : [],
      // pricelist: result.recordsets[7] ? result.recordsets[7] : [],
      // matnSale: result.recordsets[8]? result.recordsets[8] : '',
      // matnSaleProject: result.recordsets[9]? result.recordsets[9] : '',
      // matnSanad: result.recordsets[10]? result.recordsets[10] : '',
    };
  } catch (err) {
    console.log("err,message", err.message)
    // return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}
async function getExtraFormData(req) {
  try {

    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('IdSaleProject', sql.Int, req.body.IdSaleProject)
      .execute('Sale.sale.uspGetSaleProjectExtraFormData')
    // var registerInfo=result.recordsets[0][0];
    return {
      statusResult: 0,
      message: "خواندن موفق",
      pricelist: result.recordsets[0],
      matnList: result.recordsets[1] ? result.recordsets[1][0] : [],

    };
  } catch (err) {
    console.log("err,message", err.message)
    // return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}
async function getUsageList(req) {
  //var data=req.body.filters
  // console.log('req.body', req.body.idModel)
  try {
    var myQuery = `SELECT id as [value] , Title as [label] FROM udfgetUsageModel(${req.body.idModel})`
    let pool = await pools.getPool('Sale')
    let result = await pool.request()
      .query(myQuery)
    return {
      statusResult: 0,
      rows: result.recordsets[0],
    }
  } catch (err) {
    console.log("err:", err.message)
    return err
  }
}
async function getPrice(req) {
  try {
    const { Model, IdSaleProjects, price, IsNumbering, IsInsurance, IDUsage, IsBodyInsur, IsTarhinSanad, ViewType, IsHemayat } = req.body;

    //  console.log('req.body', req.body.IDUsage)

    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("Model", sql.Int, Model)
      .input("IdSaleProjects", sql.Int, IdSaleProjects)
      .input("price", sql.Numeric(18, 0), price)
      .input("IsNumbering", sql.Int, IsNumbering)
      .input("IsInsurance", sql.Int, IsInsurance)
      .input("IDUsage", sql.Int, IDUsage)
      .input("IsBodyInsur", sql.Int, IsBodyInsur)
      .input("IsTarhinSanad", sql.Int, IsTarhinSanad)
      .input("IsHemayat", sql.Int, IsHemayat)
      .input("ViewType", sql.Int, ViewType)
      .execute("Sale.dbo.spGetPriceSaleProjects");
    //  console.log(result)
    return {
      statusResult: 0,
      rows: result.recordsets[0],
    }
  } catch (err) {
    console.log("err:", err.message)
    return err
  }
}


async function SaleProjectsInsert(req) {
  try {
    const { IDSaleProject, idModel, idModelSub, Title, TitleEng, idTypeKhodro, idTypeProject, idTypeSale, idTypeClassSale, idTypeSaleTashilat, MaxKhodroInRespon, idCatagoryProject,
      idStateCheqModatDar, EffectiveDate, ExpaireDate, ExpaireDateChanging, IDLemPay, NumberOfRegistration, NumberOfRegistrationCentral, NumberOfRegistrationAgency, NumberOfRegistrationInternet
      , NumberOfReservation, Price, InternetPrice, KarmozdCheq, Invitation, ViewInSite, ViewInCentralOffice, ViewInAgency, ViewInSaleInternet, idCatagoryOfContract, idSarresidCheq, DesignProjects,
      InsuranceCalc, BakhshnameNo, ViewInSoratHesab, MatnSaleProjects, MatnSale, MatnSanad, MatnInternet, Flag, TakmilMaliSoud, NumberingCalc, HavePorseshname, EffectiveDateInternet, ExpaireDateInternet,
      MaxKhodroInResponInternet, Modelsal, StandardNo, HoghoghiNo, StateEndDateSoud, ResponExpireDate, Is18YearsOld, SanadRahnInSaleProject, SanadRahnInSaleProjectDescr, IDUsage, TahvilFori,
      BodyInsurCalc, TarhinSanadCalc, HemayatCalc,IsPrinted } = req.body;
    let spName = "sale.uspSaleProjectsInsert";
    //   if (IDSaleProject != 0)
    //     spName = "usptblPublisher_Update";
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;

    // console.log("req.body", req.body)
    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("IDSaleProject", sql.Int, IDSaleProject)
      .input("idModel", sql.Int, idModel)
      .input("idModelSub", sql.Int, idModelSub)
      .input("Title", sql.NVarChar(120), Title)
      .input("TitleEng", sql.VarChar(50), TitleEng)
      .input("idTypeKhodro", sql.Int, idTypeKhodro)
      .input("idTypeProject", sql.TinyInt, idTypeProject)
      .input("idTypeSale", sql.Int, idTypeSale)
      .input("idTypeClassSale", sql.Int, idTypeClassSale)
      .input("idTypeSaleTashilat", sql.Int, idTypeSaleTashilat)
      .input("MaxKhodroInRespon", sql.Int, MaxKhodroInRespon)
      .input("idCatagoryProject", sql.Int, idCatagoryProject)
      .input("idStateCheqModatDar", sql.Int, idStateCheqModatDar)
      .input("EffectiveDate", sql.VarChar(10), EffectiveDate)
      .input("ExpaireDate", sql.VarChar(10), ExpaireDate)
      .input("ExpaireDateChanging", sql.VarChar(10), ExpaireDateChanging)
      .input("IDLemPay", sql.Int, IDLemPay)
      .input("NumberOfRegistration", sql.Int, NumberOfRegistration)
      .input("NumberOfRegistrationCentral", sql.Int, NumberOfRegistrationCentral)
      .input("NumberOfRegistrationAgency", sql.Int, NumberOfRegistrationAgency)
      .input("NumberOfRegistrationInternet", sql.Int, NumberOfRegistrationInternet)
      .input("NumberOfReservation", sql.Int, NumberOfReservation)
      .input("Price", sql.Numeric, Price)
      .input("InternetPrice", sql.Numeric, InternetPrice)
      .input("KarmozdCheq", sql.Float, KarmozdCheq)
      .input("Invitation", sql.TinyInt, Invitation)
      .input("ViewInSite", sql.TinyInt, ViewInSite)
      .input("ViewInCentralOffice", sql.TinyInt, ViewInCentralOffice)
      .input("ViewInAgency", sql.TinyInt, ViewInAgency)
      .input("ViewInSaleInternet", sql.TinyInt, ViewInSaleInternet)
      .input("idCatagoryOfContract", sql.Int, idCatagoryOfContract)
      .input("idSarresidCheq", sql.Int, idSarresidCheq)
      .input("DesignProjects", sql.Int, DesignProjects)
      .input("InsuranceCalc", sql.Int, InsuranceCalc)
      .input("BakhshnameNo", sql.VarChar(15), BakhshnameNo)
      .input("ViewInSoratHesab", sql.TinyInt, ViewInSoratHesab)
      .input("MatnSaleProjects", sql.NVarChar(500), MatnSaleProjects)
      .input("MatnSale", sql.NVarChar(500), MatnSale)
      .input("MatnSanad", sql.NVarChar(500), MatnSanad)
      .input("MatnInternet", sql.VarChar(500), MatnInternet)
      .input("Flag", sql.TinyInt, Flag)
      .input("TakmilMaliSoud", sql.TinyInt, TakmilMaliSoud)
      .input("NumberingCalc", sql.TinyInt, NumberingCalc)
      .input("HemayatCalc", sql.TinyInt, HemayatCalc)

      .input("HavePorseshname", sql.TinyInt, HavePorseshname)
      .input("EffectiveDateInternet", sql.VarChar(10), EffectiveDateInternet)
      .input("ExpaireDateInternet", sql.VarChar(10), ExpaireDateInternet)
      .input("MaxKhodroInResponInternet", sql.Int, MaxKhodroInResponInternet)
      .input("Modelsal", sql.Int, Modelsal)
      .input("StandardNo", sql.VarChar(10), StandardNo)
      .input("HoghoghiNo", sql.NVarChar(20), HoghoghiNo)
      .input("StateEndDateSoud", sql.Int, StateEndDateSoud)
      .input("ResponExpireDate", sql.VarChar(10), ResponExpireDate)
      .input("UserID", sql.VarChar(10), UserLogin)
      .input("Is18YearsOld", sql.Int, Is18YearsOld)
      .input("SanadRahnInSaleProject", sql.Int, SanadRahnInSaleProject)
      .input("SanadRahnInSaleProjectDescr", sql.NVarChar(200), SanadRahnInSaleProjectDescr)
      .input("IDUsage", sql.Int, IDUsage)
      .input("TahvilFori", sql.Int, TahvilFori)
      .input("BodyInsurCalc", sql.Int, BodyInsurCalc)
      .input("TarhinSanadCalc", sql.Int, TarhinSanadCalc)
      .input("IsPrinted", sql.Int, IsPrinted)
      .input("ComputerName", sql.VarChar(50), clientIp)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);

    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "ذخیره اطلاعات با موفقیت انجام شد",

      }
    else return {
      statusResult: 1,
      message: result.output.msgRet,
    }
  } catch (err) {
    console.log("err.message", err.message)
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };

  }
}

async function SaleProjectsUpdate(req) {
  // console.log('req.socket.remoteAddress', req.socket.remoteAddress)
  // console.log('SaleProjectsUpdate===>req.ip', req.ip)
  // console.log('SaleProjectsUpdate===>req.headers[x-forwarded-for] ', req.headers['x-forwarded-for'] )
  // console.log('SaleProjectsUpdate===>req.headers[x-real-ip] ', req.headers['x-real-ip'] )

  try {
    const { IDSaleProject, idModel, idModelSub, Title, TitleEng, idTypeKhodro, idTypeProject, idTypeSale, idTypeClassSale, idTypeSaleTashilat, MaxKhodroInRespon, idCatagoryProject,
      idStateCheqModatDar, EffectiveDate, ExpaireDate, ExpaireDateChanging, IDLemPay, NumberOfRegistration, NumberOfRegistrationCentral, NumberOfRegistrationAgency, NumberOfRegistrationInternet
      , NumberOfReservation, Price, InternetPrice, KarmozdCheq, Invitation, ViewInSite, ViewInCentralOffice, ViewInAgency, ViewInSaleInternet, idCatagoryOfContract, idSarresidCheq, DesignProjects,
      InsuranceCalc, BakhshnameNo, ViewInSoratHesab, MatnSaleProjects, MatnSale, MatnSanad, MatnInternet, Flag, TakmilMaliSoud, NumberingCalc, HavePorseshname, EffectiveDateInternet, ExpaireDateInternet,
      MaxKhodroInResponInternet, Modelsal, StandardNo, HoghoghiNo, StateEndDateSoud, ResponExpireDate, Is18YearsOld, SanadRahnInSaleProject, SanadRahnInSaleProjectDescr, IDUsage, TahvilFori,
      BodyInsurCalc, TarhinSanadCalc, HemayatCalc ,IsPrinted } = req.body;
    let spName = "sale.uspSaleProjectsUpdate";

    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;

    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("IDSaleProject", sql.Int, IDSaleProject)
      .input("idModel", sql.Int, idModel)
      .input("idModelSub", sql.Int, idModelSub)
      .input("Title", sql.NVarChar(120), Title)
      .input("TitleEng", sql.VarChar(50), TitleEng)
      .input("idTypeKhodro", sql.Int, idTypeKhodro)
      .input("idTypeProject", sql.TinyInt, idTypeProject)
      .input("idTypeSale", sql.Int, idTypeSale)
      .input("idTypeClassSale", sql.Int, idTypeClassSale)
      .input("idTypeSaleTashilat", sql.Int, idTypeSaleTashilat)
      .input("MaxKhodroInRespon", sql.Int, MaxKhodroInRespon)
      .input("idCatagoryProject", sql.Int, idCatagoryProject)
      .input("idStateCheqModatDar", sql.Int, idStateCheqModatDar)
      .input("EffectiveDate", sql.VarChar(10), EffectiveDate)
      .input("ExpaireDate", sql.VarChar(10), ExpaireDate)
      .input("ExpaireDateChanging", sql.VarChar(10), ExpaireDateChanging)
      .input("IDLemPay", sql.Int, IDLemPay)
      .input("NumberOfRegistration", sql.Int, NumberOfRegistration)
      .input("NumberOfRegistrationCentral", sql.Int, NumberOfRegistrationCentral)
      .input("NumberOfRegistrationAgency", sql.Int, NumberOfRegistrationAgency)
      .input("NumberOfRegistrationInternet", sql.Int, NumberOfRegistrationInternet)
      .input("NumberOfReservation", sql.Int, NumberOfReservation)
      .input("Price", sql.Numeric, Price)
      .input("InternetPrice", sql.Numeric, InternetPrice)
      .input("KarmozdCheq", sql.Float, KarmozdCheq)
      .input("Invitation", sql.TinyInt, Invitation)
      .input("ViewInSite", sql.TinyInt, ViewInSite)
      .input("ViewInCentralOffice", sql.TinyInt, ViewInCentralOffice)
      .input("ViewInAgency", sql.TinyInt, ViewInAgency)
      .input("ViewInSaleInternet", sql.TinyInt, ViewInSaleInternet)
      .input("idCatagoryOfContract", sql.Int, idCatagoryOfContract)
      .input("idSarresidCheq", sql.Int, idSarresidCheq)
      .input("DesignProjects", sql.Int, DesignProjects)
      .input("InsuranceCalc", sql.Int, InsuranceCalc)
      .input("BakhshnameNo", sql.NVarChar(15), BakhshnameNo)
      .input("ViewInSoratHesab", sql.TinyInt, ViewInSoratHesab)
      .input("MatnSaleProjects", sql.NVarChar(500), MatnSaleProjects)
      .input("MatnSale", sql.NVarChar(500), MatnSale)
      .input("MatnSanad", sql.NVarChar(500), MatnSanad)
      .input("MatnInternet", sql.VarChar(500), MatnInternet)
      .input("Flag", sql.TinyInt, Flag)
      .input("TakmilMaliSoud", sql.TinyInt, TakmilMaliSoud)
      .input("NumberingCalc", sql.TinyInt, NumberingCalc)
      .input("HemayatCalc", sql.TinyInt, HemayatCalc)

      .input("HavePorseshname", sql.TinyInt, HavePorseshname)
      .input("EffectiveDateInternet", sql.VarChar(10), EffectiveDateInternet)
      .input("ExpaireDateInternet", sql.VarChar(10), ExpaireDateInternet)
      .input("MaxKhodroInResponInternet", sql.Int, MaxKhodroInResponInternet)
      .input("Modelsal", sql.Int, Modelsal)
      .input("StandardNo", sql.VarChar(10), StandardNo)
      .input("HoghoghiNo", sql.NVarChar(20), HoghoghiNo)
      .input("StateEndDateSoud", sql.Int, StateEndDateSoud)
      .input("ResponExpireDate", sql.VarChar(10), ResponExpireDate)
      .input("UserID", sql.VarChar(10), UserLogin)
      .input("Is18YearsOld", sql.Int, Is18YearsOld)
      .input("SanadRahnInSaleProject", sql.Int, SanadRahnInSaleProject)
      .input("SanadRahnInSaleProjectDescr", sql.NVarChar(200), SanadRahnInSaleProjectDescr)
      .input("IDUsage", sql.Int, IDUsage)
      .input("TahvilFori", sql.Int, TahvilFori)
      .input("BodyInsurCalc", sql.Int, BodyInsurCalc)
      .input("TarhinSanadCalc", sql.Int, TarhinSanadCalc)
      .input("IsPrinted", sql.Int, IsPrinted)
      .input("ComputerName", sql.VarChar(50), clientIp)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "ذخیره اطلاعات با موفقیت انجام شد",

      }
    else return {
      statusResult: 1,
      message: result.output.msgRet,
    }
  } catch (err) {
    console.log("err.message", err.message)
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };

  }

}
async function SaleProjectsDelete(req) {
  try {
    const { ID } = req.body;
    let spName = "sale.uspSaleProjectsDelete";
    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("ID", sql.Int, ID)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);



    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "حذف اطلاعات با موفقیت انجام شد",

      }
    else return {
      statusResult: 1,
      message: result.output.msgRet,
    }
  } catch (err) {
    console.log("err.message", err.message)
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };

  }
}
async function getPrePaymentList(req, res) {
  try {

    const { idSaleProject } = req.body.firstParams;
    let userFilter = 'idSaleProject=' + idSaleProject

    var query = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.VPrePayment', '*', userFilter)
    let pool = await pools.getPool('Sale')
    let result = await pool.request().query(query)

    return {
      statusResult: 0,
      rows: result.recordsets[0],
      totalRecords: result.recordsets[1][0].totalCount,
    }
  } catch (err) {
    console.log("err.message", err.message)
    throw (err)
  }
}
async function getPrePaymentUIData(req) {
  try {
    const { idSaleProject } = req.body;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input("idSaleProject", sql.Int, idSaleProject)
      .execute('Sale.sale.uspGetPrePaymentUIData')
    // var registerInfo=result.recordsets[0][0];
    return {
      statusResult: 0,
      message: "خواندن موفق",
      typeSanadPishDaryaft: result.recordsets[0],
      typePayment: result.recordsets[1],
      typeVosolCheq: result.recordsets[2],
      counter: result.recordsets[3][0],


    };
  } catch (err) {
    console.log("err,message", err.message)
    // return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}
async function PrePaymentInsert(req) {
  try {
    const { id, idSaleProject, Title, TitleEng, PreiodFromFirst, RateOfKarmozdCheq, Amount, KarmozdCheq, PrePaymentDelay, idTypeSanadPishDaryaft
      , idTypePayment, idTypeVosolCheq } = req.body;
    let spName = "sale.uspPrePaymentInsert";
    let UserLogin = req.privateData.UserLogin;


    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("idSaleProject", sql.Int, idSaleProject)
      .input("Title", sql.NVarChar(40), Title)
      .input("TitleEng", sql.VarChar(40), TitleEng)
      .input("PreiodFromFirst", sql.Int, PreiodFromFirst)
      .input("RateOfKarmozdCheq", sql.Float, RateOfKarmozdCheq)
      .input("Amount", sql.Numeric, Amount)
      .input("KarmozdCheq", sql.Numeric, KarmozdCheq)
      .input("PrePaymentDelay", sql.Int, PrePaymentDelay)
      .input("idTypeSanadPishDaryaft", sql.Int, idTypeSanadPishDaryaft)
      .input("idTypePayment", sql.Int, idTypePayment)
      .input("idTypeVosolCheq", sql.Int, idTypeVosolCheq)
      .input("UserID", sql.VarChar(10), UserLogin)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "ذخیره اطلاعات با موفقیت انجام شد",

      }
    else return {
      statusResult: 1,
      message: result.output.msgRet,
    }
  } catch (err) {
    console.log("err.message", err.message)
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };

  }
}
async function PrePaymentUpdate(req) {
  try {
    const { id, idSaleProject, Title, TitleEng, PreiodFromFirst, RateOfKarmozdCheq, Amount, KarmozdCheq, PrePaymentDelay, idTypeSanadPishDaryaft
      , idTypePayment, idTypeVosolCheq } = req.body;
    let spName = "sale.uspPrePaymentUpdate";
    let UserLogin = req.privateData.UserLogin;


    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("idSaleProject", sql.Int, idSaleProject)
      .input("Title", sql.NVarChar(40), Title)
      .input("TitleEng", sql.VarChar(40), TitleEng)
      .input("PreiodFromFirst", sql.Int, PreiodFromFirst)
      .input("RateOfKarmozdCheq", sql.Float, RateOfKarmozdCheq)
      .input("Amount", sql.Numeric, Amount)
      .input("KarmozdCheq", sql.Numeric, KarmozdCheq)
      .input("PrePaymentDelay", sql.Int, PrePaymentDelay)
      .input("idTypeSanadPishDaryaft", sql.Int, idTypeSanadPishDaryaft)
      .input("idTypePayment", sql.Int, idTypePayment)
      .input("idTypeVosolCheq", sql.Int, idTypeVosolCheq)
      .input("UserID", sql.VarChar(10), UserLogin)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "ویرایش اطلاعات با موفقیت انجام شد",

      }
    else return {
      statusResult: 1,
      message: result.output.msgRet,
    }
  } catch (err) {
    console.log("err.message", err.message)
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };

  }
}
async function PrePaymentDelete(req) {
  try {
    const { id } = req.body;
    let spName = "sale.uspPrePaymentDelete";
    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("id", sql.Int, id)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "حذف اطلاعات با موفقیت انجام شد",

      }
    else return {
      statusResult: 1,
      message: result.output.msgRet,
    }
  } catch (err) {
    console.log("err.message", err.message)
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };

  }
}
async function getFactorSoudList(req, res) {
  try {

    const { idSaleProject } = req.body.firstParams;
    let userFilter = 'idSaleProject=' + idSaleProject

    var query = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.VFactorSoudBase', '*', userFilter)
    let pool = await pools.getPool('Sale')
    let result = await pool.request().query(query)

    return {
      statusResult: 0,
      rows: result.recordsets[0],
      totalRecords: result.recordsets[1][0].totalCount,
    }
  } catch (err) {
    console.log("err.message", err.message)
    throw (err)
  }
}
async function getFactorSoudUIData(req) {
  try {
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .execute('Sale.sale.uspGetFactorSoudUIData')
    // var registerInfo=result.recordsets[0][0];
    return {
      statusResult: 0,
      message: "خواندن موفق",
      lemCalculate: result.recordsets[0],
      calcSoudDate: result.recordsets[1],

    };
  } catch (err) {
    console.log("err,message", err.message)
    // return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}
async function FactorSoudInsert(req) {
  try {
    const { ID, IDSaleProject, Title, TitleEng, IDBaseCalcSoudDate, IDLemCalculate, VariationDate, VariationDelay, VariationDelayNoPay, CoefficientPayment
      , ExpireDate } = req.body;
    let spName = "sale.uspFactorSoudInsert";
    let UserLogin = req.privateData.UserLogin;


    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("ID", sql.Int, ID)
      .input("IDSaleProject", sql.Int, IDSaleProject)
      .input("Title", sql.NVarChar(50), Title)
      .input("TitleEng", sql.VarChar(50), TitleEng)
      .input("IDBaseCalcSoudDate", sql.Int, IDBaseCalcSoudDate)
      .input("IDLemCalculate", sql.Int, IDLemCalculate)
      .input("VariationDate", sql.VarChar(10), VariationDate)
      .input("VariationDelay", sql.Int, VariationDelay)
      .input("VariationDelayNoPay", sql.Int, VariationDelayNoPay)
      .input("CoefficientPayment", sql.Float, CoefficientPayment)
      .input("ExpireDate", sql.VarChar(10), ExpireDate)
      .input("UserID", sql.VarChar(10), UserLogin)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "ذخیره اطلاعات با موفقیت انجام شد",

      }
    else return {
      statusResult: 1,
      message: result.output.msgRet,
    }
  } catch (err) {
    console.log("err.message", err.message)
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };

  }
}
async function FactorSoudUpdate(req) {
  try {
    const { ID, IDSaleProject, Title, TitleEng, IDBaseCalcSoudDate, IDLemCalculate, VariationDate, VariationDelay, VariationDelayNoPay, CoefficientPayment
      , ExpireDate } = req.body;
    let spName = "sale.uspFactorSoudUpdate";
    let UserLogin = req.privateData.UserLogin;


    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("ID", sql.Int, ID)
      .input("IDSaleProject", sql.Int, IDSaleProject)
      .input("Title", sql.NVarChar(50), Title)
      .input("TitleEng", sql.VarChar(50), TitleEng)
      .input("IDBaseCalcSoudDate", sql.Int, IDBaseCalcSoudDate)
      .input("IDLemCalculate", sql.Int, IDLemCalculate)
      .input("VariationDate", sql.VarChar(10), VariationDate)
      .input("VariationDelay", sql.Int, VariationDelay)
      .input("VariationDelayNoPay", sql.Int, VariationDelayNoPay)
      .input("CoefficientPayment", sql.Float, CoefficientPayment)
      .input("ExpireDate", sql.VarChar(10), ExpireDate)
      .input("UserID", sql.VarChar(10), UserLogin)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "ویرایش اطلاعات با موفقیت انجام شد",

      }
    else return {
      statusResult: 1,
      message: result.output.msgRet,
    }
  } catch (err) {
    console.log("err.message", err.message)
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };

  }
}
async function FactorSoudDelete(req) {
  try {
    const { ID } = req.body;
    let spName = "sale.uspFactorSoudDelete";
    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("ID", sql.Int, ID)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "حذف اطلاعات با موفقیت انجام شد",

      }
    else return {
      statusResult: 1,
      message: result.output.msgRet,
    }
  } catch (err) {
    console.log("err.message", err.message)
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };

  }
}
async function getEsterdadSoudList(req, res) {
  try {

    const { IDSaleProject } = req.body.firstParams;
    let userFilter = 'IDSaleProject=' + IDSaleProject

    var query = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.VEsterdadSoudBase', '*', userFilter)
    let pool = await pools.getPool('Sale')
    let result = await pool.request().query(query)

    return {
      statusResult: 0,
      rows: result.recordsets[0],
      totalRecords: result.recordsets[1][0].totalCount,
    }
  } catch (err) {
    console.log("err.message", err.message)
    throw (err)
  }
}
async function getEsterdadSoudUIData(req) {
  try {
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .execute('Sale.sale.uspGetEsterdadSoudUIData')

    return {
      statusResult: 0,
      message: "خواندن موفق",
      calcSoudDate: result.recordsets[0],
      calculateEsterdad: result.recordsets[1],

    };
  } catch (err) {
    console.log("err,message", err.message)
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}
async function EsterdadSoudInsert(req) {
  try {
    const { ID, IDSaleProject, Title, TitleEng, IDBaseCalcEstrdDate, idLemCalculate, VariationDate, VariationDelay, VariationDayNoSoud, CoefficientPayment, MaxDaySoudEsterdad
      , ExpireDate } = req.body;
    let spName = "sale.uspEsterdadSoudInsert";
    let UserLogin = req.privateData.UserLogin;


    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("ID", sql.Int, ID)
      .input("IDSaleProject", sql.Int, IDSaleProject)
      .input("Title", sql.NVarChar(50), Title)
      .input("TitleEng", sql.VarChar(50), TitleEng)
      .input("IDBaseCalcEstrdDate", sql.Int, IDBaseCalcEstrdDate)
      .input("idLemCalculate", sql.Int, idLemCalculate)
      .input("VariationDate", sql.VarChar(10), VariationDate)
      .input("VariationDelay", sql.Int, VariationDelay)
      .input("VariationDayNoSoud", sql.Int, VariationDayNoSoud)
      .input("CoefficientPayment", sql.Float, CoefficientPayment)
      .input("MaxDaySoudEsterdad", sql.Int, MaxDaySoudEsterdad)
      .input("ExpireDate", sql.VarChar(10), ExpireDate)
      .input("UserID", sql.VarChar(10), UserLogin)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "ذخیره اطلاعات با موفقیت انجام شد",

      }
    else return {
      statusResult: 1,
      message: result.output.msgRet,
    }
  } catch (err) {
    console.log("err.message", err.message)
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };

  }
}
async function EsterdadSoudUpdate(req) {
  try {
    const { ID, IDSaleProject, Title, TitleEng, IDBaseCalcEstrdDate, idLemCalculate, VariationDate, VariationDelay, VariationDayNoSoud, CoefficientPayment, MaxDaySoudEsterdad
      , ExpireDate } = req.body;
    let spName = "sale.uspEsterdadSoudUpdate";
    let UserLogin = req.privateData.UserLogin;


    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("ID", sql.Int, ID)
      .input("IDSaleProject", sql.Int, IDSaleProject)
      .input("Title", sql.NVarChar(50), Title)
      .input("TitleEng", sql.VarChar(50), TitleEng)
      .input("IDBaseCalcEstrdDate", sql.Int, IDBaseCalcEstrdDate)
      .input("idLemCalculate", sql.Int, idLemCalculate)
      .input("VariationDate", sql.VarChar(10), VariationDate)
      .input("VariationDelay", sql.Int, VariationDelay)
      .input("VariationDayNoSoud", sql.Int, VariationDayNoSoud)
      .input("CoefficientPayment", sql.Float, CoefficientPayment)
      .input("MaxDaySoudEsterdad", sql.Int, MaxDaySoudEsterdad)
      .input("ExpireDate", sql.VarChar(10), ExpireDate)
      .input("UserID", sql.VarChar(10), UserLogin)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "ویرایش اطلاعات با موفقیت انجام شد",

      }
    else return {
      statusResult: 1,
      message: result.output.msgRet,
    }
  } catch (err) {
    console.log("err.message", err.message)
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };

  }
}
async function EsterdadSoudDelete(req) {
  try {
    const { ID } = req.body;
    let spName = "sale.uspEsterdadSoudDelete";
    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("ID", sql.Int, ID)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "حذف اطلاعات با موفقیت انجام شد",

      }
    else return {
      statusResult: 1,
      message: result.output.msgRet,
    }
  } catch (err) {
    console.log("err.message", err.message)
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };

  }
}
async function getTakhfifDeliverList(req, res) {
  try {

    const { IDSaleProject } = req.body.firstParams;
    let userFilter = 'IDSaleProject=' + IDSaleProject

    var query = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.VTakhfifDeliver', '*', userFilter)
    let pool = await pools.getPool('Sale')
    let result = await pool.request().query(query)

    return {
      statusResult: 0,
      rows: result.recordsets[0],
      totalRecords: result.recordsets[1][0].totalCount,
    }
  } catch (err) {
    console.log("err.message", err.message)
    throw (err)
  }
}
async function TakhfifDeliverInsert(req) {
  try {
    const { ID, IDSaleProject, Title, TitleEng, VariationDate, VariationDelay, VariationAmount, IDUnitVariationAmount, CoefficientAmount, ExpireDate, Descr } = req.body;
    let spName = "sale.uspTakhfifDeliverInsert";
    let UserLogin = req.privateData.UserLogin;

    // console.log("req.body" , req.body)

    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("ID", sql.Int, ID)
      .input("IDSaleProject", sql.Int, IDSaleProject)
      .input("Title", sql.NVarChar(50), Title)
      .input("TitleEng", sql.VarChar(50), TitleEng)
      .input("VariationDate", sql.VarChar(10), VariationDate)
      .input("VariationDelay", sql.Int, VariationDelay)
      .input("VariationAmount", sql.Numeric, VariationAmount)
      .input("IDUnitVariationAmount", sql.Int, IDUnitVariationAmount)
      .input("CoefficientAmount", sql.Float, CoefficientAmount)
      .input("ExpireDate", sql.VarChar(10), ExpireDate)
      .input("Descr", sql.NVarChar(500), Descr)
      .input("UserID", sql.VarChar(10), UserLogin)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "ذخیره اطلاعات با موفقیت انجام شد",

      }
    else return {
      statusResult: 1,
      message: result.output.msgRet,
    }
  } catch (err) {
    console.log("err.message", err.message)
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };

  }
}

async function TakhfifDeliverUpdate(req) {
  try {
    const { ID, IDSaleProject, Title, TitleEng, VariationDate, VariationDelay, VariationAmount, IDUnitVariationAmount, CoefficientAmount, ExpireDate, Descr } = req.body;
    let spName = "sale.uspTakhfifDeliverUpdate";
    let UserLogin = req.privateData.UserLogin;

    console.log(req.body)
    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("ID", sql.Int, ID)
      .input("IDSaleProject", sql.Int, IDSaleProject)
      .input("Title", sql.NVarChar(50), Title)
      .input("TitleEng", sql.VarChar(50), TitleEng)
      .input("VariationDate", sql.VarChar(10), VariationDate)
      .input("VariationDelay", sql.Int, VariationDelay)
      .input("VariationAmount", sql.Numeric, VariationAmount)
      .input("IDUnitVariationAmount", sql.Int, IDUnitVariationAmount)
      .input("CoefficientAmount", sql.Float, CoefficientAmount)
      .input("ExpireDate", sql.VarChar(10), ExpireDate)
      .input("Descr", sql.NVarChar(500), Descr)
      .input("UserID", sql.VarChar(10), UserLogin)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "ویرایش اطلاعات با موفقیت انجام شد",

      }
    else return {
      statusResult: 1,
      message: result.output.msgRet,
    }
  } catch (err) {
    console.log("err.message", err.message)
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };

  }
}
async function TakhfifDeliverDelete(req) {
  try {
    const { ID } = req.body;
    let spName = "sale.uspTakhfifDeliverDelete";
    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("ID", sql.Int, ID)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "حذف اطلاعات با موفقیت انجام شد",

      }
    else return {
      statusResult: 1,
      message: result.output.msgRet,
    }
  } catch (err) {
    console.log("err.message", err.message)
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };

  }
}
async function getIncreasePriceList(req, res) {
  try {

    const { IDSaleProject } = req.body.firstParams;
    let userFilter = 'IDSaleProject=' + IDSaleProject

    var query = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.VIncreaseInPriceDeliver', '*', userFilter)
    let pool = await pools.getPool('Sale')
    let result = await pool.request().query(query)

    return {
      statusResult: 0,
      rows: result.recordsets[0],
      totalRecords: result.recordsets[1][0].totalCount,
    }
  } catch (err) {
    console.log("err.message", err.message)
    throw (err)
  }
}
async function IncreasePriceInsert(req) {
  try {
    const { ID, IDSaleProject, Title, TitleEng, VariationDate, VariationDelay, VariationAmount, IDUnitVariationAmount, CoefficientAmount, ExpireDate } = req.body;
    let spName = "sale.uspIncreasePriceInsert";
    let UserLogin = req.privateData.UserLogin;

    // console.log("req.body" , req.body)

    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("ID", sql.Int, ID)
      .input("IDSaleProject", sql.Int, IDSaleProject)
      .input("Title", sql.NVarChar(50), Title)
      .input("TitleEng", sql.VarChar(50), TitleEng)
      .input("VariationDate", sql.VarChar(10), VariationDate)
      .input("VariationDelay", sql.Int, VariationDelay)
      .input("VariationAmount", sql.Numeric, VariationAmount)
      .input("IDUnitVariationAmount", sql.Int, IDUnitVariationAmount)
      .input("CoefficientAmount", sql.Float, CoefficientAmount)
      .input("ExpireDate", sql.VarChar(10), ExpireDate)
      .input("UserID", sql.VarChar(10), UserLogin)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "ذخیره اطلاعات با موفقیت انجام شد",

      }
    else return {
      statusResult: 1,
      message: result.output.msgRet,
    }
  } catch (err) {
    console.log("err.message", err.message)
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };

  }
}

async function IncreasePriceUpdate(req) {
  try {
    const { ID, IDSaleProject, Title, TitleEng, VariationDate, VariationDelay, VariationAmount, IDUnitVariationAmount, CoefficientAmount, ExpireDate } = req.body;
    let spName = "sale.uspIncreasePriceUpdate";
    let UserLogin = req.privateData.UserLogin;


    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("ID", sql.Int, ID)
      .input("IDSaleProject", sql.Int, IDSaleProject)
      .input("Title", sql.NVarChar(50), Title)
      .input("TitleEng", sql.VarChar(50), TitleEng)
      .input("VariationDate", sql.VarChar(10), VariationDate)
      .input("VariationDelay", sql.Int, VariationDelay)
      .input("VariationAmount", sql.Numeric, VariationAmount)
      .input("IDUnitVariationAmount", sql.Int, IDUnitVariationAmount)
      .input("CoefficientAmount", sql.Float, CoefficientAmount)
      .input("ExpireDate", sql.VarChar(10), ExpireDate)
      .input("UserID", sql.VarChar(10), UserLogin)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "ویرایش اطلاعات با موفقیت انجام شد",

      }
    else return {
      statusResult: 1,
      message: result.output.msgRet,
    }
  } catch (err) {
    console.log("err.message", err.message)
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };

  }
}
async function IncreasePriceDelete(req) {
  try {
    const { ID } = req.body;
    let spName = "sale.uspIncreasePriceDelete";
    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("ID", sql.Int, ID)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "حذف اطلاعات با موفقیت انجام شد",

      }
    else return {
      statusResult: 1,
      message: result.output.msgRet,
    }
  } catch (err) {
    console.log("err.message", err.message)
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };

  }
}
async function getResponHazinehList(req, res) {
  try {

    const { idSaleProject } = req.body.firstParams;
    let userFilter = 'IdTypeHazine=1 and IDSaleProject=' + idSaleProject

    var query = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.VHazineBase', '*', userFilter)
    let pool = await pools.getPool('Sale')
    let result = await pool.request().query(query)

    return {
      statusResult: 0,
      rows: result.recordsets[0],
      totalRecords: result.recordsets[1][0].totalCount,
    }
  } catch (err) {
    console.log("err.message", err.message)
    throw (err)
  }
}
async function getResponHazinehUIData(req) {
  try {
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .execute('sale.uspGetResponHazinehUIData')
    // var registerInfo=result.recordsets[0][0];
    return {
      statusResult: 0,
      message: "خواندن موفق",
      hazineh: result.recordsets[0],
      typeBaseHazineh: result.recordsets[1],

    };
  } catch (err) {
    console.log("err,message", err.message)
    // return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}
async function ResponHazinehInsert(req) {
  try {
    const { ID, IDHazine, IDSaleProject, IDTypeBaseHazine, EffectiveDate, ExpireDate, ValueAmount, IDUnitMoney } = req.body;
    let spName = "sale.uspResponHazinehInsert";
    let UserLogin = req.privateData.UserLogin;

    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("ID", sql.Int, ID)
      .input("IDHazine", sql.Int, IDHazine)
      .input("IDSaleProject", sql.Int, IDSaleProject)
      .input("IDTypeBaseHazine", sql.Int, IDTypeBaseHazine)
      .input("EffectiveDate", sql.VarChar(10), EffectiveDate)
      .input("ExpireDate", sql.VarChar(10), ExpireDate)
      .input("ValueAmount", sql.Int, ValueAmount)
      .input("IDUnitMoney", sql.Int, IDUnitMoney)
      .input("UserID", sql.VarChar(10), UserLogin)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "ذخیره اطلاعات با موفقیت انجام شد",

      }
    else return {
      statusResult: 1,
      message: result.output.msgRet,
    }
  } catch (err) {
    console.log("err.message", err.message)
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };

  }
}
async function ResponHazinehUpdate(req) {
  try {
    const { ID, IDHazine, IDSaleProject, IDTypeBaseHazine, EffectiveDate, ExpireDate, ValueAmount, IDUnitMoney } = req.body;
    let spName = "sale.uspResponHazinehUpdate";
    let UserLogin = req.privateData.UserLogin;

    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("ID", sql.Int, ID)
      .input("IDHazine", sql.Int, IDHazine)
      .input("IDSaleProject", sql.Int, IDSaleProject)
      .input("IDTypeBaseHazine", sql.Int, IDTypeBaseHazine)
      .input("EffectiveDate", sql.VarChar(10), EffectiveDate)
      .input("ExpireDate", sql.VarChar(10), ExpireDate)
      .input("ValueAmount", sql.Int, ValueAmount)
      .input("IDUnitMoney", sql.Int, IDUnitMoney)
      .input("UserID", sql.VarChar(10), UserLogin)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "ویرایش اطلاعات با موفقیت انجام شد",

      }
    else return {
      statusResult: 1,
      message: result.output.msgRet,
    }
  } catch (err) {
    console.log("err.message", err.message)
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };

  }
}
async function ResponHazinehDelete(req) {
  try {
    const { ID } = req.body;
    let spName = "sale.uspResponHazinehDelete";
    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("ID", sql.Int, ID)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "حذف اطلاعات با موفقیت انجام شد",

      }
    else return {
      statusResult: 1,
      message: result.output.msgRet,
    }
  } catch (err) {
    console.log("err.message", err.message)
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };

  }
}
async function SaleProjectsCopy(req) {
  try {
    const { ID, Title } = req.body;
    let spName = "sale.uspSaleProjectsCopy";
    let UserLogin = req.privateData.UserLogin;

    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("ID", sql.Int, ID)
      .input("Title", sql.NVarChar(120), Title)
      .input("UserId", sql.VarChar(10), UserLogin)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);

    // console.log("req.body", req.body)
    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "طرح مقصد جدید کپی گردید ",

      }
    else
      return {
        statusResult: 1,
        message: result.output.msgRet,
      }
  } catch (err) {
    console.log("err.message", err.message)
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };

  }
}
async function getDueDeliverProgList(req, res) {
  try {

    const { IDSaleProject } = req.body.firstParams;
    let userFilter = 'IDSaleProject=' + IDSaleProject

    var query = SqlCommandCreator(req.body.lazyParams, 'dbo.VDueDeliverProg', '*', userFilter)
    let pool = await pools.getPool('Sale')
    let result = await pool.request().query(query)

    return {
      statusResult: 0,
      rows: result.recordsets[0],
      totalRecords: result.recordsets[1][0].totalCount,
    }
  } catch (err) {
    console.log("err.message", err.message)
    throw (err)
  }
}

async function getDueDeliverUIData(req) {

  try {
    const { IDDueDeliverProg } = req.body;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .execute('sale.uspGetDueDeliverUIData')
    return {
      statusResult: 0,
      message: "خواندن موفق",
      idDueDeliver: result.recordsets[0],
      // counter: result.recordsets[1][0],
      // TailDate: result.recordsets[2],
    };
  } catch (err) {
    console.log("err,message", err.message)
    // return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }


}
async function getDueDeliverExtraUIData(req) {
  try {
    const { IDDueDeliverProg } = req.body;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input("IDDueDeliverProg", sql.Int, IDDueDeliverProg)
      .execute('sale.uspGetDueDeliverExtraUIData')
    return {
      statusResult: 0,
      message: "خواندن موفق",
      // idDueDeliver: result.recordsets[0],
      counter: result.recordsets[0][0],
      TailDate: result.recordsets[1],
    };
  } catch (err) {
    console.log("err,message", err.message)
    // return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }

}
async function getDeliverExpireDate(req) {
  try {
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input("IDDueDeliver", sql.Int, req.body.IDDueDeliver)
      .input("YearOfDueDeliver", sql.VarChar(4), req.body.YearOfDueDeliver)
      .execute('sale.uspGetDeliverExpireDate')
    return {
      statusResult: 0,
      message: "خواندن موفق",
      ExpireDate: result.recordset[0],
    };
  } catch (err) {
    console.log("err,message", err.message)
    // return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }



}
async function DueDeliverProgInsert(req) {
  try {
    const { ID, IDSaleProject, IDDueDeliver, YearOfDueDeliver, NumberOfRegistration, NumberOfRegistrationAgency, NumberOfRegistrationCentral, NumberOfRegistrationInternet,
      ViewInAgency, ViewInSaleInternet, ViewInSale, Flag, ExpireDateAgency, ExpireDateDueDeliver, ExpireDateSale, ExpireDateSaleInternet } = req.body;
    let spName = "sale.uspDueDeliverProgInsert";
    let UserLogin = req.privateData.UserLogin;

  

    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("ID", sql.Int, ID)
      .input("IDSaleProject", sql.Int, IDSaleProject)
      .input("IDDueDeliver", sql.Int, IDDueDeliver)
      .input("YearOfDueDeliver", sql.VarChar(4), YearOfDueDeliver)
      .input("NumberOfRegistration", sql.Int, NumberOfRegistration)
      .input("NumberOfRegistrationAgency", sql.Int, NumberOfRegistrationAgency)
      .input("NumberOfRegistrationCentral", sql.Int, NumberOfRegistrationCentral)
      .input("NumberOfRegistrationInternet", sql.Int, NumberOfRegistrationInternet)
      .input("UserID", sql.VarChar(10), UserLogin)
      .input("ViewInAgency", sql.Int, ViewInAgency)
      .input("ViewInSaleInternet", sql.Int, ViewInSaleInternet)
      .input("ViewInSale", sql.Int, ViewInSale)
      .input("Flag", sql.Int, Flag)
      .input("ExpireDateAgency", sql.VarChar(10), ExpireDateAgency)
      .input("ExpireDateDueDeliver", sql.VarChar(10), ExpireDateDueDeliver)
      .input("ExpireDateSale", sql.VarChar(10), ExpireDateSale)
      .input("ExpireDateSaleInternet", sql.VarChar(10), ExpireDateSaleInternet)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);

    //  console.log("req.body ==>" , req.body)
    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "ذخیره اطلاعات با موفقیت انجام شد",

      }
    else return {
      statusResult: 1,
      message: result.output.msgRet,
    }
  } catch (err) {
    console.log("err.message", err.message)
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };

  }
}
async function DueDeliverProgUpdate(req) {
  try {
    const { ID, IDSaleProject, IDDueDeliver, YearOfDueDeliver, NumberOfRegistration, NumberOfRegistrationAgency, NumberOfRegistrationCentral, NumberOfRegistrationInternet,
      ViewInAgency, ViewInSaleInternet, ViewInSale, Flag, ExpireDateAgency, ExpireDateDueDeliver, ExpireDateSale, ExpireDateSaleInternet } = req.body;
    let spName = "sale.uspDueDeliverProgUpdate";
    let UserLogin = req.privateData.UserLogin;

    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("ID", sql.Int, ID)
      .input("IDSaleProject", sql.Int, IDSaleProject)
      .input("IDDueDeliver", sql.Int, IDDueDeliver)
      .input("YearOfDueDeliver", sql.VarChar(4), YearOfDueDeliver)
      .input("NumberOfRegistration", sql.Int, NumberOfRegistration)
      .input("NumberOfRegistrationAgency", sql.Int, NumberOfRegistrationAgency)
      .input("NumberOfRegistrationCentral", sql.Int, NumberOfRegistrationCentral)
      .input("NumberOfRegistrationInternet", sql.Int, NumberOfRegistrationInternet)
      .input("UserID", sql.VarChar(10), UserLogin)
      .input("ViewInAgency", sql.Int, ViewInAgency)
      .input("ViewInSaleInternet", sql.Int, ViewInSaleInternet)
      .input("ViewInSale", sql.Int, ViewInSale)
      .input("Flag", sql.Int, Flag)
      .input("ExpireDateAgency", sql.VarChar(10), ExpireDateAgency)
      .input("ExpireDateDueDeliver", sql.VarChar(10), ExpireDateDueDeliver)
      .input("ExpireDateSale", sql.VarChar(10), ExpireDateSale)
      .input("ExpireDateSaleInternet", sql.VarChar(10), ExpireDateSaleInternet)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);

    //  console.log("req.body ==>" , req.body)
    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "ویرایش اطلاعات با موفقیت انجام شد",

      }
    else return {
      statusResult: 1,
      message: result.output.msgRet,
    }
  } catch (err) {
    console.log("err.message", err.message)
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };

  }
}
async function DueDeliverProgDelete(req) {
  try {
    const { ID } = req.body;
    let spName = "sale.uspDueDeliverProgDelete";
    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("ID", sql.Int, ID)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "حذف اطلاعات با موفقیت انجام شد",

      }
    else return {
      statusResult: 1,
      message: result.output.msgRet,
    }
  } catch (err) {
    console.log("err.message", err.message)
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };

  }
}
async function getRelatOptionalList(req, res) {
  try {

    const { IDSaleProject } = req.body.firstParams;
    let userFilter = 'IDSaleProject=' + IDSaleProject + ' and TypeOption=1'
    var query = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.VOptionRialSaleProject', '*', userFilter)

    console.log("query ==>", query)
    let pool = await pools.getPool('Sale')
    let result = await pool.request().query(query)

    return {
      statusResult: 0,
      rows: result.recordsets[0],
      totalRecords: result.recordsets[1][0].totalCount,
    }
  } catch (err) {
    console.log("err.message", err.message)
    throw (err)
  }
}
async function getRelatOptionalPickList(req, res) {
  try {
    const { idSaleProject, idmodel } = req.body.firstParams;
    let query = `select * from dbo.VOptionModel where idmodel=${idmodel} and TypeOption=1 and idOption not in(select idOption from TOptionRialSaleProject where idmodel=${idmodel} and TypeOption=1 and idSaleProject=${idSaleProject})`
    let pool = await pools.getPool('Sale')
    let result = await pool.request().query(query)
    return {
      statusResult: 0,
      rows: result.recordsets[0],
    }
  } catch (err) {
    console.log("err.message", err.message)
    throw (err)
  }
}
async function RelatOptionalInsert(req) {
  try {
    const { IDn, IDSaleProject, IDOption, Amount } = req.body;
    let spName = "sale.uspRelatOptionalInsert";
    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("IDn", sql.Int, IDn)
      .input("IDSaleProject", sql.Int, IDSaleProject)
      .input("IDOption", sql.Int, IDOption)
      .input("Amount", sql.Numeric(18, 0), Amount)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);

    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "ذخیره اطلاعات با موفقیت انجام شد",

      }
    else return {
      statusResult: 1,
      message: result.output.msgRet,
    }
  } catch (err) {
    console.log("err.message", err.message)
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };

  }
}
async function RelateOptionalDelete(req) {
  try {
    const { IDSaleProject, IDOption } = req.body;
    let spName = "sale.uspRelatOptionalDelete";
    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("IDSaleProject", sql.Int, IDSaleProject)
      .input("IDOption", sql.Int, IDOption)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "حذف اطلاعات با موفقیت انجام شد",

      }
    else return {
      statusResult: 1,
      message: result.output.msgRet,
    }
  } catch (err) {
    console.log("err.message", err.message)
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };

  }
}
async function getSaleProjectMessage(req, res) {
  try {
    // console.log('req.body', req.body)
    let userFilter = 'IDSaleProjects=' + req.body.IdSaleProjects

    var query = SqlCommandCreator(req.body.lazyParams, 'dbo.TSaleProjectMessage', '*', userFilter)
    console.log('query', query)
    let pool = await pools.getPool('Sale')
    let result = await pool.request().query(query)

    return {
      statusResult: 0,
      SaleProjectMessage: result.recordsets[0] ? result.recordsets[0][0] : '',
    }
  } catch (err) {
    console.log("err.message", err.message)
    throw (err)
  }
}
async function getCommissionList(req, res) {
  try {

    const { idSaleProjects } = req.body.firstParams;
    let userFilter = 'idSaleProjects=' + idSaleProjects

    var query = SqlCommandCreator(req.body.lazyParams, 'dbo.VSaleProjectsCommission', '*', userFilter)
    let pool = await pools.getPool('Sale')
    let result = await pool.request().query(query)

    return {
      statusResult: 0,
      rows: result.recordsets[0],
      totalRecords: result.recordsets[1][0].totalCount,
    }
  } catch (err) {
    console.log("err.message", err.message)
    throw (err)
  }
}
async function getCommissionExtraData(req) {
  try {
    const { idTypeSale } = req.body;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .execute('Sale.sale.uspGetCommissionExtraData')
    let userFilter = ''

    if (idTypeSale == 1)
      userFilter = 'IdlemSale<>2'
    else if (idTypeSale == 2)
      userFilter = 'IdlemSale=1'
    else if (idTypeSale == 3)
      userFilter = 'IdlemSale=2'
    else if (idTypeSale == 4)
      userFilter = 'IdlemSale=3'
    var QueryA = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.TLemSale', 'idLemSale as [value] , Title as [label]', userFilter)
    // var queryA  = `Select idLemSale as [value] , Title as [label] From TLemSale where '${Filter}'`
    let resultA = await pool.request().query(QueryA)
    // var registerInfo=result.recordsets[0][0];

    return {
      statusResult: 0,
      message: "خواندن موفق",
      typeAgencyCooperation: result.recordsets[0],
      typeCalcCommission: result.recordsets[1],
      lemSale: resultA.recordsets[0],



    };
  } catch (err) {
    console.log("err,message", err.message)
    // return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}
async function getStepCommission(req) {
  try {
    const { IdSaleProjects, IdTypeAgencyCooperation, IdTypeCalcCommission, IdLemSale } = req.body;



    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input("idSaleProjects", sql.Int, IdSaleProjects)
      .input("IdTypeAgencyCooperation", sql.Int, IdTypeAgencyCooperation)
      .input("IdTypeCalcCommission", sql.Int, IdTypeCalcCommission)
      .input("IdLemSale", sql.Int, IdLemSale)
      .execute('Sale.sale.uspGetStepCommission')

    return {
      statusResult: 0,
      message: "خواندن موفق",
      step: result.recordsets[0][0],

    };

  } catch (err) {
    console.log("err,message", err.message)
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}
async function SaleProjectsCommissionInsert(req) {
  try {
    const { IdSaleProjects, IdSaleProjectsCommission, IdTypeAgencyCooperation, IdTypeCalcCommission, IdLemSale, StartDate, EndDate, Step, LimmitOfStep, AmountCommission, Coefficient } = req.body;
    let spName = "sale.uspSaleProjectsCommissionInsert";
    let UserLogin = req.privateData.UserLogin;

    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("IdSaleProjects", sql.Int, IdSaleProjects)
      .input("IdSaleProjectsCommission", sql.Int, IdSaleProjectsCommission)
      .input("IdTypeAgencyCooperation", sql.Int, IdTypeAgencyCooperation)
      .input("IdTypeCalcCommission", sql.Int, IdTypeCalcCommission)
      .input("IdLemSale", sql.Int, IdLemSale)
      .input("StartDate", sql.VarChar(10), StartDate)
      .input("EndDate", sql.VarChar(10), EndDate)
      .input("Step", sql.Int, Step)
      .input("LimmitOfStep", sql.Int, LimmitOfStep)
      .input("AmountCommission", sql.Numeric(18, 0), AmountCommission)
      .input("Coefficient", sql.Float, Coefficient)
      .input("UserID", sql.VarChar(10), UserLogin)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);

    //  console.log("req.body ==>" , req.body)
    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "ذخیره اطلاعات با موفقیت انجام شد",

      }
    else return {
      statusResult: 1,
      message: result.output.msgRet,
    }
  } catch (err) {
    console.log("err.message", err.message)
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };

  }
}
async function SaleProjectsCommissionUpdate(req) {
  try {
    const { IdSaleProjects, IdSaleProjectsCommission, IdTypeAgencyCooperation, IdTypeCalcCommission, IdLemSale, StartDate, EndDate, Step, LimmitOfStep, AmountCommission, Coefficient } = req.body;
    let spName = "sale.uspSaleProjectsCommissionUpdate";
    let UserLogin = req.privateData.UserLogin;

    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("IdSaleProjects", sql.Int, IdSaleProjects)
      .input("IdSaleProjectsCommission", sql.Int, IdSaleProjectsCommission)
      .input("IdTypeAgencyCooperation", sql.Int, IdTypeAgencyCooperation)
      .input("IdTypeCalcCommission", sql.Int, IdTypeCalcCommission)
      .input("IdLemSale", sql.Int, IdLemSale)
      .input("StartDate", sql.VarChar(10), StartDate)
      .input("EndDate", sql.VarChar(10), EndDate)
      .input("Step", sql.Int, Step)
      .input("LimmitOfStep", sql.Int, LimmitOfStep)
      .input("AmountCommission", sql.Numeric(18, 0), AmountCommission)
      .input("Coefficient", sql.Float, Coefficient)
      .input("UserID", sql.VarChar(10), UserLogin)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);

    //  console.log("req.body ==>" , req.body)
    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "ذخیره اطلاعات با موفقیت انجام شد",

      }
    else return {
      statusResult: 1,
      message: result.output.msgRet,
    }
  } catch (err) {
    console.log("err.message", err.message)
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };

  }
}
async function SaleProjectsCommissionDelete(req) {
  try {
    const { IdSaleProjectsCommission } = req.body;
    let spName = "sale.uspSaleProjectsCommissionDelete";
    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("IdSaleProjectsCommission", sql.Int, IdSaleProjectsCommission)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "حذف اطلاعات با موفقیت انجام شد",

      }
    else return {
      statusResult: 1,
      message: result.output.msgRet,
    }
  } catch (err) {
    console.log("err.message", err.message)
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };

  }
}
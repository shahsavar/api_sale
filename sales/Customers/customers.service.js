const config = require('../../config.json');
const sql = require('mssql');
const pools = require('../../_helpers/pool-manegment');
const requestIp = require('request-ip');
const os = require('node:os');
const jwt = require('jsonwebtoken');
const axios = require('axios')
const cryptoService = require('../../public/crypto/crypto.service');
const {SqlCommandCreator} = require('../../_helpers/SqlCommandCreator');
const { errorMonitor } = require('node:events');
module.exports = {
    getCustomers,
    getCustomersAgency,
    getCustomerUIData,
    customerInsert,
    customerUpdate,
    customerDelete,
    getRelatCustomerWithAccount,
    getCustomerAccountUIData,
    CustomerAccountInsert,
    CustomerAccountUpdate,
    CustomerAccountDelete,
    getIntCustomerSheba,
    getCustomersPostalCode,
    verifyPostalCode,
    getCustomersForHerasat,
    TransferIntCustomerToCustomer,
    getPersonelSematUIData,
    getBardashVajhCustomnerList,
    getBardashtVajhCustomerUIData,
    bardashVajhCustomerInsert,
    bardashVajhCustomerUpdate,
    bardashVajhCustomerDelete,
    bardashVajhCustomerErsalMali,
    paymentUsedBardashtVajhCustomerInsert,
    bardashtVajhCustomerPrintUIData,
    
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

async function getCustomers(req) {
    const { first, rows, page } = req.body
    // فیلتری که با پارامتر می فرستد 
    let userFilter =''
    if(req.body.firstParams)
    userFilter = `ID=${req.body.firstParams}`

try {
        var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.vcustomer', '*', req.body.firstFilter,userFilter)
        let pool = await pools.getPool('Sale')
        let result = await pool.request()
            .query(myQuery)
           
        return {
            statusResult: 0,
            rows: result.recordsets[0],
            totalRecords: result.recordsets[1][0].totalCount,
        }
    } catch (err) {
        
        return err
    }
}

async function getCustomersAgency(req) {

    let UserLogin = req.privateData.UserLogin; 
    
try {

    var myQuery=''
       if (UserLogin.toLowerCase().startsWith('ikd')){
           myQuery = SqlCommandCreator(req.body.lazyParams, `Sale.dbo.udfCustomersAgency('${UserLogin}')`, '*', req.body.firstFilter)}
      else{
           myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.vcustomer', '*', req.body.firstFilter) }

        let pool = await pools.getPool('Sale')
        let result = await pool.request()       .query(myQuery)

        return {
            statusResult: 0,
            rows: result.recordsets[0],
            totalRecords: result.recordsets[1][0].totalCount,
        }
    } catch (err) {
        
        return err
    }
}


async function getRelatCustomerWithAccount(req) {
    const { first, rows, page } = req.body
    var data = req.body.filters

    try {
        var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.VRelatCustomerWithAccount', '*', req.body.firstFilter)
        let pool = await pools.getPool('Sale')
        let result = await pool.request()
            .query(myQuery)
        return {
            statusResult: 0,
            rows: result.recordsets[0],
            totalRecords: result.recordsets[1][0].totalCount,
        }
    } catch (err) {
        
        return err
    }
}

async function getCustomerAccountUIData(req) {
    try {
        const pool = await pools.getPool('Sale')
        let result = await pool.request()
            .execute('Sale.sale.uspGetCustomerAccountUIData')
        return {
            statusResult: 0,
            message: "خواندن موفق",
            typeAccounts: result.recordsets[0],
        };
    } catch (err) {
        return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    }
}

async function getPersonelSematUIData(req) {
    try {
        const pool = await pools.getPool('Sale')
        let result = await pool.request()
            .execute('Sale.sale.uspGetPersonelSematUIData')
        return {
            statusResult: 0,
            message: "خواندن موفق",
            typeAgencySemat: result.recordsets[0],
        };
    } catch (err) {
        return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    }
}


async function getCustomerUIData(req) {
    try {
        // var IdCustomer=req.privateData
        // const {systemCode}=req.body;
        const pool = await pools.getPool('Sale')
        let result = await pool.request()
            // .input('IdCustomer', sql.Int, IdCustomer)
            .execute('Sale.sale.uspGetCustomerUIData')
        // var registerInfo=result.recordsets[0][0];
        return {
            statusResult: 0,
            message: "خواندن موفق",
            //   registerInfo:registerInfo,
            cities: result.recordsets[0],
            // agencies:result.recordsets[2],
            // mojaver:result.recordsets[3]
        };
    } catch (err) {
        return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    }
}

async function customerInsert(req) {
    try {
        var clientIp = req.ip;

        let UserLogin = req.privateData.UserLogin; 
        const { Family, Name, FatherName, IDTypeCustomer, IDSex, CertificateNo, IDCityOfIssuance, IssuanceDate, NationalCode, IDTypeOrganization,
            BirthDate, IDCityOfBirth, EconomicCode, DriverLicence, EMail, Mobil,MobilEzafi , EmergencyPhoneNo, IDCityAddress, Address, PostalCode, Fax,LocalityCode } = req.body

             console.log('req.body', req.body)
        const pool = await pools.getPool('Sale')
        let result = await pool.request()
            .output('Code', sql.Int)
            .input('Family', sql.NVarChar(80), Family)
            .input('Name', sql.NVarChar(40), Name)
            .input('FatherName', sql.NVarChar(40), FatherName)
            .input('IdTypeCustomer', sql.Int, IDTypeCustomer)
            .input('IDSex', sql.Int, IDSex)
            .input('IdTypeOrganization', sql.Int, IDTypeOrganization)
            .input('IdGroupCustomer', sql.Int, 0)
            .input('CertificateNo', sql.NVarChar(15), CertificateNo)
            .input('IdCityOfIssuance', sql.Int, IDCityOfIssuance)
            .input('IssuanceDate', sql.NVarChar(10), IssuanceDate)
            .input('NationalCode', sql.NVarChar(15), NationalCode)
            .input('BirthDate', sql.NVarChar(10), BirthDate)
            .input('IdCityOfBirth', sql.Int, IDCityOfBirth)
            .input('Lender', sql.TinyInt, 0)
            .input('EconomicCode', sql.NVarChar(12), EconomicCode)
            .input('IdJob', sql.Int, 0)
            .input('DriverLicence', sql.NVarChar(9), DriverLicence)
            .input('TafsiliCode', sql.NVarChar(10), '')
            .input('Email', sql.NVarChar(50), EMail)
            .input('Mobil', sql.NVarChar(20), Mobil)
            .input('EmergencyPhoneNo', sql.NVarChar(15), EmergencyPhoneNo)
            .input('userId', sql.NVarChar(10), UserLogin)
            .input('IdCityAddress', sql.Int, IDCityAddress)
            .input('Address', sql.NVarChar(200), Address)
            .input('PostalCode', sql.NVarChar(10), PostalCode)
            .input('MobilEzafi', sql.NVarChar(20), MobilEzafi)
            .input('Fax', sql.NVarChar(15), Fax)
            .input('PhonNoEzafi', sql.NVarChar(15), '')
            .input('MojavezEslah', sql.Int, 0)
            .input('LocalityCode', sql.Int, LocalityCode)
            .input("clientIp", sql.VarChar(50), clientIp)
            .output('msgRet', sql.NVarChar(500))
            .execute('Sale.sale.uspCustomerInsert')
        if (result.output.msgRet != "") {
            return {
                statusResult: 1,
                message: result.output.msgRet
            };
        }
        return {
            statusResult: 0,
            message: `مشتری با کد ${result.output.Code} ذخیره گردید`,
            // customerCode:result.output.Code
        };
    } catch (err) {
        console.log('err', err)
        return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    }
}

async function customerUpdate(req) {
    try {
        var clientIp = req.ip;
        let UserLogin = req.privateData.UserLogin; 
        const { ID, Code, Family, Name, FatherName, IDTypeCustomer, IDSex, CertificateNo, IDCityOfIssuance, IssuanceDate, NationalCode, IDTypeOrganization,
            BirthDate, IDCityOfBirth, EconomicCode, DriverLicence, EMail, Mobil,MobilEzafi , EmergencyPhoneNo, IDCityAddress, Address, PostalCode, Fax,LocalityCode } = req.body
        const pool = await pools.getPool('Sale')
        let result = await pool.request()
            .input('Id', sql.Int, ID)
            .input('Code', sql.Int, Code)
            .input('Family', sql.NVarChar(80), Family)
            .input('Name', sql.NVarChar(40), Name)
            .input('FatherName', sql.NVarChar(40), FatherName)
            .input('IdTypeCustomer', sql.Int, IDTypeCustomer)
            .input('IDSex', sql.Int, IDSex)
            .input('IdTypeOrganization', sql.Int, IDTypeOrganization)
            .input('IdGroupCustomer', sql.Int, 0)
            .input('CertificateNo', sql.NVarChar(15), CertificateNo)
            .input('IdCityOfIssuance', sql.Int, IDCityOfIssuance)
            .input('IssuanceDate', sql.NVarChar(10), IssuanceDate)
            .input('NationalCode', sql.NVarChar(15), NationalCode)
            .input('BirthDate', sql.NVarChar(10), BirthDate)
            .input('IdCityOfBirth', sql.Int, IDCityOfBirth)
            .input('Lender', sql.TinyInt, 0)
            .input('EconomicCode', sql.NVarChar(12), EconomicCode)
            .input('IdJob', sql.Int, 0)
            .input('DriverLicence', sql.NVarChar(9), DriverLicence)
            .input('TafsiliCode', sql.NVarChar(10), '')
            .input('Email', sql.NVarChar(50), EMail)
            .input('Mobil', sql.NVarChar(20), Mobil)
            .input('EmergencyPhoneNo', sql.NVarChar(15), EmergencyPhoneNo)
            .input('userId', sql.NVarChar(10), UserLogin)
            .input('IdCityAddress', sql.Int, IDCityAddress)
            .input('Address', sql.NVarChar(200), Address)
            .input('PostalCode', sql.NVarChar(10), PostalCode)
            .input('MobilEzafi', sql.NVarChar(20), MobilEzafi)
            .input('Fax', sql.NVarChar(15), Fax)
            .input('PhonNoEzafi', sql.NVarChar(15), '')
            .input('MojavezEslah', sql.Int, 0)
            .input('LocalityCode', sql.Int, LocalityCode)
            .input("clientIp", sql.VarChar(50), clientIp)
            .output('msgRet', sql.NVarChar(500))
            .execute('Sale.sale.uspCustomerUpdate')
        if (result.output.msgRet != "") {
            return {
                statusResult: 1,
                message: result.output.msgRet
            };
        }
        return {
            statusResult: 0,
            message: "ویرایش اطلاعات با موفقیت انجام شد",
            customerCode: result.output.Code
        };
    } catch (err) {
        
        return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    }
}

async function customerDelete(req) {
    try {
        let UserLogin = req.privateData.UserLogin; 
        const { Id } = req.body
        const pool = await pools.getPool('Sale')
        let result = await pool.request()
            .input('ID', sql.Int, Id)
            .input('userId', sql.NVarChar(10), UserLogin)
            .output('msgRet', sql.NVarChar(500))
            .execute('Sale.sale.uspCustomerDelete')
        if (result.output.msgRet != "") {
            return {
                statusResult: 1,
                message: result.output.msgRet
            };
        }
        return {
            statusResult: 0,
            message: "حذف با موفقیت انجام شد",
        };
    } catch (err) {
        
        return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    }
}

async function CustomerAccountUpdate(req) {
    try {
        let UserLogin = req.privateData.UserLogin; 
        const pool = await pools.getPool('Sale')
        let result = await pool.request()
            .input('id', sql.Int, req.body.ID)
            .input('idCustomer', sql.Int, req.body.idCustomer)
            .input('idAccount', sql.Int, req.body.idAccount.value)
            .input('ShebaNo', sql.NVarChar(26), 'IR' + req.body.ShebaNo)
            .input('AccountNo', sql.NVarChar(20), req.body.AccountNo)
            .input('UserID', sql.NVarChar(10), UserLogin)
            .output('msgRet', sql.NVarChar(500))
            .execute('sale.uspTRelatCustomerWithAccountUpdate')
        if (result.output.msgRet != "") {
            return {
                statusResult: 1,
                message: result.output.msgRet
            };
        }
        return {
            statusResult: 0,
            message: "ویرایش اطلاعات با موفقیت انجام شد",
        };
    } catch (err) {
        // 
        return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    }
}

async function CustomerAccountInsert(req) {
    try {
        let UserLogin = req.privateData.UserLogin; 
        const pool = await pools.getPool('Sale')
        let result = await pool.request()
            .input('idCustomer', sql.Int, req.body.idCustomer)
            .input('idAccount', sql.Int, req.body.idAccount.value)
            .input('ShebaNo', sql.NVarChar(26), 'IR' + req.body.ShebaNo)
            .input('AccountNo', sql.NVarChar(20), req.body.AccountNo)
            .input('UserID', sql.NVarChar(10), UserLogin)
            .output('msgRet', sql.NVarChar(500))
            .execute('sale.uspTRelatCustomerWithAccountInsert')
        if (result.output.msgRet != "") {
            return {
                statusResult: 1,
                message: result.output.msgRet
            };
        }
        return {
            statusResult: 0,
            message: "ذخیره اطلاعات با موفقیت انجام شد",
        };
    } catch (err) {
        
        return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    }
}

async function CustomerAccountDelete(req) {
    try {

        let UserLogin = req.privateData.UserLogin; 
        const { Id } = req.body
        const pool = await pools.getPool('Sale')
        let result = await pool.request()
            .input('idRelatCustomerWithAccount', sql.Int, req.body.ID)
            .output('msgRet', sql.NVarChar(500))
            .execute('sale.uspTRelatCustomerWithAccountDelete')
        if (result.output.msgRet != "") {
            return {
                statusResult: 1,
                message: result.output.msgRet
            };
        }
        return {
            statusResult: 0,
            message: "حذف با موفقیت انجام شد",
        };
    } catch (err) {
        return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    }
}


async function getIntCustomerSheba(req) {
    const { first, rows, page } = req.body
    //var data=req.body.filters
try {
        var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.vIntCustomerSheba', '*', req.body.firstFilter)
        let pool = await pools.getPool('Sale')
        let result = await pool.request()
            .query(myQuery)
        return {
            statusResult: 0,
            rows: result.recordsets[0],
            totalRecords: result.recordsets[1][0].totalCount,
        }
    } catch (err) {
        
        return err
    } 
}
const axiosConfigToken = (strData) => {
    const strBuffer = Buffer.from(strData);
    const strBase64 = strBuffer.toString("base64");
    return {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: `Basic ${strBase64}`,
      },
    };
  };
async function verifyPostalCode(req) {
    try {
      var v ="https://bos.behpardakht.com/bhrws/validator-service/getAddressByPostcode";
      let shahkarUrl = encodeURI(v);
      var config = axiosConfigToken("IranKhodroDiesel:77405411"); 
  
      const pool = await pools.getPool("Sale");

      let result = await pool.request().input("PostalCode", sql.NVarChar(15), req.body.PostalCode).execute('Sale.sale.uspGetPostExtraData')
      var CityId=result.recordset[0].CityId


      console.log('req :>> ', req.body.PostalCode);
      var res1 =  await axios.post(shahkarUrl, req.body.PostalCode.toString(), config);

      console.log('res1.data', res1.data)
        if (res1.data ) {
          let result =  pool
            .request()
            .input("Province", sql.NVarChar(100), res1.data.Province)
            .input("TownShip", sql.NVarChar(100), res1.data.TownShip)
            .input("Zone", sql.NVarChar(100), res1.data.Zone)
            .input("Village", sql.NVarChar(100), res1.data.Village)
            .input("LocalityType", sql.NVarChar(100), res1.data.LocalityType)
            .input("LocalityName", sql.NVarChar(100), res1.data.LocalityName)
            .input("LocalityCode", sql.Int, res1.data.LocalityCode)
            .input("SubLocality", sql.NVarChar(100), res1.data.SubLocality)
            .input("MainAvenuel", sql.NVarChar(100), res1.data.MainAvenuel)
            .input("Street", sql.NVarChar(100), res1.data.Street)
            .input("Street2", sql.NVarChar(100), res1.data.Street2)
            .input("HouseNumber",sql.Int, res1.data.HouseNumber)
            .input("Floor", sql.NVarChar(100), res1.data.Floor)
            .input("SideFloor", sql.NVarChar(100), res1.data.SideFloor)  
            .input("Description", sql.NVarChar(200), res1.data.Description)
            .input("errorMessage", sql.NVarChar(200), res1.data.errorMessage)
            .input("errorCode", sql.Int, res1.data.errorCode)  
            .input("PostalCode", sql.NVarChar(15), req.body.PostalCode)
            // .output("CityId", sql.Int)
            .execute("Sale.dbo.uspInsTCityPost");
          
        }

       let FullAddress = 'استان '+res1.data.Province+' - شهرستان '+res1.data.TownShip+' - بخش '+res1.data.Zone+' - '+res1.data.LocalityType+' '+res1.data.LocalityName+' - نام محله '+res1.data.SubLocality+' .... '
    //    +' - '+res1.data.Street+' - '+res1.data.Street2+' - پلاک '+res1.data.HouseNumber+' - طبقه '+res1.data.Floor+' - واحد '+res1.data.SideFloor 
//  console.log('FullAddress', FullAddress)

 if(res1.data.errorCode==0 && res1.data.LocalityCode!=0)
    return { "CityId": CityId, statusResult: res1.data.errorCode,"LocalityCode":res1.data.LocalityCode,"FullAddress":FullAddress,message:res1.data.errorMessage}
 else
    return { "CityId": 0, statusResult: res1.data.errorCode,"LocalityCode":res1.data.LocalityCode,"FullAddress":'',message:res1.data.errorMessage}
       
      /*
      result.recordset.forEach((element) => {
        var res1 =  axios.post(shahkarUrl, element.PostalCode.toString(), config);
        console.log('res1 :>> ', res1);
        if (res1.data && res1.data.errorCode == 0) {
          let result2 = pool 
            .request()
            .input("Province", sql.NVarChar(100), res1.data.Province)
            .input("TownShip", sql.NVarChar(100), res1.data.TownShip)
            .input("CityId", sql.Int, element.CityId)
            .execute("Sale.dbo.uspInsTCityPost");
        }
      });
      */
    } catch (err) {
      console.log("err", err);
      return { "CityId": 0, statusResult: -1,"LocalityCode":res1.data.LocalityCode,"FullAddress":'',message:err.message}
      //return { statusResult: 2, message: err.message };
    }
  }

  async function getCustomersPostalCode(req) {
    const { first, rows, page } = req.body
    //var data=req.body.filters
try {
        var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.sale.vwCustomersPostalCode', '*', req.body.firstFilter)

        let pool = await pools.getPool('Sale')
        let result = await pool.request()
            .query(myQuery)
        return {
            statusResult: 0,
            rows: result.recordsets[0],
            totalRecords: result.recordsets[1][0].totalCount,
        }
    } catch (err) {
        
        return err
    }
}

async function getCustomersForHerasat(req) {
    const { first, rows, page } = req.body
    //var data=req.body.filters
try {
        var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.sale.vwCustomersForHerasat', '*', req.body.firstFilter)

        let pool = await pools.getPool('Sale')
        let result = await pool.request()
            .query(myQuery)
        return {
            statusResult: 0,
            rows: result.recordsets[0],
            totalRecords: result.recordsets[1][0].totalCount,
        }
    } catch (err) {
        
        return err
    }
}

async function TransferIntCustomerToCustomer(req) {
    try {
        let UserLogin = req.privateData.UserLogin; 
        const pool = await pools.getPool('Sale')
        let result = await pool.request()
            .input('FromDate', sql.VarChar(10), req.body.FromDate)
            .input('ToDate', sql.VarChar(10), req.body.ToDate)
            .input('NationalCodeIn', sql.NVarChar(15), req.body.NationalCode)
            .output('msgRet', sql.NVarChar(500))
            .execute('sale.uspTransferIntCustomerToCustomer')
        if (result.output.msgRet != "") {
            return {
                statusResult: 1,
                message: result.output.msgRet
            };
        }
        return {
            statusResult: 0,
            message: "انتقال اطلاعات با موفقیت انجام شد",
        };
    } catch (err) {
        console.log("err.message" , err.message)
        
        return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    }
}

///////////////////////// برداشت وجه از حساب مشتری

async function getBardashVajhCustomnerList(req) {

    try {
  
      const { idRequester, Type } = req.body.firstParams;
      let userFilter = `idRequester=${idRequester} and Type=${Type} and Flag<>0`
      var query = SqlCommandCreator(req.body.lazyParams, 'VBaseChange', '*', userFilter)
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
  async function getBardashtVajhCustomerUIData(req) {
    try {
  
      const pool = await pools.getPool('Sale')
      let result = await pool.request()
        .input('idCustomer', sql.Int, req.body.idCustomer)
        .output("msgRet", sql.NVarChar(200))
        .execute('Sale.sale.uspBargashtVajhCustomerUIData')
  
      if (result.output.msgRet == "" || result.output.msgRet == null)
        return {
          statusResult: 0,
          message: "خواندن موفق",
          HazineDefault: result.recordsets[0] ? result.recordsets[0][0] : [],
          VCustomer: result.recordsets[1] ? result.recordsets [1][0] : [] ,
  
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
  async function bardashVajhCustomerInsert(req) {
    try {
  
  
      let UserLogin = req.privateData.UserLogin;
      var clientIp = req.ip;
      const pool = await pools.getPool('Sale')
      let result = await pool.request()
  
  
  
        .input('ID', sql.Int, 0)
        .input('IDRespon', sql.Int, req.body.IDRespon)
        .input('IDRequester', sql.Int, req.body.idRequester)
        .input('IDHazineBase', sql.Int, req.body.IDHazineBase)
        .input('Amount', sql.Numeric, req.body.Amount)
        .input('KarmozdCheq', sql.Numeric, req.body.KarmozdCheq)
        .input('HazineDefault', sql.Numeric, req.body.HazineDefault)
        .input('OrderDate', sql.VarChar(10), req.body.OrderDate)
        .input('Type', sql.Int, req.body.ChangeType)
        .input('LetterNo', sql.NVarChar(15), req.body.LetterNo)
        .input('LetterDate', sql.VarChar(10), req.body.LetterDate)
        .input('idFactor', sql.Int, req.body.idFactor)
        .input('idPayment', sql.Int, req.body.idPayment)
        .input('UserID', sql.NVarChar(10), UserLogin)
        .input("clientIp", sql.NVarChar(50), clientIp)
        .output('msgRet', sql.NVarChar(500))
        .execute('Sale.sale.uspBardashtVajhCustomerInsert')
      if (result.output.msgRet != "") {
        return {
          statusResult: 1,
          message: result.output.msgRet
        };
      }
      return {
        statusResult: 0,
        message: "ذخیره اطلاعات  با موفقیت انجام شد",
      };
    } catch (err) {
      console.log('err.message===>', err.message)
      throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
    }
  }
  async function bardashVajhCustomerUpdate(req) {
    try {
  
  
      let UserLogin = req.privateData.UserLogin;
      var clientIp = req.ip;
      const pool = await pools.getPool('Sale')
      let result = await pool.request()
  
  
  
        .input('ID', sql.Int, req.body.ID)
        .input('IDRespon', sql.Int, req.body.IDRespon)
        .input('IDRequester', sql.Int, req.body.idRequester)
        .input('IDHazineBase', sql.Int, req.body.IDHazineBase)
        .input('Amount', sql.Numeric, req.body.Amount)
        .input('KarmozdCheq', sql.Numeric, req.body.KarmozdCheq)
        .input('HazineDefault', sql.Numeric, req.body.HazineDefault)
        .input('OrderDate', sql.VarChar(10), req.body.OrderDate)
        .input('Type', sql.Int, req.body.ChangeType)
        .input('LetterNo', sql.NVarChar(15), req.body.LetterNo)
        .input('LetterDate', sql.VarChar(10), req.body.LetterDate)
        .input('idFactor', sql.Int, req.body.idFactor)
        .input('idPayment', sql.Int, req.body.idPayment)
        .input('UserID', sql.NVarChar(10), UserLogin)
        .input("clientIp", sql.NVarChar(50), clientIp)
        .output('msgRet', sql.NVarChar(500))
        .execute('Sale.sale.uspBardashtVajhCustomerUpdate')
      if (result.output.msgRet != "") {
        return {
          statusResult: 1,
          message: result.output.msgRet
        };
      }
      return {
        statusResult: 0,
        message: "ویرایش اطلاعات  با موفقیت انجام شد",
      };
    } catch (err) {
      console.log('err.message===>', err.message)
      throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
    }
  }
  async function bardashVajhCustomerDelete(req) {
    try {
      let UserLogin = req.privateData.UserLogin;
      var clientIp = req.ip;
  
      const { ID } = req.body;
      const pool = await pools.getPool('Sale');
      let result = await pool
        .request()
        .input("ID", sql.Int, ID)
        .input('UserID', sql.VarChar(10), UserLogin)
        .input("clientIp", sql.NVarChar(50), clientIp)
        .output("msgRet", sql.NVarChar(200))
        .execute('Sale.sale.uspbardashVajhCustomerDelete');
  
  
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
  async function bardashVajhCustomerErsalMali(req) {
    try {
      const { ID, IDRespon, ChangeType } = req.body;
      let UserLogin = req.privateData.UserLogin;
      var clientIp = req.ip;
  
      let spName = "Sale.sale.uspBardashVajhCustomerErsalMali";
  
      const pool = await pools.getPool('Sale');
      let result = await pool
        .request()
        .input("ID", sql.Int, ID)
        .input('UserID', sql.VarChar(10), UserLogin)
        .input("clientIp", sql.NVarChar(50), clientIp)
        .output("msgRet", sql.NVarChar(200))
        .execute(spName);
  
  
      if (result.output.msgRet == "" || result.output.msgRet == null)
        return {
          statusResult: 0,
          message: "ارسال به مالی با موفقیت انجام شد",
  
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
  async function paymentUsedBardashtVajhCustomerInsert(req) {
    try {
  
  
      let UserLogin = req.privateData.UserLogin;
      var clientIp = req.ip;
      const pool = await pools.getPool('Sale')
      let result = await pool.request()
        .input('ID', sql.Int, 0)
        .input('IDPayment', sql.Int, req.body.IDPayment)
        .input('IDReName', sql.Int, req.body.IDReName)
        .input('Amount', sql.Numeric(18, 0), req.body.Amount)
        .input('UserID', sql.VarChar(10), UserLogin)
        .input("clientIp", sql.NVarChar(50), clientIp)
        .output('msgRet', sql.NVarChar(500))
        .execute('Sale.sale.uspPaymentUsedBardashtVajhCustomerInsert')
  
      if (result.output.msgRet == "" || result.output.msgRet == null)
        return {
          statusResult: 0,
          message: "ثبت اطلاعات با موفقیت انجام شد",
  
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
  async function bardashtVajhCustomerPrintUIData(req) {
    try {
  
      const pool = await pools.getPool('Sale')
      let result = await pool.request()
        .input('IdMasterRename', sql.Int, req.body.IdMasterRename)
        .output("msgRet", sql.NVarChar(200))
        .execute('Sale.sale.uspBardashtVajhCustomerPrintUIData')
  
      if (result.output.msgRet == "" || result.output.msgRet == null)
        return {
          statusResult: 0,
          message: "خواندن موفق",
          masterRename: result.recordsets[0] ? result.recordsets[0] : [],
          paymentUsedChangerename: result.recordsets[1] ? result.recordsets[1] : [],
          sumAmount: result.recordsets[2] ? result.recordsets[2][0] : [],
         
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
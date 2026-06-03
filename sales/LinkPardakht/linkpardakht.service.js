const config = require('../../config.json');
const sql = require('mssql');
const pools = require('../../_helpers/pool-manegment');
const requestIp = require('request-ip');
const os = require('node:os');
const jwt = require('jsonwebtoken');
const axios = require('axios')
const cryptoService = require('../../public/crypto/crypto.service');
const { SqlCommandCreator } = require('../../_helpers/SqlCommandCreator');
const { errorMonitor } = require('node:events');
const fs = require('fs');
 const {sendMessage} = require('../../_helpers/sendMessage');

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

module.exports = {
  getLinkPardakht,
  BankMellatGetLinkTransactions,
  getNumberOfUnRecivedBankDataLink,
  getLinkPardakhtUIData,
  linkPardakhtInsert,
  linkPardakhtUpdate,
  linkPardakhtDelete,
  LinkPardakhtSend,
  getTypePaymentShenase,
  getDavatnameReadyToSendUrlLink,
  LinkPardakhtDavatnameSend,
  customerCodeSelectExcel,
  customerMobilSelectExcel,
  getImportLinkPardakhtListError,
}

//دریافت لیست لینکهای تهیه شده برای مشتریان 
async function getLinkPardakht(req) {
  try {
    var userFilter = req.userFilter

    var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.VPaymentCustomerShenase', '*', req.body.firstFilter, userFilter)
    // console.log('myQuery',myQuery) 
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

//دریافت اطلاعات وارده شده از صفحه پرداخت بانک و درج آنها در وجوه مشتری سیستم فروش
async function BankMellatGetLinkTransactions(req) {
  try {

    let UserLogin = req.privateData.UserLogin;
    const { Id } = req.body
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .execute('Sale.dbo.SPInsTPaymentShenaseAll')
    return {
      statusResult: 0,
      message: "دریافت و ثبت اطلاعات وجوه با موفقیت انجام پذیرفت",
    };
  } catch (err) {
    return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
  }
}

//خواندن تعداد رکوردهای آماده انتقال به سیستم فروش
async function getNumberOfUnRecivedBankDataLink(req) {
  try {
    var myQuery = `SELECT count(*) as count FROM dbo.TBankShenaseTransactions AS b 
                   LEFT JOIN dbo.TPaymentSale AS ts ON ts.IdShenaseBank = b.IdShenaseBank  
                   WHERE ts.IdShenaseBank IS NULL and b.IDCustomer is not null and b.CodeBranch is not null`
    let pool = await pools.getPool('Sale')
    let result = await pool.request()
      .query(myQuery)

    return {
      statusResult: 0,
      tedad: result.recordsets[0][0],
    }
  } catch (err) {
    // console.log('err', err.message)
    return err
  }
}

//خواندن دیتاها برای فرم لینک پرداخت**فعلا استفاده نمی شود تا بعد
async function getLinkPardakhtUIData(req) {
  try {
    var userFilter = req.userFilter
    const pool = await pools.getPool("Sale");
    let result = await pool.request()
      //.input('GroupName', sql.Int, req.body.IdPreFactor)
      .execute("sale.uspGetLinkPardakhtUIData");
    return {
      statusResult: 0,
      TypePaymentShenase: result.recordsets[0],
    };

  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

//خواندن دیتای انواع لینک پرداخت
async function getTypePaymentShenase(req) {
  try {
    var userFilter = req.userFilter

    var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.vwTypePaymentShenase', '*', req.body.firstFilter, userFilter)
    let pool = await pools.getPool('Sale')
    let result = await pool.request()
      .query(myQuery)

    return {
      statusResult: 0,
      TypePaymentShenase: result.recordsets[0],
      //totalRecords: result.recordsets[1][0].totalCount,
    }
  } catch (err) {
    return err
  }
}

//ورود و ثبت اطلاعات در لینک پرداخت
async function linkPardakhtInsert(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')

    let result = await pool.request()
      .input('idCustomer', sql.Int, req.body.IdCustomer)
      .input('idRespon', sql.Int, req.body.IdRespon)
      .input('idBankBase', sql.Int, req.body.IdBankBase)
      .input('ExpireDate', sql.NVarChar(10), req.body.ExpireDate)
      .input('Amount', sql.Decimal(18, 0), req.body.Amount)
      .input('idTypePaymentShenase', sql.Int, req.body.idTypePaymentShenase)
      .input('Mobil', sql.VarChar(11), req.body.Mobil)
      .input('UserId', sql.NVarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .output('Guid', sql.BigInt)
      .execute('sale.uspLinkPardakhtInsert')

    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: ` لینک پرداخت با موفقیت ذخیره گردید`,
    };
  } catch (err) {
    //console.log('err', err.message)
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}

//بروزآوری لینک پرداخت
async function linkPardakhtUpdate(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')

    let result = await pool.request()
      .input('Guid', sql.VarChar(18), req.body.Guid)
      .input('ExpireDate', sql.NVarChar(10), req.body.ExpireDate)
      .input('idTypePaymentShenase', sql.Int, req.body.idTypePaymentShenase)
      .input('Mobil', sql.VarChar(11), req.body.Mobil)
      .input('UserId', sql.NVarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('sale.uspLinkPardakhtUpdate')

    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: ` لینک پرداخت با موفقیت بروزآوری گردید`,
    };
  } catch (err) {
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}

//ابطال لینک پرداخت  اگر در مرحله صدورر یا ارسال باشد که وضعیت آن می شود3
async function linkPardakhtDelete(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
    const pool = await pools.getPool('Sale')

    let result = await pool.request()
      .input('Guid', sql.VarChar(18), req.body.Guid)
      .output('msgRet', sql.NVarChar(500))
      .execute('sale.uspLinkPardakhtDelete')
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: "حذف لینک پرداخت با موفقیت انجام شد",
    };
  } catch (err) {
    return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
  }
}

//مشاهده لیست دعوتنامه ها برای ارسال پیامک لینک
async function getDavatnameReadyToSendUrlLink(req) {
  try {
    var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.vwDavatnameReadyToSendUrlLink', '*', req.body.firstFilter)
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



/////متدهای ارسال لینک پرداخت قدیمی و جدید-----------------------------------------------------
//ارسال لینک پرداخت به مشتری و تغییر وضعیت به ارسال شده 1
async function LinkPardakhtSendOld(req) {
  try {
    const { idRespon, Mobil, UserId, CustomerName, Amount, TypePaymentShenaseDescr, LinkUrl, ResponCode, Guid } = req.body
    const pool = await pools.getPool('Sale')
    var Content = ''
    if (idRespon == 0) {
      Content = " مشتري گرامي " + CustomerName + " لطفا نسبت به واریز مبلغ " + Amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " ریال " + "بابت " + TypePaymentShenaseDescr + " از طریق لینک زیر : " + "\n" + LinkUrl + "\n" + " اقدام نمائید " + "\n " + "*سازمان فروش ایران خودرو ديزل*";
    }
    else {
      Content = " مشتري گرامي " + CustomerName + " لطفا نسبت به واریز مبلغ " + Amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " ریال " + "بابت " + TypePaymentShenaseDescr + " مربوط به کد تعهد : " + ResponCode + " از طریق لینک زیر : " + "\n" + LinkUrl + "\n" + " اقدام نمائید " + "\n " + "*سازمان فروش ایران خودرو ديزل*";
    }
    var v = "https://securityapp.ikd.ir/api/Message/SendMessage";
    let url = encodeURI(v);
    var postData = {
      secretKey: "C11658A3-837F-47B8-BC9D-FBC90DB0074C",
      mobileNo: Mobil,
      content: Content,
      clientTypeId: 10,
      userName: UserId,
      clinetKey: "LinkPardakhtCode =" + Guid,
    };

    var res1 = await axios.post(url, postData, axiosConfig);
    if (res1.data.result) {
      let result = await pool.request()
        .input('Guid', sql.Decimal(18, 0), Guid)
        .output('msgRet', sql.NVarChar(500))
        .execute('sale.uspLinkPardakhtSend')
      return {
        statusResult: 0,
        message: "ارسال لینک پرداخت با موفقیت انجام شد",
      };
    }
    else {
      return { statusResult: 1, message: res1.data.message }

    }
  } catch (err) {

    console.log('err :>> ', err.message);
    return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای یا ارسال پیام' }
  }
}
async function LinkPardakhtSend(req) {
console.log('req.body', req.body)
  const { idRespon, Mobil, UserId, CustomerName, Amount, TypePaymentShenaseDescr, LinkUrl, ResponCode, Guid } = req.body
  const pool = await pools.getPool('Sale')
  var Content = ''
  if (idRespon == 0) {
    Content = " مشتري گرامي " + CustomerName + " لطفا نسبت به واریز مبلغ " + Amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " ریال " + "بابت " + TypePaymentShenaseDescr + " از طریق لینک زیر : " + "\n" + LinkUrl + "\n" + " اقدام نمائید " + "\n " + "*سازمان فروش ایران خودرو ديزل*";
  }
  else {
    Content = " مشتري گرامي " + CustomerName + " لطفا نسبت به واریز مبلغ " + Amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " ریال " + "بابت " + TypePaymentShenaseDescr + " مربوط به کد تعهد : " + ResponCode + " از طریق لینک زیر : " + "\n" + LinkUrl + "\n" + " اقدام نمائید " + "\n " + "*سازمان فروش ایران خودرو ديزل*";
  }

  var clinetKey = "LinkPardakhtCode =" + Guid;
  var clientTypeId = 10;
  var userName = UserId;


 


  let sendResult=await sendMessage(Mobil,Content,userName,clientTypeId,clinetKey)
  if(sendResult.statusResult==0){
    let result = await pool.request()
    .input('Guid', sql.Decimal(18, 0), Guid)
    .output('msgRet', sql.NVarChar(500))
    .execute('sale.uspLinkPardakhtSend')
    return {
    statusResult: 0,
    message: "ارسال لینک پرداخت با موفقیت انجام شد",
    };
    }
    else
      return sendResult
  }




//------------------------------------------------------------------------------------------------


////متدهای ارسال لینک دعوتنامه قدیمی و جدید------------------------------------------------------
//ارسال لینک پرداخت دعوتنامه به مشتری و تغییر وضعیت به ارسال شده
//همزمان درج لینک پرداخت/ارسال پیامک به مشتری/بروزآوری وضعیت پرداخت به ارسال شده
async function LinkPardakhtDavatnameSendOld(req) {
  try {
    const { IdCustomerPartner, idRespon, ExpireDate, PayAmount, PartnerMobile, CustomerPartnerTitle, ResponCode } = req.body
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')

    let result = await pool.request()
      .input('idCustomer', sql.Int, IdCustomerPartner)
      .input('idRespon', sql.Int, idRespon)
      .input('idBankBase', sql.Int, 1) //بانک ملت //idBank=18//HessabNo=6567859444
      .input('ExpireDate', sql.NVarChar(10), ExpireDate)
      .input('Amount', sql.Decimal(18, 0), PayAmount)
      .input('Mobil', sql.VarChar(11), PartnerMobile)
      .input('idTypePaymentShenase', sql.Int, 18)//دعوتنامه
      .input('UserId', sql.NVarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .output('Guid', sql.BigInt)
      .execute('sale.uspLinkPardakhtInsert')

    if (result.output.msgRet == "") {
      var Guid = result.output.Guid

      var linkUrl = 'https://paybylink.ikd.ir/Default.aspx?value=' + Guid
      var Content = " مشتري گرامی آقا/خانم " + CustomerPartnerTitle + " باتوجه به دعوتنامه ارسالی مربوط به تعهد شماره :  " + ResponCode + " لطفا حداکثر تا تاریخ : " + ExpireDate + " نسبت به واریز مبلغ : " + PayAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " ریال " + " از طریق لینک زیر : " + "\n" + linkUrl + "\n" + " اقدام نموده و یا به پروفایل خود قسمت دعوتنامه مراجعه نمائید " + "\n " + "*سازمان فروش ایران خودرو ديزل*" + "\n" + "شماره تماس : 61-02155272460" + " داخلی 1003 ";

      var v = "https://securityapp.ikd.ir/api/Message/SendMessage";

      let url = encodeURI(v);
      var postData = {
        secretKey: "C11658A3-837F-47B8-BC9D-FBC90DB0074C",
        mobileNo: PartnerMobile, //'09192248625',
        content: Content,
        clientTypeId: 10,
        userName: UserLogin,
        clinetKey: "LinkPardakhtCode =" + Guid,
      };
      var res1 = await axios.post(url, postData, axiosConfig);
      if (res1.data.result) {
        let result = await pool.request()
          .input('Guid', sql.Decimal(18, 0), Guid)
          .output('msgRet', sql.NVarChar(500))
          .execute('sale.uspLinkPardakhtSend')
        if (result.output.msgRet != "") {
          return {
            statusResult: 1,
            message: result.output.msgRet
          };
        }
      }
      return {
        statusResult: 0,
        message: ` لینک پرداخت با موفقیت ثبت و ارسال شد`,
      };
    }
    else {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }

  } catch (err) {
    return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای یا ارسال پیام' }
  }
}
async function LinkPardakhtDavatnameSend(req) {

  const { IdCustomerPartner, idRespon, ExpireDate, PayAmount, PartnerMobile, CustomerPartnerTitle, ResponCode } = req.body
  let UserLogin = req.privateData.UserLogin;
  var clientIp = req.ip;
  const pool = await pools.getPool('Sale')

  let result = await pool.request()
    .input('idCustomer', sql.Int, IdCustomerPartner)
    .input('idRespon', sql.Int, idRespon)
    .input('idBankBase', sql.Int, 1) //بانک ملت //idBank=18//HessabNo=6567859444
    .input('ExpireDate', sql.NVarChar(10), ExpireDate)
    .input('Amount', sql.Decimal(18, 0), PayAmount)
    .input('Mobil', sql.VarChar(11), PartnerMobile)
    .input('idTypePaymentShenase', sql.Int, 18)//دعوتنامه
    .input('UserId', sql.NVarChar(10), UserLogin)
    .input("clientIp", sql.NVarChar(50), clientIp)
    .output('msgRet', sql.NVarChar(500))
    .output('Guid', sql.BigInt)
    .execute('sale.uspLinkPardakhtInsert')

  if (result.output.msgRet == "") {
    var Guid = result.output.Guid

    //var linkUrl = 'https://paybylink.ikd.ir/Default.aspx?value=' + Guid
    var linkUrl = 'https://paylink.ikd.ir/Payment?value=' + Guid
    var Content = " مشتري گرامی آقا/خانم " + CustomerPartnerTitle + " باتوجه به دعوتنامه ارسالی مربوط به تعهد شماره :  " + ResponCode + " لطفا حداکثر تا تاریخ : " + ExpireDate + " نسبت به واریز مبلغ : " + PayAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " ریال " + " از طریق لینک زیر : " + "\n" + linkUrl + "\n" + " اقدام نموده و یا به پروفایل خود قسمت دعوتنامه مراجعه نمائید " + "\n " + "*سازمان فروش ایران خودرو ديزل*" + "\n" + "شماره تماس : 61-02155272460" + " داخلی 1003 ";

    var clinetKey = "LinkPardakhtCode =" + Guid;
    var clientTypeId = 10;
    var userName = UserLogin;

    let sendResult=await sendMessage(PartnerMobile,Content,userName,clientTypeId,clinetKey)
    if(sendResult.statusResult==0){
      let result = await pool.request()
      .input('Guid', sql.Decimal(18, 0), Guid)
      .output('msgRet', sql.NVarChar(500))
      .execute('sale.uspLinkPardakhtSend')
      return {
      statusResult: 0,
      message: "ارسال لینک پرداخت با موفقیت انجام شد",
      };
      }
      else
        return sendResult
    }
    else {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }

   }
//-------------------------------------------------------------------------------------------------


//لیست مشتریان انتخابی بوسیله ورود از اکسل ***استفاده شده در سیستم پیامک
//درمنوی مشتریان انتخابی سیستم پیامک منوی فروش استفاده می شود
async function customerCodeSelectExcel(req, res) {

  try {
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('json', sql.NVarChar, req.body.Code)
      .execute('sale.uspCustomerCodeForSmsInsert')

    return {
      statusResult: 0,
    }
  } catch (err) {
    return {
      statusResult: 2,
      message: 'خطا در ارتباط با پایگاه داده ای'
    };
  }
}

async function customerMobilSelectExcel(req, res) {

  try {
    console.log('req :>> ', req.body);
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('json', sql.VarChar, req.body.MobileNumber)
      .execute('sale.uspCustomerMobilForSmsInsert')

    return {
      statusResult: 0,
    }
  } catch (err) {
    return {
      statusResult: 2,
      message: 'خطا در ارتباط با پایگاه داده ای'
    };
  }
}

//متد درج مقادیر پیامک در بانک اطلاعاتی جدول --------------------New---------------Insert into TMessageOut----------
async function messageOutInsert(values) {
  try {
    const [userid, msg, smsStatus, destNo, clientId, refrenceId, clientIdType] = values
    const pool = await pools.getPool("MIS");
    let result = await pool
      .request()
      .input("userid", sql.VarChar(10), userid)
      .input("msg", sql.NVarChar(sql.MAX), msg)
      .input("smsStatus", sql.VarChar(20), smsStatus)
      .input("destNo", sql.VarChar(15), destNo)
      .input("clientId", sql.VarChar(80), clientId)
      .input("refrenceId", sql.Int, refrenceId)
      .input("clientIdType", sql.Int, clientIdType)

      .execute("MIS.dbo.spInsMessageOut");
    return {
      statusResult: 0,
      message: ` پارامتر پیام با موفقیت ذخیره گردید`,
    };
  } catch (err) {
    //console.log('err.message :>> ', err.message);
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}


async function getImportLinkPardakhtListError(req, res) {
  try {


    const { ImportType } = req.body.firstParams;
    //let userFilter = 'ImportType=' + [ImportType]

    var query = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.vwImportLinkPardakhtListError', '*')
    console.log('queryLink :>> ', query);
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







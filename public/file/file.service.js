const pools = require("../../_helpers/pool-manegment");
const { SqlCommandCreator } = require("../../_helpers/SqlCommandCreator");
const readXlsxFile = require("read-excel-file/node");
const xlsx = require("xlsx"); //npm install xlsx
const slim = require("slim-xlsx");
const sql = require("mssql");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { request } = require("express");
const axiosConfig = {
  async: true,
  crossDomain: false,
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "cache-control": "no-cache",
    "Access-Control-Allow-Origin": "*",
  },
  processData: true,
};
module.exports = {
  //---بخشنامه های فروش
  getDataImageBK,
  downloadFileBK,
  getBakhshname,
  //-------
  downloadExcelFile,
  getDataFileType,
  getDataFile,
  getDataFiles,
  deleteDataFile,
  uploadFile,
  uploadFileOutput,
  uploadExcelFile,
  getDataImage,
  downloadFile,
  okDataFile,
  archiveDataFile,
  getDataFilesWithParams,

  dataFileSendLetter,

  //SaleInternet
  readJsonProjectFile,
  writeJsonProjectFile,
  downloadPrintPdfFile,
  enteghalProjectsData,
  userAccessAgencyUpdate,
  downloadExcelFileTemplateHR,
};
async function readJsonProjectFile(req) {
  try {
    let fileName = "z:\\\\projectFile.json";
    if (req.body.userName && req.body.userName === "1111111111")
      fileName = "z:\\\\projectFileTest.json";

    let rawdata = fs.readFileSync(fileName);
    let projects = JSON.parse(rawdata);
    return projects;
  } catch (err) {
    return { statusResult: 2, message: err.message };
  }
}
async function enteghalProjectsData(req) {
  try {
    const pool = await pools.getPool("Sale");
    let result = await pool.request().execute("Sale.dbo.SPInitTables");

    return {
      statusResult: 0,
      message: "انتقال با موفقیت انجام شد",
    };
  } catch (err) {
    console.log("err.message", err.message);
    return { statusResult: 2, message: err.message };
  }
}
async function writeJsonProjectFile(req) {
  try {
    const pool = await pools.getPool("MIS");
    let result = await pool
      .request()
      .input("nationalCode", sql.VarChar(20), "OrderInit")
      .output("msgError", sql.NVarChar(200))
      .execute("MIS.dbo.uspGetSaleProjectsNew");

    let projects = {
      msgError: result.output.msgError,
      statusResult: 0,
      saleProjects: result.recordsets[0],
      groups: result.recordsets[1],
    };

    let data = JSON.stringify(projects);
    fs.writeFileSync("z:\\projectFile.json", data);
    return {
      statusResult: 0,
      message: "بروز رسانی با موفقیت انجام شد",
    };
  } catch (err) {
    console.log("err.message", err.message);
    return { statusResult: 2, message: err.message };
  }
}
//---------------
function clearUserDownloadedFiles(userLogin) {
  const directory = ".//download//";
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      if (file.startsWith(userLogin + "_"))
        fs.unlink(path.join(directory, file), (err) => { });
    }
  });
}
async function getDataFile(req, res, next) {
  try {
    const { DataFileId } = req.body;
    const pool = await pools.getPool("DBImage");
    let result = await pool
      .request()
      .input("DataFileId", sql.VarChar(50), DataFileId)
      .execute("dbo.uspGetDataFile");
    console.log("result.recordset :>> ", result.recordset);
    if (result.recordset.length > 0)
      return {
        statusResult: 0,
        message: "خواندن با موفقیت انجام شد",
        row: result.recordset[0],
      };
    else
      return {
        statusResult: 1,
        message: "رکوردی یافت نشد",
      };
  } catch (err) {
    console.log("getDataFile->err.message :>> ", err.message);
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

async function getDataFileType(req, res) {
  try {
    const { filterGroup } = req.body;

    var query =
      "SELECT [DataFileTypeId] as [value],[Descr] as [label] FROM [DBImage].[dbo].[tbDataFileType] WHERE Activity=1 ";
    let firstFilter = req.body.firstFilter;
    if (filterGroup && filterGroup.dataFileTypeGroupId) {
      firstFilter = ` dataFileTypeGroupId=${filterGroup.dataFileTypeGroupId} `;
      if (filterGroup.detailTypeId)
        firstFilter += ` and detailTypeId=${filterGroup.detailTypeId} `;
    }

    if (firstFilter) query += " and " + firstFilter;
    const pool = await pools.getPool("DBImage");
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      message: "خواندن با موفقیت انجام شد",
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getDataFiles(req, res, next) {
  try {
    const firstParams = req.body.firstParams;
    let firstFilter = req.body.firstFilter;
    if (firstParams) {
      if (firstParams.refrenceName)
        firstFilter = ` refrenceName= '${firstParams.refrenceName}' and  refrenceId='${firstParams.refrenceId}' `;
      else if (firstParams.dataFileTypeGroupId)
        firstFilter = ` dataFileTypeGroupId= ${firstParams.dataFileTypeGroupId} `;
      if (firstParams.dataFileTypeId)
        firstFilter =
          firstFilter +
          ` and dataFileTypeId in(${firstParams.dataFileTypeId}) `;
      if (firstParams.archiveDate == 0)
        firstFilter = firstFilter + ` and isnull(archiveDate,'')='' `;
      else if (firstParams.archiveDate == 1)
        firstFilter = firstFilter + ` and isnull(archiveDate,'')!='' `;
      else if (firstParams.archiveDate == 3) //مربوط به بخشنامه های آرشیو شده که قراراست براساس تاریخ برای کارتابل نمایندگی ها نمایش داده شود
        firstFilter = firstFilter + ` and isnull(left(archiveDate,10),'')>'1404/01/01' and RefrenceId='1'  `;
      if (firstParams.sendDate == 0)
        firstFilter = firstFilter + ` and isnull(sendDate,'')='' `;
      else if (firstParams.sendDate == 1)
        firstFilter = firstFilter + ` and isnull(sendDate,'')!='' `;
    }
    const pool = await pools.getPool("DBImage");
    let viewName = "DBImage.dbo.VDataFile";
    if (firstParams.refrenceName == "AgencyMadrak")
      viewName = "DBImage.dbo.VDataFileCount";
    var query = SqlCommandCreator(
      req.body.lazyParams,
      viewName,
      "*",
      firstFilter
    );

    let resultq = await pool.request().query(query);
  
    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای ",
    };
  }
}

async function getDataFilesWithParams(req, res, next) {
  try {
    const pool = await pools.getPool("DBImage");
    var query = `
        select * from [DBImage].dbo.VDataFile where refrenceName= '${req.body.refrenceName}' and  refrenceId='${req.body.refrenceId}'
        `;
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordset,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function deleteDataFile(req) {
  try {
    const { DataFileId } = req.body;
    const pool = await pools.getPool("DBImage");
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;

    let result = await pool
      .request()
      .input("DataFileId", sql.UniqueIdentifier, DataFileId)
      .execute("[DBImage].dbo.uspDataFileDelete");

    //جهت لاگ بخشنامه هایی که پاک می شوند
    const pool2 = await pools.getPool("Sale");
    if (req.body.DataFileTypeId == 4 || req.body.DataFileTypeId == 5) {
      let logMsg = 'bakhshname dataFileId : ' + req.body.DataFileId +  ' and FileName :' + req.body.FileName + ' has Deleted from [DbImage].[dbo].[tbDataFile] and deleteFlag set to 1 ' 
      let result2 = await pool2.request()
        .input("tableName", sql.VarChar(50), 'dbo.TAgency')
        .input("ActionType", sql.VarChar(50), 3)
        .input("SqlCommand", sql.VarChar(sql.MAX), '[DBImage].dbo.uspDataFileDelete')
        .input("UserId", sql.VarChar(50), UserLogin)
        .input("ComputerName", sql.VarChar(50), clientIp)
        .input("LogMsg", sql.VarChar(4000), logMsg)
        .input("AppId", sql.SmallInt, 0)
        .input("OpId", sql.Int, 0)
        .input("Change‌dByAppId", sql.SmallInt, 0)
        .execute('Sale.Sale.uspChangeLogCapture');
    }

    return {
      statusResult: 0,
      message: "حذف با موفقیت انجام شد",
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای" ,
    };
  }
}

async function okDataFile(req) {
  try {
    const { DataFileId } = req.body;
    const pool = await pools.getPool("DBImage");
    let result = await pool
      .request()
      .input("DataFileId", sql.UniqueIdentifier, DataFileId)
      .execute("[DBImage].dbo.uspDataFileOk");

    return {
      statusResult: 0,
      message: "تایید با موفقیت انجام شد",
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function archiveDataFile(req) {
  try {
    const { DataFileId, IdAgency, ViewDate } = req.body;
    if (IdAgency && !ViewDate) {
      return {
        statusResult: 1,
        message: "بدلیل عدم مشاهده امکان بایگانی نمیباشد",
      };
    }
    const pool = await pools.getPool("DBImage");
    let result = await pool
      .request()
      .input("DataFileId", sql.UniqueIdentifier, DataFileId)
      .input("IdAgency", sql.VarChar(25), IdAgency)
      .execute("[DBImage].dbo.uspDataFileArchive");

    return {
      statusResult: 0,
      message: "تایید با موفقیت انجام شد",
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

async function uploadFile(req, res) {
  try {


    let companyId = req.privateData.CompanyId;
    let userName = req.privateData.UserLogin;
    const pool = await pools.getPool("DBImage");
    let result = await pool.request();
    if (!req.file) {
      result
        .input("BinaryData", sql.VarBinary(sql.MAX), null)
        .input("FileName", sql.NVarChar(150), "فاقد فایل")
        .input("FileDescription", sql.NVarChar(350), req.body.fileDescription)
        .input("FileType", sql.VarChar(50), "")
        .input("DataFileTypeId", sql.Int, req.body.dataFileTypeId)
        .input("RefrenceId", sql.VarChar(50), req.body.refrenceId)
        .input("RefrenceName", sql.VarChar(100), req.body.refrenceName)
        .input("UserName", sql.VarChar(20), userName)
        .input("IdOwner", sql.VarChar(30), companyId ? companyId : 0)
        .execute("DBImage.dbo.uspDataFileAdd");
    } else {
      fs.readFile(req.file.path, function (err, data) {
        if (!data) {
          return { statusResult: 1, message: "خطا در ذخیره فایل" };
        }
        result
          .input("BinaryData", sql.VarBinary(sql.MAX), data)
          .input("FileName", sql.NVarChar(150), req.file.originalname)
          .input("FileDescription", sql.NVarChar(350), req.body.fileDescription)
          .input("FileType", sql.VarChar(50), req.file.mimetype)
          .input("DataFileTypeId", sql.Int, req.body.dataFileTypeId)
          .input("RefrenceId", sql.VarChar(50), req.body.refrenceId)
          .input("RefrenceName", sql.VarChar(100), req.body.refrenceName)
          .input("UserName", sql.VarChar(20), userName)
          .input("IdOwner", sql.VarChar(30), companyId)
          .execute("[DBImage].dbo.uspDataFileAdd");
      });
      fs.unlinkSync(req.file.path);
    }
    return {
      statusResult: 0,
      message: "ذخیره با موفقیت انجام شد",
    };
  } catch (err) {
    //console.log("err uploadFile :>> ", err.message);
    return { statusResult: 2, message: err.message };
  }
}

async function uploadFileOutput(req, res) {
  const path = req.file.path;

  try {
    let CompanyId = req.privateData.CompanyId;
    let userName = req.privateData.UserLogin;

    const data = await fs.promises.readFile(
      req.file.path,
      function (err, data) { }
    );
    const pool = await pools.getPool("DBImage");
    let result = await pool
      .request()
      .input("BinaryData", sql.VarBinary(sql.MAX), data)
      .input("FileName", sql.NVarChar(150), req.file.originalname)
      .input("FileDescription", sql.NVarChar(350), req.body.fileDescription)
      .input("FileType", sql.VarChar(50), req.file.mimetype)
      .input("DataFileTypeId", sql.Int, req.body.dataFileTypeId)
      .input("RefrenceId", sql.VarChar(50), req.body.refrenceId)
      .input("RefrenceName", sql.VarChar(100), req.body.refrenceName)
      .input("UserName", sql.VarChar(20), userName)
      .input("IdOwner", sql.VarChar(30), CompanyId)
      .output("msgRet", sql.VarChar(1000))
      .execute("[DBImage].dbo.uspDataFileAddOutput");

    //حذف فایل از سرور
    fs.unlink(path, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log("File is deleted.");
      }
    });

    return {
      statusResult: 0,
      message: "ذخیره با موفقیت انجام شد",
      msgRet: result.output.msgRet,
    };
  } catch (err) {
    console.log("err :>> ", err.message);
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function downloadExcelFile(req, res, next) {
  try {

//for agency sale
let UserLogin = req.privateData.UserLogin;
var userFirstFilter = ''
if (UserLogin.toLowerCase().startsWith('ikd')) {
  userFirstFilter=createExtraFilterForAgency(req.body.tableName,req.privateData.CompanyId)
}



    var fileName = `.//download//${crypto.randomBytes(4).readUInt32LE(0)}.xlsx`;
    let columns = "";

    req.body.columns.map((col) => {
      if (!col.bodyTemplate && !col.field.toLowerCase().startsWith("op")) {
        if (columns != "") columns += ",";
        columns += col.field + " as [" + col.header + "]";
      }
    });
    var query = SqlCommandCreator(
      req.body.lazyParams,
      req.body.tableName,
      columns,
      req.body.firstFilter,
      userFirstFilter
    );

    console.log('downloadExcelFile->query==>',query);
    let poolName = "Default";
    if (req.body.poolName) poolName = req.body.poolName;

    const pool = await pools.getPool(poolName);
    let resultq = await pool.request().query(query);
    var rows = resultq.recordsets[0];

    const worksheet = xlsx.utils.json_to_sheet(rows);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };

    xlsx.writeFile(workbook, fileName);
    res.download(fileName, function (err) {
      if (err) {
        // Check error if you want
      }
      fs.unlink(fileName, function () {
        console.log("File was deleted"); // Callback
      });
    });
  } catch (err) {
    console.log("err.message", err.message);
  }
}
function createExtraFilterForAgency(tableName,companyId){
  
  if(tableName=="Sale.dbo.VChangeAll" || tableName=="Sale.dbo.VEsterdad")
    return "IDAgencyCommission=" + companyId;
  if(tableName=="Sale.sale.vwAgencyPersonel")
    return  "IdAgency=" + companyId;
  if(tableName=="Sale.dbo.VCustomer")
    return  `Id in (select IDOwnerCustomer from sale.dbo.TRespon where  IDAgencyCommission=${companyId})` ;
  if(tableName=="DBImage.dbo.VDataFile"|| tableName=="Sale.sale.VDataFileUserAccessAgency")
    return '' ;
  else
  return  "IdAgencyCode=" + companyId; 
  
}







async function uploadExcelFile(req, res) {
  try {
   // console.log('objectEXXXXXXXXXXXXXXXXXXXXXXXXXXXX :>> ');
    const { poolName, spName, refrenceName } = req.body
    let userName = req.privateData.UserLogin;
    let fileName = req.file.path
    const workbook = xlsx.readFile(fileName);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const xlsfile = xlsx.utils.sheet_to_json(worksheet, { header: 0 });
    let file = JSON.stringify(xlsfile).replace(/"\s+|\s+"/g, '"')
    const pool = await pools.getPool(poolName);
    let result = await pool
      .request()
      .input("file", sql.NVarChar(sql.MAX), file)
      .input("refrenceName", sql.VarChar(100), refrenceName)
      .input("userName", sql.VarChar(25), userName)
      .output("msgRet", sql.NVarChar(1000))
      .execute(spName);
    fs.unlink(fileName, function () {
      console.log("File was deleted"); // Callback
    });
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet,
      };
    }
    return {
      statusResult: 0,
      message: "عملیات با موفقیت انجام شد",
    };
    console.log("file :>> ", file);
    for (let row of file) {
      // console.log('row :>> ', row);
      // const [column1, column2, column3] = row; // Adjust this line based on your Excel structure
      // let query=''
      // await pool.request().query(query);
      // ‘INSERT INTO your_table (column1, column2, column3) VALUES (?, ?, ?)’,[column1, column2, column3]);
    }
    /*readXlsxFile(req.file.path).then((data) => {
            data.shift();
            fs.readFile(req.file.path, function (err, data) { 


            });
            fs.unlinkSync(req.file.path);
        })*/

  } catch (err) {
    console.log("err.message", err.message);
    return {
      statusResult: 2,
      message: err.message,
    };
  }
}
async function getDataImage(req, res, next) {
  try {
    const { DataFileId } = req.body;
    const pool = await pools.getPool("DBImage");
    let result = await pool
      .request()
      .input("DataFileId", sql.UniqueIdentifier, DataFileId)
      .execute("[DBImage].dbo.uspGetDataImage");

    if (result.recordset.length > 0) {
      var base64data = Buffer.from(
        result.recordset[0].BinaryData,
        "binary"
      ).toString("base64");
      return {
        statusResult: 0,
        dataImage: result.recordset[0].BinaryData,
        base64data: base64data,
      };
    } else {
      return { statusResult: 1, message: "رکوردی یافت نشد" };
    }
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

async function downloadFile(req, res, next) {
  try {
    var fileName = `.//download//${req.body.FileName}`;
    const { DataFileId } = req.body;
    const pool = await pools.getPool("DBImage");
    let result = await pool
      .request()
      .input("DataFileId", sql.UniqueIdentifier, DataFileId)
      .execute("[DBImage].dbo.uspGetDataImage");
    if (result.recordset.length > 0) {
      var base64data = Buffer.from(result.recordset[0].BinaryData, "binary");
      fs.writeFile(fileName, base64data, function (err, data) {
        if (err) {
        } else {
          res.download(fileName, function (err) {
            if (err) {
              // Check error if you want
            }
            fs.unlink(fileName, function () {
              console.log("File was deleted"); // Callback
            });
          });
        }
      });
    }
  } catch (err) {
    console.log("err.message:", err.message);
  }
}
async function getDataImageBK(req, res, next) {
  try {
    const { DataFileId } = req.body;
    const pool = await pools.getPool("DBImage");
    let result = await pool
      .request()
      .input("DataFileId", sql.UniqueIdentifier, DataFileId)
      .execute("[DBImage].dbo.uspGetDataImage");

    if (result.recordset.length > 0) {
      var base64data = Buffer.from(
        result.recordset[0].BinaryData,
        "binary"
      ).toString("base64");
      return {
        statusResult: 0,
        dataImage: result.recordset[0].BinaryData,
        base64data: base64data,
      };
    } else {
      return { statusResult: 1, message: "رکوردی یافت نشد" };
    }
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

async function downloadFileBK(req, res, next) {
  try {
    let userLogin = "BK";
    // var fileName = ".//download//" + userLogin + '_' + req.body.FileName;
    var fileName = `.//download//${req.body.FileName}`;
    const { DataFileId } = req.body;
    const pool = await pools.getPool("DBImage");
    let result = await pool
      .request()
      .input("DataFileId", sql.UniqueIdentifier, DataFileId)
      .execute("[DBImage].dbo.uspGetDataImage");

    if (result.recordset.length > 0) {
      fs.writeFile(
        fileName,
        result.recordset[0].BinaryData,
        function (err, data) {
          if (err) {
          } else {
            res.download(fileName, function (err) {
              if (err) {
                // Check error if you want
              }
              fs.unlink(fileName, function () {
                console.log("File was deleted"); // Callback
              });
            });
          }
        }
      );
    }
  } catch (err) {
    console.log("err.message", err.message);
  }
}
async function getBakhshname(req, res, next) {
  try {
    const firstFilter =
      "RefrenceName='Bakhshname' and  RefrenceId='1' and DataFileTypeId =4 and ISNULL(ArchiveDate,'')='' ";
    const pool = await pools.getPool("DBImage");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "[DBImage].dbo.VDataFile",
      "*",
      firstFilter
    );
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
async function downloadPrintPdfFile(req, res, next) {
  try {
    let bodyDate = {};
    var v = "";
    let UserLogin = req.privateData.UserLogin;

    var pdfName = `${crypto.randomBytes(4).readUInt32LE(0)}.pdf`;

    if (req.body.IdRespon) {
      //v = `http://localhost:1259/api/Print/ResponPrint`;
      v = `http://api.ikd.ir/api/Print/ResponPrint`;
      bodyDate = {
        IdRespon: req.body.IdRespon,
        FileName: pdfName,
        IdTypeSale: req.body.IdTypeSale,
        UserId: UserLogin,
      };
    }
    if (req.body.IdCustomer) {
      v = `http://api.ikd.ir/api/Print/CustomerPaymentsPrint`;
      bodyDate = {
        ViewName: "VMandePayment",
        FilterValue: req.body.IdCustomer,
        FileName: pdfName,
        UserCode: UserLogin,
      };
    }
    if (req.body.IdAgency) {
      console.log('object :>> ', req.body);
      //v = `http://localhost:1259/api/Print/AgencyPrint`;
      v = `http://api.ikd.ir/api/Print/AgencyPrint`;
      bodyDate = {
        IdAgency: req.body.IdAgency,
        FileName: pdfName,
        TypeAgency: req.body.TypeAgency,
        AgencyKind: req.body.AgencyKind,
        UserId: UserLogin,
      };
    }
    console.log('bodyDate', bodyDate)
    let url = encodeURI(v);
    var res1 = await axios.post(url, bodyDate, axiosConfig);
    if (res1.data.Result) {
      const fileName = `.//download//${pdfName}`;
      res.download(fileName, function (err) {
        if (err) {
          // Check error if you want
        }
        fs.unlink(fileName, function () {
          console.log("File was deleted"); // Callback
        });
      });
    } else {
    }
  } catch (err) {
    console.log("errerrerr", err.message);
  }
}

async function dataFileSendLetter(req, res, next) {
  try {
    const pool = await pools.getPool("DBImage");
    let result = await pool
      .request()
      .input("dataFileId", sql.UniqueIdentifier, req.body.dataFileId)
      .input(
        "agencyRows",
        sql.NVarChar(sql.MAX),
        JSON.stringify(req.body.AgencyRows)
      )
      .execute("DBImage.dbo.uspDataFileUserAccessSave");
    //.execute('DBImage.dbo.uspDataFileSendLetter')
    return {
      statusResult: 0,
    };
  } catch (err) {
    //throw(err)
    return {
      statusResult: 2,
      message: "خطا در ارتباط با پایگاه داده ای",
    };
  }
}
async function userAccessAgencyUpdate(req, res, next) {
  try {
    let userLogin = req.privateData.UserLogin;
    const pool = await pools.getPool("Sale");
    let result = await pool
      .request()
      .input("DataFileId", sql.UniqueIdentifier, req.body.DataFileId)
      .input("UserId", sql.VarChar(25), userLogin)
      .execute("Sale.sale.uspDataFileUserAccessUpdate");
    return {
      statusResult: 0,
      message: "ذخیره با موفقیت انجام شده",
    };
  } catch (err) {
    console.log("err.message :>> ", err.message);
    return {
      statusResult: 2,
      message: "خطا در ارتباط با پایگاه داده ای",
    };
  }
}
/*
async function downloadExcelFileTemplateHR(req, res, next) {
    try {
        var fileName =`.//download//HrTemplate.xlsx`
        var fileName2 =`.//download//HrTemplate_Copy.xlsx`
        

    //     fs.copyFile(fileName, fileName2, fs.constants.COPYFILE_EXCL, (err) => {
    //     if (err) {
    //       console.log("Error Found:", err);
    //     }
    //     else {
       
    //         console.log("Success Ok:");
    //     }
    //   });

        var workbook = new ExcelJS.Workbook();
        
        workbook.xlsx.readFile(fileName).then(function () {
             var worksheet=workbook.getWorksheet('Data');
             // var row={}
            for(let i=5;i<30;i++){
                var row = worksheet.getRow(i)
                row.getCell(2).value = '1';
                row.getCell(3).value = '2';
                row.getCell(4).value = '3';
                row.getCell(5).value = '4';
                row.getCell(6).value = '5';
                row.getCell(7).value = '6';

                 row.commit();
            }
           
            workbook.xlsx.writeFile(fileName2);
             workbook.xlsx
      .writeFile("Profile.xlsx")
      .then(() => 
      {
        console.log("File saved!");
        res.download(fileName2, function(err) {
            if (err) { }   
            fs.unlink(fileName2, function(){
                console.log("File was deleted") 
            });
          
          });

      })

  });
        
    } catch (err) {
        console.log('err.message', err.message)
    }
}
*/

async function downloadExcelFileTemplateHR(req, res, next) {
  try {
    var fileName = `.//download//HrTemplate.xlsx`;
    var fileName2 = `.//download//HrTemplate_Copy.xlsx`;
    const xlsxSlim = await slim.readFile(fileName);
    for (let i = 0; i < 11; i++) {
      xlsxSlim.cell(2, "B" + (5 + i), "ali safari" + (i + 1));
      xlsxSlim.cell(2, "C" + (5 + i), i + 1);
      xlsxSlim.cell(2, "D" + (5 + i), i + 1);
      xlsxSlim.cell(2, "E" + (5 + i), "refrence number");
      xlsxSlim.cell(2, "F" + (5 + i), "ali safari" + i);
      xlsxSlim.cell(2, "G" + (5 + i), i + 1);
    }
    // Save to file
    await xlsxSlim.writeFile(fileName2);
    // return nodebuffer:
    //const buff = await xlsxSlim.getBuffer();

    console.log("File saved!");
    res.download(fileName2, function (err) {
      if (err) {
      }
      fs.unlink(fileName2, function () {
        console.log("File was deleted");
      });
    });
  } catch (err) {
    console.log("err.message", err.message);
  }
}


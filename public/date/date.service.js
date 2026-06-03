const config = require("../../config.json");
const jwt = require("jsonwebtoken");
const sql = require("mssql");
const pools = require("../../_helpers/pool-manegment");
const { SqlCommandCreator } = require("../../_helpers/SqlCommandCreator");
const { getPersianDate } = require("../../_helpers/persian.calender");
const axios = require("axios");
const cryptoService = require("../crypto/crypto.service");
const {sendMessage,sendMessagesAll} = require("../../_helpers/sendMessage");
const xlsx = require("xlsx"); //npm install xlsx
var svgCaptcha = require('svg-captcha');

module.exports = {
  getDate2

};
async function getDate2(req) {
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


const CryptoJS = require("crypto-js");


module.exports = {
    encryptData,
    decryptData,
    dataEncrypt,
    dataDecrypt
};

function encryptData({data}) {
      var key = "w5CNzuU0p6QNoWFxPNomYFKRlLiQbUdL";
      var options = {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7,};
      var textWordArray = CryptoJS.enc.Utf8.parse(data);
      var keyHex = CryptoJS.enc.Base64.parse(key);
      var encrypted = CryptoJS.TripleDES.encrypt(textWordArray, keyHex, options);
      return {
        result:encrypted.toString(CryptoJS.enc.Utf8)
      }
    }
function decryptData({data}) {
      var key = "w5CNzuU0p6QNoWFxPNomYFKRlLiQbUdL";
      var keyHex = CryptoJS.enc.Base64.parse(key);
      var options = {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7,};
      const decrypted = CryptoJS.TripleDES.decrypt(data, keyHex,options);
      return {
        result:decrypted.toString(CryptoJS.enc.Utf8)
      }
    }
function dataEncrypt(text) {
  var  key = '11A1764225B11AA1'; 
  text = CryptoJS.enc.Utf8.parse(text); 
  key = CryptoJS.enc.Utf8.parse(key); 
  
  var encrypted = CryptoJS.AES.encrypt(
    text,
     key, 
    { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.ZeroPadding }
    ); 
  encrypted = encrypted.ciphertext.toString(CryptoJS.enc.Hex);
  return encrypted
  }
function dataDecrypt(encrypted) {
  var  key = '11A1764225B11AA1'; 
  key = CryptoJS.enc.Utf8.parse(key); 

  var decrypted =  CryptoJS.AES.decrypt(
    {ciphertext: CryptoJS.enc.Hex.parse(encrypted)}, 
    key, 
    {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.ZeroPadding }
  ); 
    return decrypted.toString(CryptoJS.enc.Utf8)
  }


const JSRSASign = require("jsrsasign");

const generateJWT = () => {
const claims = {
  Username: "praveen",
  Age: 27,
  Fullname: "Praveen Kumar"
}

const key = "$PraveenIsAwesome!"; //*** PUT IN ENV FILE */

const header = {
  alg: "HS512",
  typ: "JWT"
};

var sHeader = JSON.stringify(header);
var sPayload = JSON.stringify(claims);

const sJWT = JSRSASign.jws.JWS.sign("HS512", sHeader, sPayload, key);
console.log(sJWT);
}

exports.generateJWT = generateJWT; 
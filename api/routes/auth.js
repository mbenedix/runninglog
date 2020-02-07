const JSRSASign = require("jsrsasign");

const key = process.env.JWTKEY; 

const generateJWT = () => {
  const claims = {
    Username: "praveen",
    Age: 27,
    Fullname: "Praveen Kumar"
  }
  const key = process.env.JWTKEY; 
  const header = {
    alg: "HS512",
    typ: "JWT"
  };

  var sHeader = JSON.stringify(header);
  var sPayload = JSON.stringify(claims);

  const sJWT = JSRSASign.jws.JWS.sign("HS512", sHeader, sPayload, key);
  
  decodeJWT(sJWT);
  return sJWT; 
}

const validateJWT = (token) => {
  const algorithm = "HS512";
  const key = process.env.JWTKEY; 

  return JSRSASign.jws.JWS.verifyJWT(token, key, {
    alg: [algorithm]
  });

}

const decodeJWT = (token) => {
  aToken = token.split(".");
  const uHeader = JSRSASign.b64utos(aToken[0]);
  const uClaim = JSRSASign.b64utos(aToken[1]);
  const pHeader = JSRSASign.jws.JWS.readSafeJSONString(uHeader);
  const pClaim = JSRSASign.jws.JWS.readSafeJSONString(uClaim);

  return pClaim;
  console.log(pHeader);
  console.log(pClaim);
}



exports.generateJWT = generateJWT; 
exports.validateJWT = validateJWT;
const JSRSASign = require("jsrsasign");

const generateJWT = (claims) => {
  const key = process.env.JWTKEY || "AddKeyAsEnvVariablePlease"; 
  const header = {
    alg: "HS512",
    typ: "JWT"
  };
  const sHeader = JSON.stringify(header);
  const sPayload = JSON.stringify(claims);

  return JSRSASign.jws.JWS.sign("HS512", sHeader, sPayload, key);
}

const validateJWT = (token) => { 
  if(!token) {
    return false;
  }
  
  const algorithm = "HS512";
  const key = process.env.JWTKEY || "AddKeyAsEnvVariablePlease"; ; 

  return JSRSASign.jws.JWS.verifyJWT(token, key, {
    alg: [algorithm]
  });
}

const decodeJWT = (token) => {
  const aToken = token.split(".");
  const uHeader = JSRSASign.b64utos(aToken[0]);
  const uClaim = JSRSASign.b64utos(aToken[1]);
  //const pHeader = JSRSASign.jws.JWS.readSafeJSONString(uHeader);
  const pClaim = JSRSASign.jws.JWS.readSafeJSONString(uClaim);

  return pClaim;
}

const tokenMiddle = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  if(!validateJWT(token)) {
    return res.status(401).json({ error: "invalid token" });
  }

  else {
    next(); 
  }
}

module.exports = {
  generateJWT,
  validateJWT,
  decodeJWT,
  tokenMiddle
};

const JSRSASign = require("jsrsasign");

const key = process.env.JWTKEY; 

const generateJWT = (claims) => {
  

  const key = process.env.JWTKEY; 
  //const key = "froggo";
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
  if(!token) {
    return false;
  }
  
  const algorithm = "HS512";
  const key = process.env.JWTKEY; 


  let answer = JSRSASign.jws.JWS.verifyJWT(token, key, {
    alg: [algorithm]
  });
  console.log(answer);

  return answer;

}

const decodeJWT = (token) => {
  aToken = token.split(".");
  const uHeader = JSRSASign.b64utos(aToken[0]);
  const uClaim = JSRSASign.b64utos(aToken[1]);
  const pHeader = JSRSASign.jws.JWS.readSafeJSONString(uHeader);
  const pClaim = JSRSASign.jws.JWS.readSafeJSONString(uClaim);

  return pClaim;

}

const tokenMiddle = (req, res, next) => {
  
  let token = req.headers.authorization.split(' ')[1];
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

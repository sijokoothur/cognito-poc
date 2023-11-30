const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const request = require('request');

const poolData = {
    UserPoolId: process.env.USER_POOL_ID, // Your user pool id here    
    ClientId: process.env.CLIENT_ID,
};
const pool_region = process.env.REGION;

const ValidateTokenMiddleware = (req, res, next) => {
    const token = req.headers.authorization; // Assuming the token is included in the Authorization header

    if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    request({
        url: `https://cognito-idp.${pool_region}.amazonaws.com/${poolData.UserPoolId}/.well-known/jwks.json`,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            const pems = {};
            const keys = body['keys'];

            for (let i = 0; i < keys.length; i++) {
                const key_id = keys[i].kid;
                const modulus = keys[i].n;
                const exponent = keys[i].e;
                const key_type = keys[i].kty;
                const jwk = { kty: key_type, n: modulus, e: exponent };
                const pem = jwkToPem(jwk);
                pems[key_id] = pem;
            }

            const decodedJwt = jwt.decode(token, { complete: true });
            if (!decodedJwt) {
                return res.status(401).json({ error: 'Not a valid JWT token' });
            }

            const kid = decodedJwt.header.kid;
            const pem = pems[kid];
            if (!pem) {
                return res.status(401).json({ error: 'Invalid token' });
            }

            jwt.verify(token, pem, function(err, payload) {
                if (err) {
                    return res.status(401).json({ error: 'Invalid Token' });
                } else {
                    req.user = payload; // Attach the decoded payload to the request for later use
                    req.user.token = token;
                    next(); // Call the next middleware or route handler
                }
            });
        } else {
            return res.status(500).json({ error: 'Error! Unable to download JWKs' });
        }
    });
};

module.exports = ValidateTokenMiddleware;

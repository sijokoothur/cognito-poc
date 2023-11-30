const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const poolData = {
    UserPoolId: process.env.USER_POOL_ID, // Your user pool id here    
    ClientId: process.env.CLIENT_ID,
};

const renew = async (req, res) => {
    try {
        const RefreshToken = new AmazonCognitoIdentity.CognitoRefreshToken({ RefreshToken: req.headers['refresh-token'] });

        const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

        const userData = {
            Username: req.user.username,
            Pool: userPool,
        };

        const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        const session = await new Promise((resolve, reject) => {
            cognitoUser.refreshSession(RefreshToken, (err, session) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(session);
                }
            });
        });

        const retObj = {
            access_token: session.accessToken.jwtToken,
            id_token: session.idToken.jwtToken,
            refresh_token: session.refreshToken.token,
        };

        console.log(retObj);
        res.json(retObj);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Token refresh failed' });
    }
}

module.exports = {
    renew,
};

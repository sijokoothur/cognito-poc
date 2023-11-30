const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

const poolData = {
    UserPoolId: process.env.USER_POOL_ID, // Your user pool id here    
    ClientId: process.env.CLIENT_ID,
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

/**
 * Authenticates a user in Amazon Cognito using the provided username and password.
 *
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @throws {object} If an error occurs during user authentication, an error object is thrown.
 * @returns {Promise<void>} A Promise that resolves when the user authentication is successful.
 *
 */
const login = async (req, res) => {
    const { username, password } = req.body; // Assuming you send the username and password in the request body

    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: username,
        Password: password,
    });

    const userData = {
        Username: username,
        Pool: userPool,
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    try {
        const result = await new Promise((resolve, reject) => {
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: function (result) {
                    resolve(result);
                },
                onFailure: function (err) {
                    reject(err);
                },
            });
        });

        console.log('access token + ' + result.getAccessToken().getJwtToken());
        console.log('id token + ' + result.getIdToken().getJwtToken());
        console.log('refresh token + ' + result.getRefreshToken().getToken());

        res.send(result); // You may want to send a more specific response based on your application needs
    } catch (error) {
        console.log(error);
        res.status(401).send({ error: 'Failed to authenticate user' });
    }
};

module.exports = {
    login,
};

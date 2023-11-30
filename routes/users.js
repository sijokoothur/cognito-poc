var express = require('express');
const { registerUser, verifyEmail, resendConfirmationCode, updateUser } = require('../controllers/user.controllerjs');
const ValidateTokenMiddleware = require('../middlewares/token');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/', registerUser);
router.put('/', ValidateTokenMiddleware, updateUser);
router.post('/verify-email', verifyEmail);
router.post('/resend-code', resendConfirmationCode);

module.exports = router;

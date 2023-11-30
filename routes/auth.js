var express = require('express');
const { login } = require('../controllers/auth.controller.js');
const ValidateTokenMiddleware = require('../middlewares/token');
const { renew } = require('../controllers/token.controller');
var router = express.Router();


router.post('/', login);
router.post('/refresh', ValidateTokenMiddleware, renew);

module.exports = router;

const express = require('express');
const { model } = require('mongoose');
const router = express.Router();

const {body} = require('express-validator')

const userContoller = require('../controllers/user.controller');
const { useConnection } = require('../models/user.model');

const auth = require('../middleware/auth.middleware');
const { route } = require('../app');
router.post('/register',
  [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min:3}).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({min:3}).withMessage('Password must be atleast 4 char long')
  ],
  userContoller.registerUser
)

router.post('/login',[
  body('email').isEmail().withMessage('Invalid Email'),
  body('password').isLength({min:3}).withMessage('password must be 4 charec')
],

userContoller.loginUser
)

router.get('/profile',auth.authUser,userContoller.getUserProfile);

router.get('/logout',auth.authUser,userContoller.logoutUser);

module.exports = router;
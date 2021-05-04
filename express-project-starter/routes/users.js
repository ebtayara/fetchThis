const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const db = require('../db/models');
const { csrfProtection, asyncHandler } = require('../utils');

const { loginUser, logoutUser } = require('../auth');

router.get('/users/login', csrfProtection, (req, res) => {
  res.render('userLogin', {
    title: 'Login',
    csrfToken: req.csrfToken(),
  });
});

const loginValidators = [
  check('email')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Email Address'),
  check('hashedPassword')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Password'),
];

router.post('/users/login', csrfProtection, loginValidators,
  asyncHandler(async (req, res) => {
    const {
      email,
      hashedPassword,
    } = req.body;

    let errors = [];
    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      // grabbing the user by email
      const user = await db.User.findOne({ where: { email } });

      if (user !== null) {
        // user exists compare password
        // to the provided password.
        const passwordMatch = await bcrypt.compare(hashedPassword, user.hashedPassword.toString());

        if (passwordMatch) {
          // If the password hashes match, then login the user
          // and redirect them to the default route.
          loginUser(req, res, user);
          return res.redirect('/');
        }
      }

      // Otherwise display an error message to the user.
      errors.push('Login failed for the provided email address and password');
    } else {
      errors = validatorErrors.array().map((error) => error.msg);
    }

    res.render('userLogin', {
      title: 'Login',
      email,
      errors,
      csrfToken: req.csrfToken(),
    });
  }));

/*   Editing Starts here     */
router.get('/users/signup', csrfProtection, (req, res) => {
  const user = db.User.build();
  res.render('signUp', {
    title: 'Register',
    user,
    csrfToken: req.csrfToken(),
  });
});

const userValidators = [
  check('email')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Email Address')
    .isLength({ max: 255 })
    .withMessage('Email Address must not be more than 255 characters long')
    .isEmail()
    .withMessage('Email Address is not a valid email')
    .custom((value) => {
      return db.User.findOne({ where: { emailAddress: value } })
        .then((user) => {
          if (user) {
            return Promise.reject('The provided Email Address is already in use by another account');
          }
        });
    }),
  check('hashedPassword')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Password')
    .isLength({ max: 50 })
    .withMessage('Password must not be more than 50 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, 'g')
    .withMessage('Password must contain at least 1 lowercase letter, uppercase letter, number, and special character (i.e. "!@#$%^&*")')
    .isLength({ min: 8 })
    .withMessage('The password should be at least 8 characters long.'),
];


router.post('/users/signup', csrfProtection, userValidators,
  asyncHandler(async (req, res) => {
    const {
      email,
      hashedPassword,
    } = req.body;

    const user = db.User.build({
      email,
      hashedPassword
    });

    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      const encryptedPassword = await bcrypt.hash(hashedPassword, 10);
      user.encryptedPassword = encryptedPassword;
      await user.save();
      loginUser(req, res, user);
      res.redirect('/');
    } else {
      const errors = validatorErrors.array().map((error) => error.msg);
      res.render('signUp', {
        title: 'Sign up',
        user,
        errors,
        csrfToken: req.csrfToken(),
      });
    }
  }));

  router.post('/users/logout', (req, res) => {
  logoutUser(req, res);
  res.redirect('/users/login');
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const db = require('../db/models');
const { User } = require('../db/models/user');
const { csrfProtection, asyncHandler } = require('../utils');

const { loginUser, logoutUser } = require('../auth');

router.get('/login', csrfProtection, (req, res) => {
  res.render('userLogin', {
    title: 'Login',
    csrfToken: req.csrfToken(),
  });
});

router.post('/demoTyrion', asyncHandler(async(req, res) => {

  const user = await db.User.findByPk(1);

  loginUser(req, res, user);
  return req.session.save(() => res.redirect("/"))
}));

router.post('/demoCeviche', asyncHandler(async(req, res) => {

  const user = await db.User.findByPk(2);
  console.log(user, 'USERRRRRRRRR')

  loginUser(req, res, user);
  // res.redirect('/')
  return req.session.save(() => res.redirect("/"));

}));


  // const demo = await User.findByPk(2)
  // console.log(demo, 'heyyyyy is this Ceviche?')

  // res.render('userLogin', {
  //   title: 'Login',
  //   csrfToken: req.csrfToken(),
  // });
// });

const loginValidators = [
  check('email')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Email Address'),
  check('hashedPassword')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Password'),
];

router.post('/login', csrfProtection, loginValidators,
  asyncHandler(async (req, res) => {
    const {
      email,
      hashedPassword,
    } = req.body;
    // console.log(req.body);
    let errors = [];
    const validatorErrors = validationResult(req);
    if (validatorErrors.isEmpty()) {
      // console.log(req.body, 'INSIDE IF BLOCK');
      // grabbing the user by email
      const user = await db.User.findOne({ where: { email } });

      if (user !== null) {
        // console.log('User is not NULL')
        // user exists compare password
        // to the provided password.
        const passwordMatch = await bcrypt.compare(hashedPassword, user.hashedPassword.toString());


        // console.log(passwordMatch)
        if (passwordMatch) {
          // console.log('password match')
          // If the password hashes match, then login the user
          // and redirect them to the default route.
          loginUser(req, res, user);
          return req.session.save(() => res.redirect("/"));
        }
      }

      // Otherwise display an error message to the user.
      errors.push('Login failed for the provided email address and password');
    } else {
      // console.log(req.body,'INSIDE ELSE BLOCK');
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
router.get('/signUp', csrfProtection, (req, res) => {
  const user = db.User.build();
  res.render('signUp', {
    title: 'Register',
    user,
    csrfToken: req.csrfToken(),
  });
});

const userValidators = [
  // check('email')
  //   .exists({ checkFalsy: true })
  //   .withMessage('Please provide a value for Email Address')
  //   .isLength({ max: 255 })
  //   .withMessage('Email Address must not be more than 255 characters long')
  //   .isEmail()
  //   .withMessage('Email Address is not a valid email')
  //   .custom((value) => {
  //     return db.User.findOne({ where: { email: value } })
  //       .then((user) => {
  //         if (user) {
  //           return Promise.reject('The provided Email Address is already in use by another account');
  //         }
  //       });
  //   }),
  // check('hashedPassword')
  //   .exists({ checkFalsy: true })
  //   .withMessage('Please provide a value for Password')
  //   .isLength({ max: 50 })
  //   .withMessage('Password must not be more than 50 characters long')
  //   .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, 'g')
  //   .withMessage('Password must contain at least 1 lowercase letter, uppercase letter, number, and special character (i.e. "!@#$%^&*")')
  //   .isLength({ min: 8 })
  //   .withMessage('The password should be at least 8 characters long.'),
];


router.post('/signUp', csrfProtection, userValidators,
  asyncHandler(async (req, res) => {
    const {
      userName,
      email,
      password,
    } = req.body;
    console.log(req.body, 'req.body' )
    const user = db.User.build({
      username: userName,
      email
    });
    console.log(user);
    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      console.log(req.body, 'INSIDE IF BLOCK');
      const hashedPassword = await bcrypt.hash(password, 10);
      user.hashedPassword = hashedPassword;
      await user.save();
      loginUser(req, res, user);
      req.session.save(() => res.redirect("/"))
    } else {
      console.log(validatorErrors,'validatorErrors')
      console.log(req.body, 'INSIDE ELSE BLOCK');
      const errors = validatorErrors.array().map((error) => error.msg);
      console.log(errors);
      res.render('signUp', {
        title: 'Sign up',
        user,
        errors,
        csrfToken: req.csrfToken(),
      });
    }
  }));

  router.post('/logout', (req, res) => {
  logoutUser(req, res);
  req.session.save(() => res.redirect("/"))
});

module.exports = router;

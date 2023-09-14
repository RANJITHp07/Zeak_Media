const{ validationResult, check } =require('express-validator');

const validateMiddleware = [
  check('username').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
  check('email').isEmail().withMessage('Invalid email'),
  check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  }
];

module.exports =validateMiddleware;

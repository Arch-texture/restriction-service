const { body, param, query, validationResult } = require("express-validator");

exports.createRestrictionValidation = [
  body("reason")
    .trim()
    .notEmpty()
    .withMessage("Reason is required.")
    .isLength({ max: 255 })
    .withMessage("Reason cannot exceed 255 characters."),
];

exports.assignRestrictionValidation = [
  body("uuid_student")
    .isUUID()
    .withMessage("uuid_student must be a valid UUID."),
  body("reason")
    .trim()
    .notEmpty()
    .withMessage("Reason is required.")
    .isLength({ max: 255 })
    .withMessage("Reason cannot exceed 255 characters."),
];

exports.validateStudentValidation = [
  param("uuid_student")
    .isUUID()
    .withMessage("uuid_student must be a valid UUID."),
];

exports.validateRestrictionValidation = [
  param("uuid_restriction")
    .isUUID()
    .withMessage("uuid_restriction must be a valid UUID."),
];

exports.removeRestrictionValidation = [
  body("uuid_student")
    .isUUID()
    .withMessage("uuid_student must be a valid UUID."),
  body("uuid_restriction")
    .isUUID()
    .withMessage("uuid_restriction must be a valid UUID."),
];

exports.validateRestrictionValidation = [
  query("uuid").optional().isUUID().withMessage("uuid must be a valid UUID."),
  query("reason")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("reason must not be empty."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!req.query.uuid && !req.query.reason) {
      return res
        .status(400)
        .json({ message: "At least one of uuid or reason must be provided." });
    }
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

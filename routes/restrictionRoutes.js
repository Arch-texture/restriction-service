const express = require("express");
const router = express.Router();
const restrictionController = require("../controllers/restrictionController");
const {
  createRestrictionValidation,
  assignRestrictionValidation,
  validateStudentValidation,
  validateRestrictionValidation,
  removeRestrictionValidation,
} = require("../helpers/restrictionValidator");
const validateFields = require("../middleware/errorHandler");

router.post(
  "/",
  createRestrictionValidation,
  validateFields,
  restrictionController.createRestriction
);

router.get(
  "/student/:uuid_student",
  validateStudentValidation,
  validateFields,
  restrictionController.getRestrictions
);
router.get(
  "/validateStudent/:uuid_student",
  validateStudentValidation,
  validateFields,
  restrictionController.validateStudent
);
router.get(
  "/validateRestriction/:query",
  validateFields,
  restrictionController.validateRestriction
);
router.post(
  "/assign",
  assignRestrictionValidation,
  validateFields,
  restrictionController.assignRestriction
);
router.delete(
  "/remove",
  removeRestrictionValidation,
  validateFields,
  restrictionController.removeRestriction
);

module.exports = router;

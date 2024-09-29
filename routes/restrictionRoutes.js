const express = require("express");
const router = express.Router();
const restrictionController = require("../controllers/restrictionController");
const {
  assignRestrictionValidation,
  validateStudentValidation,
  removeRestrictionValidation,
} = require("../helpers/restrictionValidator");
const validateFields = require("../middleware/validateFields");

router.get(
  "/student/:uuid_student",
  validateStudentValidation,
  validateFields,
  restrictionController.getRestrictions
);
router.get(
  "/validate/:uuid_student",
  validateStudentValidation,
  validateFields,
  restrictionController.validateStudent
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

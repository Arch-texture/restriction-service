// controllers/restrictionController.js
const db = require('../helpers/firebase');
const Restriction = require('../models/restriction');
const StudentRestriction = require('../models/studentRestriction');

const getRestrictions = async (req, res, next) => {
  try {
    const snapshot = await db.collection('restrictions').get();
    const restrictions = [];
    snapshot.forEach((doc) => {
      restrictions.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(restrictions);
  } catch (error) {
    next(error);
  }
};
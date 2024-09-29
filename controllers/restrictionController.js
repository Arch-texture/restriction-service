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

const validateStudent = async (req, res, next) => {
  const { uuid_student } = req.params;
  try {
    const snapshot = await db
      .collection('studentRestrictions')
      .where('uuid_student', '==', uuid_student)
      .get();

    if (snapshot.empty) {
      return res.status(200).json({ restricted: false });
    }

    const restrictions = [];
    snapshot.forEach((doc) => {
      restrictions.push(doc.data().uuid_restriction);
    });

    res.status(200).json({ restricted: true, restrictions });
  } catch (error) {
    next(error);
  }
};

const assignRestriction = async (req, res, next) => {
  const { uuid_student, uuid_restriction } = req.body;
  try {
    await db.collection('studentRestrictions').add({
      uuid_student,
      uuid_restriction,
    });
    res.status(201).json({ message: 'Restriction assigned successfully.' });
  } catch (error) {
    next(error);
  }
};

const removeRestriction = async (req, res, next) => {
  const { uuid_student, uuid_restriction } = req.body;
  try {
    const snapshot = await db
      .collection('studentRestrictions')
      .where('uuid_student', '==', uuid_student)
      .where('uuid_restriction', '==', uuid_restriction)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'Restriction not found.' });
    }

    const batch = db.batch();
    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    res.status(200).json({ message: 'Restriction removed successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
    getRestrictions,
    validateStudent,
    assignRestriction,
    removeRestriction,
};
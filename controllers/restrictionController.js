const db = require("../helpers/firebase");
const Restriction = require("../models/restriction");
const StudentRestriction = require("../models/studentRestriction");
const { v4: uuidv4 } = require("uuid");


const createRestriction = async (req, res, next) => {
  const { reason } = req.body;

  try {
    const uuid_restriction = uuidv4();

    await db.collection("restrictions").doc(uuid_restriction).set({
      uuid: uuid_restriction,
      reason,
    });

    res.status(201).json({ message: "Restriction created successfully.", uuid_restriction });
  } catch (error) {
    next(error);
  }
};

const getRestrictions = async (req, res, next) => {
  const { uuid_student } = req.params;

  try {
    const studentRestrictionsSnapshot = await db
      .collection("studentRestrictions")
      .where("uuid_student", "==", uuid_student)
      .get();

    if (studentRestrictionsSnapshot.empty) {
      return res.status(200).json({
        message: "No restrictions found for this student.",
        restrictions: [],
      });
    }

    let uuid_restrictions = [];
    studentRestrictionsSnapshot.forEach((doc) => {
      uuid_restrictions.push(doc.data().uuid_restriction);
    });

    uuid_restrictions = [...new Set(uuid_restrictions)];

    const restrictions = [];

    if (uuid_restrictions.length <= 10) {
      const restrictionsSnapshot = await db
        .collection("restrictions")
        .where("uuid", "in", uuid_restrictions)
        .get();

      restrictionsSnapshot.forEach((doc) => {
        restrictions.push(doc.data());
      });
    } else {
      const batches = [];
      while (uuid_restrictions.length) {
        const batch = uuid_restrictions.splice(0, 10);
        batches.push(
          db.collection("restrictions").where("uuid", "in", batch).get()
        );
      }

      const results = await Promise.all(batches);
      results.forEach((restrictionsSnapshot) => {
        restrictionsSnapshot.forEach((doc) => {
          restrictions.push(doc.data());
        });
      });
    }

    res.status(200).json({ restrictions });
  } catch (error) {
    next(error);
  }
};

const validateStudent = async (req, res, next) => {
  const { uuid_student } = req.params;
  try {
    const snapshot = await db
      .collection("studentRestrictions")
      .where("uuid_student", "==", uuid_student)
      .get();

    if (snapshot.empty) {
      return res.status(200).json({ restricted: false });
    }

    res.status(200).json({ restricted: true });
  } catch (error) {
    next(error);
  }
};

const validateRestriction = async (req, res, next) => {
  const { uuid_restriction } = req.params;
  try {
    const snapshot = await db
      .collection("restrictions")
      .where("uuid", "==", uuid_restriction)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "Restriction not found." });
    }

    res.status(200).json({ message: "Restriction found." });
  } catch (error) {
    next(error);
  }
}

const assignRestriction = async (req, res, next) => {
  const { uuid_student, reason } = req.body;

  try {
    const uuid_restriction = uuidv4();

    await db.collection("restrictions").doc(uuid_restriction).set({
      uuid: uuid_restriction,
      reason,
    });

    await db.collection("studentRestrictions").add({
      uuid_student,
      uuid_restriction,
    });

    res.status(201).json({
      message: "Restriction created and assigned successfully.",
      uuid_student,
      uuid_restriction,
      reason,
    });
  } catch (error) {
    next(error);
  }
};

const removeRestriction = async (req, res, next) => {
  const { uuid_student, uuid_restriction } = req.body;
  try {
    const snapshot = await db
      .collection("studentRestrictions")
      .where("uuid_student", "==", uuid_student)
      .where("uuid_restriction", "==", uuid_restriction)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "Restriction not found." });
    }

    const batch = db.batch();
    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    res.status(200).json({ message: "Restriction removed successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRestriction,
  getRestrictions,
  validateStudent,
  validateRestriction,
  assignRestriction,
  removeRestriction,
};

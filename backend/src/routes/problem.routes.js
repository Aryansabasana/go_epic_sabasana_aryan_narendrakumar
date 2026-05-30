const express = require("express");

const router = express.Router();

const {
  getAllProblems,
  getSingleProblem,
  createProblem,
  replaceProblem,
  updateProblem,
  deleteProblem,
} = require("../controllers/problem.controller");

const validateProblem = require("../middleware/validateProblem.middleware")


router.get("/", getAllProblems);

router.get("/:problemId", getSingleProblem);

router.post("/", validateProblem, createProblem);

router.put("/:problemId", validateProblem, replaceProblem);

router.patch("/:problemId", updateProblem);

router.delete("/:problemId", deleteProblem);


module.exports = router;
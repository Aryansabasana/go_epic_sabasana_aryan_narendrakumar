const express = require("express");

const router = express.Router();

const {
  getAllProblems,
  getSingleProblem,
  createProblem,
  replaceProblem,
  updateProblem,
  deleteProblem,
  searchProblems,
  getProblemsByTopic,
  getProblemsByDifficulty,
  getProblemsBySource,
  getProblemsByInstructionKeyword,
} = require("../controllers/problem.controller");

const validateProblem = require("../middleware/validateProblem.middleware")


router.get("/", getAllProblems);

router.get("/search", searchProblems);

router.get("/topic/:topic", getProblemsByTopic);

router.get("/difficulty/:difficulty", getProblemsByDifficulty);

router.get("/source/:source", getProblemsBySource);

router.get("/instruction/:keyword", getProblemsByInstructionKeyword);

router.get("/:problemId", getSingleProblem);

router.post("/", validateProblem, createProblem);

router.put("/:problemId", validateProblem, replaceProblem);

router.patch("/:problemId", updateProblem);

router.delete("/:problemId", deleteProblem);



module.exports = router;
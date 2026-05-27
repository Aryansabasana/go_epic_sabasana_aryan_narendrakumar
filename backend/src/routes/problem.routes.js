const express = require('express');
const {getAllProblems, getSingleProblem, createProblem, replaceProblem, updateProblem, deleteProblem} = require("../controllers/problem.controller");

const router = express.Router();

router.get("/problems", getAllProblems);
router.get("/problems/:problemId", getSingleProblem);
router.post("/problems", createProblem);
router.put("/problems/:problemId", replaceProblem);
router.patch("/problems/:problemId", updateProblem);
router.delete("/problems/:problemId", deleteProblem);

module.exports = router;
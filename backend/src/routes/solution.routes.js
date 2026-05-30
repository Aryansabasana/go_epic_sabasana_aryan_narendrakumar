const express = require("express");
const router = express.Router();
const Solution = require("../models/solution.model");
const { getAllSolutions, getSingleSolution, createSolution, replaceSolution, updateSolution, deleteSolution } = require("../controllers/solution.controller");


//GET ALL PROBLEMS
router.get("/", getAllSolutions);


//GET SINGLE SOLUTION 
router.get("/:solutionId", getSingleSolution)


// CREATE SOLUTION

router.post("/", createSolution)

//REPLACE SOLUTION

router.put("/:solutionId", replaceSolution);

//UPDATE SOLUTION

router.patch("/:solutionId", updateSolution)

//DELETE SOLUTION
router.delete("/:solutionId", deleteSolution);

module.exports = router;
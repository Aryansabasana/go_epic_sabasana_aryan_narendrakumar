const Problem = require("../models/problem.model");
const asyncHandler = require("../utils/asyncHandler");
const asynHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError")

const getAllProblems = asyncHandler(async (req, res) => {
    
            const problems = await Problem.find();
    
            res.status(200).json({
                success : true,
                count : problems.length,
                data : problems,
            });
        
});

const getSingleProblem = asynHandler(async (req, res) => {
     
            const problem = await Problem.findById(req.params.problemId);
    
            if(!problem) {
               throw new ApiError(404, "Problem not found");
            }
    
            res.status(200).json({
                success : true,
                data : problem,
            });
        
});

const createProblem = asynHandler(async (req, res) => {
    
            const newProblem = await Problem.create(req.body)
    
            res.status(201).json({
                success : true,
                data : newProblem,
            });
        
});


const replaceProblem = asynHandler(async (req, res) => {
     
        const updatedProblem = await Problem.findByIdAndUpdate(
            req.params.problemId,
            req.body,
            {
                new : true,
                runValidators : true,
            }
        );

        if(!updatedProblem) {
            throw new ApiError(404, "Problem not found");
        }

        res.status(200).json({
            success : true,
            data : updatedProblem,
        })
    
});

const updateProblem =asyncHandler(async (req, res) => {
    
            const updatedProblem = await Problem.findByIdAndUpdate(
                req.params.problemId,
                req.body,
                {
                    new : true, 
                    runValidators : true,   
                }
            );
    
            if(!updatedProblem) {
               throw new ApiError(404, "Problem not found");
            }
    
            res.status(200).json({
                success : true,
                data : updatedProblem,
            })
        
});

const deleteProblem =asyncHandler(async (req, res) => {
    
        const deletedProblem = await Problem.findByIdAndDelete(
            req.params.problemId,
        );

        if(!deletedProblem) {
            throw new ApiError(404, "Problem not found");
        }

        res.status(200).json({
            success : true,
            message : "Problem deleted successfully"
        })
    
});

module.exports = {
  getAllProblems,
  getSingleProblem,
  createProblem,
  replaceProblem,
  updateProblem,
  deleteProblem,
};
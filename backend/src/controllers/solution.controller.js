const Solution = require("../models/solution.model");
const asyncHandler = require("../utils/asyncHandler");

const getAllSolutions = asyncHandler(async (req, res) => {
   
        const solutions = await Solution.find();

        res.status(200).json({
            success : true,
            count : solutions.length,
            data : solutions,
        });
    
})

const getSingleSolution = asyncHandler(async (req, res) => {
    
        const solution = await Solution.findById(req.params.solutionId);

        if(!solution) {
            throw new ApiError(404, "Solution not found")
        }

        res.status(200).json({
            success : true,
            data : solution,
        });
    
});

const createSolution = asyncHandler(async (req,res) => {
    
        const newSolution = await Solution.create(req.body);

        res.status(201).json({
            success : true,
            data : newSolution,
        })
    
});

const replaceSolution = asyncHandler(async (req,res) => {
    
        const updatedSolution = await Solution.findByIdAndUpdate(
            req.params.solutionId,
            req.body,
            {
                new : true,
                runValidators : true,
            }
        )

        if(!updatedSolution) {
            throw new ApiError(404, "Solution not found")
        }

        res.status(200).json({
            success : true,
            data : updatedSolution,
        });

         
});

const updateSolution = asyncHandler(async (req,res) => {
     
        const updatedSolution = await Solution.findByIdAndUpdate(
            req.params.solutionId,
            req.body,
            {
                new : true,
                runValidators : true,
            }
        )

        if(!updatedSolution) {
            throw new ApiError(404, "Solution not found")
        }

        res.status(200).json({
            success : true,
            data : updatedSolution,
        });

        
});

const deleteSolution = asyncHandler(async (req, res) => {
  
    const deletedSolution = await Solution.findByIdAndDelete(
      req.params.solutionId
    );

    if (!deletedSolution) {
      throw new ApiError(404, "Solution not found");
    }

    res.status(200).json({
      success: true,
      message: "Solution deleted successfully",
    });
   
});

module.exports = {
    getAllSolutions,
    getSingleSolution,
    createSolution,
    replaceSolution,
    updateSolution,
    deleteSolution
}
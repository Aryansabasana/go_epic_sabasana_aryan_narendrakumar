const Problem = require("../models/problem.model");
const asyncHandler = require("../utils/asyncHandler");
const asynHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");

const getAllProblems = asyncHandler(async (req, res) => {
  const filter = {};
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 10);
  const skip = (page - 1) * limit;
  const sort = req.query.sort || "createdAt";

  if (req.query.difficulty) {
    filter.difficulty = req.query.difficulty;
  }

  if (req.query.topic) {
    filter.topic = req.query.topic;
  }

  if (req.query.source) {
    filter.source = req.query.source;
  }

  if (req.query.keyword) {
    filter.$or = [
      {
        title: {
          $regex: req.query.keyword,
          $options: "i",
        },
      },
      {
        instruction: {
          $regex: req.query.keyword,
          $options: "i",
        },
      },
    ];
  }

  const problems = await Problem.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const totalProblems = await Problem.countDocuments(filter);

  res.status(200).json({
    success: true,
    page,
    limit,
    sort,
    totalProblems,
    totalPages: Math.ceil(totalProblems / limit),
    count: problems.length,
    data: problems,
  });
});

const getSingleProblem = asynHandler(async (req, res) => {
  const problem = await Problem.findById(req.params.problemId);

  if (!problem) {
    throw new ApiError(404, "Problem not found");
  }

  res.status(200).json({
    success: true,
    data: problem,
  });
});

const createProblem = asynHandler(async (req, res) => {
  const newProblem = await Problem.create(req.body);

  res.status(201).json({
    success: true,
    data: newProblem,
  });
});

const replaceProblem = asynHandler(async (req, res) => {
  const updatedProblem = await Problem.findByIdAndUpdate(
    req.params.problemId,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedProblem) {
    throw new ApiError(404, "Problem not found");
  }

  res.status(200).json({
    success: true,
    data: updatedProblem,
  });
});

const updateProblem = asyncHandler(async (req, res) => {
  const updatedProblem = await Problem.findByIdAndUpdate(
    req.params.problemId,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedProblem) {
    throw new ApiError(404, "Problem not found");
  }

  res.status(200).json({
    success: true,
    data: updatedProblem,
  });
});

const deleteProblem = asyncHandler(async (req, res) => {
  const deletedProblem = await Problem.findByIdAndDelete(req.params.problemId);

  if (!deletedProblem) {
    throw new ApiError(404, "Problem not found");
  }

  res.status(200).json({
    success: true,
    message: "Problem deleted successfully",
  });
});

const searchProblems = asyncHandler(async (req, res) => {
  const q = req.query.q;

  if (!q?.trim()) {
    throw new ApiError(400, "Search query is required");
  }

  const problems = await Problem.find({
    $or: [
      {
        title: {
          $regex: q,
          $options: "i",
        },
      },
      {
        instruction: {
          $regex: q,
          $options: "i",
        },
      },
      {
        topic: {
          $regex: q,
          $options: "i",
        },
      },
    ],
  });

  res.status(200).json({
    success: true,
    query: q,
    count: problems.length,
    data: problems,
  });
});

const getProblemsByTopic = asyncHandler(async (req, res) => {
  const problems = await Problem.find({
    topic: req.params.topic,
  });

  res.status(200).json({
    success: true,
    count: problems.length,
    data: problems,
  });
});


const getProblemsByDifficulty = asyncHandler(async (req, res) => {
  const problems = await Problem.find({
    difficulty: req.params.difficulty,
  });

  res.status(200).json({
    success: true,
    count: problems.length,
    data: problems,
  });
});


const getProblemsBySource = asyncHandler(async (req, res) => {
  const problems = await Problem.find({
    source: req.params.source,
  });

  res.status(200).json({
    success: true,
    count: problems.length,
    data: problems,
  });
});

const getProblemsByInstructionKeyword = asyncHandler(async (req, res) => {
  const problems = await Problem.find({
    instruction: {
      $regex: req.params.keyword,
      $options: "i",
    },
  });

  res.status(200).json({
    success: true,
    count: problems.length,
    data: problems,
  });
});

module.exports = {
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

};

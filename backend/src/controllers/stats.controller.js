const Problem = require("../models/problem.model");
const Topic = require("../models/topic.model");
const Solution = require("../models/solution.model");
const Dataset = require("../models/dataset.model");

const asyncHandler = require("../utils/asyncHandler");

const getProblemStats = asyncHandler(async (req, res) => {
  const totalProblems = await Problem.countDocuments();

  res.status(200).json({
    success: true,
    totalProblems,
  });
});

const getTopicStats = asyncHandler(async (req, res) => {
  const totalTopics = await Topic.countDocuments();

  res.status(200).json({
    success: true,
    totalTopics,
  });
});

const getDatasetStats = asyncHandler(async (req, res) => {
  const totalDatasets = await Dataset.countDocuments();

  res.status(200).json({
    success: true,
    totalDatasets,
  });
});

const getTotalSolutions = asyncHandler(async (req, res) => {
  const stats = await Solution.aggregate([
    { $count: "totalSolutions" }
  ]);

  const totalSolutions = stats.length > 0 ? stats[0].totalSolutions : 0;

  res.status(200).json({
    success: true,
    totalSolutions,
  });
});

const getAdvancedProblemsStats = asyncHandler(async (req, res) => {
  const stats = await Problem.aggregate([
    { $match: { difficulty: "advanced" } },
    { $count: "totalAdvancedProblems" }
  ]);

  const totalAdvancedProblems = stats.length > 0 ? stats[0].totalAdvancedProblems : 0;

  res.status(200).json({
    success: true,
    totalAdvancedProblems,
  });
});

const getTopicStatistics = asyncHandler(async (req, res) => {
  const { topic } = req.params;
  const stats = await Problem.aggregate([
    { $match: { topic: topic } },
    { $count: "totalProblems" }
  ]);

  const totalProblems = stats.length > 0 ? stats[0].totalProblems : 0;

  res.status(200).json({
    success: true,
    topic,
    totalProblems,
  });
});

const getSourceStatistics = asyncHandler(async (req, res) => {
  const { source } = req.params;
  const stats = await Problem.aggregate([
    { $match: { source: source } },
    { $count: "totalProblems" }
  ]);

  const totalProblems = stats.length > 0 ? stats[0].totalProblems : 0;

  res.status(200).json({
    success: true,
    source,
    totalProblems,
  });
});

const getDifficultyStats = asyncHandler(async (req, res) => {
  const stats = await Problem.aggregate([
    {
      $group: {
        _id: "$difficulty",
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: stats,
  });
});

module.exports = {
  getProblemStats,
  getTopicStats,
  getDatasetStats,
  getTotalSolutions,
  getAdvancedProblemsStats,
  getTopicStatistics,
  getSourceStatistics,
  getDifficultyStats,
};
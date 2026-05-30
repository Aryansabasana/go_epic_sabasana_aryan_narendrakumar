const Dataset = require("../models/dataset.model");

const asyncHandler = require("../utils/asyncHandler");

const getAllDatasets = asyncHandler(async (req, res) => {
  const datasets = await Dataset.find();

  res.status(200).json({
    success: true,
    count: datasets.length,
    data: datasets,
  });
});

const getSingleDataset = asyncHandler(async (req, res) => {
  const dataset = await Dataset.findById(req.params.datasetId);

  if (!dataset) {
    throw new ApiError(404, "Dataset not found");
  }

  res.status(200).json({
    success: true,
    data: dataset,
  });
});

const createDataset = asyncHandler(async (req, res) => {
  const newDataset = await Dataset.create(req.body);

  res.status(201).json({
    success: true,
    data: newDataset,
  });
});

const replaceDataset = asyncHandler(async (req, res) => {
  const updatedDataset = await Dataset.findByIdAndUpdate(
    req.params.datasetId,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedDataset) {
    throw new ApiError(404, "Dataset not found");
  }

  res.status(200).json({
    success: true,
    data: updatedDataset,
  });
});

const updateDataset = asyncHandler(async (req, res) => {
  const updatedDataset = await Dataset.findByIdAndUpdate(
    req.params.datasetId,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedDataset) {
    throw new ApiError(404, "Dataset not found");
  }

  res.status(200).json({
    success: true,
    data: updatedDataset,
  });
});

const deleteDataset = asyncHandler(async (req, res) => {
  const deletedDataset = await Dataset.findByIdAndDelete(req.params.datasetId);

  if (!deletedDataset) {
    throw new ApiError(404, "Dataset not found");
  }

  res.status(200).json({
    success: true,
    message: "Dataset deleted successfully",
  });
});

module.exports = {
  getAllDatasets,
  getSingleDataset,
  createDataset,
  replaceDataset,
  updateDataset,
  deleteDataset,
};

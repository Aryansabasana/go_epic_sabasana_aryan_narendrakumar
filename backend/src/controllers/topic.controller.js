const Topic = require("../models/topic.model");
const asyncHandler = require("../utils/asyncHandler");

const getAllTopics = asyncHandler(async (req, res) => {
     
        const topics = await Topic.find();
    
        res.status(200).json({
          success: true,
          count: topics.length,
          data: topics,
        });
      
});


const getSingleTopic = asyncHandler(async (req, res) => {
     
        const topic = await Topic.findOne({
          name: req.params.topicName,
        });
    
        if (!topic) {
          throw new ApiError(404, "Topic not found")
        }
    
        res.status(200).json({
          success: true,
          data: topic,
        });
      
});


const createTopic = asyncHandler(async (req, res) => {
    
        const newTopic = await Topic.create(req.body);
    
        res.status(201).json({
          success: true,
          data: newTopic,
        });
      
});

const replaceTopic = asyncHandler(async (req, res) => {
  
    const updatedTopic = await Topic.findOneAndUpdate(
      {
        name: req.params.topicName,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTopic) {
      throw new ApiError(404, "Topic not found")
    }

    res.status(200).json({
      success: true,
      data: updatedTopic,
    });
  
});

const updateTopic = asyncHandler(async (req, res) => {
  
    const updatedTopic = await Topic.findOneAndUpdate(
      {
        name: req.params.topicName,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTopic) {
     throw new ApiError(404, "Topic not found")
    }

    res.status(200).json({
      success: true,
      data: updatedTopic,
    });
  
});

const deleteTopic =  asyncHandler(async (req, res) => {
  
    const deletedTopic = await Topic.findOneAndDelete({
      name: req.params.topicName,
    });

    if (!deletedTopic) {
      throw new ApiError(404, "Topic not found");
    }

    res.status(200).json({
      success: true,
      message: "Topic deleted successfully",
    });
 
});

module.exports = {
    getAllTopics,
    getSingleTopic,
    createTopic,
    replaceTopic,
    updateTopic,
    deleteTopic,
}
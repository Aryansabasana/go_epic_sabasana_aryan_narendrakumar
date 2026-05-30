const express = require("express");

const router = express.Router();

const Topic = require("../models/topic.model");
const { getAllTopics, getSingleTopic, createTopic, replaceTopic, updateTopic, deleteTopic } = require("../controllers/topic.controller");


router.get("/", getAllTopics);


router.get("/:topicName", getSingleTopic);


router.post("/", createTopic);


router.put("/:topicName", replaceTopic);

router.patch("/:topicName", updateTopic);


router.delete("/:topicName", deleteTopic);

module.exports = router;
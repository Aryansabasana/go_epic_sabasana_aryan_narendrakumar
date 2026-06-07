const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const Problem = require("../models/problem.model");
const Solution = require("../models/solution.model");
const Topic = require("../models/topic.model");
const Dataset = require("../models/dataset.model");

const MONGO_URI = process.env.MONGO_URI;

// Load dataset
const dataPath = path.join(__dirname, "../../data/go-epic.json");
const rawData = fs.readFileSync(dataPath, "utf-8");
const dataset = JSON.parse(rawData);

// ========================
// NORMALIZER
// ========================
const normalizeDifficulty = (d) => {
  if (!d) return "medium";

  const value = d.toLowerCase();

  switch (value) {
    case "beginner":
    case "easy":
      return "easy";

    case "medium":
    case "intermediate":
      return "medium";

    case "hard":
    case "advanced":
    case "difficult":
      return "advanced";

    default:
      return "medium";
  }
};

const seedDatabase = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected successfully");

    // Clear old data
    await Problem.deleteMany();
    await Solution.deleteMany();
    await Topic.deleteMany();
    await Dataset.deleteMany();

    console.log("🧹 Old data cleared");

    // ========================
    // 1. PROBLEMS
    // ========================
    const problems = dataset.map((item, index) => ({
      title: `Problem ${index + 1}`,
      instruction: item.instruction,
      topic: item.topic,
      difficulty: normalizeDifficulty(item.difficulty),
    }));

    await Problem.insertMany(problems);
    console.log(`✅ Inserted ${problems.length} problems`);

    // ========================
    // 2. SOLUTIONS
    // ========================
    const solutions = dataset.map((item, index) => ({
      title: `Solution ${index + 1}`,
      topic: item.topic,
      difficulty: normalizeDifficulty(item.difficulty),
      source: item.dataset_source,
      code: item.output,
      explanation: item.instruction,
    }));

    await Solution.insertMany(solutions);
    console.log(`✅ Inserted ${solutions.length} solutions`);

    // ========================
    // 3. TOPICS (unique)
    // ========================
    const uniqueTopics = [...new Set(dataset.map((item) => item.topic))];

    const topics = uniqueTopics.map((topic) => ({
      name: topic,
      category: "programming",
      description: `Topic: ${topic}`,
    }));

    await Topic.insertMany(topics);
    console.log(`✅ Inserted ${topics.length} topics`);

    // ========================
    // 4. DATASETS (grouped + FIXED)
    // ========================
    const grouped = {};

    dataset.forEach((item) => {
      const normalizedDifficulty = normalizeDifficulty(item.difficulty);

      const key = `${item.dataset_source}-${item.topic}-${normalizedDifficulty}`;

      if (!grouped[key]) {
        grouped[key] = {
          source: item.dataset_source,
          topic: item.topic,
          difficulty: normalizedDifficulty,
          totalProblems: 0,
        };
      }

      grouped[key].totalProblems++;
    });

    const datasets = Object.values(grouped).map((d) => ({
      ...d,
      description: `${d.source} dataset for ${d.topic} (${d.difficulty})`,
    }));

    await Dataset.insertMany(datasets);
    console.log(`✅ Inserted ${datasets.length} dataset records`);

    console.log("🎉 Database seeding completed successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
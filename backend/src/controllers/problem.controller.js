const problems = require("../data/problems.data");

//GET all problems && Query Parmeters
// const getAllProblems = (req,res) => {
//     res.status(200).json({
//         success : true,
//         count : problems.length,
//         data : problems,

//     });
// };

const getAllProblems = (req,res) => {
    let filteredProblems = [...problems];

    const{difficulty, topic, keyword, sort, page = 1, limit = 5} = req.query;

    if(difficulty) {
        filteredProblems = filteredProblems.filter(
            (p) => p.difficulty.toLowerCase() === difficulty.toLowerCase()
        )
    }

    if(topic) {
        filteredProblems = filteredProblems.filter(
            (p) => p.topic.toLowerCase() === topic.toLowerCase()
        )
    }

    if(keyword) {
        filteredProblems = filteredProblems.filter(
            (p) => 
                p.title.toLowerCase().includes(keyword.toLowerCase())
        )
    }

    if(sort) {
        let sortField = sort;
        let sortOrder = 1;

        if(sort.startsWith("-")) {
            sortField = sort.slice(1);
            sortOrder = -1
        }

        filteredProblems.sort((a,b)=> {
            if (a[sortField] < b[sortField]) return -1*sortOrder;
            if (a[sortField] > b[sortField]) return 1*sortOrder;
            return 0;
        })
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const startIndex = (pageNumber - 1) * limitNumber;  
    const endIndex = startIndex + limitNumber;

    const paginatedProblems = filteredProblems.slice(startIndex, endIndex);



    res.status(200).json({
        success : true,
        totalRecords : filteredProblems.length,
        currentPage : pageNumber,
        limit : limitNumber,
        totalPages : Math.ceil(filteredProblems.length/limitNumber),
        count : paginatedProblems.length,
        data : paginatedProblems,
    })
}


//GET single Problem
const getSingleProblem = (req,res) => {
    const problemId = Number(req.params.problemId);

    const problem = problems.find((p) => p.id===problemId);

    if(!problem) {
        return res.status(400).json({
            success : false,
            message : "Problem not found",
        });
    }

    res.status(200).json({
        success : true,
        data : problem,
    });
};

//CREATE NEW PROBLEM

const createProblem = (req,res) => {
    const{title, difficulty, topic} = req.body;

    if(!title || !difficulty || !topic) {
        return res.status(400).json({
            success : false,
            message : "All fields are required",
        })
    }

    const allowedDifficulties = ["easy", "medium", "hard"];

    if(!allowedDifficulties.includes(difficulty.toLowerCase())) {
        return res.status(400).json({
            success : false,
            message : "Difficulty must be one of easy, medium, hard",
        })
    }

    const newProblem = {
        id : problems.length + 1,
        title,
        difficulty,
        topic,
    }

    problems.push(newProblem);

    res.status(201).json({
        success : true,
        message : "Problem created successfully",
        data : newProblem,
    })
}

//REPLACE COMPLETE PROBLEM

const replaceProblem = (req, res) => {
    const problemId = Number(req.params.problemId);

    const {title, difficulty, topic} = req.body;

    if(!title || !difficulty || !topic) {
        return res.status(400).json({
            success : false,
            message : "All fields are required for PUT request",
        })
    }

    const problemIndex = problems.findIndex((p)=> p.id === problemId);

    if(problemIndex === -1) {
        return res.status(404).json({
            success : false,
            message : "Problem not found",
        })
    }

    const updatedProblem = {
        id : problemId,
        title,
        difficulty,
        topic,
    }

    problems[problemIndex] = updatedProblem;

    res.status(200).json({
        success : true,
        message : "Problem updated successfully",
        data : updatedProblem,
    })
}

// PARTIAL UPDATE PROBLEM

const updateProblem = (req,res) => {
    const problemId = Number(req.params.problemId);

    const problemIndex = problems.findIndex((p) => p.id === problemId);

    if(problemIndex === -1) {
        return res.status(404).json({
            success : false,
            message : "Problem Not found",
        })
    }

    const updatedProblem = {
        ...problems[problemIndex],
        ...req.body,
    }

    problems[problemIndex] = updatedProblem;

    res.status(200).json({
        success : true,
        message : "Problem Updated Successfully",
        data : updatedProblem,
    });
}

//DELETE PROBLEM

const deleteProblem = (req,res) => {
    const problemId = Number(req.params.problemId);

    const problemIndex = problems.findIndex((p) => p.id===problemId);

    if(problemIndex === -1) {
        return res.status(404).json({
            success : false,
            message : "Problem not found",
        })
    }

    const deletedProblem = problems[problemIndex];

    problems.splice(problemIndex, 1);

    res.status(200).json({
        success : true,
        message : "Problem deleted successfully",
        data : deletedProblem,
    });
}


module.exports = {
    getAllProblems,
    getSingleProblem,
    createProblem,
    replaceProblem,
    updateProblem,
    deleteProblem,
}
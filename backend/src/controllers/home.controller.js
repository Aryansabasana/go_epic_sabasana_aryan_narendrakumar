const getHome = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Go-Epic Backend API is running",
  });
};

module.exports = {
  getHome,
};
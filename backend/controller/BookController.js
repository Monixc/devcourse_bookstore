const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const getAllBooks = (req, res) => {
  res.json({ message: "전체 도서 조회" });
};

const getBookById = (req, res) => {};

const getBooksByCategory = (req, res) => {};

module.exports = {
  getAllBooks,
  getBookById,
  getBooksByCategory,
};

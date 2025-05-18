const express = require("express");
const router = express.Router();
const {
  getAllBooks,
  getBookById,
  getBooksByCategory,
} = require("../controller/BookController");

router.use(express.json());

router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.get("/category/:id", getBooksByCategory);

module.exports = router;

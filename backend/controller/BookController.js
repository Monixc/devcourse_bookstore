const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const getAllBooks = (req, res) => {
  let { category_id, news, limit, currentPage } = req.query;

  let offset = (currentPage - 1) * limit;

  let sql = "SELECT * FROM books ";
  let values = [];
  if (category_id && news === "true") {
    sql +=
      " WHERE category_id=? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
    values.push(parseInt(category_id));
  } else if (category_id) {
    sql += " WHERE category_id=?";
    values.push(parseInt(category_id));
  } else if (news === "true") {
    sql +=
      " WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
  }

  sql += " LIMIT ? OFFSET ?";
  values.push(parseInt(limit), parseInt(offset));

  conn.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error:", err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    if (result.length) {
      return res.status(StatusCodes.OK).json(result);
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  });
};

const getBookById = (req, res) => {
  let { id } = req.params;

  let sql = `SELECT books.*, (SELECT category_name FROM category WHERE id = books.category_id) as category_name 
             FROM books 
             WHERE books.id=?`;

  conn.query(sql, id, (err, result) => {
    if (err) {
      console.error("Error:", err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    if (result[0]) return res.status(StatusCodes.OK).json(result[0]);
    else return res.status(StatusCodes.NOT_FOUND).end();
  });
};

module.exports = {
  getAllBooks,
  getBookById,
};

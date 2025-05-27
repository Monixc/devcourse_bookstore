const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const getAllBooks = (req, res) => {
  let { category_id, news, limit, currentPage } = req.query;

  let offset = (currentPage - 1) * limit;

  let sql = "SELECT *, (SELECT count(*) FROM likes WHERE books.id=liked_book_id) AS likes FROM books ";
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
  let book_id  = req.params.id;
  let {user_id} = req.body;

  let sql = `SELECT *, 
                (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes,
                (SELECT EXISTS (SELECT * FROM likes WHERE user_id=? AND liked_book_id=?)) AS liked
            FROM books
            LEFT JOIN category
            ON books.category_id = category.id
            WHERE books.id=?`;

  let values = [user_id, book_id, book_id];
  conn.query(sql, values, (err, result) => {
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

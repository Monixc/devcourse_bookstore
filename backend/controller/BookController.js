const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const getAllBooks = (req, res) => {
  let { category_id, news } = req.query;
  let limit = parseInt(req.query.limit) || 10;
  let page = parseInt(req.query.page) || 1;
  let offset = (page - 1) * limit;

  let sql = "SELECT *, (SELECT count(*) FROM likes WHERE books.id=liked_book_id) AS likes FROM books ";
  let countSql = "SELECT count(*) as total FROM books ";
  let values = [];
  let countValues = [];
  let where = "";
  if (category_id && news === "true") {
    where = " WHERE category_id=? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
    values.push(parseInt(category_id));
    countValues.push(parseInt(category_id));
  } else if (category_id) {
    where = " WHERE category_id=?";
    values.push(parseInt(category_id));
    countValues.push(parseInt(category_id));
  } else if (news === "true") {
    where = " WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
  }
  sql += where + " LIMIT ? OFFSET ?";
  countSql += where;
  values.push(limit, offset);

  // 1. 전체 개수 쿼리
  conn.query(countSql, countValues, (err, countResult) => {
    if (err) {
      console.error("Error:", err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    const total = countResult[0]?.total || 0;
    // 2. 실제 데이터 쿼리
    conn.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error:", err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }
      return res.status(StatusCodes.OK).json({
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        },
        data: result
      });
    });
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

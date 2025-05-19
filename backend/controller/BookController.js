const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const getAllBooks = (req, res) => {
  let { category_id } = req.query;

  if (category_id) {
    let sql = `SELECT * FROM books LEFT JOIN category ON books.category_id = category.id WHERE books.category_id=?`;
    conn.query(sql, category_id, (err, result) => {
      if (err) {
        return res.status(StatusCodes.BAD_REQUEST).end();
      }

      if (result.length) return res.status(StatusCodes.OK).json(result);
      else return res.status(StatusCodes.NOT_FOUND).end();
    });
  } else {
    let sql = `SELECT * FROM books LEFT JOIN category ON books.category_id = category.id`;
    conn.query(sql, (err, result) => {
      if (err) {
        return res.status(StatusCodes.BAD_REQUEST).end();
      }

      return res.status(StatusCodes.OK).json(result);
    });
  }
};

const getBookById = (req, res) => {
  //parseInt 적용 시, id 속성을 구조 분해 시도
  //parseInt는 숫자를 반환하므로, 구조 분해 불가. '
  //parseInt는 문자열을 정수로 변환하는데, 객체인 req.parmas 전체를 전달하는 오류가 있었다.

  let { id } = req.params;

  let sql = `SELECT * FROM books LEFT JOIN category ON books.category_id = category.id WHERE books.id=?`;

  conn.query(sql, id, (err, result) => {
    if (err) {
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

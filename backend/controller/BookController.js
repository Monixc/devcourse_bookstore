const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const getAllBooks = (req, res) => {
  let sql = "SELECT * FROM books";
  conn.query(sql, (err, result) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    return res.status(StatusCodes.OK).json(result);
  });
};

const getBookById = (req, res) => {
  //parseInt 적용 시, id 속성을 구조 분해 시도
  //parseInt는 숫자를 반환하므로, 구조 분해 불가. '
  //parseInt는 문자열을 정수로 변환하는데, 객체인 req.parmas 전체를 전달하는 오류가 있었다.

  let { id } = req.params;

  let sql = "SELECT * FROM books WHERE id = ?";

  conn.query(sql, id, (err, result) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    if (result[0]) return res.status(StatusCodes.OK).json(result[0]);
    else return res.status(StatusCodes.NOT_FOUND).end();
  });
};

const getBooksByCategory = (req, res) => {};

module.exports = {
  getAllBooks,
  getBookById,
  getBooksByCategory,
};

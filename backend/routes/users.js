const express = require("express");
const router = express.Router();
const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

router.use(express.json());
router.post("/join", (req, res) => {
  const { email, password } = req.body;
  let sql = "INSERT INTO users (email, password) VALUES (?, ?)";
  let values = [email, password];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.CREATED).json(results);
  });
});

router.post("/login", (req, res) => {
  res.json({ message: "로그인" });
});

router.post("/reset", (req, res) => {
  res.json({ message: "비밀번호 찾기" });
});

router.put("/reset", (req, res) => {
  res.json({ message: "비밀번호 변경" });
});

module.exports = router;

const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const crypto = require("crypto");

dotenv.config();

const join = (req, res) => {
  const { email, password } = req.body;
  let sql = "INSERT INTO users (email, password, salt) VALUES (?, ?, ?)";
  //암호화
  const salt = crypto.randomBytes(64).toString("base64");
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("base64");

  let values = [email, hash, salt];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.CREATED).json(results);
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  let sql = "SELECT * FROM users WHERE email = ?";
  conn.query(sql, email, (err, results) => {
    if (err) {
      console.log(err);
      res.status(StatusCodes.BAD_REQUEST).end();
    }

    const loginUser = results[0];

    const hash = crypto
      .pbkdf2Sync(password, loginUser.salt, 10000, 64, "sha512")
      .toString("base64");

    if (loginUser && loginUser.password === hash) {
      const token = jwt.sign(
        {
          email: loginUser.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "5m", issuer: "monicx" }
      );

      res.cookie("token", token, {
        httpOnly: true,
      });

      console.log(token); //확인용
      return res.status(StatusCodes.OK).json({ token });
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).end();
    }
  });
};

const requrestReset = (req, res) => {
  const { email } = req.body;
  let sql = "SELECT * FROM users WHERE email = ?";
  conn.query(sql, email, (err, results) => {
    if (err) return res.status(StatusCodes.BAD_REQUEST).end();

    const user = results[0];
    if (user) {
      return res.status(StatusCodes.OK).json({ email: user.email });
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).end();
    }
  });
};

const passwordReset = (req, res) => {
  const { email, password } = req.body;
  let sql = "UPDATE users SET password = ? WHERE email = ?";

  const salt = crypto.randomBytes(64).toString("base64");
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("base64");

  let values = [hash, salt, email];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    if (results.affectedRows == 0) {
      return res.status(StatusCodes.NOT_FOUND).end();
    } else {
      return res.status(StatusCodes.OK).json(results);
    }
  });
};

module.exports = { join, login, requrestReset, passwordReset };

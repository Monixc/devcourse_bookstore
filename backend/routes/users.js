const express = require("express");
const router = express.Router();
const { join } = require("../controller/UserController");

router.use(express.json());
router.post("/join", join);

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

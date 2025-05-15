const express = require("express");
const router = express.Router();

router.use(express.json);
router.post("/join", (req, res) => {
  res.json({ message: "회원가입" });
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

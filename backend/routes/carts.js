const express = require("express");
const router = express.Router();

router.use(express.json());

router.post("/", (req, res) => {
  res.json({ message: "장바구니 담기" });
});

router.get("/", (req, res) => {
  res.json({ message: "장바구니 조회" });
});

router.delete("/:id", (req, res) => {
  res.json({ message: "장바구니 ehtj tkrwp 삭제" });
});

module.exports = router;

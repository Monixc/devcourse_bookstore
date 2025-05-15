const express = require("express");
const router = express.Router();

router.use(express.json());

router.post("/", (req, res) => {
  res.json({ message: "주문 하기" });
});

router.get("/", (req, res) => {
  res.json({ message: "주문 조회" });
});

router.get("/:id", (req, res) => {
  res.json({ message: "주문 상세 조회" });
});

module.exports = router;

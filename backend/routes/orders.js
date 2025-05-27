const express = require("express");
const router = express.Router();
const auth = require("../authMiddleware");
const { order, getOrders, getOrderDetail } = require("../controller/OrderController");

router.use(express.json());

router.post("/", auth, order);
router.get("/", auth, getOrders);
router.get("/:id", auth, getOrderDetail);

module.exports = router;

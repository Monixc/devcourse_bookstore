const express = require("express");
const router = express.Router();
const auth = require("../authMiddleware");
const { addToCart, getCartItems, deleteCartItem } = require("../controller/CartController");

router.use(express.json());

router.post("/", auth, addToCart);
router.get("/", auth, getCartItems);
router.delete("/:id", auth, deleteCartItem);

module.exports = router;

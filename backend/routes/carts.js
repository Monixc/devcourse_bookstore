const express = require("express");
const router = express.Router();

router.use(express.json());

router.post("/", addToCart);
router.get("/", getCartItems);
router.delete("/:id", deleteCartItem);

module.exports = router;

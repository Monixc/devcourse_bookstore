const express = require("express");
const router = express.Router();
const { addLike, cancleLike } = require("../controller/LikesController");
const auth = require("../authMiddleware");

router.use(express.json());

router.post("/:id", auth, addLike);
router.delete("/:id", auth, cancleLike);

module.exports = router;

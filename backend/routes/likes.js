const express = require("express");
const router = express.Router();
const { addLike, cancleLike } = require("../controller/LikesController");

router.use(express.json());

router.post("/:id", addLike);
router.delete("/:id", cancleLike);

module.exports = router;

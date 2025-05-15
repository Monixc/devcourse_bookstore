const express = require("express");
const router = express.Router();
const {
  join,
  login,
  requrestReset,
  passwordReset,
} = require("../controller/UserController");

router.use(express.json());
router.post("/join", join);
router.post("/login", login);
router.post("/reset", requrestReset);
router.put("/reset", passwordReset);

module.exports = router;

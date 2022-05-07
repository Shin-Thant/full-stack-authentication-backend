const express = require("express");
const refreshTokenController = require("../../controllers/refreshTokenController");
const router = express.Router();

router.post("/", refreshTokenController);

module.exports = router;

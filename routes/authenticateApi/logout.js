const express = require("express");
const logoutController = require("../../controllers/logoutController");
const router = express.Router();

router.post("/", logoutController);

module.exports = router;

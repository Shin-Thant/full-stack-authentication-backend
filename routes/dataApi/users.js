const express = require("express");
const ROLE_LIST = require("../../config/rolesList");
const {
    getAllUsers,
    deleteUser,
    getUser,
} = require("../../controllers/userController");
const verifyRoles = require("../../middleware/verifyRoles");
const router = express.Router();

router
    .route("/")
    .get(verifyRoles(ROLE_LIST.Admin, ROLE_LIST.Editor), getAllUsers)
    .delete(verifyRoles(ROLE_LIST.Admin), deleteUser);

router
    .route("/:id")
    .get(verifyRoles(ROLE_LIST.Admin, ROLE_LIST.Editor), getUser);

module.exports = router;

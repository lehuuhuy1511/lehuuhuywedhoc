const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/usersController");

const ROLES_LIST = require("../../config/roles_list");

const verifyRoles = require("../../middleware/verifyRoles");

const verifyJWT = require("../../middleware/verifyJWT");
const { verify } = require("jsonwebtoken");

router
    .route("/")
    .get(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), usersController.getAllUsers)
    .post(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), usersController.addUser);

router
    .route("/:id")
    .get(verifyJWT, usersController.getUser)
    .delete(
        verifyJWT,
        verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
        usersController.deleteUser,
    );

module.exports = router;

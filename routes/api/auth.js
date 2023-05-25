const express = require("express");

const {authCtrl} = require("../../controllers");

const { validateBody, authenticate } = require("../../middlewares");

const { schemas } = require("../../models/user");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), authCtrl.register);

router.post("/login", validateBody(schemas.loginSchema), authCtrl.login)

router.get("/current", authenticate, authCtrl.getCurrent)

router.post("/logout", authenticate, authCtrl.logout)

module.exports = router;

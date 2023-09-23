const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/isAuth")

const emissionController = require("../controllers/emission.controller");

router.post("/insert-records", isAuth, emissionController.newEntries);

module.exports = router
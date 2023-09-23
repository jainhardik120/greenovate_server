const express = require("express");
const router = express.Router();

const factorController = require("../controllers/factor.controller");

router.get("/", factorController.allFields);

module.exports = router
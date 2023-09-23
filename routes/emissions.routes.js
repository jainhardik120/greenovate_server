const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/isAuth")

const emissionController = require("../controllers/emission.controller");

router.post("/insert-records", isAuth, emissionController.newEntries);
router.get("/year-wise-emission-sum", isAuth, emissionController.yearWiseEmission);
router.get("/factor-wise-emission-sum", isAuth, emissionController.factorWiseEmission);
router.get("/details", isAuth, emissionController.detailedReport);

module.exports = router
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const pool = require("./database.js");


const app = express();
app.use(bodyParser.json());
app.use(cors());

const authRouter = require("./routes/auth.routes");
const factorRouter = require("./routes/factor.routes")
const emissionRouter = require("./routes/emissions.routes")

app.use("/api/auth", authRouter);
app.use("/api/factors", factorRouter);
app.use("/api/emission", emissionRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
});